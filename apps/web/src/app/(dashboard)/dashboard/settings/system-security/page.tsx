'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Shield, 
  Lock, 
  Save, 
  RotateCcw,
  AlertTriangle,
  Info,
  Key,
  Network,
  Database,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Globe,
  Trash2,
  Plus
} from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { UserRole } from '@/types/auth'

// System security configuration state
interface SystemSecurityConfig {
  // Organization-Wide Security Policies
  securityPolicies: {
    passwordPolicy: {
      minLength: number
      requireUppercase: boolean
      requireLowercase: boolean
      requireNumbers: boolean
      requireSpecialChars: boolean
      expiryEnabled: boolean
      expiryDays: number
      historyCount: number
    }
    mfaEnforcement: {
      enforceForAll: boolean
      gracePeriodDays: number
    }
    sessionTimeout: {
      idleTimeout: number // minutes
      absoluteTimeout: number // minutes
    }
    accountLockout: {
      failedAttemptThreshold: number
      lockoutDuration: number // minutes
    }
  }
  
  // Authentication & Identity Infrastructure
  authentication: {
    oauthProviders: {
      azureAd: { enabled: boolean; configured: boolean }
      okta: { enabled: boolean; configured: boolean }
      googleWorkspace: { enabled: boolean; configured: boolean }
    }
    tokenLifetime: {
      accessTokenTTL: number // minutes
      refreshTokenTTL: number // days
    }
    ipRestrictions: {
      enabled: boolean
      allowedIPs: string[]
    }
  }
  
  // Network & Access Perimeter Controls
  networkControls: {
    ipAllowlist: string[]
    ipBlocklist: string[]
    vpnOnlyAccess: boolean
    geoRestriction: {
      enabled: boolean
      allowedCountries: string[]
    }
    officeNetworks: Array<{
      id: string
      name: string
      ipRange: string
      trusted: boolean
    }>
  }
  
  // Data Protection & Encryption
  dataProtection: {
    encryptionAtRest: {
      status: 'enabled' | 'disabled'
      algorithm: string
      keyRotationDays: number
    }
    encryptionInTransit: {
      status: 'enabled' | 'disabled'
      tlsVersion: string
    }
    backupEncryption: {
      enabled: boolean
      algorithm: string
    }
    secureFileAccess: {
      signedUrlsEnabled: boolean
      urlExpiryMinutes: number
    }
  }
  
  // Audit & Change Control
  auditControl: {
    auditLogging: {
      enabled: boolean
      categories: {
        authentication: boolean
        authorization: boolean
        dataAccess: boolean
        configuration: boolean
        systemEvents: boolean
      }
    }
    logRetentionDays: number
    requireApprovalFor: {
      securityChanges: boolean
      authPolicyChanges: boolean
    }
    timeSyncStatus: 'synced' | 'warning' | 'error'
  }
  
  // Incident & Risk Management
  incidentManagement: {
    emergencyLockdown: {
      enabled: boolean
      lockNonAdminUsers: boolean
      forceLogout: boolean
    }
    breachNotification: {
      enabled: boolean
      contacts: string[]
    }
    escalationContacts: Array<{
      id: string
      name: string
      email: string
      role: string
      priority: 'high' | 'medium' | 'low'
    }>
  }
  
  // Platform & Compliance Information (Read-only)
  complianceInfo: {
    standards: string[]
    dataResidency: string
    systemVersion: string
    buildIdentifier: string
    deploymentEnvironment: string
    lastSecurityReview: string
  }
}

