'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Bell,
  Filter,
  Settings,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  ExternalLink,
  X
} from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { UserRole } from '@/types/auth'

// Notification types
type NotificationSeverity = 'critical' | 'action-required' | 'informational'
type NotificationStatus = 'unread' | 'read' | 'acknowledged'

interface Notification {
  id: string
  severity: NotificationSeverity
  status: NotificationStatus
  title: string
  entityReference: string
  entityType: 'batch' | 'warehouse' | 'recall' | 'qc' | 'inventory' | 'system'
  context: string
  timestamp: Date
  acknowledgedAt?: Date
  actionUrl?: string
  overdue?: boolean
  slaMinutes?: number
}

// Mock notification data - realistic pharma events
const MOCK_NOTIFICATIONS: Notification[] = [
  // Critical Alerts
  {
    id: '1',
    severity: 'critical',
    status: 'unread',
    title: 'Temperature Excursion Detected',
    entityReference: 'Warehouse A - Cold Room 2',
    entityType: 'warehouse',
    context: 'Temperature exceeded acceptable range: 8.5°C (max: 8°C)',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
  },
  {
    id: '2',
    severity: 'critical',
    status: 'unread',
    title: 'Recall Initiated',
    entityReference: 'Recall #RC-2024-001',
    entityType: 'recall',
    context: 'Product: Paracetamol 500mg - Batch BATCH-2024-001',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    actionUrl: '/dashboard/recalls',
  },
  {
    id: '3',
    severity: 'critical',
    status: 'acknowledged',
    title: 'QC Test Failure',
    entityReference: 'Batch BATCH-2024-045',
    entityType: 'qc',
    context: 'Microbial test failed - Batch moved to Blocked status',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    acknowledgedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  
  // Action Required
  {
    id: '4',
    severity: 'action-required',
    status: 'unread',
    title: 'QC Approval Pending',
    entityReference: 'Batch BATCH-2024-078',
    entityType: 'qc',
    context: 'Incoming QC completed - Awaiting QA Manager approval',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    actionUrl: '/dashboard/quality',
    slaMinutes: 60,
    overdue: false,
  },
  {
    id: '5',
    severity: 'action-required',
    status: 'unread',
    title: 'Batch Release Approval',
    entityReference: 'Batch BATCH-2024-082',
    entityType: 'batch',
    context: 'Batch ready for release - Requires QA approval',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    actionUrl: '/dashboard/inventory',
    slaMinutes: 240,
    overdue: true,
  },
  {
    id: '6',
    severity: 'action-required',
    status: 'read',
    title: 'Near-Expiry Dispatch Approval',
    entityReference: 'Batch BATCH-2024-055',
    entityType: 'batch',
    context: 'Batch expires in 12 days - Approval required for dispatch',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    actionUrl: '/dashboard/inventory',
  },
  
  // Informational
  {
    id: '7',
    severity: 'informational',
    status: 'unread',
    title: 'New Batch Received',
    entityReference: 'Batch BATCH-2024-089',
    entityType: 'batch',
    context: 'Goods receipt completed - Batch placed in quarantine',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
  },
  {
    id: '8',
    severity: 'informational',
    status: 'read',
    title: 'Inventory Transfer Completed',
    entityReference: 'Transfer #TRF-2024-123',
    entityType: 'inventory',
    context: 'Transfer from Warehouse A to Warehouse B completed',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: '9',
    severity: 'informational',
    status: 'read',
    title: 'Inventory Rule Updated',
    entityReference: 'System Configuration',
    entityType: 'system',
    context: 'Near-expiry threshold updated to 30 days',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
]

// Role-based notification filtering
function filterNotificationsByRole(notifications: Notification[], userRole: UserRole): Notification[] {
  // Filter based on role - only show relevant notifications
  return notifications.filter(notification => {
    // Critical alerts are shown to all roles
    if (notification.severity === 'critical') return true
    
    // Action required notifications
    if (notification.severity === 'action-required') {
      // QC approvals - only QA Manager and Admin
      if (notification.entityType === 'qc' && notification.title.includes('QC')) {
        return userRole === UserRole.QA_MANAGER || userRole === UserRole.ADMIN
      }
      // Batch release - QA Manager and Admin
      if (notification.entityType === 'batch' && notification.title.includes('Release')) {
        return userRole === UserRole.QA_MANAGER || userRole === UserRole.ADMIN
      }
      // Near-expiry dispatch - Warehouse Manager and Admin
      if (notification.title.includes('Near-Expiry')) {
        return userRole === UserRole.WAREHOUSE_MANAGER || userRole === UserRole.ADMIN
      }
      // Default: show to all managers and admin
      return [UserRole.ADMIN, UserRole.QA_MANAGER, UserRole.WAREHOUSE_MANAGER].includes(userRole)
    }
    
    // Informational - show to all roles
    return true
  })
}

// Format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

interface NotificationCardProps {
  notification: Notification
  onAcknowledge: (id: string) => void
  onView: (url?: string) => void
}

function NotificationCard({ notification, onAcknowledge, onView }: NotificationCardProps) {
  const severityConfig = {
    critical: {
      icon: AlertCircle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      dotColor: 'bg-red-500',
    },
    'action-required': {
      icon: AlertTriangle,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800',
      dotColor: 'bg-amber-500',
    },
    informational: {
      icon: Info,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      dotColor: 'bg-blue-500',
    },
  }

  const config = severityConfig[notification.severity]
  const Icon = config.icon

  return (
    <div
      className={`p-3 rounded-lg border ${config.borderColor} ${config.bgColor} ${
        notification.status === 'unread' ? 'border-l-4' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-2 h-2 rounded-full ${config.dotColor} mt-2 flex-shrink-0`} />
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                {notification.title}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {notification.entityReference}
              </p>
            </div>
            {notification.status === 'unread' && (
              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
            )}
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
            {notification.context}
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-slate-400 dark:text-slate-500" />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatRelativeTime(notification.timestamp)}
              </span>
              {notification.overdue && (
                <Badge variant="destructive" className="text-xs px-1.5 py-0">
                  Overdue
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {notification.severity === 'critical' && notification.status !== 'acknowledged' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => onAcknowledge(notification.id)}
                >
                  Acknowledge
                </Button>
              )}
              {notification.actionUrl && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs"
                  onClick={() => onView(notification.actionUrl)}
                >
                  {notification.severity === 'action-required' ? 'Go to task' : 'View'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function NotificationDropdown() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set())

  // Filter notifications by role and apply acknowledgments
  const filteredNotifications = useMemo(() => {
    if (!user) return []
    const roleFiltered = filterNotificationsByRole(MOCK_NOTIFICATIONS, user.role)
    // Apply acknowledgment state
    return roleFiltered.map(n => {
      if (acknowledgedIds.has(n.id) && n.severity === 'critical') {
        return { ...n, status: 'acknowledged' as NotificationStatus, acknowledgedAt: new Date() }
      }
      return n
    })
  }, [user, acknowledgedIds])

  // Group notifications by severity
  const criticalAlerts = filteredNotifications.filter(n => n.severity === 'critical' && n.status !== 'acknowledged')
  const actionRequired = filteredNotifications.filter(n => n.severity === 'action-required')
  const informational = filteredNotifications.filter(n => n.severity === 'informational')

  // Count unread notifications
  const unreadCritical = criticalAlerts.filter(n => n.status === 'unread').length
  const unreadAction = actionRequired.filter(n => n.status === 'unread').length
  const totalUnread = filteredNotifications.filter(n => n.status === 'unread').length

  // Badge color logic
  const badgeColor = unreadCritical > 0 ? 'bg-red-500' : unreadAction > 0 ? 'bg-amber-500' : 'bg-blue-500'

  const handleAcknowledge = (id: string) => {
    // TODO: Call backend API to acknowledge notification
    // In real implementation, this would be: await acknowledgeNotification(id)
    setAcknowledgedIds(prev => new Set([...prev, id]))
    // Note: Acknowledged critical alerts remain visible but marked as acknowledged
  }

  const handleView = (url?: string) => {
    if (url) {
      router.push(url)
      setOpen(false)
    }
  }

  const handleViewAll = () => {
    router.push('/dashboard/settings/notifications')
    setOpen(false)
  }

  if (!user) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
        >
          <Bell className="h-4 w-4" />
          {totalUnread > 0 && (
            <span className={`absolute -top-1 -right-1 h-4 w-4 ${badgeColor} rounded-full flex items-center justify-center`}>
              <span className="text-[10px] font-bold text-white">
                {totalUnread > 9 ? '9+' : totalUnread}
              </span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[420px] p-0 max-h-[70vh] flex flex-col bg-white dark:bg-[hsl(217.2,32.6%,17.5%)] border-slate-200 dark:border-slate-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Notifications</h3>
            {totalUnread > 0 && (
              <Badge variant="default" className="text-xs">
                {totalUnread} unread
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              title="Filter notifications"
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              onClick={() => {
                router.push('/dashboard/settings/notifications')
                setOpen(false)
              }}
              title="Notification Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Critical Alerts */}
          {criticalAlerts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Critical Alerts</h4>
                <Badge variant="destructive" className="text-xs">
                  {unreadCritical}
                </Badge>
              </div>
              {criticalAlerts.map(notification => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onAcknowledge={handleAcknowledge}
                  onView={handleView}
                />
              ))}
            </div>
          )}

          {/* Action Required */}
          {actionRequired.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Action Required</h4>
                {unreadAction > 0 && (
                  <Badge variant="outline" className="text-xs border-amber-500 text-amber-700 dark:text-amber-400">
                    {unreadAction}
                  </Badge>
                )}
              </div>
              {actionRequired.map(notification => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onAcknowledge={handleAcknowledge}
                  onView={handleView}
                />
              ))}
            </div>
          )}

          {/* Informational */}
          {informational.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Informational</h4>
              </div>
              {informational.map(notification => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onAcknowledge={handleAcknowledge}
                  onView={handleView}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredNotifications.length === 0 && (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No notifications</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/50">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-between text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              onClick={handleViewAll}
            >
              <span>View all notifications</span>
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
