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
  Bell, 
  Mail,
  Smartphone,
  Clock,
  Info,
  Save,
  AlertTriangle,
  CheckCircle2,
  MessageSquare
} from 'lucide-react'

// Notification categories available
const NOTIFICATION_CATEGORIES = [
  {
    id: 'inventory',
    name: 'Inventory & Stock',
    description: 'Stock levels, batch expiry, near-expiry alerts',
    icon: '📦',
    defaultEnabled: true
  },
  {
    id: 'quality',
    name: 'Quality & Compliance',
    description: 'QC results, batch release, deviations',
    icon: '🧪',
    defaultEnabled: true
  },
  {
    id: 'coldchain',
    name: 'Cold Chain & Temperature',
    description: 'Temperature excursions, sensor alerts',
    icon: '❄️',
    defaultEnabled: true
  },
  {
    id: 'recalls',
    name: 'Recalls & Traceability',
    description: 'Product recalls, traceability gaps',
    icon: '⚠️',
    defaultEnabled: true
  },
  {
    id: 'approvals',
    name: 'Approvals & Workflows',
    description: 'Pending approvals, escalations, completions',
    icon: '✅',
    defaultEnabled: true
  },
  {
    id: 'security',
    name: 'Security & Access',
    description: 'Login alerts, security events',
    icon: '🔒',
    defaultEnabled: false
  },
  {
    id: 'system',
    name: 'System & Updates',
    description: 'System maintenance, updates, backups',
    icon: '⚙️',
    defaultEnabled: false
  }
]

