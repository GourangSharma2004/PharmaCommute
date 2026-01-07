'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from 'lucide-react'

export default function MasterDataPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Master Data</h1>
        <p className="text-slate-600">Manage products, suppliers, customers, and warehouses</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-600" />
            <CardTitle>Master Data Management</CardTitle>
          </div>
          <CardDescription>
            Central repository for all master data entities including products, batches, suppliers, customers, and warehouse locations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <Database className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-blue-900 mb-2">Under Development</h3>
            <p className="text-blue-700">
              This module will include product master, supplier management, customer database, and warehouse configuration.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
