'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package2 } from 'lucide-react'

export default function InventoryRulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Inventory Rules</h1>
        <p className="text-slate-600">Configure FEFO logic, stock allocation rules, and inventory policies</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Package2 className="h-5 w-5 text-blue-600" />
            <CardTitle>Inventory Rules Configuration</CardTitle>
          </div>
          <CardDescription>
            Set up FEFO algorithms, stock reservation policies, and automated inventory management rules.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <Package2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-blue-900 mb-2">Under Development</h3>
            <p className="text-blue-700">
              This section will include FEFO configuration, allocation rules, reorder policies, and inventory automation settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
