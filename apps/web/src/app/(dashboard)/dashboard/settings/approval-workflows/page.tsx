'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GitBranch } from 'lucide-react'

export default function ApprovalWorkflowsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Approval Workflows</h1>
        <p className="text-slate-600">Configure approval processes for batch release, deviations, and system changes</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <GitBranch className="h-5 w-5 text-teal-600" />
            <CardTitle>Approval Workflow Configuration</CardTitle>
          </div>
          <CardDescription>
            Design and manage approval workflows for quality processes, batch releases, and system modifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 text-center">
            <GitBranch className="h-12 w-12 text-teal-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-teal-900 mb-2">Under Development</h3>
            <p className="text-teal-700">
              This section will include workflow designer, approval chains, escalation rules, and process automation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
