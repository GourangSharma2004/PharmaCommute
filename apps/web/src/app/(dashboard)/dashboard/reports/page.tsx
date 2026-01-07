'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
        <p className="text-slate-600">Business intelligence, compliance reports, and data analytics</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            <CardTitle>Reports & Analytics</CardTitle>
          </div>
          <CardDescription>
            Comprehensive reporting suite with business intelligence, compliance reports, and predictive analytics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center">
            <TrendingUp className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-emerald-900 mb-2">Under Development</h3>
            <p className="text-emerald-700">
              This module will include expiry reports, inventory analytics, compliance dashboards, and predictive insights.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
