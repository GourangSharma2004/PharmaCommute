'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Plug, 
  Lock, 
  Database, 
  FlaskConical, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  Info,
  ArrowDown,
  ArrowUp,
  ArrowRightLeft,
  Shield,
  FileText,
  Package,
  DollarSign,
  Thermometer,
  MapPin,
  Activity,
  User,
  BarChart3,
  Settings,
  Users,
  Key,
  Eye,
  EyeOff,
  AlertTriangle,
  History,
  Power
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/auth-store'
import { UserRole } from '@/types/auth'

// Integration types
type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'disabled'
type SyncDirection = 'inbound' | 'outbound' | 'bidirectional'
type SyncFrequency = 'realtime' | 'scheduled' | 'manual'
type LastSyncStatus = 'success' | 'failed' | 'pending'

interface ERPIntegration {
  id: string
  name: string
  status: IntegrationStatus
  dataScope: string[]
  syncDirection: SyncDirection
  syncFrequency: SyncFrequency
  lastSyncStatus: LastSyncStatus
  lastSyncTime: string
}

interface QualityIntegration {
  id: string
  name: string
  status: IntegrationStatus
  dataScope: string[]
  direction: 'inbound' | 'bidirectional'
  sourceAttribution: boolean
  timestampIntegrity: boolean
}

interface LogisticsIntegration {
  id: string
  name: string
  status: IntegrationStatus
  dataType: 'temperature' | 'location' | 'shipment'
  deviceMapping: boolean
  dataFreshness: 'current' | 'stale' | 'unknown'
  alertTriggers: boolean
}

interface IdentityIntegration {
  id: string
  name: string
  status: 'enabled' | 'disabled'
  ssoEnabled: boolean
  userProvisioning: 'manual' | 'automatic'
  roleMappingSummary: string
  lastSyncStatus: LastSyncStatus
  lastSyncTime: string
}

interface AnalyticsIntegration {
  id: string
  name: string
  status: IntegrationStatus
  dataScope: string[]
  accessType: 'read-only'
  exportMode: 'scheduled' | 'on-demand'
  lastExportStatus: LastSyncStatus
  lastExportTime: string
  maskSensitiveFields: boolean
  approvalRequired: boolean
}

interface IntegrationGovernance {
  lastConfigChange: string
  changedBy: string
  changedByRole: string
  impactSummary: string
  lastError: string | null
  emergencyDisableAvailable: boolean
}

// Mock data
const erpIntegrations: ERPIntegration[] = [
  {
    id: 'sap',
    name: 'SAP ERP',
    status: 'connected',
    dataScope: ['Items', 'Batches', 'Stock levels', 'Financial postings'],
    syncDirection: 'bidirectional',
    syncFrequency: 'scheduled',
    lastSyncStatus: 'success',
    lastSyncTime: '2 hours ago',
  },
  {
    id: 'oracle',
    name: 'Oracle ERP Cloud',
    status: 'disconnected',
    dataScope: ['Items', 'Batches', 'Stock levels'],
    syncDirection: 'inbound',
    syncFrequency: 'scheduled',
    lastSyncStatus: 'pending',
    lastSyncTime: 'Never',
  },
  {
    id: 'dynamics',
    name: 'Microsoft Dynamics 365',
    status: 'connected',
    dataScope: ['Items', 'Stock levels', 'Financial postings'],
    syncDirection: 'outbound',
    syncFrequency: 'realtime',
    lastSyncStatus: 'success',
    lastSyncTime: '5 minutes ago',
  },
  {
    id: 'tally',
    name: 'Tally ERP',
    status: 'error',
    dataScope: ['Items', 'Financial postings'],
    syncDirection: 'inbound',
    syncFrequency: 'scheduled',
    lastSyncStatus: 'failed',
    lastSyncTime: '1 day ago',
  },
]

const qualityIntegrations: QualityIntegration[] = [
  {
    id: 'lims',
    name: 'Laboratory Information Management System (LIMS)',
    status: 'connected',
    dataScope: ['QC results', 'COA documents', 'Test data'],
    direction: 'inbound',
    sourceAttribution: true,
    timestampIntegrity: true,
  },
  {
    id: 'qms',
    name: 'Quality Management System (QMS)',
    status: 'connected',
    dataScope: ['Deviation references', 'CAPA records', 'Change controls'],
    direction: 'bidirectional',
    sourceAttribution: true,
    timestampIntegrity: true,
  },
  {
    id: 'dms',
    name: 'Document Management System (DMS)',
    status: 'connected',
    dataScope: ['COA documents', 'Specifications', 'SOPs'],
    direction: 'inbound',
    sourceAttribution: true,
    timestampIntegrity: true,
  },
]

