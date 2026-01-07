'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Thermometer } from 'lucide-react'

export default function ColdChainPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Cold Chain</h1>
        <p className="text-slate-600">Temperature monitoring, excursion management, and cold storage control</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Thermometer className="h-5 w-5 text-cyan-600" />
            <CardTitle>Cold Chain Management</CardTitle>
          </div>
          <CardDescription>
            Real-time temperature monitoring, excursion detection, and cold storage compliance management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6 text-center">
            <Thermometer className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-cyan-900 mb-2">Under Development</h3>
            <p className="text-cyan-700">
              This module will include IoT temperature sensors, excursion alerts, cold storage monitoring, and compliance reporting.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
