'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  Save, 
  RotateCcw, 
  AlertTriangle, 
  Info, 
  Lock, 
  Mail,
  Smartphone,
  Shield,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { UserRole } from '@/types/auth'

// Notification event types with pharma-specific terminology
interface NotificationEvent {
  id: string
  name: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  category: string
  mandatory: boolean // Compliance requirement - cannot be disabled
  mandatoryReason?: string // Why it's mandatory (for tooltips)
}

// Mock notification events
const NOTIFICATION_EVENTS: NotificationEvent[] = [
  // Inventory & Expiry
  {
    id: 'batch-near-expiry',
    name: 'Batch Near Expiry',
    description: 'Batch approaching expiry date (within 30 days)',
    severity: 'high',
    category: 'Inventory & Expiry',
    mandatory: false,
  },
  {
    id: 'batch-expired',
    name: 'Batch Expired',
    description: 'Batch has reached expiry date',
    severity: 'critical',
    category: 'Inventory & Expiry',
    mandatory: true,
    mandatoryReason: 'Required by GxP for inventory control',
  },
  {
    id: 'quarantine-initiated',
    name: 'Quarantine Initiated',
    description: 'Batch placed in quarantine status',
    severity: 'high',
    category: 'Inventory & Expiry',
    mandatory: true,
    mandatoryReason: 'Regulatory requirement for quality control',
  },
  {
    id: 'low-stock',
    name: 'Low Stock Alert',
    description: 'Product stock below reorder level',
    severity: 'medium',
    category: 'Inventory & Expiry',
    mandatory: false,
  },
  
  // Cold Chain
  {
    id: 'temp-excursion',
    name: 'Temperature Excursion',
    description: 'Temperature outside acceptable range detected',
    severity: 'critical',
    category: 'Cold Chain',
    mandatory: true,
    mandatoryReason: 'FDA requirement for cold chain monitoring',
  },
  {
    id: 'cold-chain-breach',
    name: 'Cold Chain Breach',
    description: 'Critical temperature breach requiring immediate action',
    severity: 'critical',
    category: 'Cold Chain',
    mandatory: true,
    mandatoryReason: 'Regulatory compliance - must notify immediately',
  },
  {
    id: 'sensor-offline',
    name: 'Sensor Offline',
    description: 'Temperature monitoring sensor disconnected',
    severity: 'high',
    category: 'Cold Chain',
    mandatory: false,
  },
  
  // Quality & Compliance
  {
    id: 'qc-failure',
    name: 'QC Test Failure',
    description: 'Quality control test result failed',
    severity: 'critical',
    category: 'Quality & Compliance',
    mandatory: true,
    mandatoryReason: 'GxP requirement for quality oversight',
  },
  {
    id: 'batch-release-pending',
    name: 'Batch Release Pending',
    description: 'Batch awaiting QA approval for release',
    severity: 'high',
    category: 'Quality & Compliance',
    mandatory: false,
  },
  {
    id: 'deviation-logged',
    name: 'Deviation Logged',
    description: 'New deviation recorded in quality system',
    severity: 'high',
    category: 'Quality & Compliance',
    mandatory: true,
    mandatoryReason: '21 CFR Part 11 compliance requirement',
  },
  {
    id: 'capa-required',
    name: 'CAPA Required',
    description: 'Corrective action required for deviation',
    severity: 'high',
    category: 'Quality & Compliance',
    mandatory: false,
  },
  
  // Recall & Traceability
  {
    id: 'recall-initiated',
    name: 'Recall Initiated',
    description: 'Product recall has been initiated',
    severity: 'critical',
    category: 'Recall & Traceability',
    mandatory: true,
    mandatoryReason: 'FDA mandate - all stakeholders must be notified',
  },
  {
    id: 'traceability-gap',
    name: 'Traceability Gap',
    description: 'Gap detected in batch genealogy',
    severity: 'critical',
    category: 'Recall & Traceability',
    mandatory: true,
    mandatoryReason: 'Regulatory requirement for full traceability',
  },
  
  // Security & System
  {
    id: 'failed-login',
    name: 'Failed Login Attempt',
    description: 'Multiple failed login attempts detected',
    severity: 'medium',
    category: 'Security & System',
    mandatory: false,
  },
  {
    id: 'audit-log-export',
    name: 'Audit Log Export',
    description: 'Audit log has been exported',
    severity: 'low',
    category: 'Security & System',
    mandatory: false,
  },
  {
    id: 'system-backup-failed',
    name: 'Backup Failure',
    description: 'Automated system backup failed',
    severity: 'high',
    category: 'Security & System',
    mandatory: false,
  },
]

