'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lock } from 'lucide-react'

export default function SystemSecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">System & Security</h1>
        <p className="text-slate-600">Configure system-wide security policies, encryption, and access controls</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-red-600" />
            <CardTitle>System & Security Configuration</CardTitle>
          </div>
          <CardDescription>
            Manage system security policies, encryption settings, and global access control configurations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <Lock className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">Under Development</h3>
            <p className="text-red-700">
              This section will include security policies, encryption settings, access controls, and system hardening configurations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
