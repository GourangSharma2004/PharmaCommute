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
  Thermometer, 
  Plus, 
  Edit, 
  AlertTriangle, 
  Settings, 
  Shield, 
  Wifi, 
  FileText,
  Clock,
  Bell,
  Lock,
  Info
} from 'lucide-react'

// Types for Cold Chain Configuration
interface TemperatureProfile {
  id: string
  productCategory: string
  storageType: 'Ambient' | '2-8°C' | 'Frozen' | 'Custom'
  minTemp: number
  maxTemp: number
  allowedDeviation: number
  allowedDuration: number
  mandatoryColdChain: boolean
  status: 'Active' | 'Inactive'
}

interface ExcursionRule {
  id: string
  level: 'Minor' | 'Major' | 'Critical'
  deviationRange: string
  durationThreshold: number
  autoActions: string[]
  deviationRecordRequired: boolean
  lastUpdated: string
  version: string
}

export default function ColdChainConfigPage() {
  const { user, getPermissions } = useAuthStore()
  const permissions = getPermissions()
  
  // Check if user can configure system (Admin or QA Manager only)
  const canConfigure = permissions?.canConfigureSystem || user?.role === 'QA_MANAGER'
  
  // State for modals and forms
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<TemperatureProfile | null>(null)
  const [isExcursionModalOpen, setIsExcursionModalOpen] = useState(false)
  const [editingExcursionRule, setEditingExcursionRule] = useState<ExcursionRule | null>(null)
  
  // Mock data for temperature profiles
  const [temperatureProfiles, setTemperatureProfiles] = useState<TemperatureProfile[]>([
    {
      id: '1',
      productCategory: 'Vaccines',
      storageType: '2-8°C',
      minTemp: 2,
      maxTemp: 8,
      allowedDeviation: 2,
      allowedDuration: 30,
      mandatoryColdChain: true,
      status: 'Active'
    },
    {
      id: '2',
      productCategory: 'Insulin Products',
      storageType: '2-8°C',
      minTemp: 2,
      maxTemp: 8,
      allowedDeviation: 1,
      allowedDuration: 15,
      mandatoryColdChain: true,
      status: 'Active'
    },
    {
      id: '3',
      productCategory: 'Frozen Biologics',
      storageType: 'Frozen',
      minTemp: -25,
      maxTemp: -15,
      allowedDeviation: 5,
      allowedDuration: 10,
      mandatoryColdChain: true,
      status: 'Active'
    }
  ])

  // Mock data for excursion rules
  const [excursionRules, setExcursionRules] = useState<ExcursionRule[]>([
    {
      id: '1',
      level: 'Minor',
      deviationRange: '±1-2°C',
      durationThreshold: 30,
      autoActions: ['Log only'],
      deviationRecordRequired: false,
      lastUpdated: '2024-01-15T10:30:00Z',
      version: 'v1.2'
    },
    {
      id: '2',
      level: 'Major',
      deviationRange: '±2-5°C',
      durationThreshold: 15,
      autoActions: ['Log only', 'Require QA review'],
      deviationRecordRequired: true,
      lastUpdated: '2024-01-15T10:30:00Z',
      version: 'v1.2'
    },
    {
      id: '3',
      level: 'Critical',
      deviationRange: '>±5°C',
      durationThreshold: 5,
      autoActions: ['Log event', 'Tag affected batches', 'Trigger alert', 'Require QA review'],
      deviationRecordRequired: true,
      lastUpdated: '2024-01-15T10:30:00Z',
      version: 'v1.2'
    }
  ])

  // Form state for new/edit profile
  const [profileForm, setProfileForm] = useState<Partial<TemperatureProfile>>({
    productCategory: '',
    storageType: 'Ambient',
    minTemp: 0,
    maxTemp: 0,
    allowedDeviation: 0,
    allowedDuration: 0,
    mandatoryColdChain: false,
    status: 'Active'
  })

  const handleSaveProfile = () => {
    if (editingProfile) {
      // Update existing profile
      setTemperatureProfiles(profiles => 
        profiles.map(p => p.id === editingProfile.id ? { ...editingProfile, ...profileForm } : p)
      )
    } else {
      // Add new profile
      const newProfile: TemperatureProfile = {
        ...profileForm,
        id: Date.now().toString(),
      } as TemperatureProfile
      setTemperatureProfiles(profiles => [...profiles, newProfile])
    }
    
    setIsProfileModalOpen(false)
    setEditingProfile(null)
    setProfileForm({
      productCategory: '',
      storageType: 'Ambient',
      minTemp: 0,
      maxTemp: 0,
      allowedDeviation: 0,
      allowedDuration: 0,
      mandatoryColdChain: false,
      status: 'Active'
    })
  }

  const openEditProfile = (profile: TemperatureProfile) => {
    setEditingProfile(profile)
    setProfileForm(profile)
    setIsProfileModalOpen(true)
  }

  // Form state for new/edit excursion rule
  const [excursionForm, setExcursionForm] = useState<Partial<ExcursionRule>>({
    level: 'Minor',
    deviationRange: '',
    durationThreshold: 0,
    autoActions: [],
    deviationRecordRequired: false
  })

  // State for IoT Sensor Association Rules
  const [iotSettings, setIotSettings] = useState({
    treatMissingAsExcursion: true,
    allowBackupSensor: true,
    allowManualEntry: false,
  })

  // State for Manual Temperature Entry Controls
  const [manualEntrySettings, setManualEntrySettings] = useState({
    allowManualTemp: false,
    qaApproval: true,
  })

  const openEditExcursionRule = (rule: ExcursionRule) => {
    setEditingExcursionRule(rule)
    setExcursionForm(rule)
    setIsExcursionModalOpen(true)
  }

  const handleSaveExcursionRule = () => {
    if (editingExcursionRule) {
      // Update existing rule
      setExcursionRules(rules => 
        rules.map(r => r.id === editingExcursionRule.id ? { ...editingExcursionRule, ...excursionForm } as ExcursionRule : r)
      )
    }
    
    setIsExcursionModalOpen(false)
    setEditingExcursionRule(null)
    setExcursionForm({
      level: 'Minor',
      deviationRange: '',
      durationThreshold: 0,
      autoActions: [],
      deviationRecordRequired: false
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Cold Chain Configuration</h1>
        <p className="text-slate-600 dark:text-slate-300">Monitor and classify temperature excursions - detection and severity assessment</p>
      </div>

      {/* Pipeline Clarity Banner */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This page <strong>detects and classifies</strong> temperature excursions. Stock actions (quarantine, release restrictions) are governed by <strong>Inventory Control Rules</strong>.
        </AlertDescription>
      </Alert>

      {!canConfigure && (
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            You have read-only access to cold chain configuration. Only Administrators and QA Managers can modify these settings.
          </AlertDescription>
        </Alert>
      )}

      {/* Section 1: Product Temperature Profiles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Thermometer className="h-5 w-5 text-cyan-600" />
              <div>
                <CardTitle>Product Temperature Profiles</CardTitle>
                <CardDescription>
                  Define temperature enforcement rules for different product categories
                </CardDescription>
              </div>
            </div>
            {canConfigure && (
              <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProfile ? 'Edit Temperature Profile' : 'Add Temperature Profile'}
                    </DialogTitle>
                    <DialogDescription>
                      Configure temperature requirements for product storage and handling
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productCategory">Product Category</Label>
                      <Input
                        id="productCategory"
                        value={profileForm.productCategory || ''}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, productCategory: e.target.value }))}
                        placeholder="e.g., Vaccines, Insulin"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="storageType">Storage Type</Label>
                      <Select
                        value={profileForm.storageType || 'Ambient'}
                        onValueChange={(value) => setProfileForm(prev => ({ ...prev, storageType: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ambient">Ambient</SelectItem>
                          <SelectItem value="2-8°C">2-8°C</SelectItem>
                          <SelectItem value="Frozen">Frozen</SelectItem>
                          <SelectItem value="Custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="minTemp">Min Temperature (°C)</Label>
                      <Input
                        id="minTemp"
                        type="number"
                        value={profileForm.minTemp || ''}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, minTemp: parseFloat(e.target.value) }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxTemp">Max Temperature (°C)</Label>
                      <Input
                        id="maxTemp"
                        type="number"
                        value={profileForm.maxTemp || ''}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, maxTemp: parseFloat(e.target.value) }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="allowedDeviation">Allowed Deviation (±°C)</Label>
                      <Input
                        id="allowedDeviation"
                        type="number"
                        value={profileForm.allowedDeviation || ''}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, allowedDeviation: parseFloat(e.target.value) }))}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="allowedDuration">Allowed Duration (minutes)</Label>
                      <Input
                        id="allowedDuration"
                        type="number"
                        value={profileForm.allowedDuration || ''}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, allowedDuration: parseInt(e.target.value) }))}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 col-span-2">
                      <Switch
                        id="mandatoryColdChain"
                        checked={profileForm.mandatoryColdChain || false}
                        onCheckedChange={(checked) => setProfileForm(prev => ({ ...prev, mandatoryColdChain: checked }))}
                      />
                      <Label htmlFor="mandatoryColdChain">Mandatory Cold Chain</Label>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsProfileModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      {editingProfile ? 'Update Profile' : 'Add Profile'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Category</TableHead>
                <TableHead>Storage Type</TableHead>
                <TableHead>Temperature Range</TableHead>
                <TableHead>Allowed Deviation</TableHead>
                <TableHead>Duration Limit</TableHead>
                <TableHead>Cold Chain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {temperatureProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.productCategory}</TableCell>
                  <TableCell>{profile.storageType}</TableCell>
                  <TableCell>{profile.minTemp}°C to {profile.maxTemp}°C</TableCell>
                  <TableCell>±{profile.allowedDeviation}°C</TableCell>
                  <TableCell>{profile.allowedDuration} min</TableCell>
                  <TableCell>
                    {profile.mandatoryColdChain ? (
                      <Badge variant="destructive">Mandatory</Badge>
                    ) : (
                      <Badge variant="secondary">Optional</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={profile.status === 'Active' ? 'default' : 'secondary'}>
                      {profile.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {canConfigure && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditProfile(profile)}
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

      {/* Section 2: Temperature Excursion Classification Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <div>
              <CardTitle>Temperature Excursion Classification Rules</CardTitle>
              <CardDescription>
                Classify temperature deviations by severity and define detection responses (logging, tagging, alerts)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-600">Last updated: January 15, 2024</span>
              <Badge variant="outline">v1.2</Badge>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Excursion Level</TableHead>
                <TableHead>Temperature Deviation</TableHead>
                <TableHead>Duration Threshold</TableHead>
                <TableHead>Auto Actions</TableHead>
                <TableHead>Deviation Record</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {excursionRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <Badge 
                      variant={
                        rule.level === 'Critical' ? 'destructive' : 
                        rule.level === 'Major' ? 'default' : 
                        'secondary'
                      }
                    >
                      {rule.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{rule.deviationRange}</TableCell>
                  <TableCell>{rule.durationThreshold} minutes</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {rule.autoActions.map((action, index) => (
                        <Badge key={index} variant="outline" className="mr-1 mb-1">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {rule.deviationRecordRequired ? (
                      <Badge variant="destructive">Required</Badge>
                    ) : (
                      <Badge variant="secondary">Optional</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {canConfigure && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openEditExcursionRule(rule)}
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

      {/* Edit Excursion Rule Dialog */}
      <Dialog open={isExcursionModalOpen} onOpenChange={setIsExcursionModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Excursion Classification Rule</DialogTitle>
            <DialogDescription>
              Modify the classification criteria and automatic actions for temperature excursions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="excursionLevel">Excursion Level</Label>
              <Select
                value={excursionForm.level || 'Minor'}
                onValueChange={(value) => setExcursionForm(prev => ({ ...prev, level: value as 'Minor' | 'Major' | 'Critical' }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Minor">Minor</SelectItem>
                  <SelectItem value="Major">Major</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deviationRange">Temperature Deviation Range</Label>
              <Input
                id="deviationRange"
                value={excursionForm.deviationRange || ''}
                onChange={(e) => setExcursionForm(prev => ({ ...prev, deviationRange: e.target.value }))}
                placeholder="e.g., ±1-2°C, >±5°C"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="durationThreshold">Duration Threshold (minutes)</Label>
              <Input
                id="durationThreshold"
                type="number"
                value={excursionForm.durationThreshold || ''}
                onChange={(e) => setExcursionForm(prev => ({ ...prev, durationThreshold: parseInt(e.target.value) || 0 }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Automatic Actions</Label>
              <div className="space-y-2 p-3 border rounded-md">
                {['Log only', 'Log event', 'Tag affected batches', 'Trigger alert', 'Require QA review'].map((action) => {
                  const isSelected = excursionForm.autoActions?.includes(action) || false
                  return (
                    <div key={action} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`action-${action}`}
                        checked={isSelected}
                        onChange={(e) => {
                          const currentActions = excursionForm.autoActions || []
                          if (e.target.checked) {
                            setExcursionForm(prev => ({ ...prev, autoActions: [...currentActions, action] }))
                          } else {
                            setExcursionForm(prev => ({ ...prev, autoActions: currentActions.filter(a => a !== action) }))
                          }
                        }}
                        className="rounded border-slate-300"
                      />
                      <Label htmlFor={`action-${action}`} className="cursor-pointer">
                        {action}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={excursionForm.deviationRecordRequired || false}
                onCheckedChange={(checked) => setExcursionForm(prev => ({ ...prev, deviationRecordRequired: checked }))}
              />
              <Label>Deviation Record Required</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExcursionModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveExcursionRule}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Section 3: IoT Sensor Association Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Wifi className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle>IoT Sensor Association Rules</CardTitle>
              <CardDescription>
                Configure how sensor data is interpreted and processed
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="mappingScope">Mapping Scope</Label>
                <Select disabled={!canConfigure}>
                  <SelectTrigger>
                    <SelectValue placeholder="Warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="coldroom">Cold Room</SelectItem>
                    <SelectItem value="vehicle">Vehicle</SelectItem>
                    <SelectItem value="shipment">Shipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="dataFrequency">Expected Data Frequency (minutes)</Label>
                <Input 
                  id="dataFrequency" 
                  type="number" 
                  defaultValue="5" 
                  disabled={!canConfigure}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="alertThreshold">Missing Data Alert Threshold (minutes)</Label>
                <Input 
                  id="alertThreshold" 
                  type="number" 
                  defaultValue="15" 
                  disabled={!canConfigure}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="treatMissingAsExcursion">Treat missing data as excursion</Label>
                  <Switch
                    id="treatMissingAsExcursion"
                    checked={iotSettings.treatMissingAsExcursion}
                    onCheckedChange={(checked) => setIotSettings(prev => ({ ...prev, treatMissingAsExcursion: checked }))}
                    disabled={!canConfigure}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="allowBackupSensor">Allow backup sensor</Label>
                  <Switch
                    id="allowBackupSensor"
                    checked={iotSettings.allowBackupSensor}
                    onCheckedChange={(checked) => setIotSettings(prev => ({ ...prev, allowBackupSensor: checked }))}
                    disabled={!canConfigure}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="allowManualEntry">Allow manual entry if IoT fails</Label>
                  <Switch
                    id="allowManualEntry"
                    checked={iotSettings.allowManualEntry}
                    onCheckedChange={(checked) => setIotSettings(prev => ({ ...prev, allowManualEntry: checked }))}
                    disabled={!canConfigure}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Manual Temperature Entry Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-purple-600" />
            <div>
              <CardTitle>Manual Temperature Entry Controls</CardTitle>
              <CardDescription>
                Control audit-sensitive manual data entry procedures
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Manual temperature entries create audit trails and may require additional compliance documentation.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="allowManualTemp">Allow manual temperature entry</Label>
                <Switch
                  id="allowManualTemp"
                  checked={manualEntrySettings.allowManualTemp}
                  onCheckedChange={(checked) => setManualEntrySettings(prev => ({ ...prev, allowManualTemp: checked }))}
                  disabled={!canConfigure}
                />
              </div>
              
              <div>
                <Label htmlFor="reasonCode">Mandatory Reason Code</Label>
                <Select disabled={!canConfigure}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason requirement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equipment-failure">Equipment Failure</SelectItem>
                    <SelectItem value="calibration">Calibration</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="documentRequirement">Supporting Document Requirement</Label>
                <Select disabled={!canConfigure}>
                  <SelectTrigger>
                    <SelectValue placeholder="Optional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="optional">Optional</SelectItem>
                    <SelectItem value="mandatory">Mandatory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="editWindow">Editable Time Window (hours)</Label>
                <Input 
                  id="editWindow" 
                  type="number" 
                  defaultValue="2" 
                  disabled={!canConfigure}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="qaApproval">QA approval required</Label>
                <Switch
                  id="qaApproval"
                  checked={manualEntrySettings.qaApproval}
                  onCheckedChange={(checked) => setManualEntrySettings(prev => ({ ...prev, qaApproval: checked }))}
                  disabled={!canConfigure}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 5: Cold Chain Alert Rules */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-yellow-600" />
            <div>
              <CardTitle>Cold Chain Alert Rules</CardTitle>
              <CardDescription>
                Define when alerts trigger and escalation procedures
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Trigger on Excursion Type</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="triggerMinor" defaultChecked disabled={!canConfigure} />
                    <Label htmlFor="triggerMinor">Minor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="triggerMajor" defaultChecked disabled={!canConfigure} />
                    <Label htmlFor="triggerMajor">Major</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="triggerCritical" defaultChecked disabled={!canConfigure} />
                    <Label htmlFor="triggerCritical">Critical</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Alert Channels</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="inAppAlert" defaultChecked disabled={!canConfigure} />
                    <Label htmlFor="inAppAlert">In-app</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="emailAlert" defaultChecked disabled={!canConfigure} />
                    <Label htmlFor="emailAlert">Email</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="escalationPath">Escalation Path</Label>
                <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-md">
                  <div className="text-sm space-y-1">
                    <div>1. Warehouse Manager</div>
                    <div>2. QA Manager</div>
                    <div>3. Administrator</div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="escalationSLA">Escalation SLA (minutes)</Label>
                <Input 
                  id="escalationSLA" 
                  type="number" 
                  defaultValue="30" 
                  disabled={!canConfigure}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 6: Compliance & Audit Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-green-600" />
            <div>
              <CardTitle>Compliance & Audit Controls</CardTitle>
              <CardDescription>
                Locked compliance settings ensuring regulatory adherence
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              These settings are locked to ensure regulatory compliance and cannot be modified.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Temperature logs immutable</Label>
                <Badge variant="default">ON</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Manual edits disabled</Label>
                <Badge variant="default">ON</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Audit trail enabled</Label>
                <Badge variant="default">ON</Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="retentionPeriod">Data Retention Period</Label>
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="7 years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7years">7 years</SelectItem>
                    <SelectItem value="10years">10 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Export Formats Supported</Label>
                <div className="mt-2 space-x-2">
                  <Badge variant="outline">PDF</Badge>
                  <Badge variant="outline">CSV</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}