'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FlaskConical } from 'lucide-react'

export default function QualityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Quality & Compliance</h1>
        <p className="text-slate-600">QC testing, batch release, deviations, and CAPA management</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FlaskConical className="h-5 w-5 text-purple-600" />
            <CardTitle>Quality Control & Compliance</CardTitle>
          </div>
          <CardDescription>
            Comprehensive quality management system with QC workflows, batch release, and compliance tracking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
            <FlaskConical className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-purple-900 mb-2">Under Development</h3>
            <p className="text-purple-700">
              This module will include IQC/QC testing, batch release workflows, deviation management, and CAPA tracking.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
