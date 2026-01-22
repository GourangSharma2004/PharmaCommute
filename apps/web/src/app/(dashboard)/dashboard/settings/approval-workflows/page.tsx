'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  GitBranch, 
  Shield, 
  FlaskConical, 
  AlertTriangle,
  CheckCircle2,
  Info,
  Save,
  Clock,
  Users,
  Lock,
  ArrowRight,
  Plus,
  Edit
} from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { UserRole } from '@/types/auth'

// Workflow definitions
interface WorkflowStep {
  id: string
  order: number
  role: UserRole
  action: string
  timeoutHours: number
}

interface ApprovalWorkflow {
  id: string
  name: string
  category: 'Quality' | 'Inventory' | 'Recall' | 'Regulatory'
  description: string
  mandatory: boolean
  steps: WorkflowStep[]
      escalationEnabled: boolean
  escalationHours: number
  escalationTo: UserRole[]
}

export default function ApprovalWorkflowsPage() {
  const { user, getPermissions } = useAuthStore()
  const permissions = getPermissions()
  
  const canConfigure = permissions?.canConfigureSystem || user?.role === 'ADMIN'
  
  // Mock workflows
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([
    {
      id: '1',
      name: 'Batch Release',
      category: 'Quality',
      description: 'Release of batches for distribution',
      mandatory: true,
      steps: [
        { id: '1', order: 1, role: UserRole.QA_ANALYST, action: 'Review QC Results', timeoutHours: 24 },
        { id: '2', order: 2, role: UserRole.QA_MANAGER, action: 'Final Approval', timeoutHours: 12 }
      ],
      escalationEnabled: true,
      escalationHours: 8,
      escalationTo: [UserRole.ADMIN]
    },
    {
      id: '2',
      name: 'Temperature Excursion Investigation',
      category: 'Quality',
      description: 'Investigation and closure of temperature excursions',
      mandatory: true,
      steps: [
        { id: '1', order: 1, role: UserRole.WAREHOUSE_MANAGER, action: 'Initial Investigation', timeoutHours: 4 },
        { id: '2', order: 2, role: UserRole.QA_MANAGER, action: 'Review & Approve Closure', timeoutHours: 12 }
      ],
      escalationEnabled: true,
      escalationHours: 2,
      escalationTo: [UserRole.QA_MANAGER, UserRole.ADMIN]
    },
    {
      id: '3',
      name: 'Product Recall Initiation',
      category: 'Recall',
      description: 'Initiation of product recall',
      mandatory: true,
      steps: [
        { id: '1', order: 1, role: UserRole.QA_MANAGER, action: 'Risk Assessment', timeoutHours: 2 },
        { id: '2', order: 2, role: UserRole.ADMIN, action: 'Executive Approval', timeoutHours: 1 }
      ],
      escalationEnabled: true,
      escalationHours: 1,
      escalationTo: [UserRole.ADMIN]
    },
    {
      id: '4',
      name: 'Manual Inventory Adjustment',
      category: 'Inventory',
      description: 'Manual adjustments exceeding threshold',
      mandatory: false,
      steps: [
        { id: '1', order: 1, role: UserRole.WAREHOUSE_MANAGER, action: 'Approve Adjustment', timeoutHours: 48 }
      ],
      escalationEnabled: true,
      escalationHours: 24,
      escalationTo: [UserRole.ADMIN]
    }
  ])
  
  const [hasChanges, setHasChanges] = useState(false)
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)

  const handleSave = () => {
    console.log('Saving workflow configuration:', workflows)
    setHasChanges(false)
  }
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Quality': return 'text-red-600 dark:text-red-400'
      case 'Inventory': return 'text-blue-600 dark:text-blue-400'
      case 'Recall': return 'text-purple-600 dark:text-purple-400'
      case 'Regulatory': return 'text-orange-600 dark:text-orange-400'
      default: return 'text-slate-600'
    }
  }
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Quality': return FlaskConical
      case 'Inventory': return Shield
      case 'Recall': return AlertTriangle
      case 'Regulatory': return Lock
      default: return GitBranch
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
        <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Approval Workflows</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
          How should approvals progress if no action is taken? Design process escalation and timeouts.
          </p>
        </div>

      {!canConfigure && (
        <Alert>
          <Lock className="h-4 w-4" />
          <AlertDescription>
            You have read-only access to approval workflows. Only Administrators can modify these configurations.
          </AlertDescription>
        </Alert>
      )}

      {/* Helper Banner */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This page defines approval <strong>processes and escalation logic</strong>. For notification delivery preferences (email, in-app), visit the <strong>Notifications</strong> settings.
        </AlertDescription>
      </Alert>

      {/* Section 1: Workflow Selector & Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <GitBranch className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle>Active Approval Workflows</CardTitle>
          <CardDescription>
                Select a workflow to view and configure its approval sequence
          </CardDescription>
                </div>
              </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Approval Steps</TableHead>
                <TableHead>Escalation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => {
                const CategoryIcon = getCategoryIcon(workflow.category)
                
                return (
                  <TableRow key={workflow.id}>
                    <TableCell className="font-medium">{workflow.name}</TableCell>
                    <TableCell>
                <div className="flex items-center space-x-2">
                        <CategoryIcon className={`h-4 w-4 ${getCategoryColor(workflow.category)}`} />
                        <span>{workflow.category}</span>
                </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{workflow.steps.length} Steps</Badge>
                    </TableCell>
                    <TableCell>
                      {workflow.escalationEnabled ? (
                        <Badge variant="default">After {workflow.escalationHours}h</Badge>
                      ) : (
                        <Badge variant="secondary">Disabled</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {workflow.mandatory ? (
                        <Badge variant="destructive">Mandatory</Badge>
                      ) : (
                        <Badge variant="secondary">Optional</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {canConfigure && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedWorkflow(workflow.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Section 2: Approval Sequence Builder */}
      {selectedWorkflow && (
      <Card>
        <CardHeader>
            <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <CardTitle>Approver Sequence Builder</CardTitle>
          <CardDescription>
                    Define the step-by-step approval process for {workflows.find(w => w.id === selectedWorkflow)?.name}
          </CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedWorkflow(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {workflows.find(w => w.id === selectedWorkflow)?.steps.map((step, index) => (
              <div key={step.id} className="mb-4 p-4 border rounded-lg dark:border-slate-700">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                    <span className="text-sm font-bold text-blue-900 dark:text-blue-200">{step.order}</span>
          </div>

                  <ArrowRight className="h-4 w-4 text-slate-400" />
                  
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-slate-500">Role</Label>
                      <Select value={step.role} disabled={!canConfigure}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                          <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                          <SelectItem value={UserRole.QA_MANAGER}>QA Manager</SelectItem>
                          <SelectItem value={UserRole.QA_ANALYST}>QA Analyst</SelectItem>
                          <SelectItem value={UserRole.WAREHOUSE_MANAGER}>Warehouse Manager</SelectItem>
                  </SelectContent>
                </Select>
          </div>

                    <div>
                      <Label className="text-xs text-slate-500">Action</Label>
                      <Input value={step.action} disabled={!canConfigure} />
          </div>

                    <div>
                      <Label className="text-xs text-slate-500">Timeout (hours)</Label>
                      <Input 
                        type="number" 
                        value={step.timeoutHours} 
                        disabled={!canConfigure}
                      />
                </div>
              </div>
            </div>
              </div>
            ))}
            
            {canConfigure && (
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Approval Step
              </Button>
            )}
        </CardContent>
      </Card>
      )}

      {/* Section 3: Escalation Timing & Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <div>
              <CardTitle>Escalation Timing & Rules</CardTitle>
          <CardDescription>
                What happens if an approval is not completed within the expected timeframe?
          </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                    Escalation ensures approvals don't stall
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    When an approver doesn't act within the timeout period, the request escalates to a higher authority or additional approvers are notified. This ensures business continuity and compliance.
                </p>
              </div>
            </div>
                </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-base font-medium">Default Escalation Timeout</Label>
                <div className="flex items-center space-x-4">
                <Input
                  type="number"
                    defaultValue="24"
                    disabled={!canConfigure}
                    className="w-32"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">hours</span>
              </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Default time before escalating inactive approvals
                </p>
          </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Escalation Recipients</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked disabled={!canConfigure} />
                    <Label className="text-sm font-normal">QA Manager</Label>
                </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked disabled={!canConfigure} />
                    <Label className="text-sm font-normal">Administrator</Label>
              </div>
                <div className="flex items-center space-x-2">
                    <input type="checkbox" disabled={!canConfigure} />
                    <Label className="text-sm font-normal">Compliance Officer</Label>
                </div>
              </div>
            </div>
          </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Auto-reassign to backup approver</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Automatically reassign to a backup approver if primary doesn't respond
                </p>
              </div>
              <Switch disabled={!canConfigure} defaultChecked />
          </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Allow temporary delegation</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Approvers can temporarily delegate their approval authority
                </p>
              </div>
              <Switch disabled={!canConfigure} defaultChecked />
            </div>
                </div>
        </CardContent>
      </Card>

      {/* Section 4: Role-Based Approver Assignment */}
      <Card>
        <CardHeader>
                <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-600" />
            <div>
              <CardTitle>Role-Based Approver Assignment</CardTitle>
              <CardDescription>
                Map which roles can approve which types of workflows
              </CardDescription>
                </div>
              </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Role</TableHead>
                <TableHead>Quality Approvals</TableHead>
                <TableHead>Inventory Approvals</TableHead>
                <TableHead>Recall Approvals</TableHead>
                <TableHead>Regulatory Approvals</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">QA Manager</TableCell>
                <TableCell><CheckCircle2 className="h-4 w-4 text-green-600" /></TableCell>
                <TableCell><CheckCircle2 className="h-4 w-4 text-green-600" /></TableCell>
                <TableCell><CheckCircle2 className="h-4 w-4 text-green-600" /></TableCell>
                <TableCell><CheckCircle2 className="h-4 w-4 text-green-600" /></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">QA Analyst</TableCell>
                <TableCell><CheckCircle2 className="h-4 w-4 text-green-600" /></TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Warehouse Manager</TableCell>
                <TableCell>-</TableCell>
                <TableCell><CheckCircle2 className="h-4 w-4 text-green-600" /></TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Administrator</TableCell>
                <TableCell><CheckCircle2 className="h-4 w-4 text-green-600" /></TableCell>
                <TableCell><CheckCircle2 className="h-4 w-4 text-green-600" /></TableCell>
                <TableCell><CheckCircle2 className="h-4 w-4 text-green-600" /></TableCell>
                <TableCell><CheckCircle2 className="h-4 w-4 text-green-600" /></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Section 5: Workflow Status & Monitoring */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-cyan-600" />
            <div>
              <CardTitle>Workflow Status Indicators</CardTitle>
          <CardDescription>
                Visual status indicators for approval workflows
          </CardDescription>
                </div>
              </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg dark:border-slate-700">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <Label className="text-sm font-medium">Pending</Label>
            </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Waiting for approver action
              </p>
          </div>

            <div className="p-4 border rounded-lg dark:border-slate-700">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <Label className="text-sm font-medium">Escalated</Label>
                </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Timeout exceeded, escalated to higher authority
              </p>
          </div>

            <div className="p-4 border rounded-lg dark:border-slate-700">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <Label className="text-sm font-medium">Approved</Label>
                </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Workflow completed successfully
              </p>
          </div>

            <div className="p-4 border rounded-lg dark:border-slate-700">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <Label className="text-sm font-medium">Rejected</Label>
                </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Approval was denied by approver
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Process Rules & Compliance */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-red-600" />
            <div>
              <CardTitle>Process Rules & Compliance</CardTitle>
          <CardDescription>
                Enforce process integrity and compliance requirements
          </CardDescription>
                </div>
              </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              These rules ensure approval workflows meet regulatory requirements and cannot be bypassed.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Quality workflows require QA role</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Enforced for GMP compliance
                </p>
              </div>
              <Badge variant="destructive">Always ON</Badge>
          </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Approval timestamps are immutable</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  21 CFR Part 11 requirement
                </p>
              </div>
              <Badge variant="destructive">Always ON</Badge>
          </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Approver cannot approve own request</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Segregation of duties
                </p>
              </div>
              <Badge variant="destructive">Always ON</Badge>
          </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">All approvals are audit logged</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Complete audit trail
                </p>
              </div>
              <Badge variant="destructive">Always ON</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      {hasChanges && canConfigure && (
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Workflow Configuration
          </Button>
        </div>
      )}
    </div>
  )
}