export default function NotificationsPage() {
  const [preferences, setPreferences] = useState({
    // Category preferences
    categories: NOTIFICATION_CATEGORIES.reduce((acc, cat) => ({
      ...acc,
      [cat.id]: {
        enabled: cat.defaultEnabled,
        channels: {
          inApp: true,
          email: cat.defaultEnabled,
          push: false
        }
      }
    }), {} as Record<string, any>),
    
    // Delivery settings
    delivery: {
      frequency: 'instant' as 'instant' | 'hourly' | 'daily',
      quietHoursEnabled: false,
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00'
    },
    
    // Acknowledgment settings
    acknowledgment: {
      requireForCritical: true,
      autoMarkAsRead: false,
      remindersEnabled: true,
      reminderInterval: 60 // minutes
    }
  })
  
  const [hasChanges, setHasChanges] = useState(false)
  
  const updateCategoryEnabled = (categoryId: string, enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryId]: {
          ...prev.categories[categoryId],
          enabled
        }
      }
    }))
    setHasChanges(true)
  }
  
  const updateCategoryChannel = (categoryId: string, channel: string, enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryId]: {
          ...prev.categories[categoryId],
          channels: {
            ...prev.categories[categoryId].channels,
            [channel]: enabled
          }
        }
      }
    }))
    setHasChanges(true)
  }
  
  const handleSave = () => {
    console.log('Saving notification preferences:', preferences)
    setHasChanges(false)
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Notification Preferences</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          How would you like to be notified about events and updates?
        </p>
      </div>

      {/* Helper Banner */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Configure your personal notification preferences. For approval processes and escalation rules, visit the <strong>Approval Workflows</strong> settings.
        </AlertDescription>
      </Alert>

      {/* Section 1: Notification Categories */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <div>
                <CardTitle>Notification Categories</CardTitle>
                <CardDescription>
                  Choose which types of events you want to be notified about
                </CardDescription>
              </div>
            </div>
            {hasChanges && (
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {NOTIFICATION_CATEGORIES.map((category) => {
              const catPrefs = preferences.categories[category.id]
              
              return (
                <div key={category.id} className="p-4 border rounded-lg dark:border-slate-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3 flex-1">
                      <span className="text-2xl">{category.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Label className="text-base font-medium">{category.name}</Label>
                          {catPrefs?.enabled && (
                            <Badge variant="default" className="text-xs">Active</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={catPrefs?.enabled || false}
                      onCheckedChange={(checked) => updateCategoryEnabled(category.id, checked)}
                    />
                  </div>
                  
                  {catPrefs?.enabled && (
                    <div className="ml-11 pt-3 border-t dark:border-slate-700">
                      <Label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">
                        Delivery Channels:
                      </Label>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <Smartphone className="h-4 w-4 text-slate-500" />
                          <Switch
                            checked={catPrefs.channels.inApp}
                            onCheckedChange={(checked) => updateCategoryChannel(category.id, 'inApp', checked)}
                          />
                          <Label className="text-sm">In-App</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-slate-500" />
                          <Switch
                            checked={catPrefs.channels.email}
                            onCheckedChange={(checked) => updateCategoryChannel(category.id, 'email', checked)}
                          />
                          <Label className="text-sm">Email</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 text-slate-500" />
                          <Switch
                            checked={catPrefs.channels.push}
                            onCheckedChange={(checked) => updateCategoryChannel(category.id, 'push', checked)}
                          />
                          <Label className="text-sm">Push (Future)</Label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Delivery Frequency */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-green-600" />
            <div>
              <CardTitle>Delivery Frequency</CardTitle>
              <CardDescription>
                When would you like to receive notifications?
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">Notification Frequency</Label>
            <Select
              value={preferences.delivery.frequency}
              onValueChange={(value: any) => {
                setPreferences(prev => ({
                  ...prev,
                  delivery: { ...prev.delivery, frequency: value }
                }))
                setHasChanges(true)
              }}
            >
              <SelectTrigger className="w-full md:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Instant (Real-time)</SelectItem>
                <SelectItem value="hourly">Hourly Digest</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {preferences.delivery.frequency === 'instant' 
                ? 'Receive notifications immediately as events occur'
                : preferences.delivery.frequency === 'hourly'
                ? 'Receive a summary of notifications every hour'
                : 'Receive a single daily summary of all notifications'
              }
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Label className="text-base font-medium">Quiet Hours</Label>
              <Badge variant="outline" className="text-xs">Optional</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Switch
                checked={preferences.delivery.quietHoursEnabled}
                onCheckedChange={(checked) => {
                  setPreferences(prev => ({
                    ...prev,
                    delivery: { ...prev.delivery, quietHoursEnabled: checked }
                  }))
                  setHasChanges(true)
                }}
              />
              <Label className="text-sm font-normal">
                Pause non-critical notifications during quiet hours
              </Label>
            </div>
            
            {preferences.delivery.quietHoursEnabled && (
              <div className="ml-8 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Label className="text-sm">Start:</Label>
                  <Input
                    type="time"
                    value={preferences.delivery.quietHoursStart}
                    onChange={(e) => {
                      setPreferences(prev => ({
                        ...prev,
                        delivery: { ...prev.delivery, quietHoursStart: e.target.value }
                      }))
                      setHasChanges(true)
                    }}
                    className="w-32"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="text-sm">End:</Label>
                  <Input
                    type="time"
                    value={preferences.delivery.quietHoursEnd}
                    onChange={(e) => {
                      setPreferences(prev => ({
                        ...prev,
                        delivery: { ...prev.delivery, quietHoursEnd: e.target.value }
                      }))
                      setHasChanges(true)
                    }}
                    className="w-32"
                  />
                </div>
              </div>
            )}
            
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Critical alerts (recalls, cold chain breaches) will always be delivered immediately
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 3: Acknowledgment & Reminders */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5 text-purple-600" />
            <div>
              <CardTitle>Acknowledgment & Reminders</CardTitle>
              <CardDescription>
                Manage how you interact with important notifications
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Require acknowledgment for critical alerts</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  You must acknowledge critical notifications before they can be dismissed
                </p>
              </div>
              <Switch
                checked={preferences.acknowledgment.requireForCritical}
                onCheckedChange={(checked) => {
                  setPreferences(prev => ({
                    ...prev,
                    acknowledgment: { ...prev.acknowledgment, requireForCritical: checked }
                  }))
                  setHasChanges(true)
                }}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Auto-mark notifications as read</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Automatically mark notifications as read when you view them
                </p>
              </div>
              <Switch
                checked={preferences.acknowledgment.autoMarkAsRead}
                onCheckedChange={(checked) => {
                  setPreferences(prev => ({
                    ...prev,
                    acknowledgment: { ...prev.acknowledgment, autoMarkAsRead: checked }
                  }))
                  setHasChanges(true)
                }}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Enable reminder nudges</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Remind you about unread notifications after a set interval
                </p>
              </div>
              <Switch
                checked={preferences.acknowledgment.remindersEnabled}
                onCheckedChange={(checked) => {
                  setPreferences(prev => ({
                    ...prev,
                    acknowledgment: { ...prev.acknowledgment, remindersEnabled: checked }
                  }))
                  setHasChanges(true)
                }}
              />
            </div>
            
            {preferences.acknowledgment.remindersEnabled && (
              <div className="ml-8 space-y-2">
                <Label className="text-sm">Reminder Interval (minutes)</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    value={preferences.acknowledgment.reminderInterval}
                    onChange={(e) => {
                      setPreferences(prev => ({
                        ...prev,
                        acknowledgment: { 
                          ...prev.acknowledgment, 
                          reminderInterval: parseInt(e.target.value) || 60 
                        }
                      }))
                      setHasChanges(true)
                    }}
                    min="15"
                    max="1440"
                    className="w-32"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">minutes</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Section 4: Notification Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-orange-600" />
            <div>
              <CardTitle>Notification Preview</CardTitle>
              <CardDescription>
                Sample of how notifications will appear
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* In-App Notification Preview */}
            <div className="p-4 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      Batch Near Expiry - ABC123
                    </span>
                    <span className="text-xs text-slate-500">2 mins ago</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Batch ABC123 (Paracetamol 500mg) will expire in 15 days. Current available quantity: 5,000 tablets.
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-xs">Inventory</Badge>
                    <Badge variant="default" className="text-xs">High Priority</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Email Notification Preview */}
            <div className="p-4 border rounded-lg dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <div className="flex items-center space-x-2 mb-2">
                <Mail className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  Email Preview
                </span>
              </div>
              <div className="text-xs space-y-1 font-mono bg-white dark:bg-slate-900 p-3 rounded border dark:border-slate-700">
                <div><strong>From:</strong> PharmaCommute Notifications &lt;notify@pharmacommute.com&gt;</div>
                <div><strong>Subject:</strong> [High Priority] Batch Near Expiry - ABC123</div>
                <div className="pt-2 border-t dark:border-slate-700 mt-2">
                  Batch ABC123 (Paracetamol 500mg) will expire in 15 days...
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button at Bottom */}
      {hasChanges && (
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Notification Preferences
          </Button>
        </div>
      )}
    </div>
  )
}
