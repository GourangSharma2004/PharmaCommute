'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function RecallsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Recall & Traceability</h1>
        <p className="text-slate-600">Product recalls, batch traceability, and impact analysis</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <CardTitle>Recall & Traceability Management</CardTitle>
          </div>
          <CardDescription>
            Complete recall workflow with forward/backward traceability, impact analysis, and regulatory reporting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">Under Development</h3>
            <p className="text-red-700">
              This module will include recall initiation, batch genealogy tracking, customer impact analysis, and regulatory notifications.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