// User notification preferences (mock state)
interface NotificationPreferences {
  events: Record<string, {
    inApp: boolean
    email: boolean
  }>
  delivery: {
    preferredChannels: ('inApp' | 'email')[]
    quietHoursEnabled: boolean
    quietHoursStart: string
    quietHoursEnd: string
    digestMode: boolean
    digestFrequency: 'daily' | 'weekly'
    timezone: string
  }
  escalation: {
    requireAcknowledgment: boolean
    escalationThreshold: number // minutes
    escalationRecipients: UserRole[]
  }
  compliance: {
    forceRecallNotifications: boolean
    forceColdChainNotifications: boolean
    preventDisablingComplianceAlerts: boolean
    logRetentionDays: number
    auditPreferenceChanges: boolean
  }
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  events: {},
  delivery: {
    preferredChannels: ['inApp', 'email'],
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    digestMode: false,
    digestFrequency: 'daily',
    timezone: 'America/New_York',
  },
  escalation: {
    requireAcknowledgment: true,
    escalationThreshold: 60,
    escalationRecipients: [UserRole.ADMIN, UserRole.QA_MANAGER],
  },
  compliance: {
    forceRecallNotifications: true,
    forceColdChainNotifications: true,
    preventDisablingComplianceAlerts: true,
    logRetentionDays: 2555, // 7 years for pharma compliance
    auditPreferenceChanges: true,
  },
}

// Initialize all events with default preferences
NOTIFICATION_EVENTS.forEach(event => {
  DEFAULT_PREFERENCES.events[event.id] = {
    inApp: true,
    email: !event.mandatory, // Mandatory events default to in-app only
  }
})

