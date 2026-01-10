'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  GitBranch, 
  Shield, 
  FlaskConical, 
  Lock, 
  Info, 
  AlertTriangle,
  CheckCircle2,
  Save,
  RotateCcw,
  Database,
  Settings,
  Package2,
  Warehouse,
  FileCheck,
  DollarSign,
  Scale,
  Clock,
  Users,
  ArrowRightLeft,
  Gavel,
  Bell,
  UserCheck
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/auth-store'
import { UserRole } from '@/types/auth'

// Approval workflow configuration state
interface ApprovalWorkflowConfig {
  dataGovernance: {
    productMasterChanges: {
      approvalRequired: boolean // Mandatory
      approvalStructure: 'single' | 'sequential'
      approverRoles: UserRole[]
      mandatoryChangeReason: boolean
      reapprovalOnModification: boolean
    }
    batchConfigTemplates: {
      approvalRequired: boolean
      approvalStructure: 'single' | 'sequential'
      approverRoles: UserRole[]
      mandatoryChangeReason: boolean
      reapprovalOnModification: boolean
    }
    warehouseLocationChanges: {
      approvalRequired: boolean
      approvalStructure: 'single' | 'sequential'
      approverRoles: UserRole[]
      mandatoryChangeReason: boolean
      reapprovalOnModification: boolean
    }
    inventoryRulesChanges: {
      approvalRequired: boolean
      approvalStructure: 'single' | 'sequential'
      approverRoles: UserRole[]
      mandatoryChangeReason: boolean
      reapprovalOnModification: boolean
    }
    systemSecurityChanges: {
      approvalRequired: boolean
      approvalStructure: 'single' | 'sequential'
      approverRoles: UserRole[]
      mandatoryChangeReason: boolean
      reapprovalOnModification: boolean
    }
  }
  qualitySafety: {
    batchRelease: {
      approvalRequired: boolean // Mandatory
      approvalStructure: 'single' | 'sequential'
      approverRole: 'QA' | 'QUALIFIED_PERSON'
      mandatoryComments: boolean
    }
    unquarantineUnblock: {
      approvalRequired: boolean // Mandatory
      approvalStructure: 'single' | 'sequential'
      approverRole: 'QA' | 'QUALIFIED_PERSON'
      mandatoryComments: boolean
    }
    qcResultAcceptance: {
      approvalRequired: boolean // Mandatory
      approvalStructure: 'single' | 'sequential'
      approverRole: 'QA' | 'QUALIFIED_PERSON'
      mandatoryComments: boolean
    }
    returnedGoodsDisposition: {
      approvalRequired: boolean // Mandatory
      approvalStructure: 'single' | 'sequential'
      approverRole: 'QA' | 'QUALIFIED_PERSON'
      mandatoryComments: boolean
    }
  }
  inventoryRisk: {
    manualAdjustments: {
      approvalEnabled: boolean
      quantityThreshold: number
      valueThreshold: number
      approvalStructure: 'single' | 'sequential' | 'parallel'
      approverRoles: UserRole[]
      mandatoryJustification: boolean
    }
    backdatedEntries: {
      approvalEnabled: boolean
      daysLimit: number
      approvalStructure: 'single' | 'sequential' | 'parallel'
      approverRoles: UserRole[]
      mandatoryJustification: boolean
    }
    nearExpiryDispatch: {
      approvalEnabled: boolean
      daysThreshold: number
      approvalStructure: 'single' | 'sequential' | 'parallel'
      approverRoles: UserRole[]
      mandatoryJustification: boolean
    }
    partialBatchTransfers: {
      approvalEnabled: boolean
      approvalStructure: 'single' | 'sequential' | 'parallel'
      approverRoles: UserRole[]
      mandatoryJustification: boolean
    }
    crossWarehouseTransfers: {
      approvalEnabled: boolean
      approvalStructure: 'single' | 'sequential' | 'parallel'
      approverRoles: UserRole[]
      mandatoryJustification: boolean
    }
  }
  regulatoryAction: {
    recallInitiation: {
      approvalRequired: boolean // Mandatory
      approvalStructure: 'sequential'
      mandatoryComments: boolean
      escalationEnabled: boolean
    }
    recallClosure: {
      approvalRequired: boolean // Mandatory
      approvalStructure: 'sequential'
      mandatoryComments: boolean
      escalationEnabled: boolean
    }
    destructionOfGoods: {
      approvalRequired: boolean // Mandatory
      approvalStructure: 'sequential'
      mandatoryComments: boolean
      escalationEnabled: boolean
    }
    regulatoryReportSubmission: {
      approvalRequired: boolean // Mandatory
      approvalStructure: 'sequential'
      mandatoryComments: boolean
      escalationEnabled: boolean
    }
  }
  escalation: {
    enabled: boolean
    approvalSLAHours: number
    roleEscalation: boolean
    notificationEscalation: boolean
    substituteApprovers: boolean
    temporaryDelegation: boolean
    emergencyOverride: {
      enabled: boolean
      adminOnly: boolean
      requireJustification: boolean
    }
  }
}

