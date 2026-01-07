import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Query, 
  Param, 
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { 
  CreateInventoryMovementDto, 
  BatchStockQueryDto, 
  FEFOAllocationDto 
} from './dto/inventory.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Inventory')
@ApiBearerAuth()
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('movements')
  @Roles(UserRole.WAREHOUSE_MANAGER, UserRole.WAREHOUSE_USER)
  @ApiOperation({ summary: 'Create inventory movement' })
  @ApiResponse({ status: 201, description: 'Movement created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid movement data or business rule violation' })
  @ApiResponse({ status: 404, description: 'Batch or warehouse not found' })
  async createMovement(
    @Request() req: any,
    @Body() createMovementDto: CreateInventoryMovementDto,
  ) {
    const { tenantId, userId } = req.user;
    return this.inventoryService.createMovement(tenantId, userId, createMovementDto);
  }

  @Get('stock/batches')
  @Roles(
    UserRole.WAREHOUSE_MANAGER, 
    UserRole.WAREHOUSE_USER, 
    UserRole.QA_MANAGER,
    UserRole.SALES_USER,
    UserRole.ADMIN
  )
  @ApiOperation({ summary: 'Get batch-wise stock summary with FEFO ordering' })
  @ApiResponse({ status: 200, description: 'Stock summary retrieved successfully' })
  async getBatchStock(
    @Request() req: any,
    @Query() query: BatchStockQueryDto,
  ) {
    const { tenantId } = req.user;
    return this.inventoryService.getBatchStock(tenantId, query);
  }

  @Post('allocate')
  @Roles(UserRole.WAREHOUSE_MANAGER, UserRole.SALES_USER)
  @ApiOperation({ 
    summary: 'Allocate stock using FEFO logic',
    description: 'Returns optimal batch allocation for a given quantity requirement'
  })
  @ApiResponse({ status: 200, description: 'Stock allocated successfully' })
  @ApiResponse({ status: 400, description: 'Insufficient stock available' })
  async allocateStock(
    @Request() req: any,
    @Body() allocationDto: FEFOAllocationDto,
  ) {
    const { tenantId } = req.user;
    return this.inventoryService.allocateStock(tenantId, allocationDto);
  }

  @Get('movements')
  @Roles(
    UserRole.WAREHOUSE_MANAGER, 
    UserRole.QA_MANAGER, 
    UserRole.ADMIN,
    UserRole.AUDITOR
  )
  @ApiOperation({ summary: 'Get inventory movement history for audit trail' })
  @ApiResponse({ status: 200, description: 'Movement history retrieved successfully' })
  async getMovementHistory(
    @Request() req: any,
    @Query('batchId') batchId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('limit') limit?: number,
  ) {
    const { tenantId } = req.user;
    return this.inventoryService.getMovementHistory(
      tenantId, 
      batchId, 
      warehouseId, 
      limit ? parseInt(limit.toString()) : 100
    );
  }

  @Get('movements/batch/:batchId')
  @Roles(
    UserRole.WAREHOUSE_MANAGER, 
    UserRole.QA_MANAGER, 
    UserRole.ADMIN,
    UserRole.AUDITOR
  )
  @ApiOperation({ summary: 'Get movement history for specific batch (traceability)' })
  @ApiResponse({ status: 200, description: 'Batch movement history retrieved successfully' })
  async getBatchMovementHistory(
    @Request() req: any,
    @Param('batchId') batchId: string,
  ) {
    const { tenantId } = req.user;
    return this.inventoryService.getMovementHistory(tenantId, batchId);
  }

  @Get('stock/near-expiry')
  @Roles(
    UserRole.WAREHOUSE_MANAGER, 
    UserRole.QA_MANAGER, 
    UserRole.ADMIN
  )
  @ApiOperation({ 
    summary: 'Get near-expiry stock report',
    description: 'Critical for pharma loss prevention and compliance'
  })
  @ApiResponse({ status: 200, description: 'Near-expiry stock retrieved successfully' })
  async getNearExpiryStock(
    @Request() req: any,
    @Query('days') days?: number,
    @Query('warehouseId') warehouseId?: string,
  ) {
    const { tenantId } = req.user;
    return this.inventoryService.getBatchStock(tenantId, {
      warehouseId,
      nearExpiryDays: days ? parseInt(days.toString()) : 30,
      availableOnly: true,
    });
  }

  @Get('stock/blocked')
  @Roles(
    UserRole.WAREHOUSE_MANAGER, 
    UserRole.QA_MANAGER, 
    UserRole.ADMIN
  )
  @ApiOperation({ 
    summary: 'Get blocked/quarantine stock report',
    description: 'Shows stock that cannot be issued due to quality or other restrictions'
  })
  @ApiResponse({ status: 200, description: 'Blocked stock retrieved successfully' })
  async getBlockedStock(
    @Request() req: any,
    @Query('warehouseId') warehouseId?: string,
  ) {
    const { tenantId } = req.user;
    
    // This would need to be implemented in the service to filter by batch status
    // For now, returning all stock (would be filtered by QUARANTINE/BLOCKED status)
    return this.inventoryService.getBatchStock(tenantId, {
      warehouseId,
      availableOnly: false, // Include quarantine/blocked
    });
  }
}
