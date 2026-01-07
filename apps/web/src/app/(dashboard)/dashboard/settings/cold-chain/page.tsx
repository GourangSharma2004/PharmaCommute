'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Thermometer } from 'lucide-react'

export default function ColdChainConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Cold Chain Configuration</h1>
        <p className="text-slate-600">Configure temperature ranges, monitoring settings, and excursion policies</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Thermometer className="h-5 w-5 text-cyan-600" />
            <CardTitle>Cold Chain Configuration</CardTitle>
          </div>
          <CardDescription>
            Set up temperature monitoring parameters, excursion thresholds, and cold storage policies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6 text-center">
            <Thermometer className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-cyan-900 mb-2">Under Development</h3>
            <p className="text-cyan-700">
              This section will include temperature range settings, monitoring configurations, excursion policies, and alert thresholds.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
