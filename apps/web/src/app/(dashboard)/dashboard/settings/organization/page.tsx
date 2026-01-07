'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building } from 'lucide-react'

export default function OrganizationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Organization Settings</h1>
        <p className="text-slate-600">Configure company information, branding, and organizational preferences</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Building className="h-5 w-5 text-indigo-600" />
            <CardTitle>Organization Configuration</CardTitle>
          </div>
          <CardDescription>
            Manage company details, branding settings, and organizational structure configurations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-center">
            <Building className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-indigo-900 mb-2">Under Development</h3>
            <p className="text-indigo-700">
              This section will include company information, branding settings, organizational structure, and tenant configuration.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
