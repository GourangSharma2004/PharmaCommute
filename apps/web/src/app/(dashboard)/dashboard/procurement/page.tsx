'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart } from 'lucide-react'

export default function ProcurementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Procurement</h1>
        <p className="text-slate-600">Purchase orders, goods receipt, and supplier management</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-green-600" />
            <CardTitle>Procurement Management</CardTitle>
          </div>
          <CardDescription>
            Complete procurement workflow from purchase requisitions to goods receipt and vendor management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <ShoppingCart className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-green-900 mb-2">Under Development</h3>
            <p className="text-green-700">
              This module will include purchase requisitions, purchase orders, goods receipt notes, and vendor compliance tracking.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
