import { IsString, IsNumber, IsOptional, IsEnum, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MovementType } from '@prisma/client';

export class CreateInventoryMovementDto {
  @ApiProperty({ description: 'Batch ID for the movement' })
  @IsUUID()
  batchId: string;

  @ApiProperty({ description: 'Source warehouse ID (null for receipts)', required: false })
  @IsOptional()
  @IsUUID()
  fromWarehouseId?: string;

  @ApiProperty({ description: 'Destination warehouse ID (null for issues)', required: false })
  @IsOptional()
  @IsUUID()
  toWarehouseId?: string;

  @ApiProperty({ enum: MovementType, description: 'Type of inventory movement' })
  @IsEnum(MovementType)
  movementType: MovementType;

  @ApiProperty({ description: 'Quantity moved', minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  quantity: number;

  @ApiProperty({ description: 'Unit of measure' })
  @IsString()
  uom: string;

  @ApiProperty({ description: 'Reference document type', required: false })
  @IsOptional()
  @IsString()
  referenceType?: string;

  @ApiProperty({ description: 'Reference document number', required: false })
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiProperty({ description: 'Reason for movement (required for adjustments)', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class BatchStockQueryDto {
  @ApiProperty({ description: 'Product ID to filter by', required: false })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiProperty({ description: 'Warehouse ID to filter by', required: false })
  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @ApiProperty({ description: 'Include only available stock (exclude quarantine/blocked)', required: false })
  @IsOptional()
  availableOnly?: boolean;

  @ApiProperty({ description: 'Include near-expiry batches (days threshold)', required: false })
  @IsOptional()
  @IsNumber()
  nearExpiryDays?: number;
}

export class FEFOAllocationDto {
  @ApiProperty({ description: 'Product ID to allocate' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Warehouse ID to allocate from' })
  @IsUUID()
  warehouseId: string;

  @ApiProperty({ description: 'Quantity required', minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  quantityRequired: number;

  @ApiProperty({ description: 'Unit of measure' })
  @IsString()
  uom: string;
}

export class BatchStockSummary {
  batchId: string;
  batchNumber: string;
  productId: string;
  productName: string;
  warehouseId: string;
  warehouseName: string;
  availableQuantity: number;
  reservedQuantity: number;
  totalQuantity: number;
  uom: string;
  expiryDate: Date;
  daysToExpiry: number;
  status: string;
  isNearExpiry: boolean;
}

export class FEFOAllocation {
  batchId: string;
  batchNumber: string;
  availableQuantity: number;
  allocatedQuantity: number;
  expiryDate: Date;
  daysToExpiry: number;
}
