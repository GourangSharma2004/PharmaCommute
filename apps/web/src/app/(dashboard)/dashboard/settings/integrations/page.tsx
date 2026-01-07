'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plug } from 'lucide-react'

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Integrations</h1>
        <p className="text-slate-600">Configure ERP connections, API settings, and external system integrations</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Plug className="h-5 w-5 text-green-600" />
            <CardTitle>System Integrations</CardTitle>
          </div>
          <CardDescription>
            Manage connections to ERP systems, external APIs, and third-party service integrations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <Plug className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-green-900 mb-2">Under Development</h3>
            <p className="text-green-700">
              This section will include ERP integrations, API configurations, webhook settings, and data synchronization rules.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
