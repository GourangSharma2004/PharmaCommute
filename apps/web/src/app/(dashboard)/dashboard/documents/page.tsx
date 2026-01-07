'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderOpen } from 'lucide-react'

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
        <p className="text-slate-600">Document management, COAs, certificates, and file storage</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FolderOpen className="h-5 w-5 text-amber-600" />
            <CardTitle>Document Management</CardTitle>
          </div>
          <CardDescription>
            Centralized document repository for COAs, certificates, SOPs, and compliance documents with version control.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
            <FolderOpen className="h-12 w-12 text-amber-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-amber-900 mb-2">Under Development</h3>
            <p className="text-amber-700">
              This module will include COA management, certificate storage, SOP library, and document version control.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
