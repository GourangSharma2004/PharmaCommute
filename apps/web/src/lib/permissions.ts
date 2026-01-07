import { UserRole, PermissionKey, PERMISSIONS } from '@/types/auth'

/**
 * Role-based permission matrix for pharma compliance
 * Implements segregation of duties and approval hierarchies
 */
const ROLE_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  [UserRole.ADMIN]: [
    // Full system access
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_CREATE,
    PERMISSIONS.INVENTORY_UPDATE,
    PERMISSIONS.INVENTORY_DELETE,
    PERMISSIONS.BATCH_VIEW,
    PERMISSIONS.BATCH_CREATE,
    PERMISSIONS.BATCH_UPDATE,
    PERMISSIONS.BATCH_RELEASE,
    PERMISSIONS.QC_VIEW,
    PERMISSIONS.QC_PERFORM,
    PERMISSIONS.QC_APPROVE,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.AUDIT_EXPORT,
    PERMISSIONS.USER_MANAGE,
    PERMISSIONS.SYSTEM_CONFIG,
  ],
  
  [UserRole.QA_MANAGER]: [
    // Quality oversight + batch release authority
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.BATCH_VIEW,
    PERMISSIONS.BATCH_RELEASE, // Key: Can approve batch releases
    PERMISSIONS.QC_VIEW,
    PERMISSIONS.QC_APPROVE, // Key: Can approve QC results
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.AUDIT_EXPORT,
  ],
  
  [UserRole.QA_ANALYST]: [
    // Quality testing only, cannot approve own work
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.BATCH_VIEW,
    PERMISSIONS.QC_VIEW,
    PERMISSIONS.QC_PERFORM, // Can perform tests but not approve
  ],
  
  [UserRole.WAREHOUSE_MANAGER]: [
    // Inventory management authority
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_CREATE,
    PERMISSIONS.INVENTORY_UPDATE,
    PERMISSIONS.BATCH_VIEW,
    PERMISSIONS.BATCH_CREATE,
    PERMISSIONS.BATCH_UPDATE,
    // Note: Cannot perform QC or approve batches (segregation of duties)
  ],
  
  [UserRole.WAREHOUSE_USER]: [
    // Basic inventory operations
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_CREATE, // Can create movements
    PERMISSIONS.BATCH_VIEW,
  ],
  
  [UserRole.PROCUREMENT_USER]: [
    // Purchase and supplier management
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.BATCH_VIEW,
    PERMISSIONS.BATCH_CREATE, // Can create batches from POs
  ],
  
  [UserRole.SALES_USER]: [
    // Sales and dispatch
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.BATCH_VIEW,
  ],
  
  [UserRole.AUDITOR]: [
    // Read-only access for compliance
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.BATCH_VIEW,
    PERMISSIONS.QC_VIEW,
    PERMISSIONS.AUDIT_VIEW,
    PERMISSIONS.AUDIT_EXPORT,
  ],
}

/**
 * Check if a user role has a specific permission
 */
export function hasPermission(userRole: UserRole, permission: PermissionKey): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole]
  return rolePermissions.includes(permission)
}

/**
 * Get all permissions for a user role
 */
export function getRolePermissions(userRole: UserRole): PermissionKey[] {
  return ROLE_PERMISSIONS[userRole] || []
}

/**
 * Check if user can access a resource with specific action
 * Usage: canAccess(user.role, 'inventory.create')
 */
export function canAccess(userRole: UserRole, permission: PermissionKey): boolean {
  return hasPermission(userRole, permission)
}

/**
 * Permission utility for components
 * Usage: const permissions = usePermissions(user.role)
 *        if (permissions.canCreateInventory) { ... }
 */
export function createPermissionUtils(userRole: UserRole) {
  return {
    // Inventory permissions
    canViewInventory: hasPermission(userRole, PERMISSIONS.INVENTORY_VIEW),
    canCreateInventory: hasPermission(userRole, PERMISSIONS.INVENTORY_CREATE),
    canUpdateInventory: hasPermission(userRole, PERMISSIONS.INVENTORY_UPDATE),
    canDeleteInventory: hasPermission(userRole, PERMISSIONS.INVENTORY_DELETE),
    
    // Batch permissions
    canViewBatch: hasPermission(userRole, PERMISSIONS.BATCH_VIEW),
    canCreateBatch: hasPermission(userRole, PERMISSIONS.BATCH_CREATE),
    canUpdateBatch: hasPermission(userRole, PERMISSIONS.BATCH_UPDATE),
    canReleaseBatch: hasPermission(userRole, PERMISSIONS.BATCH_RELEASE),
    
    // Quality permissions
    canViewQC: hasPermission(userRole, PERMISSIONS.QC_VIEW),
    canPerformQC: hasPermission(userRole, PERMISSIONS.QC_PERFORM),
    canApproveQC: hasPermission(userRole, PERMISSIONS.QC_APPROVE),
    
    // Audit permissions
    canViewAudit: hasPermission(userRole, PERMISSIONS.AUDIT_VIEW),
    canExportAudit: hasPermission(userRole, PERMISSIONS.AUDIT_EXPORT),
    
    // Admin permissions
    canManageUsers: hasPermission(userRole, PERMISSIONS.USER_MANAGE),
    canConfigureSystem: hasPermission(userRole, PERMISSIONS.SYSTEM_CONFIG),
    
    // Utility method
    can: (permission: PermissionKey) => hasPermission(userRole, permission),
  }
}

/**
 * Role display names for UI
 */
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrator',
  [UserRole.QA_MANAGER]: 'QA Manager',
  [UserRole.QA_ANALYST]: 'QA Analyst',
  [UserRole.WAREHOUSE_MANAGER]: 'Warehouse Manager',
  [UserRole.WAREHOUSE_USER]: 'Warehouse User',
  [UserRole.PROCUREMENT_USER]: 'Procurement User',
  [UserRole.SALES_USER]: 'Sales User',
  [UserRole.AUDITOR]: 'Auditor',
}
