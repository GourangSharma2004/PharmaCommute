'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Package2, 
  Save, 
  RotateCcw,
  AlertTriangle,
  Info,
  Lock,
  Calendar,
  Shield,
  ArrowRightLeft,
  Warehouse,
  RotateCcw as ReturnIcon,
  Lock as LockIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText
} from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { UserRole } from '@/types/auth'

// Inventory rules configuration state
interface InventoryRulesConfig {
  // Batch & Expiry Handling Rules
  batchExpiry: {
    fefoEnforcement: boolean // Non-disableable
    nearExpiryThreshold: number // days
    nearExpiryWarningThreshold: number // days
    nearExpiryCriticalThreshold: number // days
    nearExpiryDispatchPolicy: 'block' | 'approval' | 'documentation' // Replaces multiple toggles
    autoBlockExpired: boolean
    preventDispatchExpired: boolean
  }
  
  // Quarantine & Restricted Stock Rules
  quarantine: {
    autoQuarantineOnGRN: boolean
    unquarantineRoles: UserRole[]
    visibilityRules: {
      showQuarantinedInReports: boolean
      showQuarantinedInInventory: boolean
      requireReasonToView: boolean
    }
    autoBlockOnQCFailure: boolean
    mandatoryQAApprovalForRelease: boolean
    qaApprovalRoles: UserRole[]
  }
  
  // Inventory Movement & Adjustment Rules
  movements: {
    allowManualAdjustments: boolean
    mandatoryReasonCodes: boolean
    adjustmentWarningThreshold: number // percentage
    adjustmentApprovalThreshold: number // percentage
    requireApprovalForHighValue: boolean
    highValueThreshold: number
    preventNegativeInventory: boolean
    backdatedMovementPolicy: {
      allowed: boolean
      daysLimit: number
      requireReason: boolean
      requireApproval: boolean
    }
  }
  
  // Warehouse & Location Rules
  warehouse: {
    interWarehouseTransferRules: {
      allowed: boolean
      requireApproval: boolean
      approvalRoles: UserRole[]
    }
    partialBatchMovement: {
      allowed: boolean
      requireDocumentation: boolean
      trackSplitHistory: boolean
    }
    virtualLocations: {
      quarantineLocation: string
      damagedLocation: string
      expiredLocation: string
      autoRouteToVirtual: boolean
    }
  }
  
  // Returns & Reverse Logistics Rules
  returns: {
    allowedReturnTypes: {
      expired: boolean
      damaged: boolean
      nearExpiry: boolean
      customerReturn: boolean
    }
    autoRouting: {
      expiredToExpiredLocation: boolean
      damagedToDamagedLocation: boolean
      nearExpiryToQuarantine: boolean
    }
    qaInspectionRequired: boolean
    mandatoryDocumentation: boolean
    returnDocumentationFields: string[]
  }
  
  // Inventory Locking & Valuation Rules
  locking: {
    periodBasedLocking: boolean
    lockPeriodEndDate: string // YYYY-MM-DD
    preventBackdatedEntries: boolean
    backdatedEntryDaysLimit: number
    requireApprovalForHistoricalChanges: boolean
    approvalRolesForHistorical: UserRole[]
    valuationMethod: 'FIFO' | 'FEFO' | 'LIFO' | 'Average'
    showValuationInReports: boolean
  }
}

const DEFAULT_CONFIG: InventoryRulesConfig = {
  batchExpiry: {
    fefoEnforcement: true, // Always enabled
    nearExpiryThreshold: 30, // days
    nearExpiryWarningThreshold: 60, // days
    nearExpiryCriticalThreshold: 15, // days
    nearExpiryDispatchPolicy: 'approval', // block | approval | documentation
    autoBlockExpired: true,
    preventDispatchExpired: true,
  },
  quarantine: {
    autoQuarantineOnGRN: true,
    unquarantineRoles: [UserRole.QA_MANAGER, UserRole.ADMIN],
    visibilityRules: {
      showQuarantinedInReports: true,
      showQuarantinedInInventory: true,
      requireReasonToView: false,
    },
    autoBlockOnQCFailure: true,
    mandatoryQAApprovalForRelease: true,
    qaApprovalRoles: [UserRole.QA_MANAGER, UserRole.ADMIN],
  },
  movements: {
    allowManualAdjustments: false, // Default OFF
    mandatoryReasonCodes: true,
    adjustmentWarningThreshold: 5, // percentage
    adjustmentApprovalThreshold: 10, // percentage
    requireApprovalForHighValue: true,
    highValueThreshold: 10000, // currency units
    preventNegativeInventory: true,
    backdatedMovementPolicy: {
      allowed: true,
      daysLimit: 7,
      requireReason: true,
      requireApproval: true,
    },
  },
  warehouse: {
    interWarehouseTransferRules: {
      allowed: true,
      requireApproval: true,
      approvalRoles: [UserRole.WAREHOUSE_MANAGER, UserRole.ADMIN],
    },
    partialBatchMovement: {
      allowed: true,
      requireDocumentation: true,
      trackSplitHistory: true,
    },
    virtualLocations: {
      quarantineLocation: 'QUARANTINE',
      damagedLocation: 'DAMAGED',
      expiredLocation: 'EXPIRED',
      autoRouteToVirtual: true,
    },
  },
  returns: {
    allowedReturnTypes: {
      expired: true,
      damaged: true,
      nearExpiry: true,
      customerReturn: true,
    },
    autoRouting: {
      expiredToExpiredLocation: true,
      damagedToDamagedLocation: true,
      nearExpiryToQuarantine: true,
    },
    qaInspectionRequired: true,
    mandatoryDocumentation: true,
    returnDocumentationFields: ['Return Reason', 'Condition', 'QC Status', 'Disposition'],
  },
  locking: {
    periodBasedLocking: false,
    lockPeriodEndDate: '',
    preventBackdatedEntries: false,
    backdatedEntryDaysLimit: 30,
    requireApprovalForHistoricalChanges: true,
    approvalRolesForHistorical: [UserRole.ADMIN, UserRole.QA_MANAGER],
    valuationMethod: 'FEFO',
    showValuationInReports: true,
  },
}

