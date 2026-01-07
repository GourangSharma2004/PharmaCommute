'use client'

import { useAuthStore } from '@/store/auth-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, AlertTriangle, Clock, CheckCircle } from 'lucide-react'
import { ROLE_DISPLAY_NAMES } from '@/lib/permissions'

export default function DashboardPage() {
  const { user, getPermissions } = useAuthStore()
  const permissions = getPermissions()

  if (!user || !permissions) return null

  // Mock dashboard data - would come from API
  const dashboardStats = {
    totalBatches: 1247,
    nearExpiry: 23,
    quarantine: 8,
    available: 1216,
  }

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Welcome back, {user.firstName}
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          {ROLE_DISPLAY_NAMES[user.role]} • {user.tenantName}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-slate-200">Total Batches</CardTitle>
            <Package className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-slate-100">{dashboardStats.totalBatches}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Active inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-slate-200">Near Expiry</CardTitle>
            <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{dashboardStats.nearExpiry}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Within 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-slate-200">Quarantine</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{dashboardStats.quarantine}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Awaiting QC</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-slate-200">Available</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{dashboardStats.available}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">Ready for issue</p>
          </CardContent>
        </Card>
      </div>

      {/* Role-specific content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick actions based on role */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Actions available for your role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {permissions.canCreateInventory && (
              <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded">
                <span className="text-sm dark:text-slate-200">Create Inventory Movement</span>
                <Badge variant="secondary">Available</Badge>
              </div>
            )}
            {permissions.canPerformQC && (
              <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded">
                <span className="text-sm dark:text-slate-200">Perform QC Testing</span>
                <Badge variant="secondary">Available</Badge>
              </div>
            )}
            {permissions.canApproveQC && (
              <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded">
                <span className="text-sm dark:text-slate-200">Approve QC Results</span>
                <Badge variant="secondary">Available</Badge>
              </div>
            )}
            {permissions.canReleaseBatch && (
              <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded">
                <span className="text-sm dark:text-slate-200">Release Batches</span>
                <Badge variant="secondary">Available</Badge>
              </div>
            )}
            {permissions.canViewAudit && (
              <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded">
                <span className="text-sm dark:text-slate-200">View Audit Trails</span>
                <Badge variant="secondary">Available</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm dark:text-slate-200">Batch ABC123 released for distribution</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 dark:bg-yellow-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm dark:text-slate-200">Temperature excursion detected in Cold Storage A</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm dark:text-slate-200">New batch XYZ789 received from Supplier Inc</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">6 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
