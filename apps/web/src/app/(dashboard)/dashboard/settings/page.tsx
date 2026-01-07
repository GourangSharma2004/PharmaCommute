'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600">System configuration, user management, and administrative settings</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <CardTitle>System Settings & Administration</CardTitle>
          </div>
          <CardDescription>
            System configuration, user management, role assignments, and administrative controls.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <Settings className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Under Development</h3>
            <p className="text-gray-700">
              This module will include user management, role configuration, system settings, and tenant administration.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
