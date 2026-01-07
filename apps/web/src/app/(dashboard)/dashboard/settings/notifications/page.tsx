'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell } from 'lucide-react'

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="text-slate-600">Configure email, SMS, and in-app notification preferences</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-orange-600" />
            <CardTitle>Notification Settings</CardTitle>
          </div>
          <CardDescription>
            Manage email alerts, SMS notifications, and in-app notification preferences for various system events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 text-center">
            <Bell className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-orange-900 mb-2">Under Development</h3>
            <p className="text-orange-700">
              This section will include email preferences, SMS alerts, push notifications, and event-specific notification settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