// Mock initial state
const defaultConfig: ApprovalWorkflowConfig = {
  dataGovernance: {
    productMasterChanges: {
      approvalRequired: true,
      approvalStructure: 'sequential',
      approverRoles: [UserRole.ADMIN, UserRole.QA_MANAGER],
      mandatoryChangeReason: true,
      reapprovalOnModification: true,
    },
    batchConfigTemplates: {
      approvalRequired: true,
      approvalStructure: 'single',
      approverRoles: [UserRole.ADMIN],
      mandatoryChangeReason: true,
      reapprovalOnModification: true,
    },
    warehouseLocationChanges: {
      approvalRequired: true,
      approvalStructure: 'single',
      approverRoles: [UserRole.ADMIN],
      mandatoryChangeReason: true,
      reapprovalOnModification: false,
    },
    inventoryRulesChanges: {
      approvalRequired: true,
      approvalStructure: 'sequential',
      approverRoles: [UserRole.ADMIN, UserRole.QA_MANAGER],
      mandatoryChangeReason: true,
      reapprovalOnModification: true,
    },
    systemSecurityChanges: {
      approvalRequired: true,
      approvalStructure: 'sequential',
      approverRoles: [UserRole.ADMIN],
      mandatoryChangeReason: true,
      reapprovalOnModification: true,
    },
  },
  qualitySafety: {
    batchRelease: {
      approvalRequired: true,
      approvalStructure: 'sequential',
      approverRole: 'QUALIFIED_PERSON',
      mandatoryComments: true,
    },
    unquarantineUnblock: {
      approvalRequired: true,
      approvalStructure: 'single',
      approverRole: 'QA',
      mandatoryComments: true,
    },
    qcResultAcceptance: {
      approvalRequired: true,
      approvalStructure: 'single',
      approverRole: 'QA',
      mandatoryComments: true,
    },
    returnedGoodsDisposition: {
      approvalRequired: true,
      approvalStructure: 'sequential',
      approverRole: 'QUALIFIED_PERSON',
      mandatoryComments: true,
    },
  },
  inventoryRisk: {
    manualAdjustments: {
      approvalEnabled: true,
      quantityThreshold: 100,
      valueThreshold: 5000,
      approvalStructure: 'sequential',
      approverRoles: [UserRole.WAREHOUSE_MANAGER],
      mandatoryJustification: true,
    },
    backdatedEntries: {
      approvalEnabled: true,
      daysLimit: 7,
      approvalStructure: 'sequential',
      approverRoles: [UserRole.WAREHOUSE_MANAGER, UserRole.ADMIN],
      mandatoryJustification: true,
    },
    nearExpiryDispatch: {
      approvalEnabled: true,
      daysThreshold: 30,
      approvalStructure: 'single',
      approverRoles: [UserRole.WAREHOUSE_MANAGER],
      mandatoryJustification: true,
    },
    partialBatchTransfers: {
      approvalEnabled: true,
      approvalStructure: 'single',
      approverRoles: [UserRole.WAREHOUSE_MANAGER],
      mandatoryJustification: false,
    },
    crossWarehouseTransfers: {
      approvalEnabled: true,
      approvalStructure: 'sequential',
      approverRoles: [UserRole.WAREHOUSE_MANAGER, UserRole.ADMIN],
      mandatoryJustification: true,
    },
  },
  regulatoryAction: {
    recallInitiation: {
      approvalRequired: true,
      approvalStructure: 'sequential',
      mandatoryComments: true,
      escalationEnabled: true,
    },
    recallClosure: {
      approvalRequired: true,
      approvalStructure: 'sequential',
      mandatoryComments: true,
      escalationEnabled: true,
    },
    destructionOfGoods: {
      approvalRequired: true,
      approvalStructure: 'sequential',
      mandatoryComments: true,
      escalationEnabled: true,
    },
    regulatoryReportSubmission: {
      approvalRequired: true,
      approvalStructure: 'sequential',
      mandatoryComments: true,
      escalationEnabled: true,
    },
  },
  escalation: {
    enabled: true,
    approvalSLAHours: 24,
    roleEscalation: true,
    notificationEscalation: true,
    substituteApprovers: true,
    temporaryDelegation: true,
    emergencyOverride: {
      enabled: true,
      adminOnly: true,
      requireJustification: true,
    },
  },
}

