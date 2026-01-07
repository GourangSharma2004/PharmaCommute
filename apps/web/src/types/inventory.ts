export enum BatchStatus {
  QUARANTINE = 'QUARANTINE',
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  BLOCKED = 'BLOCKED',
  EXPIRED = 'EXPIRED',
  ISSUED = 'ISSUED',
}

export interface Batch {
  id: string
  batchNumber: string
  productId: string
  productName: string
  productCode: string
  supplierId: string
  supplierName: string
  manufacturedDate: string | null
  expiryDate: string
  receivedDate: string
  status: BatchStatus
  quantity: number
  availableQuantity: number
  reservedQuantity: number
  uom: string
  warehouseName: string
  daysToExpiry: number
  isNearExpiry: boolean
  coaReference: string | null
}

export interface InventoryFilters {
  productId?: string
  warehouseId?: string
  status?: BatchStatus
  nearExpiryDays?: number
  search?: string
}

export interface InventoryStats {
  totalBatches: number
  availableBatches: number
  quarantineBatches: number
  blockedBatches: number
  nearExpiryBatches: number
  expiredBatches: number
}
