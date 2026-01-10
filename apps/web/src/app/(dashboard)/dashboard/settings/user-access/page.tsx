'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { 
  UserCheck, 
  Lock, 
  Users, 
  UserPlus, 
  Shield, 
  Eye, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  History,
  Key,
  Calendar,
  MapPin,
  Building,
  FileText,
  Info,
  UserX,
  UserCog,
  Ban,
  RefreshCw,
  Settings
} from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { UserRole } from '@/types/auth'
import { getRolePermissions, ROLE_DISPLAY_NAMES } from '@/lib/permissions'

// User state types
type UserState = 'invited' | 'active' | 'suspended' | 'disabled'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  state: UserState
  lastLogin: string | null
  warehouseAccess: string[]
  moduleAccess: string[]
}

interface RoleDefinition {
  role: UserRole
  displayName: string
  description: string
  permissionSummary: string[]
  approvalAuthority: string[]
  restrictions: string[]
}

interface PrivilegedAccess {
  userId: string
  userName: string
  elevatedRole: UserRole
  reason: string
  approvedBy: string
  expiresAt: string
  status: 'active' | 'expired'
}

interface AccessAuditEvent {
  id: string
  timestamp: string
  user: string
  action: string
  details: string
  changedBy: string
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@pharmacommute.com',
    firstName: 'The',
    lastName: 'Gourang',
    role: UserRole.ADMIN,
    state: 'active',
    lastLogin: '2 hours ago',
    warehouseAccess: ['All'],
    moduleAccess: ['All'],
  },
  {
    id: '2',
    email: 'qa.manager@pharmacommute.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: UserRole.QA_MANAGER,
    state: 'active',
    lastLogin: '1 day ago',
    warehouseAccess: ['Warehouse A', 'Warehouse B'],
    moduleAccess: ['Quality', 'Inventory', 'Reports'],
  },
  {
    id: '3',
    email: 'warehouse@pharmacommute.com',
    firstName: 'Mike',
    lastName: 'Wilson',
    role: UserRole.WAREHOUSE_MANAGER,
    state: 'active',
    lastLogin: '30 minutes ago',
    warehouseAccess: ['Warehouse A'],
    moduleAccess: ['Inventory', 'Procurement'],
  },
  {
    id: '4',
    email: 'auditor@pharmacommute.com',
    firstName: 'Lisa',
    lastName: 'Chen',
    role: UserRole.AUDITOR,
    state: 'active',
    lastLogin: '3 days ago',
    warehouseAccess: ['All'],
    moduleAccess: ['All (Read-only)'],
  },
  {
    id: '5',
    email: 'new.user@pharmacommute.com',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.WAREHOUSE_USER,
    state: 'invited',
    lastLogin: null,
    warehouseAccess: [],
    moduleAccess: [],
  },
]

const roleDefinitions: RoleDefinition[] = [
  {
    role: UserRole.ADMIN,
    displayName: 'System Admin',
    description: 'Full system access with configuration authority. Cannot bypass QA approvals.',
    permissionSummary: ['Full system access', 'User management', 'System configuration'],
    approvalAuthority: ['System changes', 'User access', 'Integration configuration'],
    restrictions: ['Cannot bypass QA approvals', 'Cannot approve own actions'],
  },
  {
    role: UserRole.QA_MANAGER,
    displayName: 'QA / Compliance',
    description: 'Quality oversight and batch release authority. Cannot execute inventory movements.',
    permissionSummary: ['Batch release', 'QC approval', 'Quality oversight', 'Audit access'],
    approvalAuthority: ['Batch release', 'QC result approval', 'Unquarantine'],
    restrictions: ['Cannot execute inventory movements', 'Cannot approve own QC work'],
  },
  {
    role: UserRole.QA_ANALYST,
    displayName: 'QA Analyst',
    description: 'Quality testing and analysis. Cannot approve own work.',
    permissionSummary: ['QC testing', 'Quality data entry', 'View inventory'],
    approvalAuthority: [],
    restrictions: ['Cannot approve own QC results', 'Cannot release batches'],
  },
  {
    role: UserRole.WAREHOUSE_MANAGER,
    displayName: 'Operations Manager',
    description: 'Inventory management and operations. Cannot perform QC or approve batches.',
    permissionSummary: ['Inventory management', 'Batch creation', 'Movement execution'],
    approvalAuthority: ['Inventory adjustments', 'Movement approvals'],
    restrictions: ['Cannot perform QC', 'Cannot approve batch releases'],
  },
  {
    role: UserRole.WAREHOUSE_USER,
    displayName: 'Inventory Operator',
    description: 'Basic inventory operations and data entry.',
    permissionSummary: ['View inventory', 'Create movements', 'Data entry'],
    approvalAuthority: [],
    restrictions: ['No approval authority', 'Limited to assigned warehouses'],
  },
  {
    role: UserRole.AUDITOR,
    displayName: 'Read-only / Auditor',
    description: 'Read-only access for compliance and audit purposes.',
    permissionSummary: ['View all data', 'Export audit logs', 'Read-only access'],
    approvalAuthority: [],
    restrictions: ['No write access', 'No approval authority'],
  },
]