export default function ApprovalWorkflowsPage() {
  const { user, getPermissions } = useAuthStore()
  const permissions = getPermissions()
  const [config, setConfig] = useState<ApprovalWorkflowConfig>(defaultConfig)
  const [hasChanges, setHasChanges] = useState(false)

  // Check if user has access (Admin / QA / Compliance)
  if (!user || !permissions) {
    return null
  }

  const hasAccess = 
    user.role === UserRole.ADMIN || 
    user.role === UserRole.QA_MANAGER ||
    user.role === UserRole.AUDITOR

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Approval Workflows</h1>
          <p className="text-slate-600 dark:text-slate-400">Configure approval processes for system workflows</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Access Restricted</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Only Admin, QA Manager, and Compliance roles can access approval workflow configuration.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate overview metrics
  const totalWorkflows = 
    Object.keys(config.dataGovernance).length + 
    Object.keys(config.qualitySafety).length +
    Object.keys(config.inventoryRisk).length +
    Object.keys(config.regulatoryAction).length

  const dataGovernanceCount = Object.keys(config.dataGovernance).length
  const qualitySafetyCount = Object.keys(config.qualitySafety).length
  const inventoryRiskCount = Object.keys(config.inventoryRisk).length
  const regulatoryActionCount = Object.keys(config.regulatoryAction).length

  const structuresInUse = new Set<string>()
  Object.values(config.dataGovernance).forEach(w => structuresInUse.add(w.approvalStructure))
  Object.values(config.qualitySafety).forEach(w => structuresInUse.add(w.approvalStructure))
  Object.values(config.inventoryRisk).forEach(w => {
    if (w.approvalEnabled) structuresInUse.add(w.approvalStructure)
  })
  Object.values(config.regulatoryAction).forEach(w => structuresInUse.add(w.approvalStructure))

  const handleSave = () => {
    // TODO: API call to save configuration
    console.log('Saving approval workflow configuration:', config)
    setHasChanges(false)
    // Show success message
  }

  const handleReset = () => {
    setConfig(defaultConfig)
    setHasChanges(false)
  }

  const updateDataGovernance = (
    workflow: keyof typeof config.dataGovernance,
    field: string,
    value: any
  ) => {
    setConfig(prev => ({
      ...prev,
      dataGovernance: {
        ...prev.dataGovernance,
        [workflow]: {
          ...prev.dataGovernance[workflow],
          [field]: value,
        },
      },
    }))
    setHasChanges(true)
  }

  const updateQualitySafety = (
    workflow: keyof typeof config.qualitySafety,
    field: string,
    value: any
  ) => {
    setConfig(prev => ({
      ...prev,
      qualitySafety: {
        ...prev.qualitySafety,
        [workflow]: {
          ...prev.qualitySafety[workflow],
          [field]: value,
        },
      },
    }))
    setHasChanges(true)
  }

  const updateInventoryRisk = (
    workflow: keyof typeof config.inventoryRisk,
    field: string,
    value: any
  ) => {
    setConfig(prev => ({
      ...prev,
      inventoryRisk: {
        ...prev.inventoryRisk,
        [workflow]: {
          ...prev.inventoryRisk[workflow],
          [field]: value,
        },
      },
    }))
    setHasChanges(true)
  }

  const updateRegulatoryAction = (
    workflow: keyof typeof config.regulatoryAction,
    field: string,
    value: any
  ) => {
    setConfig(prev => ({
      ...prev,
      regulatoryAction: {
        ...prev.regulatoryAction,
        [workflow]: {
          ...prev.regulatoryAction[workflow],
          [field]: value,
        },
      },
    }))
    setHasChanges(true)
  }

  const updateEscalation = (field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      escalation: {
        ...prev.escalation,
        [field]: value,
      },
    }))
    setHasChanges(true)
  }

  const updateEmergencyOverride = (field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      escalation: {
        ...prev.escalation,
        emergencyOverride: {
          ...prev.escalation.emergencyOverride,
          [field]: value,
        },
      },
    }))
    setHasChanges(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Approval Workflows</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Configure how approvals are enforced for regulated system workflows
          </p>
        </div>
        {hasChanges && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* 1. Workflow Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <GitBranch className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle>Workflow Overview</CardTitle>
          </div>
          <CardDescription>
            High-level visibility into approval strictness and configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg p-4 border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Active Workflows</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalWorkflows}</div>
            </div>
            <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg p-4 border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Data Governance</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{dataGovernanceCount}</div>
            </div>
            <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg p-4 border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Quality & Safety</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{qualitySafetyCount}</div>
            </div>
            <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg p-4 border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Inventory Risk</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{inventoryRiskCount}</div>
            </div>
            <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg p-4 border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Regulatory Action</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{regulatoryActionCount}</div>
            </div>
            <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg p-4 border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Escalation Enabled</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {config.escalation.enabled ? 'Yes' : 'No'}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">Approval Structures in Use</div>
            <div className="flex flex-wrap gap-2">
              {Array.from(structuresInUse).map(structure => (
                <Badge key={structure} variant="secondary" className="capitalize">
                  {structure === 'single' ? 'Single-level' : 'Sequential'}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Data Governance Approvals */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle>Data Governance Approvals</CardTitle>
          </div>
          <CardDescription>
            Protect master data and configuration integrity. These approvals protect downstream compliance and audit readiness.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product / Item Master Changes */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Database className="h-4 w-4 text-slate-500" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Product / Item Master Changes
                  </Label>
                  <Badge variant="outline" className="text-xs">Mandatory</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Changes to product specifications, attributes, or regulatory data
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Approval Structure</Label>
                <Select
                  value={config.dataGovernance.productMasterChanges.approvalStructure}
                  onValueChange={(value: 'single' | 'sequential') =>
                    updateDataGovernance('productMasterChanges', 'approvalStructure', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single-level</SelectItem>
                    <SelectItem value="sequential">Sequential</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Mandatory Change Reason</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.dataGovernance.productMasterChanges.mandatoryChangeReason}
                    onCheckedChange={(checked) =>
                      updateDataGovernance('productMasterChanges', 'mandatoryChangeReason', checked)
                    }
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.dataGovernance.productMasterChanges.mandatoryChangeReason ? 'Required' : 'Optional'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Re-approval on Modification</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.dataGovernance.productMasterChanges.reapprovalOnModification}
                    onCheckedChange={(checked) =>
                      updateDataGovernance('productMasterChanges', 'reapprovalOnModification', checked)
                    }
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.dataGovernance.productMasterChanges.reapprovalOnModification ? 'Required' : 'Not Required'}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-800 dark:text-blue-300">
                <strong>Compliance Note:</strong> All product master changes must be audit logged. Approval cannot be disabled as this protects downstream batch records and regulatory submissions.
              </p>
            </div>
          </div>

          {/* Batch Configuration Templates */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Package2 className="h-4 w-4 text-slate-500" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Batch Configuration Templates
                  </Label>
                  <Badge variant="outline" className="text-xs">Mandatory</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Changes to batch creation templates, attributes, or validation rules
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Approval Structure</Label>
                <Select
                  value={config.dataGovernance.batchConfigTemplates.approvalStructure}
                  onValueChange={(value: 'single' | 'sequential') =>
                    updateDataGovernance('batchConfigTemplates', 'approvalStructure', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single-level</SelectItem>
                    <SelectItem value="sequential">Sequential</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Mandatory Change Reason</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.dataGovernance.batchConfigTemplates.mandatoryChangeReason}
                    onCheckedChange={(checked) =>
                      updateDataGovernance('batchConfigTemplates', 'mandatoryChangeReason', checked)
                    }
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.dataGovernance.batchConfigTemplates.mandatoryChangeReason ? 'Required' : 'Optional'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Warehouse & Location Changes */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Warehouse className="h-4 w-4 text-slate-500" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Warehouse & Location Changes
                  </Label>
                  <Badge variant="outline" className="text-xs">Mandatory</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Changes to warehouse configuration, storage locations, or location attributes
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Approval Structure</Label>
                <Select
                  value={config.dataGovernance.warehouseLocationChanges.approvalStructure}
                  onValueChange={(value: 'single' | 'sequential') =>
                    updateDataGovernance('warehouseLocationChanges', 'approvalStructure', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single-level</SelectItem>
                    <SelectItem value="sequential">Sequential</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Mandatory Change Reason</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.dataGovernance.warehouseLocationChanges.mandatoryChangeReason}
                    onCheckedChange={(checked) =>
                      updateDataGovernance('warehouseLocationChanges', 'mandatoryChangeReason', checked)
                    }
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.dataGovernance.warehouseLocationChanges.mandatoryChangeReason ? 'Required' : 'Optional'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Rules Changes */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Settings className="h-4 w-4 text-slate-500" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Inventory Rules Changes
                  </Label>
                  <Badge variant="outline" className="text-xs">Mandatory</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Changes to FEFO rules, expiry handling, quarantine policies, or inventory governance
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Approval Structure</Label>
                <Select
                  value={config.dataGovernance.inventoryRulesChanges.approvalStructure}
                  onValueChange={(value: 'single' | 'sequential') =>
                    updateDataGovernance('inventoryRulesChanges', 'approvalStructure', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single-level</SelectItem>
                    <SelectItem value="sequential">Sequential</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Re-approval on Modification</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.dataGovernance.inventoryRulesChanges.reapprovalOnModification}
                    onCheckedChange={(checked) =>
                      updateDataGovernance('inventoryRulesChanges', 'reapprovalOnModification', checked)
                    }
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.dataGovernance.inventoryRulesChanges.reapprovalOnModification ? 'Required' : 'Not Required'}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-300">
                <strong>Warning:</strong> Changes to inventory rules affect operational compliance. All modifications require documented justification and approval.
              </p>
            </div>
          </div>

          {/* System & Security Configuration Changes */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Lock className="h-4 w-4 text-slate-500" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    System & Security Configuration Changes
                  </Label>
                  <Badge variant="outline" className="text-xs">Mandatory</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Changes to system settings, security policies, user access, or audit controls
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Approval Structure</Label>
                <Select
                  value={config.dataGovernance.systemSecurityChanges.approvalStructure}
                  onValueChange={(value: 'single' | 'sequential') =>
                    updateDataGovernance('systemSecurityChanges', 'approvalStructure', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single-level</SelectItem>
                    <SelectItem value="sequential">Sequential</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Re-approval on Modification</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.dataGovernance.systemSecurityChanges.reapprovalOnModification}
                    onCheckedChange={(checked) =>
                      updateDataGovernance('systemSecurityChanges', 'reapprovalOnModification', checked)
                    }
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.dataGovernance.systemSecurityChanges.reapprovalOnModification ? 'Required' : 'Not Required'}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-800 dark:text-red-300">
                <strong>Critical:</strong> System and security changes directly impact 21 CFR Part 11 compliance and audit readiness. All changes are immutable and fully audit logged.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Quality & Safety Approvals */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FlaskConical className="h-5 w-5 text-red-600 dark:text-red-400" />
            <CardTitle>Quality & Safety Approvals</CardTitle>
            <Badge variant="destructive" className="ml-2">Critical</Badge>
          </div>
          <CardDescription>
            Prevent unsafe or non-compliant product states. These approvals directly support GMP & GxP requirements. Every approval must be traceable, immutable, and reviewable.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Batch Release */}
          <div className="border-2 border-red-200 dark:border-red-800 rounded-lg p-4 space-y-4 bg-red-50/30 dark:bg-red-900/10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Batch Release
                  </Label>
                  <Badge variant="destructive" className="text-xs">Mandatory</Badge>
                  <Badge variant="outline" className="text-xs">GMP Critical</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Release of batches for distribution. Requires Qualified Person or QA Manager approval with electronic signature.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Approval Structure</Label>
                <Select
                  value={config.qualitySafety.batchRelease.approvalStructure}
                  onValueChange={(value: 'single' | 'sequential') =>
                    updateQualitySafety('batchRelease', 'approvalStructure', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single-level (QA/Qualified Person)</SelectItem>
                    <SelectItem value="sequential">Sequential (QA → Compliance)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Approval Comments</Label>
                <Select
                  value={config.qualitySafety.batchRelease.mandatoryComments ? 'mandatory' : 'optional'}
                  onValueChange={(value) =>
                    updateQualitySafety('batchRelease', 'mandatoryComments', value === 'mandatory')
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mandatory">Mandatory</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-md p-3 flex items-start space-x-2">
              <Info className="h-4 w-4 text-red-700 dark:text-red-300 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-red-800 dark:text-red-200 space-y-1">
                <p><strong>Compliance Requirements:</strong></p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>Electronic signature required (21 CFR Part 11)</li>
                  <li>Timestamp enforced and immutable</li>
                  <li>Auto-approval NOT allowed</li>
                  <li>Approver must be QA Manager or Qualified Person</li>
                  <li>All approvals are audit logged and reviewable</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Unquarantine / Unblock Batch */}
          <div className="border-2 border-red-200 dark:border-red-800 rounded-lg p-4 space-y-4 bg-red-50/30 dark:bg-red-900/10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <FileCheck className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Unquarantine / Unblock Batch
                  </Label>
                  <Badge variant="destructive" className="text-xs">Mandatory</Badge>
                  <Badge variant="outline" className="text-xs">GMP Critical</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Removal of quarantine or block status. Requires QA approval after investigation and resolution.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Approval Structure</Label>
                <Select
                  value={config.qualitySafety.unquarantineUnblock.approvalStructure}
                  onValueChange={(value: 'single' | 'sequential') =>
                    updateQualitySafety('unquarantineUnblock', 'approvalStructure', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single-level (QA)</SelectItem>
                    <SelectItem value="sequential">Sequential (QA → Compliance)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Approval Comments</Label>
                <Select
                  value={config.qualitySafety.unquarantineUnblock.mandatoryComments ? 'mandatory' : 'optional'}
                  onValueChange={(value) =>
                    updateQualitySafety('unquarantineUnblock', 'mandatoryComments', value === 'mandatory')
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mandatory">Mandatory</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-md p-3 flex items-start space-x-2">
              <Info className="h-4 w-4 text-red-700 dark:text-red-300 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-800 dark:text-red-200">
                <strong>Compliance Note:</strong> Unquarantine actions must be supported by documented investigation and resolution. Approval cannot be bypassed or auto-approved.
              </p>
            </div>
          </div>

          {/* QC Result Acceptance */}
          <div className="border-2 border-red-200 dark:border-red-800 rounded-lg p-4 space-y-4 bg-red-50/30 dark:bg-red-900/10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <FlaskConical className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    QC Result Acceptance
                  </Label>
                  <Badge variant="destructive" className="text-xs">Mandatory</Badge>
                  <Badge variant="outline" className="text-xs">GMP Critical</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Acceptance of QC test results. QA must review and approve before batch can proceed.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Approval Structure</Label>
                <Select
                  value={config.qualitySafety.qcResultAcceptance.approvalStructure}
                  onValueChange={(value: 'single' | 'sequential') =>
                    updateQualitySafety('qcResultAcceptance', 'approvalStructure', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single-level (QA)</SelectItem>
                    <SelectItem value="sequential">Sequential (QA → Compliance)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Approval Comments</Label>
                <Select
                  value={config.qualitySafety.qcResultAcceptance.mandatoryComments ? 'mandatory' : 'optional'}
                  onValueChange={(value) =>
                    updateQualitySafety('qcResultAcceptance', 'mandatoryComments', value === 'mandatory')
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mandatory">Mandatory</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-md p-3 flex items-start space-x-2">
              <Info className="h-4 w-4 text-red-700 dark:text-red-300 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-800 dark:text-red-200">
                <strong>Compliance Note:</strong> QC result acceptance is a GMP requirement. All test results must be reviewed and approved by qualified QA personnel before batch release consideration.
              </p>
            </div>
          </div>

          {/* Returned Goods Disposition */}
          <div className="border-2 border-red-200 dark:border-red-800 rounded-lg p-4 space-y-4 bg-red-50/30 dark:bg-red-900/10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Package2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Returned Goods Disposition
                  </Label>
                  <Badge variant="destructive" className="text-xs">Mandatory</Badge>
                  <Badge variant="outline" className="text-xs">GMP Critical</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Disposition decision for returned products. Requires QA/Qualified Person approval to determine if goods can be re-released.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Approval Structure</Label>
                <Select
                  value={config.qualitySafety.returnedGoodsDisposition.approvalStructure}
                  onValueChange={(value: 'single' | 'sequential') =>
                    updateQualitySafety('returnedGoodsDisposition', 'approvalStructure', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single-level (QA/Qualified Person)</SelectItem>
                    <SelectItem value="sequential">Sequential (QA → Compliance)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Approval Comments</Label>
                <Select
                  value={config.qualitySafety.returnedGoodsDisposition.mandatoryComments ? 'mandatory' : 'optional'}
                  onValueChange={(value) =>
                    updateQualitySafety('returnedGoodsDisposition', 'mandatoryComments', value === 'mandatory')
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mandatory">Mandatory</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-md p-3 flex items-start space-x-2">
              <Info className="h-4 w-4 text-red-700 dark:text-red-300 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-800 dark:text-red-200">
                <strong>Compliance Note:</strong> Returned goods require documented investigation and disposition decision. Re-release decisions must be approved by Qualified Person per GMP requirements.
              </p>
            </div>
          </div>

          {/* Global Quality & Safety Compliance Banner */}
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-2">
                  Global Quality & Safety Compliance Rules
                </h4>
                <ul className="text-xs text-red-800 dark:text-red-200 space-y-1 list-disc list-inside">
                  <li>All approvals require electronic signature (21 CFR Part 11 compliant)</li>
                  <li>Approver identity, timestamp, and comments are captured and immutable</li>
                  <li>Auto-approval is NOT permitted for any quality/safety workflow</li>
                  <li>All approval actions are fully audit logged and reviewable</li>
                  <li>Approval cannot be disabled or bypassed for quality/safety workflows</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Inventory Risk Approvals */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Scale className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <CardTitle>Inventory Risk Approvals</CardTitle>
          </div>
          <CardDescription>
            Control financial risk, traceability risk, and audit exposure caused by exceptional inventory actions. Approval required only when trigger conditions are met.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Manual Inventory Adjustments */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Package2 className="h-4 w-4 text-slate-500" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Manual Inventory Adjustments
                  </Label>
                  <Badge variant="outline" className="text-xs">Conditional</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Manual corrections to inventory quantities. Approval required when thresholds are exceeded.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Enable Approval</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.inventoryRisk.manualAdjustments.approvalEnabled}
                    onCheckedChange={(checked) =>
                      updateInventoryRisk('manualAdjustments', 'approvalEnabled', checked)
                    }
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.inventoryRisk.manualAdjustments.approvalEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Approval Structure</Label>
                <Select
                  value={config.inventoryRisk.manualAdjustments.approvalStructure}
                  onValueChange={(value: 'single' | 'sequential' | 'parallel') =>
                    updateInventoryRisk('manualAdjustments', 'approvalStructure', value)
                  }
                  disabled={!config.inventoryRisk.manualAdjustments.approvalEnabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single-level</SelectItem>
                    <SelectItem value="sequential">Sequential</SelectItem>
                    <SelectItem value="parallel">Parallel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Quantity Threshold</Label>
                <Input
                  type="number"
                  value={config.inventoryRisk.manualAdjustments.quantityThreshold}
                  onChange={(e) =>
                    updateInventoryRisk('manualAdjustments', 'quantityThreshold', parseInt(e.target.value) || 0)
                  }
                  disabled={!config.inventoryRisk.manualAdjustments.approvalEnabled}
                />
                <p className="text-xs text-slate-500">Units</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Value Threshold</Label>
                <Input
                  type="number"
                  value={config.inventoryRisk.manualAdjustments.valueThreshold}
                  onChange={(e) =>
                    updateInventoryRisk('manualAdjustments', 'valueThreshold', parseInt(e.target.value) || 0)
                  }
                  disabled={!config.inventoryRisk.manualAdjustments.approvalEnabled}
                />
                <p className="text-xs text-slate-500">Currency</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Mandatory Justification</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.inventoryRisk.manualAdjustments.mandatoryJustification}
                    onCheckedChange={(checked) =>
                      updateInventoryRisk('manualAdjustments', 'mandatoryJustification', checked)
                    }
                    disabled={!config.inventoryRisk.manualAdjustments.approvalEnabled}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.inventoryRisk.manualAdjustments.mandatoryJustification ? 'Required' : 'Optional'}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 flex items-start space-x-2">
              <Info className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-300">
                <strong>Note:</strong> Routine system movements do not require approval. Only adjustments exceeding thresholds trigger approval workflow.
              </p>
            </div>
          </div>

          {/* Backdated Inventory Entries */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Backdated Inventory Entries
                  </Label>
                  <Badge variant="outline" className="text-xs">Conditional</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Inventory movements dated in the past. Approval required to maintain audit trail integrity.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Enable Approval</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.inventoryRisk.backdatedEntries.approvalEnabled}
                    onCheckedChange={(checked) =>
                      updateInventoryRisk('backdatedEntries', 'approvalEnabled', checked)
                    }
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.inventoryRisk.backdatedEntries.approvalEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Days Limit</Label>
                <Input
                  type="number"
                  value={config.inventoryRisk.backdatedEntries.daysLimit}
                  onChange={(e) =>
                    updateInventoryRisk('backdatedEntries', 'daysLimit', parseInt(e.target.value) || 0)
                  }
                  disabled={!config.inventoryRisk.backdatedEntries.approvalEnabled}
                />
                <p className="text-xs text-slate-500">Days in the past</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Approval Structure</Label>
                <Select
                  value={config.inventoryRisk.backdatedEntries.approvalStructure}
                  onValueChange={(value: 'single' | 'sequential' | 'parallel') =>
                    updateInventoryRisk('backdatedEntries', 'approvalStructure', value)
                  }
                  disabled={!config.inventoryRisk.backdatedEntries.approvalEnabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single-level</SelectItem>
                    <SelectItem value="sequential">Sequential</SelectItem>
                    <SelectItem value="parallel">Parallel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Mandatory Justification</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.inventoryRisk.backdatedEntries.mandatoryJustification}
                    onCheckedChange={(checked) =>
                      updateInventoryRisk('backdatedEntries', 'mandatoryJustification', checked)
                    }
                    disabled={!config.inventoryRisk.backdatedEntries.approvalEnabled}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.inventoryRisk.backdatedEntries.mandatoryJustification ? 'Required' : 'Optional'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Near-Expiry Dispatch */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-slate-500" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Near-Expiry Dispatch
                  </Label>
                  <Badge variant="outline" className="text-xs">Conditional</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Dispatch of products approaching expiry. Approval required to ensure proper handling.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Enable Approval</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.inventoryRisk.nearExpiryDispatch.approvalEnabled}
                    onCheckedChange={(checked) =>
                      updateInventoryRisk('nearExpiryDispatch', 'approvalEnabled', checked)
                    }
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.inventoryRisk.nearExpiryDispatch.approvalEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Days Threshold</Label>
                <Input
                  type="number"
                  value={config.inventoryRisk.nearExpiryDispatch.daysThreshold}
                  onChange={(e) =>
                    updateInventoryRisk('nearExpiryDispatch', 'daysThreshold', parseInt(e.target.value) || 0)
                  }
                  disabled={!config.inventoryRisk.nearExpiryDispatch.approvalEnabled}
                />
                <p className="text-xs text-slate-500">Days before expiry</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Approval Structure</Label>
                <Select
                  value={config.inventoryRisk.nearExpiryDispatch.approvalStructure}
                  onValueChange={(value: 'single' | 'sequential' | 'parallel') =>
                    updateInventoryRisk('nearExpiryDispatch', 'approvalStructure', value)
                  }
                  disabled={!config.inventoryRisk.nearExpiryDispatch.approvalEnabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single-level</SelectItem>
                    <SelectItem value="sequential">Sequential</SelectItem>
                    <SelectItem value="parallel">Parallel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Mandatory Justification</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.inventoryRisk.nearExpiryDispatch.mandatoryJustification}
                    onCheckedChange={(checked) =>
                      updateInventoryRisk('nearExpiryDispatch', 'mandatoryJustification', checked)
                    }
                    disabled={!config.inventoryRisk.nearExpiryDispatch.approvalEnabled}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.inventoryRisk.nearExpiryDispatch.mandatoryJustification ? 'Required' : 'Optional'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Partial Batch Transfers */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <ArrowRightLeft className="h-4 w-4 text-slate-500" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Partial Batch Transfers
                  </Label>
                  <Badge variant="outline" className="text-xs">Conditional</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Transfer of partial batch quantities. Approval required to maintain traceability.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Enable Approval</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.inventoryRisk.partialBatchTransfers.approvalEnabled}
                    onCheckedChange={(checked) =>
                      updateInventoryRisk('partialBatchTransfers', 'approvalEnabled', checked)
                    }
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.inventoryRisk.partialBatchTransfers.approvalEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Approval Structure</Label>
                <Select
                  value={config.inventoryRisk.partialBatchTransfers.approvalStructure}
                  onValueChange={(value: 'single' | 'sequential' | 'parallel') =>
                    updateInventoryRisk('partialBatchTransfers', 'approvalStructure', value)
                  }
                  disabled={!config.inventoryRisk.partialBatchTransfers.approvalEnabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single-level</SelectItem>
                    <SelectItem value="sequential">Sequential</SelectItem>
                    <SelectItem value="parallel">Parallel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Cross-Warehouse Transfers */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Warehouse className="h-4 w-4 text-slate-500" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Cross-Warehouse Transfers
                  </Label>
                  <Badge variant="outline" className="text-xs">Conditional</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Transfers between different warehouses. Approval required to ensure proper documentation and traceability.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Enable Approval</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.inventoryRisk.crossWarehouseTransfers.approvalEnabled}
                    onCheckedChange={(checked) =>
                      updateInventoryRisk('crossWarehouseTransfers', 'approvalEnabled', checked)
                    }
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.inventoryRisk.crossWarehouseTransfers.approvalEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Approval Structure</Label>
                <Select
                  value={config.inventoryRisk.crossWarehouseTransfers.approvalStructure}
                  onValueChange={(value: 'single' | 'sequential' | 'parallel') =>
                    updateInventoryRisk('crossWarehouseTransfers', 'approvalStructure', value)
                  }
                  disabled={!config.inventoryRisk.crossWarehouseTransfers.approvalEnabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single-level</SelectItem>
                    <SelectItem value="sequential">Sequential</SelectItem>
                    <SelectItem value="parallel">Parallel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Mandatory Justification</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.inventoryRisk.crossWarehouseTransfers.mandatoryJustification}
                    onCheckedChange={(checked) =>
                      updateInventoryRisk('crossWarehouseTransfers', 'mandatoryJustification', checked)
                    }
                    disabled={!config.inventoryRisk.crossWarehouseTransfers.approvalEnabled}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.inventoryRisk.crossWarehouseTransfers.mandatoryJustification ? 'Required' : 'Optional'}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-md p-3 flex items-start space-x-2">
              <Info className="h-4 w-4 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-700 dark:text-slate-300">
                <strong>Note:</strong> All approved/rejected actions are audit logged. Routine system movements do not require approval.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Regulatory Action Approvals */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Gavel className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <CardTitle>Regulatory Action Approvals</CardTitle>
            <Badge variant="destructive" className="ml-2">Legal</Badge>
          </div>
          <CardDescription>
            Govern actions with direct regulatory or legal consequences. Multi-level approval required with dual control enforced.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recall Initiation */}
          <div className="border-2 border-purple-200 dark:border-purple-800 rounded-lg p-4 space-y-4 bg-purple-50/30 dark:bg-purple-900/10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Recall Initiation
                  </Label>
                  <Badge variant="destructive" className="text-xs">Mandatory</Badge>
                  <Badge variant="outline" className="text-xs">Legal</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Initiation of product recall. Requires multi-level approval with dual control.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Mandatory Comments</Label>
                <Select
                  value={config.regulatoryAction.recallInitiation.mandatoryComments ? 'mandatory' : 'optional'}
                  onValueChange={(value) =>
                    updateRegulatoryAction('recallInitiation', 'mandatoryComments', value === 'mandatory')
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mandatory">Mandatory</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Escalation Enabled</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.regulatoryAction.recallInitiation.escalationEnabled}
                    onCheckedChange={(checked) =>
                      updateRegulatoryAction('recallInitiation', 'escalationEnabled', checked)
                    }
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.regulatoryAction.recallInitiation.escalationEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 rounded-md p-3 flex items-start space-x-2">
              <Info className="h-4 w-4 text-purple-700 dark:text-purple-300 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-purple-800 dark:text-purple-200">
                <strong>Compliance Note:</strong> Recall initiation has direct regulatory consequences. Dual control enforced - no single approver can initiate recall. Acknowledgment and approval are distinct actions.
              </p>
            </div>
          </div>

          {/* Recall Closure */}
          <div className="border-2 border-purple-200 dark:border-purple-800 rounded-lg p-4 space-y-4 bg-purple-50/30 dark:bg-purple-900/10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Recall Closure
                  </Label>
                  <Badge variant="destructive" className="text-xs">Mandatory</Badge>
                  <Badge variant="outline" className="text-xs">Legal</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Closure of product recall. Requires documented completion and multi-level approval.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Mandatory Comments</Label>
                <Select
                  value={config.regulatoryAction.recallClosure.mandatoryComments ? 'mandatory' : 'optional'}
                  onValueChange={(value) =>
                    updateRegulatoryAction('recallClosure', 'mandatoryComments', value === 'mandatory')
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mandatory">Mandatory</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Escalation Enabled</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.regulatoryAction.recallClosure.escalationEnabled}
                    onCheckedChange={(checked) =>
                      updateRegulatoryAction('recallClosure', 'escalationEnabled', checked)
                    }
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.regulatoryAction.recallClosure.escalationEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Destruction of Goods */}
          <div className="border-2 border-purple-200 dark:border-purple-800 rounded-lg p-4 space-y-4 bg-purple-50/30 dark:bg-purple-900/10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Destruction of Goods
                  </Label>
                  <Badge variant="destructive" className="text-xs">Mandatory</Badge>
                  <Badge variant="outline" className="text-xs">Legal</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Destruction of pharmaceutical products. Requires documented justification and multi-level approval.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Mandatory Comments</Label>
                <Select
                  value={config.regulatoryAction.destructionOfGoods.mandatoryComments ? 'mandatory' : 'optional'}
                  onValueChange={(value) =>
                    updateRegulatoryAction('destructionOfGoods', 'mandatoryComments', value === 'mandatory')
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mandatory">Mandatory</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Escalation Enabled</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.regulatoryAction.destructionOfGoods.escalationEnabled}
                    onCheckedChange={(checked) =>
                      updateRegulatoryAction('destructionOfGoods', 'escalationEnabled', checked)
                    }
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.regulatoryAction.destructionOfGoods.escalationEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Regulatory Report Submission */}
          <div className="border-2 border-purple-200 dark:border-purple-800 rounded-lg p-4 space-y-4 bg-purple-50/30 dark:bg-purple-900/10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <FileCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Regulatory Report Submission
                  </Label>
                  <Badge variant="destructive" className="text-xs">Mandatory</Badge>
                  <Badge variant="outline" className="text-xs">Legal</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Submission of regulatory reports to authorities. Requires multi-level approval before submission.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Mandatory Comments</Label>
                <Select
                  value={config.regulatoryAction.regulatoryReportSubmission.mandatoryComments ? 'mandatory' : 'optional'}
                  onValueChange={(value) =>
                    updateRegulatoryAction('regulatoryReportSubmission', 'mandatoryComments', value === 'mandatory')
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mandatory">Mandatory</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Escalation Enabled</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.regulatoryAction.regulatoryReportSubmission.escalationEnabled}
                    onCheckedChange={(checked) =>
                      updateRegulatoryAction('regulatoryReportSubmission', 'escalationEnabled', checked)
                    }
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.regulatoryAction.regulatoryReportSubmission.escalationEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Global Regulatory Compliance Banner */}
          <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Gavel className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  Global Regulatory Action Compliance Rules
                </h4>
                <ul className="text-xs text-purple-800 dark:text-purple-200 space-y-1 list-disc list-inside">
                  <li>All regulatory actions require multi-level sequential approval</li>
                  <li>Dual control enforced - no single approver can complete action</li>
                  <li>Acknowledgment and approval are distinct, tracked actions</li>
                  <li>Immutable approval trail required for all regulatory actions</li>
                  <li>Approval cannot be disabled - protects organization from regulatory penalties</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6. Approval Governance & Escalation */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle>Approval Governance & Escalation</CardTitle>
          </div>
          <CardDescription>
            Ensure approvals do not stall and responsibility is clearly defined. All escalations and overrides must be traceable.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Approval SLA */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Approval SLA (Service Level Agreement)
                  </Label>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Time-based service level for approval completion. Escalation triggers when SLA is exceeded.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Approval SLA (Hours)</Label>
                <Input
                  type="number"
                  value={config.escalation.approvalSLAHours}
                  onChange={(e) =>
                    updateEscalation('approvalSLAHours', parseInt(e.target.value) || 0)
                  }
                  disabled={!config.escalation.enabled}
                />
                <p className="text-xs text-slate-500">Hours before escalation</p>
              </div>
            </div>
          </div>

          {/* Escalation Rules */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Bell className="h-4 w-4 text-slate-500" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Escalation Rules
                  </Label>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Configure how stalled approvals are escalated to ensure timely completion.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Role Escalation</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.escalation.roleEscalation}
                    onCheckedChange={(checked) =>
                      updateEscalation('roleEscalation', checked)
                    }
                    disabled={!config.escalation.enabled}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.escalation.roleEscalation ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Escalate to higher role when SLA exceeded</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Notification Escalation</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.escalation.notificationEscalation}
                    onCheckedChange={(checked) =>
                      updateEscalation('notificationEscalation', checked)
                    }
                    disabled={!config.escalation.enabled}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.escalation.notificationEscalation ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Send notifications when SLA is approaching/exceeded</p>
              </div>
            </div>
          </div>

          {/* Substitute Approvers & Delegation */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Users className="h-4 w-4 text-slate-500" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Substitute Approvers & Delegation
                  </Label>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Configure temporary delegation and substitute approvers for vacation or absence handling.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Substitute Approvers</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.escalation.substituteApprovers}
                    onCheckedChange={(checked) =>
                      updateEscalation('substituteApprovers', checked)
                    }
                    disabled={!config.escalation.enabled}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.escalation.substituteApprovers ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Allow designated substitute approvers</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Temporary Delegation</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.escalation.temporaryDelegation}
                    onCheckedChange={(checked) =>
                      updateEscalation('temporaryDelegation', checked)
                    }
                    disabled={!config.escalation.enabled}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.escalation.temporaryDelegation ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Allow temporary delegation for vacation/absence</p>
              </div>
            </div>
          </div>

          {/* Emergency Override */}
          <div className="border-2 border-red-200 dark:border-red-800 rounded-lg p-4 space-y-4 bg-red-50/30 dark:bg-red-900/10">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Emergency Override
                  </Label>
                  <Badge variant="destructive" className="text-xs">Admin Only</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Emergency override capability for critical situations. Admin-only, fully audit logged, cannot bypass Quality & Safety approvals.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label className="text-sm">Enable Emergency Override</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.escalation.emergencyOverride.enabled}
                    onCheckedChange={(checked) =>
                      updateEmergencyOverride('enabled', checked)
                    }
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.escalation.emergencyOverride.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Require Justification</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.escalation.emergencyOverride.requireJustification}
                    onCheckedChange={(checked) =>
                      updateEmergencyOverride('requireJustification', checked)
                    }
                    disabled={!config.escalation.emergencyOverride.enabled}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {config.escalation.emergencyOverride.requireJustification ? 'Required' : 'Optional'}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-md p-3 flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-700 dark:text-red-300 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-red-800 dark:text-red-200 space-y-1">
                <p><strong>Critical Restrictions:</strong></p>
                <ul className="list-disc list-inside space-y-0.5 ml-2">
                  <li>Emergency override is Admin-only</li>
                  <li>Cannot bypass Quality & Safety approvals</li>
                  <li>All overrides are fully audit logged</li>
                  <li>Justification is mandatory when enabled</li>
                  <li>Override actions are immutable and reviewable</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Global Governance Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Global Approval Governance Rules
                </h4>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                  <li>All escalations and overrides must be traceable and audit logged</li>
                  <li>Emergency override cannot bypass Quality & Safety approvals</li>
                  <li>Substitute approvers and delegations are time-bound and require approval</li>
                  <li>All approval actions capture approver identity, timestamp, and comments</li>
                  <li>Approval trail is immutable and fully reviewable</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