const logisticsIntegrations: LogisticsIntegration[] = [
  {
    id: 'iot-temp',
    name: 'IoT Temperature Sensors',
    status: 'connected',
    dataType: 'temperature',
    deviceMapping: true,
    dataFreshness: 'current',
    alertTriggers: true,
  },
  {
    id: 'gps-tracking',
    name: 'GPS / Shipment Tracking',
    status: 'connected',
    dataType: 'location',
    deviceMapping: true,
    dataFreshness: 'current',
    alertTriggers: true,
  },
  {
    id: '3pl-provider',
    name: '3PL Logistics Provider',
    status: 'connected',
    dataType: 'shipment',
    deviceMapping: false,
    dataFreshness: 'current',
    alertTriggers: true,
  },
]

const identityIntegrations: IdentityIntegration[] = [
  {
    id: 'azure-ad',
    name: 'Azure Active Directory',
    status: 'enabled',
    ssoEnabled: true,
    userProvisioning: 'automatic',
    roleMappingSummary: '3 groups mapped',
    lastSyncStatus: 'success',
    lastSyncTime: '1 hour ago',
  },
  {
    id: 'okta',
    name: 'Okta',
    status: 'disabled',
    ssoEnabled: false,
    userProvisioning: 'manual',
    roleMappingSummary: 'Not configured',
    lastSyncStatus: 'pending',
    lastSyncTime: 'Never',
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    status: 'enabled',
    ssoEnabled: true,
    userProvisioning: 'automatic',
    roleMappingSummary: '2 groups mapped',
    lastSyncStatus: 'success',
    lastSyncTime: '30 minutes ago',
  },
]

const analyticsIntegrations: AnalyticsIntegration[] = [
  {
    id: 'power-bi',
    name: 'Power BI',
    status: 'connected',
    dataScope: ['Inventory summaries', 'Batch history', 'Movement logs'],
    accessType: 'read-only',
    exportMode: 'scheduled',
    lastExportStatus: 'success',
    lastExportTime: '6 hours ago',
    maskSensitiveFields: true,
    approvalRequired: true,
  },
  {
    id: 'tableau',
    name: 'Tableau',
    status: 'connected',
    dataScope: ['Inventory summaries', 'Batch history'],
    accessType: 'read-only',
    exportMode: 'on-demand',
    lastExportStatus: 'success',
    lastExportTime: '2 days ago',
    maskSensitiveFields: true,
    approvalRequired: true,
  },
  {
    id: 'data-warehouse',
    name: 'Secure Data Warehouse Export',
    status: 'connected',
    dataScope: ['Inventory summaries', 'Batch history', 'Movement logs', 'QC results'],
    accessType: 'read-only',
    exportMode: 'scheduled',
    lastExportStatus: 'success',
    lastExportTime: '1 day ago',
    maskSensitiveFields: true,
    approvalRequired: true,
  },
]

const integrationGovernance: IntegrationGovernance = {
  lastConfigChange: '2 days ago',
  changedBy: 'The Gourang',
  changedByRole: 'Administrator',
  impactSummary: 'SAP ERP sync frequency changed from real-time to scheduled',
  lastError: 'Tally ERP sync failed - connection timeout',
  emergencyDisableAvailable: true,
}