const DEFAULT_CONFIG: SystemSecurityConfig = {
  securityPolicies: {
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expiryEnabled: true,
      expiryDays: 90,
      historyCount: 5,
    },
    mfaEnforcement: {
      enforceForAll: false,
      gracePeriodDays: 30,
    },
    sessionTimeout: {
      idleTimeout: 30,
      absoluteTimeout: 480, // 8 hours
    },
    accountLockout: {
      failedAttemptThreshold: 5,
      lockoutDuration: 15,
    },
  },
  authentication: {
    oauthProviders: {
      azureAd: { enabled: false, configured: false },
      okta: { enabled: false, configured: false },
      googleWorkspace: { enabled: false, configured: false },
    },
    tokenLifetime: {
      accessTokenTTL: 60, // 1 hour
      refreshTokenTTL: 30, // 30 days
    },
    ipRestrictions: {
      enabled: false,
      allowedIPs: [],
    },
  },
  networkControls: {
    ipAllowlist: [],
    ipBlocklist: [],
    vpnOnlyAccess: false,
    geoRestriction: {
      enabled: false,
      allowedCountries: [],
    },
    officeNetworks: [],
  },
  dataProtection: {
    encryptionAtRest: {
      status: 'enabled',
      algorithm: 'AES-256',
      keyRotationDays: 90,
    },
    encryptionInTransit: {
      status: 'enabled',
      tlsVersion: 'TLS 1.3',
    },
    backupEncryption: {
      enabled: true,
      algorithm: 'AES-256',
    },
    secureFileAccess: {
      signedUrlsEnabled: true,
      urlExpiryMinutes: 60,
    },
  },
  auditControl: {
    auditLogging: {
      enabled: true,
      categories: {
        authentication: true,
        authorization: true,
        dataAccess: true,
        configuration: true,
        systemEvents: true,
      },
    },
    logRetentionDays: 2555, // 7 years for pharma
    requireApprovalFor: {
      securityChanges: true,
      authPolicyChanges: true,
    },
    timeSyncStatus: 'synced',
  },
  incidentManagement: {
    emergencyLockdown: {
      enabled: false,
      lockNonAdminUsers: false,
      forceLogout: false,
    },
    breachNotification: {
      enabled: true,
      contacts: [],
    },
    escalationContacts: [],
  },
  complianceInfo: {
    standards: ['GxP', '21 CFR Part 11', 'GDPR', 'HIPAA'],
    dataResidency: 'US-East (Virginia)',
    systemVersion: '2.1.0',
    buildIdentifier: '2024.01.15-abc123',
    deploymentEnvironment: 'Production',
    lastSecurityReview: '2024-01-10',
  },
}