const mockPrivilegedAccess: PrivilegedAccess[] = [
  {
    userId: '3',
    userName: 'Mike Wilson',
    elevatedRole: UserRole.ADMIN,
    reason: 'Emergency system maintenance',
    approvedBy: 'The Gourang',
    expiresAt: '2024-01-15T18:00:00Z',
    status: 'active',
  },
]

const mockAuditEvents: AccessAuditEvent[] = [
  {
    id: '1',
    timestamp: '2 days ago',
    user: 'Sarah Johnson',
    action: 'Role changed',
    details: 'Role changed from QA Analyst to QA Manager',
    changedBy: 'The Gourang',
  },
  {
    id: '2',
    timestamp: '5 days ago',
    user: 'John Doe',
    action: 'User invited',
    details: 'User invited with role Warehouse User',
    changedBy: 'The Gourang',
  },
  {
    id: '3',
    timestamp: '1 week ago',
    user: 'Mike Wilson',
    action: 'Access scope changed',
    details: 'Warehouse access updated: Added Warehouse B',
    changedBy: 'The Gourang',
  },
]

export default function UserAccessPage() {
  const { user } = useAuthStore()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<UserRole>(UserRole.WAREHOUSE_USER)

  // Check if user has access (Admin / Compliance)
  if (!user) {
    return null
  }

  const hasAccess = 
    user.role === UserRole.ADMIN ||
    user.role === UserRole.AUDITOR

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">User & Access Management</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage users, roles, permissions, and access controls</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Access Restricted</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Only Admin and Compliance roles can access user and access management.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate overview metrics
  const activeUsers = users.filter(u => u.state === 'active').length
  const disabledUsers = users.filter(u => u.state === 'disabled').length
  const pendingUsers = users.filter(u => u.state === 'invited').length

  const usersByRole = Object.values(UserRole).reduce((acc, role) => {
    acc[role] = users.filter(u => u.role === role).length
    return acc
  }, {} as Record<UserRole, number>)

  const getStateBadge = (state: UserState) => {
    switch (state) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Active</Badge>
      case 'invited':
        return <Badge variant="secondary">Invited</Badge>
      case 'suspended':
        return <Badge variant="outline" className="text-amber-600 dark:text-amber-400">Suspended</Badge>
      case 'disabled':
        return <Badge variant="destructive">Disabled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleInviteUser = () => {
    // TODO: API call to invite user
    console.log('Inviting user:', inviteEmail, inviteRole)
    setInviteEmail('')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">User & Access Management</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Define who can access what, where, and under which conditions
        </p>
      </div>

      {/* 1. User Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle>User Overview</CardTitle>
          </div>
          <CardDescription>
            High-level visibility into system users and access patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg p-4 border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Users</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{users.length}</div>
            </div>
            <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg p-4 border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{activeUsers}</div>
            </div>
            <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg p-4 border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Disabled</div>
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">{disabledUsers}</div>
            </div>
            <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg p-4 border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pending</div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingUsers}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Users by Role</div>
              <div className="space-y-2">
                {Object.entries(usersByRole).map(([role, count]) => (
                  <div key={role} className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">{ROLE_DISPLAY_NAMES[role as UserRole]}</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Recent Login Activity</div>
              <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg p-4 border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {users.filter(u => u.lastLogin).slice(0, 3).map(u => (
                    <div key={u.id} className="flex justify-between py-1">
                      <span>{u.firstName} {u.lastName}</span>
                      <span className="text-slate-500">{u.lastLogin}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. User Lifecycle Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <UserCog className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle>User Lifecycle Management</CardTitle>
          </div>
          <CardDescription>
            Control how users enter, change, and exit the system. All lifecycle events are audit logged.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Invite User */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <UserPlus className="h-4 w-4 text-slate-500" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Invite User</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Email Address</Label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Initial Role</Label>
                <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(UserRole).map((role) => (
                      <SelectItem key={role} value={role}>
                        {ROLE_DISPLAY_NAMES[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleInviteUser} className="w-full">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Send Invitation
                </Button>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Users can be invited via email or SSO. Invited users will receive an email with setup instructions.
              </p>
            </div>
          </div>

          {/* User States */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-4">
              <UserCheck className="h-4 w-4 text-slate-500" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">User States</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Deactivation Options</div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch defaultChecked={true} />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Immediate deactivation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Scheduled deactivation</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Access Review Requirements</div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">On role change</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">On department/responsibility change</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 flex items-start space-x-2">
              <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Compliance Note:</strong> No hard deletes. Disabled users remain in audit history. All lifecycle events are audit logged.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Roles & Responsibilities */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
            <CardTitle>Roles & Responsibilities</CardTitle>
          </div>
          <CardDescription>
            Predefined roles with segregation of duties. Roles cannot approve their own actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {roleDefinitions.map((roleDef) => (
            <div
              key={roleDef.role}
              className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {roleDef.displayName}
                    </h3>
                    <Badge variant="outline" className="text-xs">Predefined</Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {roleDef.description}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Permission Summary</div>
                      <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                        {roleDef.permissionSummary.map((perm, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-1">•</span>
                            <span>{perm}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Approval Authority</div>
                      {roleDef.approvalAuthority.length > 0 ? (
                        <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                          {roleDef.approvalAuthority.map((auth, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-1">•</span>
                              <span>{auth}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-xs text-slate-500 dark:text-slate-400">None</span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Restrictions</div>
                      <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
                        {roleDef.restrictions.map((restriction, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-1">•</span>
                            <span>{restriction}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-md p-3 flex items-start space-x-2">
                <Info className="h-4 w-4 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong>Linked to Approval Workflows:</strong> This role's approval authority is configured in Settings → Approval Workflows.
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 4. Access Scope & Restrictions */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <CardTitle>Access Scope & Restrictions</CardTitle>
          </div>
          <CardDescription>
            Limit access based on context, not just role. Scope restrictions override role permissions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Warehouse-level Access */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <Building className="h-4 w-4 text-slate-500" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Warehouse-level Access</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Available Warehouses</Label>
                <div className="space-y-2">
                  {['Warehouse A', 'Warehouse B', 'Warehouse C'].map((wh) => (
                    <div key={wh} className="flex items-center space-x-2">
                      <Switch />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{wh}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Location-level Access</Label>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Configure location-level restrictions per warehouse assignment.
                </div>
              </div>
            </div>
          </div>

          {/* Module Access */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="h-4 w-4 text-slate-500" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Module Access</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Inventory', 'Quality', 'Recall', 'Reports', 'Procurement', 'Sales'].map((module) => (
                <div key={module} className="flex items-center space-x-2">
                  <Switch />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{module}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action-level Access */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <Key className="h-4 w-4 text-slate-500" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Action-level Access</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['View', 'Create', 'Approve', 'Override'].map((action) => (
                <div key={action} className="flex items-center space-x-2">
                  <Switch />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Restrictions */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="h-4 w-4 text-slate-500" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Optional Restrictions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Time-based Access</Label>
                <div className="flex items-center space-x-2">
                  <Switch />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Enable time-based restrictions</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">IP / Location-based Access</Label>
                <div className="flex items-center space-x-2">
                  <Switch />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Linked to System & Security settings</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-md p-3 flex items-start space-x-2">
            <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-indigo-800 dark:text-indigo-200">
              <strong>Compliance Note:</strong> Scope restrictions must override role permissions. All scope changes are audit logged.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 5. Privileged Access Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-red-600 dark:text-red-400" />
            <CardTitle>Privileged Access Controls</CardTitle>
            <Badge variant="destructive" className="ml-2">Critical</Badge>
          </div>
          <CardDescription>
            Protect high-risk permissions. Privileged actions must be justified, time-limited, and fully logged.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Active Privileged Access */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Active Privileged Access</h3>
            </div>
            {mockPrivilegedAccess.length > 0 ? (
              <div className="space-y-3">
                {mockPrivilegedAccess.map((access) => (
                  <div key={access.userId} className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">User:</span>{' '}
                        <span className="font-medium text-slate-900 dark:text-slate-100">{access.userName}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Elevated Role:</span>{' '}
                        <span className="font-medium text-slate-900 dark:text-slate-100">{ROLE_DISPLAY_NAMES[access.elevatedRole]}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Reason:</span>{' '}
                        <span className="text-slate-900 dark:text-slate-100">{access.reason}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Approved By:</span>{' '}
                        <span className="text-slate-900 dark:text-slate-100">{access.approvedBy}</span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">Expires:</span>{' '}
                        <span className="text-slate-900 dark:text-slate-100">{new Date(access.expiresAt).toLocaleString()}</span>
                      </div>
                      <div>
                        <Badge className={access.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-slate-100 text-slate-800'}>
                          {access.status === 'active' ? 'Active' : 'Expired'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-400">No active privileged access</p>
            )}
          </div>

          {/* Privileged Access Configuration */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <Settings className="h-4 w-4 text-slate-500" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Privileged Access Configuration</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Approval Required for Role Escalation</Label>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked={true} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Required</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Approval Required for Emergency Access</Label>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked={true} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Required</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Just-in-time Access (Time-bound)</Label>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked={true} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Enabled</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Automatic Privilege Expiry</Label>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked={true} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Enabled</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">
                  Privileged Access Rules
                </h4>
                <ul className="text-xs text-red-800 dark:text-red-200 space-y-1 list-disc list-inside">
                  <li>Privileged actions must be justified, time-limited, and fully logged</li>
                  <li>Emergency access must NOT bypass Quality & Safety approvals</li>
                  <li>All privilege elevations require approval and are audit logged</li>
                  <li>Automatic expiry ensures no permanent privilege escalation</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6. Access Audit & Visibility */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <CardTitle>Access Audit & Visibility</CardTitle>
          </div>
          <CardDescription>
            Audit-ready visibility into access control. Read-only access. Linked to central Audit Logs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Access Change History */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <History className="h-4 w-4 text-slate-500" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">User Access Change History</h3>
            </div>
            <div className="space-y-3">
              {mockAuditEvents.map((event) => (
                <div key={event.id} className="border-b border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{event.user}</span>
                        <Badge variant="outline" className="text-xs">{event.action}</Badge>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{event.details}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        Changed by {event.changedBy} • {event.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Role Assignment Changes</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">12</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Last 30 days</div>
            </div>
            <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Privilege Elevation Events</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">3</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Last 30 days</div>
            </div>
            <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Failed Access Attempts</div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">0</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Last 30 days</div>
            </div>
            <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4">
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Last Access Review</div>
              <div className="text-sm font-medium text-slate-900 dark:text-slate-100">2 weeks ago</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Scheduled: Quarterly</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              All access changes are linked to central Audit Logs
            </div>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              View Full Audit Log
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
