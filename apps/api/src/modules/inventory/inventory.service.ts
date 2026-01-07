import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { BatchStatus, MovementType } from '@prisma/client';
import { 
  CreateInventoryMovementDto, 
  BatchStockQueryDto, 
  FEFOAllocationDto,
  BatchStockSummary,
  FEFOAllocation 
} from './dto/inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create an inventory movement with business rule validation
   * Enforces quarantine/blocked stock rules and FEFO logic
   */
  async createMovement(
    tenantId: string, 
    userId: string, 
    dto: CreateInventoryMovementDto
  ) {
    // Validate batch exists and belongs to tenant
    const batch = await this.prisma.batch.findFirst({
      where: {
        id: dto.batchId,
        tenantId,
        deletedAt: null,
      },
      include: {
        product: true,
      },
    });

    if (!batch) {
      throw new NotFoundException('Batch not found');
    }

    // Business rule validations
    await this.validateMovementRules(tenantId, dto, batch);

    // Create the movement in a transaction
    return this.prisma.$transaction(async (tx) => {
      // Create the movement record
      const movement = await tx.inventoryMovement.create({
        data: {
          tenantId,
          batchId: dto.batchId,
          fromWarehouseId: dto.fromWarehouseId,
          toWarehouseId: dto.toWarehouseId,
          movementType: dto.movementType,
          quantity: dto.quantity,
          uom: dto.uom,
          referenceType: dto.referenceType,
          referenceNumber: dto.referenceNumber,
          reason: dto.reason,
          createdBy: userId,
        },
        include: {
          batch: {
            include: {
              product: true,
            },
          },
          fromWarehouse: true,
          toWarehouse: true,
          user: true,
        },
      });

      // Update batch status if needed (e.g., AVAILABLE -> ISSUED for full consumption)
      await this.updateBatchStatusIfNeeded(tx, batch.id, dto);

      return movement;
    });
  }

  /**
   * Get batch-wise stock summary with FEFO ordering
   * Supports filtering by product, warehouse, and availability
   */
  async getBatchStock(tenantId: string, query: BatchStockQueryDto): Promise<BatchStockSummary[]> {
    const whereClause: any = {
      tenantId,
      deletedAt: null,
    };

    if (query.productId) {
      whereClause.productId = query.productId;
    }

    // Build the raw SQL query for better performance with stock calculations
    const sql = `
      SELECT 
        b.id as "batchId",
        b.batch_number as "batchNumber",
        b.product_id as "productId",
        p.name as "productName",
        COALESCE(stock.warehouse_id, '') as "warehouseId",
        COALESCE(w.name, '') as "warehouseName",
        COALESCE(stock.available_quantity, 0) as "availableQuantity",
        COALESCE(stock.reserved_quantity, 0) as "reservedQuantity",
        COALESCE(stock.total_quantity, 0) as "totalQuantity",
        COALESCE(stock.uom, p.pack_size) as "uom",
        b.expiry_date as "expiryDate",
        EXTRACT(DAY FROM (b.expiry_date - CURRENT_DATE)) as "daysToExpiry",
        b.status,
        CASE 
          WHEN EXTRACT(DAY FROM (b.expiry_date - CURRENT_DATE)) <= COALESCE($3, 30) 
          THEN true 
          ELSE false 
        END as "isNearExpiry"
      FROM batches b
      INNER JOIN products p ON b.product_id = p.id
      LEFT JOIN (
        SELECT 
          batch_id,
          to_warehouse_id as warehouse_id,
          SUM(CASE 
            WHEN movement_type IN ('RECEIPT', 'TRANSFER', 'ADJUSTMENT') 
            THEN quantity 
            ELSE -quantity 
          END) as total_quantity,
          SUM(CASE 
            WHEN movement_type IN ('RECEIPT', 'TRANSFER', 'ADJUSTMENT') 
            AND batch_status = 'AVAILABLE'
            THEN quantity 
            ELSE 0 
          END) as available_quantity,
          SUM(CASE 
            WHEN movement_type = 'RESERVED' 
            THEN quantity 
            ELSE 0 
          END) as reserved_quantity,
          MAX(uom) as uom
        FROM inventory_movements im
        INNER JOIN batches b2 ON im.batch_id = b2.id
        WHERE im.tenant_id = $1
        AND im.to_warehouse_id IS NOT NULL
        GROUP BY batch_id, to_warehouse_id
        HAVING SUM(CASE 
          WHEN movement_type IN ('RECEIPT', 'TRANSFER', 'ADJUSTMENT') 
          THEN quantity 
          ELSE -quantity 
        END) > 0
      ) stock ON b.id = stock.batch_id
      LEFT JOIN warehouses w ON stock.warehouse_id = w.id
      WHERE b.tenant_id = $1
      ${query.productId ? 'AND b.product_id = $2' : ''}
      ${query.warehouseId ? 'AND stock.warehouse_id = $4' : ''}
      ${query.availableOnly ? 'AND b.status = \'AVAILABLE\'' : ''}
      AND b.deleted_at IS NULL
      ORDER BY 
        b.expiry_date ASC,  -- FEFO: First Expiry First Out
        b.created_at ASC    -- Then by receipt date
    `;

    const params = [tenantId];
    if (query.productId) params.push(query.productId);
    params.push(query.nearExpiryDays || 30);
    if (query.warehouseId) params.push(query.warehouseId);

    const result = await this.prisma.$queryRawUnsafe(sql, ...params);
    return result as BatchStockSummary[];
  }

  /**
   * FEFO allocation logic - allocates stock from earliest expiry batches first
   * Critical for pharma compliance and loss minimization
   */
  async allocateStock(tenantId: string, dto: FEFOAllocationDto): Promise<FEFOAllocation[]> {
    // Get available stock for the product in FEFO order
    const availableStock = await this.getBatchStock(tenantId, {
      productId: dto.productId,
      warehouseId: dto.warehouseId,
      availableOnly: true,
    });

    const allocations: FEFOAllocation[] = [];
    let remainingQuantity = dto.quantityRequired;

    for (const stock of availableStock) {
      if (remainingQuantity <= 0) break;

      const allocatedQuantity = Math.min(remainingQuantity, stock.availableQuantity);
      
      allocations.push({
        batchId: stock.batchId,
        batchNumber: stock.batchNumber,
        availableQuantity: stock.availableQuantity,
        allocatedQuantity,
        expiryDate: stock.expiryDate,
        daysToExpiry: stock.daysToExpiry,
      });

      remainingQuantity -= allocatedQuantity;
    }

    if (remainingQuantity > 0) {
      throw new BadRequestException(
        `Insufficient stock. Required: ${dto.quantityRequired}, Available: ${dto.quantityRequired - remainingQuantity}`
      );
    }

    return allocations;
  }

  /**
   * Get inventory movements for audit trail
   */
  async getMovementHistory(
    tenantId: string, 
    batchId?: string, 
    warehouseId?: string,
    limit: number = 100
  ) {
    const whereClause: any = { tenantId };
    
    if (batchId) whereClause.batchId = batchId;
    if (warehouseId) {
      whereClause.OR = [
        { fromWarehouseId: warehouseId },
        { toWarehouseId: warehouseId },
      ];
    }

    return this.prisma.inventoryMovement.findMany({
      where: whereClause,
      include: {
        batch: {
          include: {
            product: true,
          },
        },
        fromWarehouse: true,
        toWarehouse: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Validate business rules for inventory movements
   */
  private async validateMovementRules(
    tenantId: string, 
    dto: CreateInventoryMovementDto, 
    batch: any
  ) {
    // Rule 1: Cannot issue from QUARANTINE or BLOCKED stock
    if (dto.movementType === MovementType.ISSUE && 
        [BatchStatus.QUARANTINE, BatchStatus.BLOCKED].includes(batch.status)) {
      throw new BadRequestException(
        `Cannot issue stock from ${batch.status.toLowerCase()} batch`
      );
    }

    // Rule 2: Cannot issue expired stock
    if (dto.movementType === MovementType.ISSUE && 
        batch.expiryDate < new Date()) {
      throw new BadRequestException('Cannot issue expired stock');
    }

    // Rule 3: Validate warehouse exists
    if (dto.fromWarehouseId) {
      const fromWarehouse = await this.prisma.warehouse.findFirst({
        where: { id: dto.fromWarehouseId, tenantId, deletedAt: null },
      });
      if (!fromWarehouse) {
        throw new NotFoundException('Source warehouse not found');
      }
    }

    if (dto.toWarehouseId) {
      const toWarehouse = await this.prisma.warehouse.findFirst({
        where: { id: dto.toWarehouseId, tenantId, deletedAt: null },
      });
      if (!toWarehouse) {
        throw new NotFoundException('Destination warehouse not found');
      }
    }

    // Rule 4: Check sufficient stock for issues
    if (dto.movementType === MovementType.ISSUE) {
      const currentStock = await this.getBatchStock(tenantId, {
        productId: batch.productId,
        warehouseId: dto.fromWarehouseId,
      });

      const batchStock = currentStock.find(s => s.batchId === dto.batchId);
      if (!batchStock || batchStock.availableQuantity < dto.quantity) {
        throw new BadRequestException('Insufficient stock for issue');
      }
    }
  }

  /**
   * Update batch status based on movement (e.g., mark as ISSUED when fully consumed)
   */
  private async updateBatchStatusIfNeeded(tx: any, batchId: string, dto: CreateInventoryMovementDto) {
    // This is a simplified version - in production, you'd calculate remaining stock
    // and update status accordingly (e.g., AVAILABLE -> ISSUED when stock reaches 0)
    
    if (dto.movementType === MovementType.ISSUE) {
      // Check if this was the last stock
      const remainingMovements = await tx.inventoryMovement.aggregate({
        where: { batchId },
        _sum: {
          quantity: true,
        },
      });

      // If no remaining stock, mark as ISSUED
      if (remainingMovements._sum.quantity <= 0) {
        await tx.batch.update({
          where: { id: batchId },
          data: { status: BatchStatus.ISSUED },
        });
      }
    }
  }
}