export default function SystemSecurityPage() {
  const { user, getPermissions } = useAuthStore()
  const permissions = getPermissions()
  const isAdmin = user?.role === UserRole.ADMIN || permissions?.canConfigureSystem

  const [config, setConfig] = useState<SystemSecurityConfig>(DEFAULT_CONFIG)
  const [hasChanges, setHasChanges] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null)
  const [newIP, setNewIP] = useState('')
  const [newContact, setNewContact] = useState({ name: '', email: '', role: '', priority: 'medium' as 'high' | 'medium' | 'low' })

  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Lock className="h-16 w-16 text-red-600 dark:text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Access Denied</h2>
              <p className="text-slate-600 dark:text-slate-400">
                System & Security settings can only be accessed by Administrators and IT personnel.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSave = () => {
    // TODO: Save to backend with audit logging
    console.log('Saving system security config:', config)
    setHasChanges(false)
    // Show success notification
  }

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG)
    setHasChanges(false)
  }

  const updateConfig = (path: string, value: any) => {
    const keys = path.split('.')
    setConfig(prev => {
      const newConfig = { ...prev }
      let current: any = newConfig
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]] = { ...current[keys[i]] }
      }
      current[keys[keys.length - 1]] = value
      return newConfig
    })
    setHasChanges(true)
  }

  const addIPToAllowlist = () => {
    if (newIP.trim()) {
      updateConfig('networkControls.ipAllowlist', [...config.networkControls.ipAllowlist, newIP.trim()])
      setNewIP('')
    }
  }

  const removeIPFromAllowlist = (ip: string) => {
    updateConfig('networkControls.ipAllowlist', config.networkControls.ipAllowlist.filter(i => i !== ip))
  }

  const addEscalationContact = () => {
    if (newContact.name && newContact.email) {
      updateConfig('incidentManagement.escalationContacts', [
        ...config.incidentManagement.escalationContacts,
        { ...newContact, id: Date.now().toString() }
      ])
      setNewContact({ name: '', email: '', role: '', priority: 'medium' })
    }
  }

  const removeEscalationContact = (id: string) => {
    updateConfig('incidentManagement.escalationContacts', 
      config.incidentManagement.escalationContacts.filter(c => c.id !== id))
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">System & Security</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Configure organization-wide security policies, encryption, and compliance controls
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} size="sm" disabled={!hasChanges}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} size="sm" disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
              System-Wide Configuration
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              Changes to these settings affect all users and are automatically audit logged. 
              Misconfiguration may impact system access or compliance status.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: ORGANIZATION-WIDE SECURITY POLICIES */}
      <Card className="border-2 dark:border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Organization-Wide Security Policies</CardTitle>
              <CardDescription className="mt-1">
                Enforce security rules across all users in the organization
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Password Policy */}
          <div className="space-y-4 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold dark:text-slate-200">Global Password Policy</Label>
              <Badge variant="outline" className="text-xs text-amber-700 dark:text-amber-400">
                Affects all users
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Minimum Length</Label>
                <Input
                  type="number"
                  value={config.securityPolicies.passwordPolicy.minLength}
                  onChange={(e) => updateConfig('securityPolicies.passwordPolicy.minLength', parseInt(e.target.value) || 8)}
                  min="8"
                  max="128"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Expiry Days</Label>
                <Input
                  type="number"
                  value={config.securityPolicies.passwordPolicy.expiryDays}
                  onChange={(e) => updateConfig('securityPolicies.passwordPolicy.expiryDays', parseInt(e.target.value) || 90)}
                  min="30"
                  max="365"
                  className="w-full"
                  disabled={!config.securityPolicies.passwordPolicy.expiryEnabled}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.securityPolicies.passwordPolicy.requireUppercase}
                  onCheckedChange={(checked) => updateConfig('securityPolicies.passwordPolicy.requireUppercase', checked)}
                />
                <Label className="text-sm">Require uppercase letters</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.securityPolicies.passwordPolicy.requireLowercase}
                  onCheckedChange={(checked) => updateConfig('securityPolicies.passwordPolicy.requireLowercase', checked)}
                />
                <Label className="text-sm">Require lowercase letters</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.securityPolicies.passwordPolicy.requireNumbers}
                  onCheckedChange={(checked) => updateConfig('securityPolicies.passwordPolicy.requireNumbers', checked)}
                />
                <Label className="text-sm">Require numbers</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.securityPolicies.passwordPolicy.requireSpecialChars}
                  onCheckedChange={(checked) => updateConfig('securityPolicies.passwordPolicy.requireSpecialChars', checked)}
                />
                <Label className="text-sm">Require special characters</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.securityPolicies.passwordPolicy.expiryEnabled}
                  onCheckedChange={(checked) => updateConfig('securityPolicies.passwordPolicy.expiryEnabled', checked)}
                />
                <Label className="text-sm">Enable password expiry</Label>
              </div>
            </div>
          </div>

          {/* MFA Enforcement */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold dark:text-slate-200">Multi-Factor Authentication</Label>
              <Badge variant="outline" className="text-xs text-amber-700 dark:text-amber-400">
                Affects all users
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Switch
                checked={config.securityPolicies.mfaEnforcement.enforceForAll}
                onCheckedChange={(checked) => updateConfig('securityPolicies.mfaEnforcement.enforceForAll', checked)}
              />
              <div className="flex-1">
                <Label className="text-sm font-normal cursor-pointer">Enforce MFA for all users</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  All users will be required to enable MFA within the grace period
                </p>
              </div>
            </div>
            {config.securityPolicies.mfaEnforcement.enforceForAll && (
              <div className="pl-8">
                <Label className="text-sm">Grace Period (days)</Label>
                <Input
                  type="number"
                  value={config.securityPolicies.mfaEnforcement.gracePeriodDays}
                  onChange={(e) => updateConfig('securityPolicies.mfaEnforcement.gracePeriodDays', parseInt(e.target.value) || 30)}
                  min="1"
                  max="90"
                  className="w-32 mt-1"
                />
              </div>
            )}
          </div>

          {/* Session Timeout */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold dark:text-slate-200">Session Timeout Configuration</Label>
              <Badge variant="outline" className="text-xs text-amber-700 dark:text-amber-400">
                Affects all users
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Idle Timeout (minutes)</Label>
                <Input
                  type="number"
                  value={config.securityPolicies.sessionTimeout.idleTimeout}
                  onChange={(e) => updateConfig('securityPolicies.sessionTimeout.idleTimeout', parseInt(e.target.value) || 30)}
                  min="5"
                  max="480"
                  className="w-full"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">User inactive time before auto-logout</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Absolute Timeout (minutes)</Label>
                <Input
                  type="number"
                  value={config.securityPolicies.sessionTimeout.absoluteTimeout}
                  onChange={(e) => updateConfig('securityPolicies.sessionTimeout.absoluteTimeout', parseInt(e.target.value) || 480)}
                  min="60"
                  max="1440"
                  className="w-full"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">Maximum session duration regardless of activity</p>
              </div>
            </div>
          </div>

          {/* Account Lockout */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <Label className="text-base font-semibold dark:text-slate-200">Account Lockout Rules</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Failed Login Threshold</Label>
                <Input
                  type="number"
                  value={config.securityPolicies.accountLockout.failedAttemptThreshold}
                  onChange={(e) => updateConfig('securityPolicies.accountLockout.failedAttemptThreshold', parseInt(e.target.value) || 5)}
                  min="3"
                  max="10"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Lockout Duration (minutes)</Label>
                <Input
                  type="number"
                  value={config.securityPolicies.accountLockout.lockoutDuration}
                  onChange={(e) => updateConfig('securityPolicies.accountLockout.lockoutDuration', parseInt(e.target.value) || 15)}
                  min="5"
                  max="1440"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: AUTHENTICATION & IDENTITY INFRASTRUCTURE */}
      <Card className="border-2 dark:border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Key className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Authentication & Identity Infrastructure</CardTitle>
              <CardDescription className="mt-1">
                Configure OAuth/SSO providers and token management
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* OAuth Providers */}
          <div className="space-y-4">
            <Label className="text-base font-semibold dark:text-slate-200">OAuth / SSO Providers</Label>
            <div className="space-y-3">
              {[
                { key: 'azureAd', name: 'Azure Active Directory', icon: '🔷' },
                { key: 'okta', name: 'Okta', icon: '🔶' },
                { key: 'googleWorkspace', name: 'Google Workspace', icon: '🔵' },
              ].map(provider => {
                const providerConfig = config.authentication.oauthProviders[provider.key as keyof typeof config.authentication.oauthProviders]
                return (
                  <div key={provider.key} className="p-4 border dark:border-slate-700 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{provider.icon}</span>
                        <div>
                          <Label className="text-sm font-medium">{provider.name}</Label>
                          <Badge variant={providerConfig.configured ? 'default' : 'outline'} className="ml-2 text-xs">
                            {providerConfig.configured ? 'Configured' : 'Not Configured'}
                          </Badge>
                        </div>
                      </div>
                      <Switch
                        checked={providerConfig.enabled}
                        onCheckedChange={(checked) => {
                          updateConfig(`authentication.oauthProviders.${provider.key}.enabled`, checked)
                        }}
                        disabled={!providerConfig.configured}
                      />
                    </div>
                    {!providerConfig.configured && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 ml-11">
                        Configure in Settings → Integrations
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Token Lifetime */}
          <div className="space-y-4 p-4 border dark:border-slate-700 rounded-lg">
            <Label className="text-base font-semibold dark:text-slate-200">Token Lifetime Configuration</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Access Token TTL (minutes)</Label>
                <Input
                  type="number"
                  value={config.authentication.tokenLifetime.accessTokenTTL}
                  onChange={(e) => updateConfig('authentication.tokenLifetime.accessTokenTTL', parseInt(e.target.value) || 60)}
                  min="15"
                  max="480"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Refresh Token TTL (days)</Label>
                <Input
                  type="number"
                  value={config.authentication.tokenLifetime.refreshTokenTTL}
                  onChange={(e) => updateConfig('authentication.tokenLifetime.refreshTokenTTL', parseInt(e.target.value) || 30)}
                  min="1"
                  max="90"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* IP Restrictions */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center gap-4">
              <Switch
                checked={config.authentication.ipRestrictions.enabled}
                onCheckedChange={(checked) => updateConfig('authentication.ipRestrictions.enabled', checked)}
              />
              <Label className="text-sm font-semibold dark:text-slate-200">Enable IP-based Login Restrictions</Label>
            </div>
            {config.authentication.ipRestrictions.enabled && (
              <div className="pl-8 space-y-2">
                <Label className="text-sm">Allowed IP Addresses (one per line)</Label>
                <Textarea
                  value={config.authentication.ipRestrictions.allowedIPs.join('\n')}
                  onChange={(e) => updateConfig('authentication.ipRestrictions.allowedIPs', e.target.value.split('\n').filter(ip => ip.trim()))}
                  placeholder="192.168.1.1&#10;10.0.0.0/8"
                  className="font-mono text-sm"
                  rows={4}
                />
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  ⚠️ Misconfiguration may lock users out. Test with a backup admin account.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: NETWORK & ACCESS PERIMETER CONTROLS */}
      <Card className="border-2 dark:border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Network className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Network & Access Perimeter Controls</CardTitle>
              <CardDescription className="mt-1">
                Control where the system can be accessed from
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* IP Allowlist */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <Label className="text-base font-semibold dark:text-slate-200">IP Allowlist</Label>
            <div className="flex gap-2">
              <Input
                value={newIP}
                onChange={(e) => setNewIP(e.target.value)}
                placeholder="192.168.1.1 or 10.0.0.0/8"
                className="flex-1 font-mono text-sm"
                onKeyPress={(e) => e.key === 'Enter' && addIPToAllowlist()}
              />
              <Button onClick={addIPToAllowlist} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            {config.networkControls.ipAllowlist.length > 0 && (
              <div className="space-y-1 mt-2">
                {config.networkControls.ipAllowlist.map((ip, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                    <code className="text-sm font-mono">{ip}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeIPFromAllowlist(ip)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-amber-600 dark:text-amber-400">
              ⚠️ Only listed IPs will be able to access the system. Ensure admin access is included.
            </p>
          </div>

          {/* VPN Only Access */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center gap-4">
              <Switch
                checked={config.networkControls.vpnOnlyAccess}
                onCheckedChange={(checked) => updateConfig('networkControls.vpnOnlyAccess', checked)}
              />
              <div className="flex-1">
                <Label className="text-sm font-semibold dark:text-slate-200 cursor-pointer">VPN-Only Access</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Require VPN connection for all system access
                </p>
              </div>
            </div>
            {config.networkControls.vpnOnlyAccess && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded p-3">
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  ⚠️ All users must connect via VPN. Ensure VPN infrastructure is properly configured.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SECTION 4: DATA PROTECTION & ENCRYPTION */}
      <Card className="border-2 dark:border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Database className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Data Protection & Encryption</CardTitle>
              <CardDescription className="mt-1">
                System-level data protection guarantees and encryption status
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Encryption at Rest */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold dark:text-slate-200">Encryption at Rest</Label>
              <Badge variant={config.dataProtection.encryptionAtRest.status === 'enabled' ? 'default' : 'destructive'}>
                {config.dataProtection.encryptionAtRest.status === 'enabled' ? (
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                ) : (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                {config.dataProtection.encryptionAtRest.status.toUpperCase()}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Algorithm</Label>
                <Input
                  value={config.dataProtection.encryptionAtRest.algorithm}
                  readOnly
                  className="bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Key Rotation (days)</Label>
                <Input
                  type="number"
                  value={config.dataProtection.encryptionAtRest.keyRotationDays}
                  onChange={(e) => updateConfig('dataProtection.encryptionAtRest.keyRotationDays', parseInt(e.target.value) || 90)}
                  min="30"
                  max="365"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Encryption in Transit */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold dark:text-slate-200">Encryption in Transit</Label>
              <Badge variant={config.dataProtection.encryptionInTransit.status === 'enabled' ? 'default' : 'destructive'}>
                {config.dataProtection.encryptionInTransit.status === 'enabled' ? (
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                ) : (
                  <XCircle className="h-3 w-3 mr-1" />
                )}
                {config.dataProtection.encryptionInTransit.status.toUpperCase()}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">TLS Version</Label>
              <Input
                value={config.dataProtection.encryptionInTransit.tlsVersion}
                readOnly
                className="bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Backup Encryption */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center gap-4">
              <Switch
                checked={config.dataProtection.backupEncryption.enabled}
                onCheckedChange={(checked) => updateConfig('dataProtection.backupEncryption.enabled', checked)}
              />
              <div className="flex-1">
                <Label className="text-sm font-semibold dark:text-slate-200 cursor-pointer">Backup Encryption</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  All backups are encrypted using {config.dataProtection.backupEncryption.algorithm}
                </p>
              </div>
            </div>
          </div>

          {/* Secure File Access */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center gap-4">
              <Switch
                checked={config.dataProtection.secureFileAccess.signedUrlsEnabled}
                onCheckedChange={(checked) => updateConfig('dataProtection.secureFileAccess.signedUrlsEnabled', checked)}
              />
              <div className="flex-1">
                <Label className="text-sm font-semibold dark:text-slate-200 cursor-pointer">Signed URL Access</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Files are accessed via time-limited signed URLs
                </p>
              </div>
            </div>
            {config.dataProtection.secureFileAccess.signedUrlsEnabled && (
              <div className="pl-8">
                <Label className="text-sm">URL Expiry (minutes)</Label>
                <Input
                  type="number"
                  value={config.dataProtection.secureFileAccess.urlExpiryMinutes}
                  onChange={(e) => updateConfig('dataProtection.secureFileAccess.urlExpiryMinutes', parseInt(e.target.value) || 60)}
                  min="5"
                  max="1440"
                  className="w-32 mt-1"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SECTION 5: AUDIT & CHANGE CONTROL */}
      <Card className="border-2 dark:border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Audit & Change Control</CardTitle>
              <CardDescription className="mt-1">
                Ensure traceability and compliance with audit logging
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Audit Logging */}
          <div className="space-y-4 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold dark:text-slate-200">Audit Logging</Label>
              <Badge variant="outline" className="text-xs">
                All changes are recorded
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Switch
                checked={config.auditControl.auditLogging.enabled}
                onCheckedChange={(checked) => updateConfig('auditControl.auditLogging.enabled', checked)}
              />
              <Label className="text-sm font-normal cursor-pointer">Enable comprehensive audit logging</Label>
            </div>
            {config.auditControl.auditLogging.enabled && (
              <div className="pl-8 space-y-2">
                <Label className="text-sm">Logging Categories</Label>
                {Object.entries(config.auditControl.auditLogging.categories).map(([category, enabled]) => (
                  <div key={category} className="flex items-center gap-2">
                    <Switch
                      checked={enabled}
                      onCheckedChange={(checked) => 
                        updateConfig(`auditControl.auditLogging.categories.${category}`, checked)
                      }
                    />
                    <Label className="text-sm font-normal cursor-pointer capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Log Retention */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <Label className="text-base font-semibold dark:text-slate-200">Audit Log Retention</Label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={config.auditControl.logRetentionDays}
                onChange={(e) => updateConfig('auditControl.logRetentionDays', parseInt(e.target.value) || 2555)}
                min="365"
                max="3650"
                className="w-32"
              />
              <Label className="text-sm font-normal">days</Label>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Minimum: 7 years (2555 days) for pharma compliance. Current: {Math.floor(config.auditControl.logRetentionDays / 365)} years.
            </p>
          </div>

          {/* Approval Requirements */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <Label className="text-base font-semibold dark:text-slate-200">Mandatory Approval for Changes</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.auditControl.requireApprovalFor.securityChanges}
                  onCheckedChange={(checked) => updateConfig('auditControl.requireApprovalFor.securityChanges', checked)}
                />
                <Label className="text-sm font-normal cursor-pointer">Security setting changes</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={config.auditControl.requireApprovalFor.authPolicyChanges}
                  onCheckedChange={(checked) => updateConfig('auditControl.requireApprovalFor.authPolicyChanges', checked)}
                />
                <Label className="text-sm font-normal cursor-pointer">Authentication policy changes</Label>
              </div>
            </div>
          </div>

          {/* Time Sync Status */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <Label className="text-base font-semibold dark:text-slate-200">System Time Synchronization</Label>
            <div className="flex items-center gap-3">
              {config.auditControl.timeSyncStatus === 'synced' ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : config.auditControl.timeSyncStatus === 'warning' ? (
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
              <div>
                <p className="text-sm font-medium">
                  Status: <span className="capitalize">{config.auditControl.timeSyncStatus}</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Accurate timestamps are critical for audit trail integrity (21 CFR Part 11)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 6: INCIDENT & RISK MANAGEMENT */}
      <Card className="border-2 dark:border-slate-700 border-red-200 dark:border-red-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Incident & Risk Management</CardTitle>
              <CardDescription className="mt-1">
                Emergency controls and security incident response
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Emergency Lockdown */}
          <div className="space-y-4 p-4 border-2 border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/10">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <Label className="text-base font-semibold text-red-900 dark:text-red-200">Emergency Lockdown Mode</Label>
            </div>
            <div className="flex items-center gap-4">
              <Switch
                checked={config.incidentManagement.emergencyLockdown.enabled}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setShowConfirmDialog('lockdown')
                  } else {
                    updateConfig('incidentManagement.emergencyLockdown.enabled', false)
                  }
                }}
              />
              <div className="flex-1">
                <Label className="text-sm font-semibold text-red-900 dark:text-red-200 cursor-pointer">
                  Enable Emergency Lockdown
                </Label>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                  ⚠️ DANGER ZONE: This will lock non-admin users and may force logout. Use only in security emergencies.
                </p>
              </div>
            </div>
            {config.incidentManagement.emergencyLockdown.enabled && (
              <div className="pl-8 space-y-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={config.incidentManagement.emergencyLockdown.lockNonAdminUsers}
                    onCheckedChange={(checked) => updateConfig('incidentManagement.emergencyLockdown.lockNonAdminUsers', checked)}
                  />
                  <Label className="text-sm font-normal cursor-pointer">Lock non-admin users</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={config.incidentManagement.emergencyLockdown.forceLogout}
                    onCheckedChange={(checked) => updateConfig('incidentManagement.emergencyLockdown.forceLogout', checked)}
                  />
                  <Label className="text-sm font-normal cursor-pointer">Force logout all users</Label>
                </div>
              </div>
            )}
          </div>

          {/* Breach Notification */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <div className="flex items-center gap-4">
              <Switch
                checked={config.incidentManagement.breachNotification.enabled}
                onCheckedChange={(checked) => updateConfig('incidentManagement.breachNotification.enabled', checked)}
              />
              <Label className="text-sm font-semibold dark:text-slate-200 cursor-pointer">Breach Notification</Label>
            </div>
            {config.incidentManagement.breachNotification.enabled && (
              <div className="pl-8">
                <Label className="text-sm">Notification Contacts (emails, one per line)</Label>
                <Textarea
                  value={config.incidentManagement.breachNotification.contacts.join('\n')}
                  onChange={(e) => updateConfig('incidentManagement.breachNotification.contacts', e.target.value.split('\n').filter(email => email.trim()))}
                  placeholder="security@company.com&#10;compliance@company.com"
                  rows={3}
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {/* Escalation Contacts */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <Label className="text-base font-semibold dark:text-slate-200">Security Escalation Contacts</Label>
            <div className="space-y-3">
              {config.incidentManagement.escalationContacts.map(contact => (
                <div key={contact.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded">
                  <div>
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{contact.email} • {contact.role}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{contact.priority}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEscalationContact(contact.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Input
                  placeholder="Name"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                />
                <Input
                  placeholder="Role"
                  value={newContact.role}
                  onChange={(e) => setNewContact({ ...newContact, role: e.target.value })}
                />
                <div className="flex gap-2">
                  <Select
                    value={newContact.priority}
                    onValueChange={(value: 'high' | 'medium' | 'low') => setNewContact({ ...newContact, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addEscalationContact} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 7: PLATFORM & COMPLIANCE INFORMATION (Read-only) */}
      <Card className="border-2 dark:border-slate-700">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <Globe className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Platform & Compliance Information</CardTitle>
              <CardDescription className="mt-1">
                System information for auditors and enterprise customers (Read-only)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Compliance Standards */}
          <div className="space-y-3 p-4 border dark:border-slate-700 rounded-lg">
            <Label className="text-base font-semibold dark:text-slate-200">Supported Compliance Standards</Label>
            <div className="flex flex-wrap gap-2">
              {config.complianceInfo.standards.map(standard => (
                <Badge key={standard} variant="default" className="text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {standard}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              System is designed to support these compliance frameworks. Actual compliance depends on configuration and usage.
            </p>
          </div>

          {/* System Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 p-4 border dark:border-slate-700 rounded-lg">
              <Label className="text-sm font-semibold dark:text-slate-200">Data Residency</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">{config.complianceInfo.dataResidency}</p>
            </div>
            <div className="space-y-2 p-4 border dark:border-slate-700 rounded-lg">
              <Label className="text-sm font-semibold dark:text-slate-200">System Version</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">{config.complianceInfo.systemVersion}</p>
            </div>
            <div className="space-y-2 p-4 border dark:border-slate-700 rounded-lg">
              <Label className="text-sm font-semibold dark:text-slate-200">Build Identifier</Label>
              <p className="text-sm font-mono text-slate-600 dark:text-slate-400">{config.complianceInfo.buildIdentifier}</p>
            </div>
            <div className="space-y-2 p-4 border dark:border-slate-700 rounded-lg">
              <Label className="text-sm font-semibold dark:text-slate-200">Deployment Environment</Label>
              <Badge variant="outline">{config.complianceInfo.deploymentEnvironment}</Badge>
            </div>
            <div className="space-y-2 p-4 border dark:border-slate-700 rounded-lg">
              <Label className="text-sm font-semibold dark:text-slate-200">Last Security Review</Label>
              <p className="text-sm text-slate-600 dark:text-slate-400">{config.complianceInfo.lastSecurityReview}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog Placeholder */}
      {showConfirmDialog === 'lockdown' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Confirm Emergency Lockdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Enabling emergency lockdown will:
              </p>
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                <li>Lock all non-admin users</li>
                <li>Force logout all users (if enabled)</li>
                <li>Require manual unlock by administrator</li>
              </ul>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                ⚠️ This action is logged and cannot be easily reversed.
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowConfirmDialog(null)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    updateConfig('incidentManagement.emergencyLockdown.enabled', true)
                    setShowConfirmDialog(null)
                  }}
                >
                  Enable Lockdown
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