export default function NotificationsPage() {
  const { user, getPermissions } = useAuthStore()
  const permissions = getPermissions()
  const isAdmin = user?.role === UserRole.ADMIN || permissions?.canConfigureSystem

  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES)
  const [hasChanges, setHasChanges] = useState(false)

  const handleEventToggle = (eventId: string, channel: 'inApp' | 'email', checked: boolean) => {
    const event = NOTIFICATION_EVENTS.find(e => e.id === eventId)
    if (event?.mandatory && channel === 'email') {
      // Cannot disable mandatory events
      return
    }
    
    setPreferences(prev => ({
      ...prev,
      events: {
        ...prev.events,
        [eventId]: {
          ...prev.events[eventId],
          [channel]: checked,
        },
      },
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // TODO: Save to backend
    console.log('Saving preferences:', preferences)
    setHasChanges(false)
    // Show success message
  }

  const handleReset = () => {
    setPreferences(DEFAULT_PREFERENCES)
    setHasChanges(false)
  }

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: 'destructive',
      high: 'default',
      medium: 'secondary',
      low: 'outline',
    } as const
    
    const icons = {
      critical: <AlertCircle className="h-3 w-3" />,
      high: <AlertTriangle className="h-3 w-3" />,
      medium: <Info className="h-3 w-3" />,
      low: <CheckCircle2 className="h-3 w-3" />,
    }
    
    return (
      <Badge variant={variants[severity as keyof typeof variants] || 'outline'} className="text-xs">
        {icons[severity as keyof typeof icons]}
        <span className="ml-1 capitalize">{severity}</span>
      </Badge>
    )
  }

  const categories = Array.from(new Set(NOTIFICATION_EVENTS.map(e => e.category)))

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Notification Settings</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Configure notification preferences, delivery channels, and compliance controls
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

      {/* SECTION 1: NOTIFICATION CATEGORIES */}
      <Card className="border-2 dark:border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Notification Categories</CardTitle>
              <CardDescription className="mt-1">
                Configure which events trigger notifications and through which channels
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.map(category => {
            const categoryEvents = NOTIFICATION_EVENTS.filter(e => e.category === category)
            return (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b dark:border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{category}</h3>
                  <Badge variant="outline" className="text-xs">
                    {categoryEvents.length} events
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {categoryEvents.map(event => {
                    const eventPrefs = preferences.events[event.id] || { inApp: true, email: false }
                    const isLocked = event.mandatory
                    
                    return (
                      <div
                        key={event.id}
                        className="p-4 rounded-lg border dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                {event.name}
                              </span>
                              {getSeverityBadge(event.severity)}
                              {isLocked && (
                                <Badge variant="outline" className="text-xs border-amber-500 text-amber-700 dark:text-amber-400">
                                  <Lock className="h-3 w-3 mr-1" />
                                  Mandatory
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {event.description}
                            </p>
                            {isLocked && event.mandatoryReason && (
                              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 flex items-center gap-1">
                                <Info className="h-3 w-3" />
                                {event.mandatoryReason}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 pt-2">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Smartphone className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                              <Label htmlFor={`${event.id}-inapp`} className="text-sm font-normal cursor-pointer">
                                In-App
                              </Label>
                            </div>
                            <Switch
                              id={`${event.id}-inapp`}
                              checked={eventPrefs.inApp}
                              onCheckedChange={(checked) => handleEventToggle(event.id, 'inApp', checked)}
                              disabled={isLocked} // Mandatory events must have in-app notifications
                            />
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                              <Label htmlFor={`${event.id}-email`} className="text-sm font-normal cursor-pointer">
                                Email
                              </Label>
                            </div>
                            <Switch
                              id={`${event.id}-email`}
                              checked={eventPrefs.email}
                              onCheckedChange={(checked) => handleEventToggle(event.id, 'email', checked)}
                              disabled={isLocked && !eventPrefs.email} // Can't disable if mandatory and already enabled
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* SECTION 2: DELIVERY PREFERENCES */}
      <Card className="border-2 dark:border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Delivery Preferences</CardTitle>
              <CardDescription className="mt-1">
                Configure how and when you receive notifications
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preferred Channels */}
          <div className="space-y-3">
            <Label className="text-base font-semibold dark:text-slate-200">Preferred Channels</Label>
            <div className="flex flex-wrap gap-4">
              {(['inApp', 'email'] as const).map(channel => (
                <div key={channel} className="flex items-center gap-2">
                  <Switch
                    checked={preferences.delivery.preferredChannels.includes(channel)}
                    onCheckedChange={(checked) => {
                      setPreferences(prev => ({
                        ...prev,
                        delivery: {
                          ...prev.delivery,
                          preferredChannels: checked
                            ? [...prev.delivery.preferredChannels, channel]
                            : prev.delivery.preferredChannels.filter(c => c !== channel),
                        },
                      }))
                      setHasChanges(true)
                    }}
                  />
                  <Label className="text-sm font-normal cursor-pointer">
                    {channel === 'inApp' ? 'In-App' : 'Email'}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Label className="text-base font-semibold dark:text-slate-200">Quiet Hours</Label>
              <Badge variant="outline" className="text-xs">
                Non-critical only
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Switch
                checked={preferences.delivery.quietHoursEnabled}
                onCheckedChange={(checked) => {
                  setPreferences(prev => ({
                    ...prev,
                    delivery: { ...prev.delivery, quietHoursEnabled: checked },
                  }))
                  setHasChanges(true)
                }}
              />
              <Label className="text-sm font-normal">Enable quiet hours</Label>
            </div>
            {preferences.delivery.quietHoursEnabled && (
              <div className="flex items-center gap-4 pl-8">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Start:</Label>
                  <Input
                    type="time"
                    value={preferences.delivery.quietHoursStart}
                    onChange={(e) => {
                      setPreferences(prev => ({
                        ...prev,
                        delivery: { ...prev.delivery, quietHoursStart: e.target.value },
                      }))
                      setHasChanges(true)
                    }}
                    className="w-32"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">End:</Label>
                  <Input
                    type="time"
                    value={preferences.delivery.quietHoursEnd}
                    onChange={(e) => {
                      setPreferences(prev => ({
                        ...prev,
                        delivery: { ...prev.delivery, quietHoursEnd: e.target.value },
                      }))
                      setHasChanges(true)
                    }}
                    className="w-32"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Digest Mode */}
          <div className="space-y-3">
            <Label className="text-base font-semibold dark:text-slate-200">Notification Digest</Label>
            <div className="flex items-center gap-4">
              <Switch
                checked={preferences.delivery.digestMode}
                onCheckedChange={(checked) => {
                  setPreferences(prev => ({
                    ...prev,
                    delivery: { ...prev.delivery, digestMode: checked },
                  }))
                  setHasChanges(true)
                }}
              />
              <Label className="text-sm font-normal">Enable digest mode (batch notifications)</Label>
            </div>
            {preferences.delivery.digestMode && (
              <div className="pl-8">
                <Select
                  value={preferences.delivery.digestFrequency}
                  onValueChange={(value: 'daily' | 'weekly') => {
                    setPreferences(prev => ({
                      ...prev,
                      delivery: { ...prev.delivery, digestFrequency: value },
                    }))
                    setHasChanges(true)
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Digest</SelectItem>
                    <SelectItem value="weekly">Weekly Digest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Timezone */}
          <div className="space-y-3">
            <Label className="text-base font-semibold dark:text-slate-200">Time Zone</Label>
            <Select
              value={preferences.delivery.timezone}
              onValueChange={(value) => {
                setPreferences(prev => ({
                  ...prev,
                  delivery: { ...prev.delivery, timezone: value },
                }))
                setHasChanges(true)
              }}
            >
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: ESCALATION & ACKNOWLEDGMENT RULES (Admin Only) */}
      {isAdmin && (
        <Card className="border-2 dark:border-slate-700 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle className="text-xl dark:text-slate-100">Escalation & Acknowledgment Rules</CardTitle>
                <CardDescription className="mt-1">
                  Configure escalation workflows and acknowledgment requirements (Admin only)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Require Acknowledgment */}
            <div className="space-y-3">
              <Label className="text-base font-semibold dark:text-slate-200">Acknowledgment Requirements</Label>
              <div className="flex items-center gap-4">
                <Switch
                  checked={preferences.escalation.requireAcknowledgment}
                  onCheckedChange={(checked) => {
                    setPreferences(prev => ({
                      ...prev,
                      escalation: { ...prev.escalation, requireAcknowledgment: checked },
                    }))
                    setHasChanges(true)
                  }}
                />
                <Label className="text-sm font-normal">
                  Require acknowledgment for critical alerts
                </Label>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 pl-8">
                Users must acknowledge critical alerts before they can be dismissed
              </p>
            </div>

            {/* Escalation Threshold */}
            <div className="space-y-3">
              <Label className="text-base font-semibold dark:text-slate-200">Escalation Time Threshold</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={preferences.escalation.escalationThreshold}
                  onChange={(e) => {
                    setPreferences(prev => ({
                      ...prev,
                      escalation: { ...prev.escalation, escalationThreshold: parseInt(e.target.value) || 60 },
                    }))
                    setHasChanges(true)
                  }}
                  className="w-32"
                  min="1"
                />
                <Label className="text-sm font-normal">minutes</Label>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Time before unacknowledged critical alerts escalate to additional recipients
              </p>
            </div>

            {/* Escalation Recipients */}
            <div className="space-y-3">
              <Label className="text-base font-semibold dark:text-slate-200">Escalation Recipients</Label>
              <div className="space-y-2">
                {[UserRole.ADMIN, UserRole.QA_MANAGER, UserRole.WAREHOUSE_MANAGER].map(role => (
                  <div key={role} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={preferences.escalation.escalationRecipients.includes(role)}
                      onChange={(e) => {
                        setPreferences(prev => ({
                          ...prev,
                          escalation: {
                            ...prev.escalation,
                            escalationRecipients: e.target.checked
                              ? [...prev.escalation.escalationRecipients, role]
                              : prev.escalation.escalationRecipients.filter(r => r !== role),
                          },
                        }))
                        setHasChanges(true)
                      }}
                      className="rounded border-slate-300"
                    />
                    <Label className="text-sm font-normal cursor-pointer">
                      {role.replace('_', ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION 4: SYSTEM & COMPLIANCE CONTROLS (Admin Only) */}
      {isAdmin && (
        <Card className="border-2 dark:border-slate-700 border-red-200 dark:border-red-800">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-xl dark:text-slate-100">System & Compliance Controls</CardTitle>
                <CardDescription className="mt-1">
                  Configure system-wide compliance and audit settings (Admin only)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Force Notifications */}
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-base font-semibold dark:text-slate-200">Mandatory Notification Rules</Label>
                <div className="space-y-3 pl-4 border-l-2 border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={preferences.compliance.forceRecallNotifications}
                      onCheckedChange={(checked) => {
                        setPreferences(prev => ({
                          ...prev,
                          compliance: { ...prev.compliance, forceRecallNotifications: checked },
                        }))
                        setHasChanges(true)
                      }}
                    />
                    <div className="flex-1">
                      <Label className="text-sm font-normal cursor-pointer">
                        Force notifications for recalls
                      </Label>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        All users receive recall notifications regardless of preferences (FDA requirement)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={preferences.compliance.forceColdChainNotifications}
                      onCheckedChange={(checked) => {
                        setPreferences(prev => ({
                          ...prev,
                          compliance: { ...prev.compliance, forceColdChainNotifications: checked },
                        }))
                        setHasChanges(true)
                      }}
                    />
                    <div className="flex-1">
                      <Label className="text-sm font-normal cursor-pointer">
                        Force notifications for cold chain breaches
                      </Label>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Critical temperature breaches always trigger notifications (regulatory requirement)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={preferences.compliance.preventDisablingComplianceAlerts}
                      onCheckedChange={(checked) => {
                        setPreferences(prev => ({
                          ...prev,
                          compliance: { ...prev.compliance, preventDisablingComplianceAlerts: checked },
                        }))
                        setHasChanges(true)
                      }}
                    />
                    <div className="flex-1">
                      <Label className="text-sm font-normal cursor-pointer">
                        Prevent disabling compliance alerts
                      </Label>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Users cannot disable notifications marked as mandatory for GxP compliance
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Log Retention */}
            <div className="space-y-3">
              <Label className="text-base font-semibold dark:text-slate-200">Notification Log Retention</Label>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={preferences.compliance.logRetentionDays}
                  onChange={(e) => {
                    setPreferences(prev => ({
                      ...prev,
                      compliance: { ...prev.compliance, logRetentionDays: parseInt(e.target.value) || 2555 },
                    }))
                    setHasChanges(true)
                  }}
                  className="w-32"
                  min="365"
                />
                <Label className="text-sm font-normal">days</Label>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Minimum retention period: 7 years (2555 days) for pharma compliance
              </p>
            </div>

            {/* Audit Logging */}
            <div className="space-y-3">
              <Label className="text-base font-semibold dark:text-slate-200">Audit Controls</Label>
              <div className="flex items-center gap-4">
                <Switch
                  checked={preferences.compliance.auditPreferenceChanges}
                  onCheckedChange={(checked) => {
                    setPreferences(prev => ({
                      ...prev,
                      compliance: { ...prev.compliance, auditPreferenceChanges: checked },
                    }))
                    setHasChanges(true)
                  }}
                />
                <div className="flex-1">
                  <Label className="text-sm font-normal cursor-pointer">
                    Audit log preference changes
                  </Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    All notification preference changes are logged for audit trail (21 CFR Part 11)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Note */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
              Compliance Note
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Some notifications are mandatory and cannot be disabled due to regulatory requirements (GxP, 21 CFR Part 11). 
              These are clearly marked with a lock icon and explanation. User preferences cannot override compliance mandates.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