export default function InventoryRulesPage() {
  const { user, getPermissions } = useAuthStore()
  const permissions = getPermissions()
  
  // Allow ADMIN, QA_MANAGER, and WAREHOUSE_MANAGER
  const isAdmin = user?.role === UserRole.ADMIN || permissions?.canConfigureSystem
  const isQAManager = user?.role === UserRole.QA_MANAGER
  const isWarehouseManager = user?.role === UserRole.WAREHOUSE_MANAGER
  const hasAccess = isAdmin || isQAManager || isWarehouseManager

  const [config, setConfig] = useState<InventoryRulesConfig>(DEFAULT_CONFIG)
  const [hasChanges, setHasChanges] = useState(false)

  // If not authorized, show access denied
  if (!hasAccess) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Lock className="h-16 w-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Access Denied</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Inventory Rules can only be accessed by Administrators, QA Managers, and Warehouse Managers.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSave = () => {
    // TODO: Save to backend with audit logging
    console.log('Saving inventory rules config:', config)
    setHasChanges(false)
    // Show success notification
  }

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG)
    setHasChanges(false)
  }

  const updateConfig = (path: string, value: any) => {
    const keys = path.split('.')
    setConfig(prev => {
      const newConfig = { ...prev }
      let current: any = newConfig
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = { ...current[keys[i]] }
      }
      current[keys[keys.length - 1]] = value
      return newConfig
    })
    setHasChanges(true)
  }

  const toggleRole = (path: string, role: UserRole) => {
    const currentRoles = path.split('.').reduce((obj, key) => obj[key], config as any)
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter((r: UserRole) => r !== role)
      : [...currentRoles, role]
    updateConfig(path, newRoles)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Inventory Rules & Policies</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Governance rules that protect compliance, traceability, and audit integrity across all inventory operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} size="sm" disabled={!hasChanges}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} size="sm" disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Governance Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
              Inventory Governance Policies
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              These rules define how inventory is handled across the entire system. Mandatory rules cannot be disabled 
              as they are required for pharmaceutical compliance (GxP, 21 CFR Part 11). All policy changes are automatically 
              audit logged to maintain regulatory compliance.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: BATCH & EXPIRY HANDLING RULES */}
      <Card className="border-2 dark:border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Batch & Expiry Handling Rules</CardTitle>
              <CardDescription className="mt-1">
                Configure FEFO logic, expiry thresholds, and batch allocation rules
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* FEFO Enforcement - Enforced Policy */}
          <div className="space-y-3 p-5 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/10">
            <div className="flex items-start gap-3">
              <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Label className="text-lg font-bold dark:text-slate-100">FEFO Enforcement</Label>
                  <Badge variant="default" className="bg-amber-600 text-white border-0">
                    <Lock className="h-3 w-3 mr-1" />
                    Regulatory Mandatory
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Enforced (Non-disableable)</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">
                  First-Expiry-First-Out (FEFO) allocation is mandatory for pharmaceutical compliance per GxP regulations. 
                  All batch dispatches automatically follow FEFO logic to minimize expiry losses and ensure regulatory compliance.
                </p>
                <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded border border-blue-200 dark:border-blue-700">
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <Info className="h-3 w-3 inline mr-1" />
                    This rule cannot be disabled as it is a core requirement for pharma inventory management and audit compliance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Near-Expiry Multi-Level Thresholds */}
          <div className="space-y-4 p-4 border dark:border-slate-700 rounded-lg">
            <Label className="text-base font-semibold dark:text-slate-200">Near-Expiry Threshold Configuration</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Warning Threshold</Label>
                <Input
                  type="number"
                  value={config.batchExpiry.nearExpiryWarningThreshold}
                  onChange={(e) => updateConfig('batchExpiry.nearExpiryWarningThreshold', parseInt(e.target.value) || 60)}
                  min="1"
                  max="365"
                  className="w-full"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">days before expiry</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Alert Threshold</Label>
                <Input
                  type="number"
                  value={config.batchExpiry.nearExpiryThreshold}
                  onChange={(e) => updateConfig('batchExpiry.nearExpiryThreshold', parseInt(e.target.value) || 30)}
                  min="1"
                  max="365"
                  className="w-full"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">days before expiry</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Critical Threshold</Label>
                <Input
                  type="number"
                  value={config.batchExpiry.nearExpiryCriticalThreshold}
                  onChange={(e) => updateConfig('batchExpiry.nearExpiryCriticalThreshold', parseInt(e.target.value) || 15)}
                  min="1"
                  max="365"
                  className="w-full"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">days before expiry</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Multi-level thresholds enable progressive alerts and controls as batches approach expiry
            </p>
          </div>

          {/* Near-Expiry Dispatch Policy - Dropdown */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <Label className="text-base font-semibold dark:text-slate-200">Near-Expiry Dispatch Policy</Label>
            <Select
              value={config.batchExpiry.nearExpiryDispatchPolicy}
              onValueChange={(value: 'block' | 'approval' | 'documentation') => 
                updateConfig('batchExpiry.nearExpiryDispatchPolicy', value)
              }
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="block">Block dispatch (prevent near-expiry dispatches)</SelectItem>
                <SelectItem value="approval">Allow with approval (require manager approval)</SelectItem>
                <SelectItem value="documentation">Allow with documentation (require reason code)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Controls how batches within near-expiry thresholds are handled during dispatch operations
            </p>
          </div>

          {/* Expired Stock Handling - Enforced Rule */}
          <div className="space-y-3 p-4 border-2 border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/10">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-base font-semibold text-red-900 dark:text-red-200">Expired Stock Handling</Label>
                  <Badge variant="outline" className="text-xs border-red-500 text-red-700 dark:text-red-400">
                    Enforced Rule
                  </Badge>
                </div>
                <p className="text-sm text-red-800 dark:text-red-300 font-medium mb-1">
                  Expired batches are always blocked from dispatch
                </p>
                <p className="text-xs text-red-700 dark:text-red-400">
                  This is a system-enforced rule to prevent dispatch of expired pharmaceutical products. 
                  Expired batches are automatically moved to blocked status and cannot be dispatched under any circumstances.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: QUARANTINE & RESTRICTED STOCK RULES */}
      <Card className="border-2 dark:border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Quarantine & Restricted Stock Rules</CardTitle>
              <CardDescription className="mt-1">
                Configure quarantine workflows, visibility, and release approval requirements
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto-Quarantine on GRN */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center gap-4">
              <Switch
                checked={config.quarantine.autoQuarantineOnGRN}
                onCheckedChange={(checked) => updateConfig('quarantine.autoQuarantineOnGRN', checked)}
              />
              <div className="flex-1">
                <Label className="text-sm font-semibold dark:text-slate-200 cursor-pointer">
                  Auto-quarantine on Goods Receipt Note (GRN)
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  All incoming batches are automatically placed in quarantine until QC approval
                </p>
                <p className="text-xs text-green-700 dark:text-green-400 mt-1 font-medium">
                  ✓ Recommended for GMP compliance
                </p>
              </div>
            </div>
          </div>

          {/* QC Failure Handling - Enforced Rule */}
          <div className="space-y-3 p-4 border-2 border-orange-200 dark:border-orange-800 rounded-lg bg-orange-50 dark:bg-orange-900/10">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-base font-semibold text-orange-900 dark:text-orange-200">QC Failure Handling</Label>
                  <Badge variant="outline" className="text-xs border-orange-500 text-orange-700 dark:text-orange-400">
                    Enforced Rule
                  </Badge>
                </div>
                <p className="text-sm text-orange-800 dark:text-orange-300 font-medium mb-1">
                  QC failure automatically moves batch to Blocked status
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-400">
                  This is a mandatory quality control rule. Any batch that fails QC testing is automatically 
                  moved to blocked status and cannot be released until corrective action is taken.
                </p>
              </div>
            </div>
          </div>

          {/* Unquarantine Permissions - Role Matrix */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-base font-semibold dark:text-slate-200">Unquarantine Permissions</Label>
              <Badge variant="outline" className="text-xs">
                <FileText className="h-3 w-3 mr-1" />
                All actions audit logged
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Select roles authorized to release batches from quarantine
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[UserRole.ADMIN, UserRole.QA_MANAGER, UserRole.WAREHOUSE_MANAGER].map(role => (
                <div 
                  key={role} 
                  className={`p-3 border-2 rounded-lg transition-colors ${
                    config.quarantine.unquarantineRoles.includes(role)
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={config.quarantine.unquarantineRoles.includes(role)}
                      onChange={() => toggleRole('quarantine.unquarantineRoles', role)}
                      className="rounded border-slate-300"
                    />
                    <Label className="text-sm font-medium cursor-pointer">
                      {role.replace('_', ' ')}
                    </Label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visibility Rules */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <Label className="text-base font-semibold dark:text-slate-200">Quarantined Stock Visibility</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.quarantine.visibilityRules.showQuarantinedInReports}
                  onCheckedChange={(checked) => updateConfig('quarantine.visibilityRules.showQuarantinedInReports', checked)}
                />
                <Label className="text-sm font-normal cursor-pointer">
                  Show quarantined stock in reports
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.quarantine.visibilityRules.showQuarantinedInInventory}
                  onCheckedChange={(checked) => updateConfig('quarantine.visibilityRules.showQuarantinedInInventory', checked)}
                />
                <Label className="text-sm font-normal cursor-pointer">
                  Show quarantined stock in inventory views
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.quarantine.visibilityRules.requireReasonToView}
                  onCheckedChange={(checked) => updateConfig('quarantine.visibilityRules.requireReasonToView', checked)}
                />
                <Label className="text-sm font-normal cursor-pointer">
                  Require reason to view quarantined stock details
                </Label>
              </div>
            </div>
          </div>

          {/* Mandatory QA Approval */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center gap-4">
              <Switch
                checked={config.quarantine.mandatoryQAApprovalForRelease}
                onCheckedChange={(checked) => updateConfig('quarantine.mandatoryQAApprovalForRelease', checked)}
              />
              <div className="flex-1">
                <Label className="text-sm font-semibold dark:text-slate-200 cursor-pointer">
                  Mandatory QA approval for batch release
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  All batches require QA approval before release from quarantine
                </p>
              </div>
            </div>
            {config.quarantine.mandatoryQAApprovalForRelease && (
              <div className="mt-3 p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/10">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Label className="text-sm font-bold text-blue-900 dark:text-blue-200">Active Policy</Label>
                      <Badge variant="outline" className="text-xs border-blue-500 text-blue-700 dark:text-blue-400">
                        Enforced
                      </Badge>
                    </div>
                    <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
                      All batches require QA approval before release from quarantine
                    </p>
                    <div className="mt-3 space-y-2">
                      <Label className="text-xs font-medium">Authorized Approval Roles:</Label>
                      <div className="flex flex-wrap gap-2">
                        {config.quarantine.qaApprovalRoles.map(role => (
                          <Badge key={role} variant="default" className="text-xs">
                            {role.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {config.quarantine.mandatoryQAApprovalForRelease && (
              <div className="pl-8 space-y-2">
                <Label className="text-sm">QA Approval Roles</Label>
                {[UserRole.ADMIN, UserRole.QA_MANAGER].map(role => (
                  <div key={role} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={config.quarantine.qaApprovalRoles.includes(role)}
                      onChange={() => toggleRole('quarantine.qaApprovalRoles', role)}
                      className="rounded border-slate-300"
                    />
                    <Label className="text-sm font-normal cursor-pointer">
                      {role.replace('_', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: INVENTORY MOVEMENT & ADJUSTMENT RULES */}
      <Card className="border-2 dark:border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <ArrowRightLeft className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Inventory Movement & Adjustment Rules</CardTitle>
              <CardDescription className="mt-1">
                Control manual adjustments, reason codes, and approval workflows
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Allow Manual Adjustments - Default OFF with Warning */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center gap-4">
              <Switch
                checked={config.movements.allowManualAdjustments}
                onCheckedChange={(checked) => updateConfig('movements.allowManualAdjustments', checked)}
              />
              <div className="flex-1">
                <Label className="text-sm font-semibold dark:text-slate-200 cursor-pointer">
                  Allow manual inventory adjustments
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enable users to manually adjust inventory quantities
                </p>
              </div>
            </div>
            {config.movements.allowManualAdjustments && (
              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    <strong>Warning:</strong> Manual adjustments increase audit risk. All adjustments are logged and may require 
                    additional documentation for compliance purposes.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Mandatory Reason Codes */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center gap-4">
              <Switch
                checked={config.movements.mandatoryReasonCodes}
                onCheckedChange={(checked) => updateConfig('movements.mandatoryReasonCodes', checked)}
              />
              <div className="flex-1">
                <Label className="text-sm font-semibold dark:text-slate-200 cursor-pointer">
                  Mandatory reason codes for adjustments
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  All adjustments must include a reason code for audit trail
                </p>
              </div>
            </div>
          </div>

          {/* Adjustment Thresholds - Warning and Approval */}
          <div className="space-y-4 p-4 border dark:border-slate-700 rounded-lg">
            <Label className="text-base font-semibold dark:text-slate-200">Adjustment Thresholds</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Warning Threshold</Label>
                <Input
                  type="number"
                  value={config.movements.adjustmentWarningThreshold}
                  onChange={(e) => updateConfig('movements.adjustmentWarningThreshold', parseInt(e.target.value) || 5)}
                  min="1"
                  max="100"
                  className="w-full"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">% variance - triggers warning notification</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Approval Threshold</Label>
                <Input
                  type="number"
                  value={config.movements.adjustmentApprovalThreshold}
                  onChange={(e) => updateConfig('movements.adjustmentApprovalThreshold', parseInt(e.target.value) || 10)}
                  min="1"
                  max="100"
                  className="w-full"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">% variance - requires manager approval</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Adjustments exceeding the approval threshold require additional authorization before processing
            </p>
          </div>

          {/* High-Value Approval */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center gap-4">
              <Switch
                checked={config.movements.requireApprovalForHighValue}
                onCheckedChange={(checked) => updateConfig('movements.requireApprovalForHighValue', checked)}
              />
              <div className="flex-1">
                <Label className="text-sm font-semibold dark:text-slate-200 cursor-pointer">
                  Require approval for high-value adjustments
                </Label>
              </div>
            </div>
            {config.movements.requireApprovalForHighValue && (
              <div className="pl-8 space-y-2">
                <Label className="text-sm">High-Value Threshold</Label>
                <Input
                  type="number"
                  value={config.movements.highValueThreshold}
                  onChange={(e) => updateConfig('movements.highValueThreshold', parseInt(e.target.value) || 10000)}
                  min="0"
                  className="w-48"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">Currency units</p>
              </div>
            )}
          </div>

          {/* Prevent Negative Inventory - Enforced Constraint */}
          {config.movements.preventNegativeInventory && (
            <div className="space-y-3 p-4 border-2 border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/10">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-base font-semibold text-green-900 dark:text-green-200">Negative Inventory Prevention</Label>
                    <Badge variant="outline" className="text-xs border-green-500 text-green-700 dark:text-green-400">
                      System Constraint
                    </Badge>
                  </div>
                  <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                    System will block movements that would result in negative stock
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                    This constraint ensures inventory accuracy and prevents data integrity issues
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Backdated Movements - Policy Block */}
          <div className="space-y-4 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center gap-4">
              <Switch
                checked={config.movements.backdatedMovementPolicy.allowed}
                onCheckedChange={(checked) => 
                  updateConfig('movements.backdatedMovementPolicy.allowed', checked)
                }
              />
              <div className="flex-1">
                <Label className="text-sm font-semibold dark:text-slate-200 cursor-pointer">
                  Allow backdated movements
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Permit entry of movements with dates in the past
                </p>
              </div>
            </div>
            {config.movements.backdatedMovementPolicy.allowed && (
              <div className="pl-8 space-y-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Allowed Window</Label>
                  <Input
                    type="number"
                    value={config.movements.backdatedMovementPolicy.daysLimit}
                    onChange={(e) => updateConfig('movements.backdatedMovementPolicy.daysLimit', parseInt(e.target.value) || 7)}
                    min="1"
                    max="90"
                    className="w-32"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">days in the past</p>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={config.movements.backdatedMovementPolicy.requireReason}
                    onCheckedChange={(checked) => updateConfig('movements.backdatedMovementPolicy.requireReason', checked)}
                  />
                  <Label className="text-sm font-normal cursor-pointer">Mandatory reason required</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={config.movements.backdatedMovementPolicy.requireApproval}
                    onCheckedChange={(checked) => updateConfig('movements.backdatedMovementPolicy.requireApproval', checked)}
                  />
                  <Label className="text-sm font-normal cursor-pointer">Mandatory approval required</Label>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SECTION 4: WAREHOUSE & LOCATION RULES */}
      <Card className="border-2 dark:border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Warehouse className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Warehouse & Location Rules</CardTitle>
              <CardDescription className="mt-1">
                Configure inter-warehouse transfers, partial batch movements, and virtual locations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Inter-Warehouse Transfers */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center gap-4">
              <Switch
                checked={config.warehouse.interWarehouseTransferRules.allowed}
                onCheckedChange={(checked) => updateConfig('warehouse.interWarehouseTransferRules.allowed', checked)}
              />
              <div className="flex-1">
                <Label className="text-sm font-semibold dark:text-slate-200 cursor-pointer">
                  Allow inter-warehouse transfers
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enable stock transfers between different warehouse locations
                </p>
              </div>
            </div>
            {config.warehouse.interWarehouseTransferRules.allowed && (
              <div className="pl-8 space-y-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={config.warehouse.interWarehouseTransferRules.requireApproval}
                    onCheckedChange={(checked) => updateConfig('warehouse.interWarehouseTransferRules.requireApproval', checked)}
                  />
                  <Label className="text-sm font-normal cursor-pointer">
                    Require approval for inter-warehouse transfers
                  </Label>
                </div>
                {config.warehouse.interWarehouseTransferRules.requireApproval && (
                  <div className="space-y-2">
                    <Label className="text-sm">Approval Roles</Label>
                    {[UserRole.ADMIN, UserRole.WAREHOUSE_MANAGER].map(role => (
                      <div key={role} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={config.warehouse.interWarehouseTransferRules.approvalRoles.includes(role)}
                          onChange={() => toggleRole('warehouse.interWarehouseTransferRules.approvalRoles', role)}
                          className="rounded border-slate-300"
                        />
                        <Label className="text-sm font-normal cursor-pointer">
                          {role.replace('_', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Partial Batch Movement */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center gap-4">
              <Switch
                checked={config.warehouse.partialBatchMovement.allowed}
                onCheckedChange={(checked) => updateConfig('warehouse.partialBatchMovement.allowed', checked)}
              />
              <div className="flex-1">
                <Label className="text-sm font-semibold dark:text-slate-200 cursor-pointer">
                  Allow partial batch movements
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Permit splitting batches across multiple locations or movements
                </p>
              </div>
            </div>
            {config.warehouse.partialBatchMovement.allowed && (
              <div className="pl-8 space-y-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={config.warehouse.partialBatchMovement.requireDocumentation}
                    onCheckedChange={(checked) => updateConfig('warehouse.partialBatchMovement.requireDocumentation', checked)}
                  />
                  <Label className="text-sm font-normal cursor-pointer">
                    Require documentation for partial movements
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={config.warehouse.partialBatchMovement.trackSplitHistory}
                    onCheckedChange={(checked) => updateConfig('warehouse.partialBatchMovement.trackSplitHistory', checked)}
                  />
                  <Label className="text-sm font-normal cursor-pointer">
                    Track batch split history for traceability
                  </Label>
                </div>
              </div>
            )}
          </div>

          {/* Virtual Locations */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-base font-semibold dark:text-slate-200">Virtual Locations</Label>
              <Badge variant="outline" className="text-xs">
                Compliance Segregation
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Virtual locations ensure proper segregation of non-conforming stock for compliance and traceability
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Quarantine Location</Label>
                <Input
                  value={config.warehouse.virtualLocations.quarantineLocation}
                  onChange={(e) => updateConfig('warehouse.virtualLocations.quarantineLocation', e.target.value)}
                  placeholder="QUARANTINE"
                  readOnly={!isAdmin}
                  className={!isAdmin ? "bg-slate-50 dark:bg-slate-800" : ""}
                />
                {!isAdmin && (
                  <p className="text-xs text-slate-400">Read-only (Admin only)</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Damaged Location</Label>
                <Input
                  value={config.warehouse.virtualLocations.damagedLocation}
                  onChange={(e) => updateConfig('warehouse.virtualLocations.damagedLocation', e.target.value)}
                  placeholder="DAMAGED"
                  readOnly={!isAdmin}
                  className={!isAdmin ? "bg-slate-50 dark:bg-slate-800" : ""}
                />
                {!isAdmin && (
                  <p className="text-xs text-slate-400">Read-only (Admin only)</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Expired Location</Label>
                <Input
                  value={config.warehouse.virtualLocations.expiredLocation}
                  onChange={(e) => updateConfig('warehouse.virtualLocations.expiredLocation', e.target.value)}
                  placeholder="EXPIRED"
                  readOnly={!isAdmin}
                  className={!isAdmin ? "bg-slate-50 dark:bg-slate-800" : ""}
                />
                {!isAdmin && (
                  <p className="text-xs text-slate-400">Read-only (Admin only)</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Switch
                checked={config.warehouse.virtualLocations.autoRouteToVirtual}
                onCheckedChange={(checked) => updateConfig('warehouse.virtualLocations.autoRouteToVirtual', checked)}
              />
              <Label className="text-sm font-normal cursor-pointer">
                Auto-route stock to appropriate virtual location
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 5: RETURNS & REVERSE LOGISTICS RULES */}
      <Card className="border-2 dark:border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <ReturnIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Returns & Reverse Logistics Rules</CardTitle>
              <CardDescription className="mt-1">
                Configure return types, auto-routing, and QA inspection requirements
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Allowed Return Types */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <Label className="text-base font-semibold dark:text-slate-200">Allowed Return Types</Label>
            <div className="space-y-2">
              {Object.entries(config.returns.allowedReturnTypes).map(([type, allowed]) => (
                <div key={type} className="flex items-center gap-2">
                  <Switch
                    checked={allowed}
                    onCheckedChange={(checked) => updateConfig(`returns.allowedReturnTypes.${type}`, checked)}
                  />
                  <Label className="text-sm font-normal cursor-pointer capitalize">
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Auto-Routing */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <Label className="text-base font-semibold dark:text-slate-200">Auto-Routing of Returned Stock</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.returns.autoRouting.expiredToExpiredLocation}
                  onCheckedChange={(checked) => updateConfig('returns.autoRouting.expiredToExpiredLocation', checked)}
                />
                <Label className="text-sm font-normal cursor-pointer">
                  Route expired returns to expired location
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.returns.autoRouting.damagedToDamagedLocation}
                  onCheckedChange={(checked) => updateConfig('returns.autoRouting.damagedToDamagedLocation', checked)}
                />
                <Label className="text-sm font-normal cursor-pointer">
                  Route damaged returns to damaged location
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.returns.autoRouting.nearExpiryToQuarantine}
                  onCheckedChange={(checked) => updateConfig('returns.autoRouting.nearExpiryToQuarantine', checked)}
                />
                <Label className="text-sm font-normal cursor-pointer">
                  Route near-expiry returns to quarantine
                </Label>
              </div>
            </div>
          </div>

          {/* Returns Auto-Routing - Default Policy */}
          <div className="space-y-3 p-4 border-2 border-indigo-200 dark:border-indigo-800 rounded-lg bg-indigo-50 dark:bg-indigo-900/10">
            <div className="flex items-start gap-3">
              <ReturnIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-base font-semibold text-indigo-900 dark:text-indigo-200">Returned Stock Routing</Label>
                  <Badge variant="outline" className="text-xs border-indigo-500 text-indigo-700 dark:text-indigo-400">
                    Default Policy
                  </Badge>
                </div>
                <p className="text-sm text-indigo-800 dark:text-indigo-300 font-medium mb-1">
                  All returned stock routes to Quarantine by default
                </p>
                <p className="text-xs text-indigo-700 dark:text-indigo-400">
                  Returned stock is automatically routed to quarantine location for QA inspection 
                  before re-entry into inventory, ensuring quality control and compliance.
                </p>
              </div>
            </div>
          </div>

          {/* QA Inspection - Mandatory Rule */}
          {config.returns.qaInspectionRequired && (
            <div className="space-y-3 p-4 border-2 border-orange-200 dark:border-orange-800 rounded-lg bg-orange-50 dark:bg-orange-900/10">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-base font-semibold text-orange-900 dark:text-orange-200">QA Inspection Requirement</Label>
                    <Badge variant="outline" className="text-xs border-orange-500 text-orange-700 dark:text-orange-400">
                      Mandatory Rule
                    </Badge>
                  </div>
                  <p className="text-sm text-orange-800 dark:text-orange-300 font-medium">
                    QA inspection required for all returns before re-entry into inventory
                  </p>
                  <p className="text-xs text-orange-700 dark:text-orange-400 mt-1">
                    This ensures returned stock meets quality standards before being reintroduced to active inventory
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mandatory Documentation */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center gap-4">
              <Switch
                checked={config.returns.mandatoryDocumentation}
                onCheckedChange={(checked) => updateConfig('returns.mandatoryDocumentation', checked)}
              />
              <div className="flex-1">
                <Label className="text-sm font-semibold dark:text-slate-200 cursor-pointer">
                  Mandatory return documentation
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  All returns must include complete documentation (reason, condition, QC status, disposition)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 6: INVENTORY LOCKING & VALUATION RULES */}
      <Card className="border-2 dark:border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <LockIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Inventory Locking & Valuation Rules</CardTitle>
              <CardDescription className="mt-1">
                Configure period-based locking, backdated entry control, and valuation methods
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Period-Based Locking - Governance Rule */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center gap-4">
              <Switch
                checked={config.locking.periodBasedLocking}
                onCheckedChange={(checked) => updateConfig('locking.periodBasedLocking', checked)}
              />
              <div className="flex-1">
                <Label className="text-sm font-semibold dark:text-slate-200 cursor-pointer">
                  Enable period-based inventory locking
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Lock inventory for closed periods to prevent historical changes
                </p>
              </div>
            </div>
            {config.locking.periodBasedLocking && (
              <div className="pl-8 space-y-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Lock Period End Date</Label>
                  <Input
                    type="date"
                    value={config.locking.lockPeriodEndDate}
                    onChange={(e) => updateConfig('locking.lockPeriodEndDate', e.target.value)}
                    className="w-48"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    All inventory before this date is locked and cannot be modified
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Governance Rule: Historical changes require approval
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Changes to locked periods must be approved by authorized roles to maintain audit integrity
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Prevent Backdated Entries */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center gap-4">
              <Switch
                checked={config.locking.preventBackdatedEntries}
                onCheckedChange={(checked) => updateConfig('locking.preventBackdatedEntries', checked)}
              />
              <div className="flex-1">
                <Label className="text-sm font-semibold dark:text-slate-200 cursor-pointer">
                  Prevent backdated entries
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Block entry of transactions with dates in the past
                </p>
              </div>
            </div>
            {!config.locking.preventBackdatedEntries && (
              <div className="pl-8 space-y-2">
                <Label className="text-sm">Backdated Entry Days Limit</Label>
                <Input
                  type="number"
                  value={config.locking.backdatedEntryDaysLimit}
                  onChange={(e) => updateConfig('locking.backdatedEntryDaysLimit', parseInt(e.target.value) || 30)}
                  min="1"
                  max="90"
                  className="w-32"
                />
              </div>
            )}
          </div>

          {/* Approval for Historical Changes */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center gap-4">
              <Switch
                checked={config.locking.requireApprovalForHistoricalChanges}
                onCheckedChange={(checked) => updateConfig('locking.requireApprovalForHistoricalChanges', checked)}
              />
              <div className="flex-1">
                <Label className="text-sm font-semibold dark:text-slate-200 cursor-pointer">
                  Require approval for historical changes
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Changes to locked or historical periods require additional approval
                </p>
              </div>
            </div>
            {config.locking.requireApprovalForHistoricalChanges && (
              <div className="pl-8 space-y-2">
                <Label className="text-sm">Approval Roles</Label>
                {[UserRole.ADMIN, UserRole.QA_MANAGER].map(role => (
                  <div key={role} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={config.locking.approvalRolesForHistorical.includes(role)}
                      onChange={() => toggleRole('locking.approvalRolesForHistorical', role)}
                      className="rounded border-slate-300"
                    />
                    <Label className="text-sm font-normal cursor-pointer">
                      {role.replace('_', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Operational Allocation vs Financial Valuation */}
          <div className="space-y-4 p-4 border dark:border-slate-700 rounded-lg">
            <Label className="text-base font-semibold dark:text-slate-200">Allocation & Valuation Methods</Label>
            
            {/* Operational Allocation - FEFO Locked */}
            <div className="p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/10">
              <div className="flex items-start gap-3 mb-2">
                <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Label className="text-sm font-bold text-blue-900 dark:text-blue-200">Operational Allocation</Label>
                    <Badge variant="default" className="bg-amber-600 text-white border-0 text-xs">
                      Locked
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                    FEFO (First-Expiry-First-Out)
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                    Batch allocation for dispatch operations always follows FEFO logic. This cannot be changed.
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Valuation - Selectable */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Financial Valuation Method</Label>
              <Select
                value={config.locking.valuationMethod}
                onValueChange={(value: 'FIFO' | 'FEFO' | 'LIFO' | 'Average') => 
                  updateConfig('locking.valuationMethod', value)
                }
              >
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FEFO">FEFO (First-Expiry-First-Out) - Recommended for Pharma</SelectItem>
                  <SelectItem value="FIFO">FIFO (First-In-First-Out)</SelectItem>
                  <SelectItem value="LIFO">LIFO (Last-In-First-Out)</SelectItem>
                  <SelectItem value="Average">Weighted Average</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Valuation method does not affect batch allocation logic. Used for financial reporting and inventory valuation only.
              </p>
            </div>
          </div>

          {/* Show Valuation in Reports */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center gap-4">
              <Switch
                checked={config.locking.showValuationInReports}
                onCheckedChange={(checked) => updateConfig('locking.showValuationInReports', checked)}
              />
              <Label className="text-sm font-semibold dark:text-slate-200 cursor-pointer">
                Show valuation in inventory reports
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Note */}
      <div className="bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <Info className="h-6 w-6 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
              These Rules Protect Compliance, Traceability, and Audit Integrity
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              This page defines the "laws of inventory" for your organization. Mandatory rules (marked with lock icons) 
              are required for pharmaceutical compliance and cannot be disabled. Configurable rules allow you to set 
              thresholds and policies that balance operational flexibility with regulatory requirements. All changes 
              are automatically audit logged to maintain a complete record for regulatory inspections and internal audits.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Compliance Standards:</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">GxP</Badge>
                <Badge variant="outline" className="text-xs">21 CFR Part 11</Badge>
                <Badge variant="outline" className="text-xs">Batch Traceability</Badge>
                <Badge variant="outline" className="text-xs">Quality Control</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
