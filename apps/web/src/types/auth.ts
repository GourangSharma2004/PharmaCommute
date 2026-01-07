export enum UserRole {
  ADMIN = 'ADMIN',
  QA_MANAGER = 'QA_MANAGER',
  QA_ANALYST = 'QA_ANALYST',
  WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER',
  WAREHOUSE_USER = 'WAREHOUSE_USER',
  PROCUREMENT_USER = 'PROCUREMENT_USER',
  SALES_USER = 'SALES_USER',
  AUDITOR = 'AUDITOR',
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  tenantId: string
  tenantName: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface Permission {
  resource: string
  action: string
}

// Permission strings for easy checking
export const PERMISSIONS = {
  // Inventory permissions
  INVENTORY_VIEW: 'inventory.view',
  INVENTORY_CREATE: 'inventory.create',
  INVENTORY_UPDATE: 'inventory.update',
  INVENTORY_DELETE: 'inventory.delete',
  
  // Batch permissions
  BATCH_VIEW: 'batch.view',
  BATCH_CREATE: 'batch.create',
  BATCH_UPDATE: 'batch.update',
  BATCH_RELEASE: 'batch.release',
  
  // Quality permissions
  QC_VIEW: 'qc.view',
  QC_PERFORM: 'qc.perform',
  QC_APPROVE: 'qc.approve',
  
  // Audit permissions
  AUDIT_VIEW: 'audit.view',
  AUDIT_EXPORT: 'audit.export',
  
  // Admin permissions
  USER_MANAGE: 'user.manage',
  SYSTEM_CONFIG: 'system.config',
} as const

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS]
