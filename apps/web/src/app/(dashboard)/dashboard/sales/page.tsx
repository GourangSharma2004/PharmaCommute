'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck } from 'lucide-react'

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Sales & Distribution</h1>
        <p className="text-slate-600">Sales orders, dispatch management, and distribution tracking</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Truck className="h-5 w-5 text-indigo-600" />
            <CardTitle>Sales & Distribution Management</CardTitle>
          </div>
          <CardDescription>
            Complete sales workflow from order processing to dispatch and delivery tracking with FEFO allocation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 text-center">
            <Truck className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-indigo-900 mb-2">Under Development</h3>
            <p className="text-indigo-700">
              This module will include sales orders, FEFO-based picking, dispatch notes, and delivery tracking.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