export default function IntegrationsPage() {
  const { user } = useAuthStore()

  // Check if user has access (Admin / IT / Compliance)
  if (!user) {
    return null
  }

  const hasAccess = 
    user.role === UserRole.ADMIN ||
    user.role === UserRole.AUDITOR

  if (!hasAccess) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Integrations</h1>
          <p className="text-slate-600 dark:text-slate-400">Configure system-level integrations</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Lock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">Access Restricted</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Only Admin and Compliance roles can access integration configuration.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate overview metrics
  const allIntegrations = [
    ...erpIntegrations,
    ...qualityIntegrations,
    ...logisticsIntegrations,
    ...identityIntegrations,
    ...analyticsIntegrations,
  ]

  const connectedCount = allIntegrations.filter(i => 
    i.status === 'connected' || i.status === 'enabled'
  ).length
  const disabledCount = allIntegrations.filter(i => 
    i.status === 'disabled' || i.status === 'disconnected'
  ).length
  const erpCount = erpIntegrations.length
  const qualityCount = qualityIntegrations.length
  const logisticsCount = logisticsIntegrations.length
  const identityCount = identityIntegrations.length
  const analyticsCount = analyticsIntegrations.length

  const dataFlowTypes = new Set<string>()
  erpIntegrations.forEach(i => dataFlowTypes.add(i.syncDirection))
  qualityIntegrations.forEach(i => dataFlowTypes.add(i.direction))
  logisticsIntegrations.forEach(() => dataFlowTypes.add('inbound'))

  const getStatusBadge = (status: IntegrationStatus) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Connected</Badge>
      case 'disconnected':
        return <Badge variant="outline">Not Connected</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      case 'disabled':
        return <Badge variant="secondary">Disabled</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getSyncStatusIcon = (status: LastSyncStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-slate-400" />
    }
  }

  const getDirectionIcon = (direction: SyncDirection | 'inbound' | 'bidirectional') => {
    if (direction === 'inbound') {
      return <ArrowDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    } else if (direction === 'outbound') {
      return <ArrowUp className="h-4 w-4 text-green-600 dark:text-green-400" />
    } else {
      return <ArrowRightLeft className="h-4 w-4 text-purple-600 dark:text-purple-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Integrations</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Configure system-level integrations with ERP, quality, and logistics systems
        </p>
      </div>

      {/* 1. Integration Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Plug className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle>Integration Overview</CardTitle>
          </div>
          <CardDescription>
            High-level visibility into system connectivity and data flow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-8 gap-4">
            <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg p-4 border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Integrations</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{allIntegrations.length}</div>
            </div>
            <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg p-4 border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Connected</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{connectedCount}</div>
            </div>
            <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg p-4 border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Disabled</div>
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-400">{disabledCount}</div>
            </div>
            <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg p-4 border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">ERP Systems</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{erpCount}</div>
            </div>
            <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg p-4 border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Quality & Compliance</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{qualityCount}</div>
            </div>
            <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg p-4 border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Logistics & Cold Chain</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{logisticsCount}</div>
            </div>
            <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg p-4 border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Identity & Access</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{identityCount}</div>
            </div>
            <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg p-4 border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Data & Analytics</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{analyticsCount}</div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">Data Flow Types in Use</div>
            <div className="flex flex-wrap gap-2">
              {Array.from(dataFlowTypes).map(type => (
                <Badge key={type} variant="secondary" className="capitalize">
                  {type === 'inbound' ? 'Inbound' : type === 'outbound' ? 'Outbound' : 'Bidirectional'}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. ERP & Business Systems */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle>ERP & Business Systems</CardTitle>
          </div>
          <CardDescription>
            Connect with enterprise ERP and accounting systems. Inventory execution remains in this system. ERP cannot auto-release or auto-adjust inventory.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {erpIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {integration.name}
                    </h3>
                    {getStatusBadge(integration.status)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Data Scope</div>
                      <div className="flex flex-wrap gap-1">
                        {integration.dataScope.map((scope) => (
                          <Badge key={scope} variant="outline" className="text-xs">
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Sync Direction</div>
                      <div className="flex items-center space-x-2">
                        {getDirectionIcon(integration.syncDirection)}
                        <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                          {integration.syncDirection === 'bidirectional' ? 'Bidirectional' : 
                           integration.syncDirection === 'inbound' ? 'Read-only' : 'Write-back'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Sync Frequency</div>
                      <div className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                        {integration.syncFrequency === 'realtime' ? 'Real-time' : 
                         integration.syncFrequency === 'scheduled' ? 'Scheduled' : 'Manual'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Last Sync</div>
                      <div className="flex items-center space-x-2">
                        {getSyncStatusIcon(integration.lastSyncStatus)}
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {integration.lastSyncTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {integration.status === 'connected' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-800 dark:text-blue-200">
                    <strong>Compliance Note:</strong> Inventory execution remains in this system. ERP cannot auto-release batches or auto-adjust inventory. All errors are visible and not silently retried.
                  </p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 3. Quality & Compliance Systems */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FlaskConical className="h-5 w-5 text-red-600 dark:text-red-400" />
            <CardTitle>Quality & Compliance Systems</CardTitle>
          </div>
          <CardDescription>
            Integrate external quality systems while preserving batch release authority and audit integrity. External systems may provide data but may NOT auto-release batches.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {qualityIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {integration.name}
                    </h3>
                    {getStatusBadge(integration.status)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Data Scope</div>
                      <div className="flex flex-wrap gap-1">
                        {integration.dataScope.map((scope) => (
                          <Badge key={scope} variant="outline" className="text-xs">
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Direction</div>
                      <div className="flex items-center space-x-2">
                        {getDirectionIcon(integration.direction)}
                        <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                          {integration.direction === 'inbound' ? 'Inbound (default)' : 'Bidirectional'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Source Attribution</div>
                      <div className="flex items-center space-x-2">
                        {integration.sourceAttribution ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {integration.sourceAttribution ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Timestamp Integrity</div>
                      <div className="flex items-center space-x-2">
                        {integration.timestampIntegrity ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        )}
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {integration.timestampIntegrity ? 'Verified' : 'Not Verified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {integration.status === 'connected' && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-red-800 dark:text-red-200">
                    <strong>Compliance Note:</strong> External systems may provide quality data, but may NOT auto-release batches. All imported quality data must be traceable to source. Batch release authority remains in this system.
                  </p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 4. Logistics & Cold Chain */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Truck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <CardTitle>Logistics & Cold Chain</CardTitle>
          </div>
          <CardDescription>
            Ingest transport and environmental data without allowing external systems to directly alter batch states. Sensor data may trigger alerts but requires human approval for state changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {logisticsIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {integration.name}
                    </h3>
                    {getStatusBadge(integration.status)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Data Type</div>
                      <div className="flex items-center space-x-2">
                        {integration.dataType === 'temperature' && (
                          <Thermometer className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        )}
                        {integration.dataType === 'location' && (
                          <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        )}
                        {integration.dataType === 'shipment' && (
                          <Package className="h-4 w-4 text-green-600 dark:text-green-400" />
                        )}
                        <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                          {integration.dataType}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Device Mapping</div>
                      <div className="flex items-center space-x-2">
                        {integration.deviceMapping ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-slate-400" />
                        )}
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {integration.deviceMapping ? 'Mapped' : 'Not Mapped'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Data Freshness</div>
                      <div className="flex items-center space-x-2">
                        {integration.dataFreshness === 'current' && (
                          <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                        )}
                        {integration.dataFreshness === 'stale' && (
                          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        )}
                        {integration.dataFreshness === 'unknown' && (
                          <AlertCircle className="h-4 w-4 text-slate-400" />
                        )}
                        <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                          {integration.dataFreshness}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Alert Triggers</div>
                      <div className="flex items-center space-x-2">
                        {integration.alertTriggers ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-slate-400" />
                        )}
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {integration.alertTriggers ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {integration.status === 'connected' && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    <strong>Compliance Note:</strong> Sensor data is read-only and may trigger alerts. Sensor data may NOT auto-change batch status. Human approval is required for all state changes based on sensor data.
                  </p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 5. Identity & Access */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <CardTitle>Identity & Access</CardTitle>
          </div>
          <CardDescription>
            Enable enterprise authentication and identity federation without weakening system security. Identity integrations must align with System & Security settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {identityIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {integration.name}
                    </h3>
                    {integration.status === 'enabled' ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Enabled</Badge>
                    ) : (
                      <Badge variant="outline">Disabled</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">SSO Enabled</div>
                      <div className="flex items-center space-x-2">
                        {integration.ssoEnabled ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-slate-400" />
                        )}
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {integration.ssoEnabled ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">User Provisioning</div>
                      <div className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                        {integration.userProvisioning}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Role Mapping</div>
                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        {integration.roleMappingSummary}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Last Sync</div>
                      <div className="flex items-center space-x-2">
                        {getSyncStatusIcon(integration.lastSyncStatus)}
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {integration.lastSyncTime}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {integration.status === 'enabled' && (
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-md p-3 flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-purple-800 dark:text-purple-200">
                    <strong>Compliance Note:</strong> Identity integrations must align with System & Security settings. No per-user SSO configuration. Role escalation must remain internal. All identity changes are audit logged.
                  </p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 6. Data & Analytics */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <CardTitle>Data & Analytics</CardTitle>
          </div>
          <CardDescription>
            Allow controlled data consumption for analytics without exposing or mutating regulated data. Analytics integrations are read-only with no write-back to operational data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {analyticsIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {integration.name}
                    </h3>
                    {getStatusBadge(integration.status)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Data Scope</div>
                      <div className="flex flex-wrap gap-1">
                        {integration.dataScope.map((scope) => (
                          <Badge key={scope} variant="outline" className="text-xs">
                            {scope}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Access Type</div>
                      <div className="flex items-center space-x-2">
                        <ArrowDown className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {integration.accessType} (default)
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Export Mode</div>
                      <div className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                        {integration.exportMode === 'scheduled' ? 'Scheduled' : 'On-demand'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Last Export</div>
                      <div className="flex items-center space-x-2">
                        {getSyncStatusIcon(integration.lastExportStatus)}
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {integration.lastExportTime}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Mask Sensitive Fields</div>
                      <div className="flex items-center space-x-2">
                        {integration.maskSensitiveFields ? (
                          <EyeOff className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-400" />
                        )}
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {integration.maskSensitiveFields ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Approval Required</div>
                      <div className="flex items-center space-x-2">
                        {integration.approvalRequired ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-slate-400" />
                        )}
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {integration.approvalRequired ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {integration.status === 'connected' && (
                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-md p-3 flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-indigo-800 dark:text-indigo-200">
                    <strong>Compliance Note:</strong> Analytics integrations are read-only. No write-back to operational data. All exports must be traceable and auditable. Sensitive fields are masked by default.
                  </p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 7. Integration Governance */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <CardTitle>Integration Governance</CardTitle>
            <Badge variant="destructive" className="ml-2">Critical</Badge>
          </div>
          <CardDescription>
            System-level control, visibility, and safety over all integrations. All configuration changes are audit logged and may require approval.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Global Controls */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="h-4 w-4 text-slate-500" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Global Controls</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Approval Required for New Integration</Label>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked={true} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Required</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Approval Required for Data Scope Changes</Label>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked={true} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Required</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Approval Required for Direction Changes</Label>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked={true} />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Required</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Disable */}
          <div className="border-2 border-red-200 dark:border-red-800 rounded-lg p-4 space-y-4 bg-red-50/30 dark:bg-red-900/10">
            <div className="flex items-center space-x-2 mb-2">
              <Power className="h-4 w-4 text-red-600 dark:text-red-400" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Emergency Disable (Kill Switch)</h3>
              <Badge variant="destructive" className="text-xs">Admin Only</Badge>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Immediately disable all integrations in case of security incident or system compromise. This action is always available to Administrators and is fully audit logged.
            </p>
            <Button variant="destructive" disabled={!integrationGovernance.emergencyDisableAvailable}>
              <Power className="h-4 w-4 mr-2" />
              Emergency Disable All Integrations
            </Button>
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-md p-3 flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-700 dark:text-red-300 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-800 dark:text-red-200">
                <strong>Warning:</strong> Emergency disable will immediately stop all integration activity. This action cannot be undone automatically and requires manual re-enablement of each integration.
              </p>
            </div>
          </div>

          {/* Configuration History */}
          <div className="border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-4 space-y-4">
            <div className="flex items-center space-x-2 mb-3">
              <History className="h-4 w-4 text-slate-500" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Configuration History</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Last Configuration Change</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {integrationGovernance.lastConfigChange}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Changed By</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {integrationGovernance.changedBy} ({integrationGovernance.changedByRole})
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Impact Summary</div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {integrationGovernance.impactSummary}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Audit Logs</div>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  View Audit Logs
                </Button>
              </div>
            </div>
          </div>

          {/* Last Error */}
          {integrationGovernance.lastError && (
            <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 space-y-2 bg-red-50/30 dark:bg-red-900/10">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Last Error</h3>
              </div>
              <p className="text-sm text-red-800 dark:text-red-200">
                {integrationGovernance.lastError}
              </p>
            </div>
          )}

          {/* Governance Compliance Banner */}
          <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] border-2 border-slate-300 dark:border-slate-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Integration Governance Rules
                </h4>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                  <li>All integration configuration changes must be audit logged</li>
                  <li>Governance actions may require approval (configurable)</li>
                  <li>Emergency disable must always be available to Admin</li>
                  <li>All integration activity is traceable and reviewable</li>
                  <li>No integration can bypass system security or compliance controls</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Integration Compliance Banner */}
      <Card>
        <CardContent className="pt-6">
          <div className="bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] border-2 border-slate-300 dark:border-slate-700 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Global Integration Compliance Rules
                </h4>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                  <li>No integration can bypass approval workflows, inventory rules, or quality & safety gates</li>
                  <li>All integration activity must be audit logged and traceable</li>
                  <li>Inventory execution remains in this system - external systems cannot auto-release or auto-adjust</li>
                  <li>External quality systems may provide data but cannot auto-release batches</li>
                  <li>Sensor data may trigger alerts but requires human approval for state changes</li>
                  <li>All errors must be visible and not silently retried</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
