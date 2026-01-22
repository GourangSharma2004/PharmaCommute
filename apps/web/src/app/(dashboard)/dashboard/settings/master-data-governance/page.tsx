'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAuthStore } from '@/store/auth-store'
import { 
  Layers, 
  Edit, 
  Shield, 
  Settings, 
  GitBranch,
  FileText,
  AlertTriangle,
  Info,
  Download,
  Clock,
  Users,
  Database,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

// Types for Master Data Governance
interface MasterDataPolicy {
  id: string
  dataType: string
  changeSensitivity: 'Low' | 'Medium' | 'High'
  approvalRequired: 'None' | 'Single-level' | 'Multi-level'
  qaApprovalRequired: boolean
  effectiveDateRequired: boolean
  autoVersionOnChange: boolean
  status: 'Active' | 'Inactive'
}

interface FieldGovernance {
  id: string
  masterType: string
  fieldName: string
  sensitiveField: boolean
  requiresApproval: boolean
  changeAllowedAfterBatch: boolean
  effectiveDateRequired: boolean
}

interface AuditLogEntry {
  id: string
  masterDataType: string
  fieldChanged: string
  oldValue: string
  newValue: string
  changedBy: string
  approvedBy: string
  timestamp: string
  approvalReferenceId: string
}

export default function MasterDataGovernancePage() {
  const { user, getPermissions } = useAuthStore()
  const permissions = getPermissions()
  
  // Check if user can configure system (Admin or QA Manager only)
  const canConfigure = permissions?.canConfigureSystem || user?.role === 'QA_MANAGER'
  
  // State for modals and expanded sections
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<MasterDataPolicy | null>(null)
  const [expandedFieldTypes, setExpandedFieldTypes] = useState<string[]>([])
  
  // Mock data for master data policies
  const [masterDataPolicies, setMasterDataPolicies] = useState<MasterDataPolicy[]>([
    {
      id: '1',
      dataType: 'Product / Drug Master',
      changeSensitivity: 'High',
      approvalRequired: 'Multi-level',
      qaApprovalRequired: true,
      effectiveDateRequired: true,
      autoVersionOnChange: true,
      status: 'Active'
    },
    {
      id: '2',
      dataType: 'Batch / Lot Master',
      changeSensitivity: 'High',
      approvalRequired: 'Multi-level',
      qaApprovalRequired: true,
      effectiveDateRequired: false,
      autoVersionOnChange: true,
      status: 'Active'
    },
    {
      id: '3',
      dataType: 'Supplier Master',
      changeSensitivity: 'Medium',
      approvalRequired: 'Single-level',
      qaApprovalRequired: false,
      effectiveDateRequired: true,
      autoVersionOnChange: true,
      status: 'Active'
    },
    {
      id: '4',
      dataType: 'Customer / Distributor Master',
      changeSensitivity: 'Medium',
      approvalRequired: 'Single-level',
      qaApprovalRequired: false,
      effectiveDateRequired: false,
      autoVersionOnChange: false,
      status: 'Active'
    },
    {
      id: '5',
      dataType: 'Warehouse / Cold Storage Master',
      changeSensitivity: 'High',
      approvalRequired: 'Multi-level',
      qaApprovalRequired: true,
      effectiveDateRequired: true,
      autoVersionOnChange: true,
      status: 'Active'
    },
    {
      id: '6',
      dataType: 'Manufacturing Site Master',
      changeSensitivity: 'High',
      approvalRequired: 'Multi-level',
      qaApprovalRequired: true,
      effectiveDateRequired: true,
      autoVersionOnChange: true,
      status: 'Active'
    },
    {
      id: '7',
      dataType: 'UOM & Conversion Master',
      changeSensitivity: 'Low',
      approvalRequired: 'Single-level',
      qaApprovalRequired: false,
      effectiveDateRequired: false,
      autoVersionOnChange: false,
      status: 'Active'
    },
    {
      id: '8',
      dataType: 'HSN / Drug Classification Master',
      changeSensitivity: 'Low',
      approvalRequired: 'Single-level',
      qaApprovalRequired: false,
      effectiveDateRequired: false,
      autoVersionOnChange: false,
      status: 'Active'
    }
  ])

  // Mock field governance data
  const [fieldGovernanceRules] = useState<FieldGovernance[]>([
    { id: '1', masterType: 'Product / Drug Master', fieldName: 'Strength', sensitiveField: true, requiresApproval: true, changeAllowedAfterBatch: false, effectiveDateRequired: true },
    { id: '2', masterType: 'Product / Drug Master', fieldName: 'Dosage Form', sensitiveField: true, requiresApproval: true, changeAllowedAfterBatch: false, effectiveDateRequired: true },
    { id: '3', masterType: 'Product / Drug Master', fieldName: 'Shelf Life', sensitiveField: true, requiresApproval: true, changeAllowedAfterBatch: false, effectiveDateRequired: true },
    { id: '4', masterType: 'Product / Drug Master', fieldName: 'Storage Condition', sensitiveField: true, requiresApproval: true, changeAllowedAfterBatch: false, effectiveDateRequired: true },
    { id: '5', masterType: 'Supplier Master', fieldName: 'Qualification Status', sensitiveField: true, requiresApproval: true, changeAllowedAfterBatch: true, effectiveDateRequired: true },
    { id: '6', masterType: 'Supplier Master', fieldName: 'Contact Information', sensitiveField: false, requiresApproval: false, changeAllowedAfterBatch: true, effectiveDateRequired: false }
  ])

  // Mock audit log data
  const [auditLogs] = useState<AuditLogEntry[]>([
    {
      id: '1',
      masterDataType: 'Product / Drug Master',
      fieldChanged: 'Shelf Life',
      oldValue: '24 months',
      newValue: '36 months',
      changedBy: 'John Smith',
      approvedBy: 'Sarah Johnson',
      timestamp: '2024-01-15T10:30:00Z',
      approvalReferenceId: 'APR-2024-001'
    },
    {
      id: '2',
      masterDataType: 'Supplier Master',
      fieldChanged: 'Qualification Status',
      oldValue: 'Pending',
      newValue: 'Qualified',
      changedBy: 'Mike Wilson',
      approvedBy: 'Sarah Johnson',
      timestamp: '2024-01-14T14:20:00Z',
      approvalReferenceId: 'APR-2024-002'
    }
  ])

  // Form state for policy editing
  const [policyForm, setPolicyForm] = useState<Partial<MasterDataPolicy>>({
    dataType: '',
    changeSensitivity: 'Low',
    approvalRequired: 'None',
    qaApprovalRequired: false,
    effectiveDateRequired: false,
    autoVersionOnChange: false,
    status: 'Active'
  })

  const handleSavePolicy = () => {
    if (editingPolicy) {
      setMasterDataPolicies(policies => 
        policies.map(p => p.id === editingPolicy.id ? { ...editingPolicy, ...policyForm } : p)
      )
    }
    
    setIsPolicyModalOpen(false)
    setEditingPolicy(null)
    setPolicyForm({
      dataType: '',
      changeSensitivity: 'Low',
      approvalRequired: 'None',
      qaApprovalRequired: false,
      effectiveDateRequired: false,
      autoVersionOnChange: false,
      status: 'Active'
    })
  }

  const openEditPolicy = (policy: MasterDataPolicy) => {
    setEditingPolicy(policy)
    setPolicyForm(policy)
    setIsPolicyModalOpen(true)
  }

  const toggleFieldTypeExpansion = (masterType: string) => {
    setExpandedFieldTypes(prev => 
      prev.includes(masterType) 
        ? prev.filter(type => type !== masterType)
        : [...prev, masterType]
    )
  }

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case 'High': return 'destructive'
      case 'Medium': return 'default'
      case 'Low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getApprovalColor = (approval: string) => {
    switch (approval) {
      case 'Multi-level': return 'destructive'
      case 'Single-level': return 'default'
      case 'None': return 'secondary'
      default: return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Master Data Governance</h1>
        <p className="text-slate-600 dark:text-slate-300">Control master data creation, modification, and approval processes</p>
      </div>

      {!canConfigure && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You have read-only access to master data governance settings. Only Administrators and QA Managers can modify these configurations.
          </AlertDescription>
        </Alert>
      )}

      {/* Section 1: Master Data Change Policy */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="h-5 w-5 text-emerald-600" />
              <div>
                <CardTitle>Master Data Change Policy</CardTitle>
                <CardDescription>
                  Define governance rules for different master data domains
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Master Data Type</TableHead>
                <TableHead>Change Sensitivity</TableHead>
                <TableHead>Approval Required</TableHead>
                <TableHead>QA Approval</TableHead>
                <TableHead>Effective Date</TableHead>
                <TableHead>Auto-Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {masterDataPolicies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell className="font-medium">{policy.dataType}</TableCell>
                  <TableCell>
                    <Badge variant={getSensitivityColor(policy.changeSensitivity) as any}>
                      {policy.changeSensitivity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getApprovalColor(policy.approvalRequired) as any}>
                      {policy.approvalRequired}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {policy.qaApprovalRequired ? (
                      <Badge variant="destructive">Required</Badge>
                    ) : (
                      <Badge variant="secondary">Not Required</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {policy.effectiveDateRequired ? (
                      <Badge variant="default">Required</Badge>
                    ) : (
                      <Badge variant="secondary">Optional</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {policy.autoVersionOnChange ? (
                      <Badge variant="default">Enabled</Badge>
                    ) : (
                      <Badge variant="secondary">Disabled</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={policy.status === 'Active' ? 'default' : 'secondary'}>
                      {policy.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {canConfigure && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditPolicy(policy)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Section 2: Field-Level Governance (Advanced) */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-indigo-600" />
            <div>
              <CardTitle>Field-Level Governance (Advanced)</CardTitle>
              <CardDescription>
                Define which fields are sensitive and require stricter control
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Product / Drug Master', 'Supplier Master'].map((masterType) => {
              const isExpanded = expandedFieldTypes.includes(masterType)
              const fieldsForType = fieldGovernanceRules.filter(rule => rule.masterType === masterType)
              
              return (
                <div key={masterType} className="border rounded-lg">
                  <div 
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={() => toggleFieldTypeExpansion(masterType)}
                  >
                    <div className="flex items-center space-x-2">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <span className="font-medium">{masterType}</span>
                      <Badge variant="secondary">{fieldsForType.length} fields</Badge>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="border-t">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Field Name</TableHead>
                            <TableHead>Sensitive Field</TableHead>
                            <TableHead>Requires Approval</TableHead>
                            <TableHead>Change After Batch?</TableHead>
                            <TableHead>Effective Date Required</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fieldsForType.map((field) => (
                            <TableRow key={field.id}>
                              <TableCell className="font-medium">{field.fieldName}</TableCell>
                              <TableCell>
                                <Switch checked={field.sensitiveField} disabled={!canConfigure} />
                              </TableCell>
                              <TableCell>
                                <Switch checked={field.requiresApproval} disabled={!canConfigure} />
                              </TableCell>
                              <TableCell>
                                {field.changeAllowedAfterBatch ? (
                                  <Badge variant="default">Yes</Badge>
                                ) : (
                                  <Badge variant="destructive">No</Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <Switch checked={field.effectiveDateRequired} disabled={!canConfigure} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Versioning & Effective Dating Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <div>
              <CardTitle>Versioning & Effective Dating Rules</CardTitle>
              <CardDescription>
                Configure version control and effective dating for master data changes
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoVersion">Auto-create new version on approved change</Label>
                <Switch id="autoVersion" defaultChecked disabled={!canConfigure} />
              </div>
              
              <div>
                <Label htmlFor="versionFormat">Version Format</Label>
                <Select disabled={!canConfigure}>
                  <SelectTrigger>
                    <SelectValue placeholder="v1/v2" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v1v2">v1/v2</SelectItem>
                    <SelectItem value="date-based">Date-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="effectiveRules">Effective Date Rules</Label>
                <Select disabled={!canConfigure}>
                  <SelectTrigger>
                    <SelectValue placeholder="Future-dated only" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="future-only">Future-dated only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="rollbackPermissions">Rollback Permissions</Label>
                <Select disabled={!canConfigure}>
                  <SelectTrigger>
                    <SelectValue placeholder="View-only" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view-only">View-only</SelectItem>
                    <SelectItem value="revert-allowed">Revert allowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Version control ensures complete audit trails for regulatory compliance and enables rollback capabilities when needed.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Audit Trail & Change History (Read-Only) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-cyan-600" />
              <div>
                <CardTitle>Audit Trail & Change History</CardTitle>
                <CardDescription>
                  Visibility into governed master data changes
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div>
                <Label htmlFor="masterTypeFilter">Master Data Type</Label>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="product">Product / Drug Master</SelectItem>
                    <SelectItem value="supplier">Supplier Master</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="dateRange">Date Range</Label>
                <Input type="date" className="w-40" />
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Master Data Type</TableHead>
                  <TableHead>Field Changed</TableHead>
                  <TableHead>Old Value → New Value</TableHead>
                  <TableHead>Changed By</TableHead>
                  <TableHead>Approved By</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Approval Ref ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.masterDataType}</TableCell>
                    <TableCell>{log.fieldChanged}</TableCell>
                    <TableCell>
                      <div className="space-x-2">
                        <span className="text-red-600">{log.oldValue}</span>
                        <span>→</span>
                        <span className="text-green-600">{log.newValue}</span>
                      </div>
                    </TableCell>
                    <TableCell>{log.changedBy}</TableCell>
                    <TableCell>{log.approvedBy}</TableCell>
                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.approvalReferenceId}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Emergency Change Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <CardTitle>Emergency Change Controls</CardTitle>
              <CardDescription>
                Controlled path for urgent operational master data changes
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Emergency changes bypass normal approval workflows but require post-change justification and approval.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emergencyMode">Enable emergency change mode</Label>
                <Switch id="emergencyMode" disabled={!canConfigure} />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="mandatoryJustification">Mandatory justification required</Label>
                <Badge variant="destructive">Always ON</Badge>
              </div>
              
              <div>
                <Label htmlFor="postChangeWindow">Post-change approval window (hours)</Label>
                <Input 
                  id="postChangeWindow" 
                  type="number" 
                  defaultValue="24" 
                  disabled={!canConfigure}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="highlightEmergency">Highlight emergency changes in audit logs</Label>
                <Badge variant="destructive">Always ON</Badge>
              </div>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Emergency changes are automatically flagged in all audit reports and require additional documentation for regulatory compliance.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policy Edit Modal */}
      <Dialog open={isPolicyModalOpen} onOpenChange={setIsPolicyModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Master Data Policy</DialogTitle>
            <DialogDescription>
              Configure governance rules for {editingPolicy?.dataType}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="changeSensitivity">Change Sensitivity</Label>
              <Select
                value={policyForm.changeSensitivity || 'Low'}
                onValueChange={(value) => setPolicyForm(prev => ({ ...prev, changeSensitivity: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="approvalRequired">Approval Required</Label>
              <Select
                value={policyForm.approvalRequired || 'None'}
                onValueChange={(value) => setPolicyForm(prev => ({ ...prev, approvalRequired: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None">None</SelectItem>
                  <SelectItem value="Single-level">Single-level</SelectItem>
                  <SelectItem value="Multi-level">Multi-level</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 col-span-2">
              <Switch
                id="qaApprovalRequired"
                checked={policyForm.qaApprovalRequired || false}
                onCheckedChange={(checked) => setPolicyForm(prev => ({ ...prev, qaApprovalRequired: checked }))}
              />
              <Label htmlFor="qaApprovalRequired">QA Approval Required</Label>
            </div>
            
            <div className="flex items-center space-x-2 col-span-2">
              <Switch
                id="effectiveDateRequired"
                checked={policyForm.effectiveDateRequired || false}
                onCheckedChange={(checked) => setPolicyForm(prev => ({ ...prev, effectiveDateRequired: checked }))}
              />
              <Label htmlFor="effectiveDateRequired">Effective Date Required</Label>
            </div>
            
            <div className="flex items-center space-x-2 col-span-2">
              <Switch
                id="autoVersionOnChange"
                checked={policyForm.autoVersionOnChange || false}
                onCheckedChange={(checked) => setPolicyForm(prev => ({ ...prev, autoVersionOnChange: checked }))}
              />
              <Label htmlFor="autoVersionOnChange">Auto-version on Change</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPolicyModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePolicy}>
              Update Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
