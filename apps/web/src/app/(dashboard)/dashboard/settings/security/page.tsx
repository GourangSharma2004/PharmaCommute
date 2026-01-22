'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Shield, 
  Lock, 
  Smartphone, 
  Monitor,
  AlertCircle,
  CheckCircle2,
  Eye,
  MapPin,
  Clock,
  Info,
  ExternalLink
} from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import Link from 'next/link'

// Mock data for trusted devices
interface TrustedDevice {
  id: string
  deviceName: string
  browser: string
  addedOn: string
  lastUsed: string
  location: string
}

export default function UserSecurityControlsPage() {
  const { user } = useAuthStore()
  
  // Organization policies (READ-ONLY from backend)
  const orgSecurityPolicies = {
    passwordPolicy: {
      minLength: 12,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expiryDays: 90,
      historyCount: 5
    },
    mfaEnforcement: {
      mandatory: false,
      allowedMethods: ['Authenticator App', 'Email OTP']
    },
    sessionTimeout: 30,
    accountLockout: {
      failedAttempts: 5,
      lockoutDuration: 15
    }
  }
  
  // Mock trusted devices
  const trustedDevices: TrustedDevice[] = [
    {
      id: '1',
      deviceName: 'MacBook Pro',
      browser: 'Chrome 120',
      addedOn: '2024-01-01',
      lastUsed: '2 minutes ago',
      location: 'Mumbai, India'
    },
    {
      id: '2',
      deviceName: 'iPhone 14',
      browser: 'Safari Mobile',
      addedOn: '2024-01-05',
      lastUsed: '1 hour ago',
      location: 'Mumbai, India'
    },
    {
      id: '3',
      deviceName: 'Windows Desktop',
      browser: 'Edge 119',
      addedOn: '2024-01-10',
      lastUsed: '2 days ago',
      location: 'Delhi, India'
    }
  ]
  
  // Mock security alerts
  const securityAlerts = [
    {
      id: '1',
      type: 'success',
      message: 'Login successful from new location',
      timestamp: '2024-01-15 09:30 AM',
      location: 'Mumbai, India'
    },
    {
      id: '2',
      type: 'warning',
      message: 'Failed login attempt detected',
      timestamp: '2024-01-14 08:15 PM',
      location: 'Unknown'
    }
  ]

  if (!user) return null

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">User Security Controls</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          View how your account is protected under organization security policies
        </p>
      </div>

      {/* Helper Banner */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          To change your password, enable MFA, or manage active sessions, visit <Link href="/dashboard/settings/profile" className="underline font-medium">My Profile</Link> settings.
        </AlertDescription>
      </Alert>

      {/* Organization Security Policies (READ-ONLY) */}
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <CardTitle>Organization Security Policies</CardTitle>
              <CardDescription>
                Security requirements enforced for all users in your organization
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <Label className="text-sm font-medium">Password Requirements</Label>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <div>• Minimum {orgSecurityPolicies.passwordPolicy.minLength} characters</div>
                  {orgSecurityPolicies.passwordPolicy.requireUppercase && <div>• Uppercase letters required</div>}
                  {orgSecurityPolicies.passwordPolicy.requireLowercase && <div>• Lowercase letters required</div>}
                  {orgSecurityPolicies.passwordPolicy.requireNumbers && <div>• Numbers required</div>}
                  {orgSecurityPolicies.passwordPolicy.requireSpecialChars && <div>• Special characters required</div>}
                  <div>• Expires every {orgSecurityPolicies.passwordPolicy.expiryDays} days</div>
                  <div>• Cannot reuse last {orgSecurityPolicies.passwordPolicy.historyCount} passwords</div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Smartphone className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <Label className="text-sm font-medium">Multi-Factor Authentication</Label>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <div>Status: {orgSecurityPolicies.mfaEnforcement.mandatory ? (
                    <Badge variant="destructive" className="ml-1">Mandatory</Badge>
                  ) : (
                    <Badge variant="secondary" className="ml-1">Optional</Badge>
                  )}</div>
                  <div>Allowed methods: {orgSecurityPolicies.mfaEnforcement.allowedMethods.join(', ')}</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <Label className="text-sm font-medium">Session Management</Label>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <div>Session timeout: {orgSecurityPolicies.sessionTimeout} minutes of inactivity</div>
                  <div>Auto-logout: Enabled</div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  <Label className="text-sm font-medium">Account Protection</Label>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <div>Failed login limit: {orgSecurityPolicies.accountLockout.failedAttempts} attempts</div>
                  <div>Lockout duration: {orgSecurityPolicies.accountLockout.lockoutDuration} minutes</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trusted Devices (Read-Only Visibility) */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Monitor className="h-5 w-5 text-purple-600" />
            <div>
              <CardTitle>Trusted Devices</CardTitle>
              <CardDescription>
                Devices that have been used to access your account
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device & Browser</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>First Used</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trustedDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Monitor className="h-4 w-4 text-slate-400" />
                      <div>
                        <div className="font-medium">{device.deviceName}</div>
                        <div className="text-xs text-slate-500">{device.browser}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span className="text-sm">{device.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{device.addedOn}</TableCell>
                  <TableCell className="text-sm">{device.lastUsed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Security Alerts (Awareness) */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription>
                Recent security events related to your account
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  alert.type === 'success' 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {alert.type === 'success' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      alert.type === 'success' 
                        ? 'text-green-900 dark:text-green-200'
                        : 'text-yellow-900 dark:text-yellow-200'
                    }`}>
                      {alert.message}
                    </p>
                    <p className={`text-xs mt-1 ${
                      alert.type === 'success' 
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-yellow-700 dark:text-yellow-300'
                    }`}>
                      {alert.timestamp} • {alert.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Awareness & Best Practices */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Eye className="h-5 w-5 text-cyan-600" />
            <div>
              <CardTitle>Security Awareness</CardTitle>
              <CardDescription>
                Best practices to keep your account secure
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    Use a strong, unique password
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Your password should be at least {orgSecurityPolicies.passwordPolicy.minLength} characters and include uppercase, lowercase, numbers, and special characters.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    Enable Multi-Factor Authentication
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Add an extra layer of security to your account. Visit <Link href="/dashboard/settings/profile" className="underline">My Profile</Link> to enable MFA.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    Review your active sessions regularly
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Check your <Link href="/dashboard/settings/profile" className="underline">My Profile</Link> page to see active sessions and logout from unfamiliar devices.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                    Monitor security alerts
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Review security alerts below for any suspicious activity on your account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Security Status Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <div>
              <CardTitle>Account Security Status</CardTitle>
              <CardDescription>
                Overview of your account's security posture
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <Label className="text-sm">Password Complexity</Label>
              </div>
              <Badge variant="default" className="bg-green-600">Met</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                <Label className="text-sm">MFA Enabled</Label>
              </div>
              <Badge variant="secondary">Not Enabled</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <Label className="text-sm">No Failed Logins</Label>
              </div>
              <Badge variant="default" className="bg-green-600">Secure</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <Label className="text-sm">Trusted Devices</Label>
              </div>
              <Badge variant="outline">{trustedDevices.length} Devices</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-indigo-600" />
            <div>
              <CardTitle>Quick Security Actions</CardTitle>
              <CardDescription>
                Common security tasks for your account
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/dashboard/settings/profile">
              <div className="p-4 border rounded-lg dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Lock className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Change Password
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Update your account password
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/settings/profile">
              <div className="p-4 border rounded-lg dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Enable MFA
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Add two-factor authentication
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/settings/profile">
              <div className="p-4 border rounded-lg dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Monitor className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        Manage Sessions
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        View and logout active sessions
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </Link>
            
            <Link href="/dashboard/audit">
              <div className="p-4 border rounded-lg dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Eye className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        View Activity Log
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        See your personal audit trail
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
