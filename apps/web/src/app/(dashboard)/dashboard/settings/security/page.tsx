'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { 
  Shield, 
  Lock, 
  Clock, 
  AlertTriangle, 
  Smartphone, 
  Eye,
  FileText,
  CheckCircle,
  Save,
  ExternalLink
} from 'lucide-react'

export default function SecurityPage() {
  // Password Policy State
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryEnabled: false,
    expiryDays: 90,
    historyCount: 5,
  })

  // Session & Authentication State
  const [sessionControls, setSessionControls] = useState({
    sessionTimeout: 30,
    autoLogout: true,
    maxConcurrentSessions: 3,
    forceLogoutOnPasswordChange: true,
    rememberMeDuration: 30,
  })

  // Login Protection State
  const [loginProtection, setLoginProtection] = useState({
    failedAttemptLimit: 5,
    accountLockout: true,
    lockoutDuration: 15,
    captchaAfterAttempts: 3,
    captchaEnabled: false,
    ipTracking: true,
  })

  // MFA State
  const [mfaSettings, setMfaSettings] = useState({
    requiredFor: 'admin', // 'admin' | 'qa' | 'all' | 'none'
    authenticatorApp: true,
    emailOTP: true,
    gracePeriod: 7,
  })

  // Device & Access Control State
  const [deviceControl, setDeviceControl] = useState({
    allowedDevices: 'any', // 'any' | 'approved'
    deviceRegistrationRequired: false,
    newDeviceVerification: true,
    ipAllowlist: '',
    ipBlocklist: '',
  })

  const handleSave = () => {
    // Mock save handler
    console.log('Saving security settings:', {
      passwordPolicy,
      sessionControls,
      loginProtection,
      mfaSettings,
      deviceControl,
    })
    alert('Security settings saved successfully! (Mock)')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Security</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Configure global security policies and controls for your organization</p>
        </div>
        <Button onClick={handleSave} size="sm">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* SECTION 1: PASSWORD POLICY */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Password Policy</CardTitle>
              <CardDescription className="mt-1">
                Define password requirements that apply to all users
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-semibold dark:text-slate-200">Minimum Password Length</Label>
            <Input
              type="number"
              min="6"
              max="32"
              value={passwordPolicy.minLength}
              onChange={(e) => setPasswordPolicy({ ...passwordPolicy, minLength: parseInt(e.target.value) || 8 })}
              className="w-32"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">Minimum number of characters required (6-32)</p>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold dark:text-slate-200">Password Requirements</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
                <div className="space-y-0.5 flex-1">
                  <Label className="text-sm font-medium dark:text-slate-200">Require Uppercase Letters</Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">At least one uppercase letter (A-Z)</p>
                </div>
                <Button
                  variant={passwordPolicy.requireUppercase ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPasswordPolicy({ ...passwordPolicy, requireUppercase: !passwordPolicy.requireUppercase })}
                  className="ml-4"
                >
                  {passwordPolicy.requireUppercase ? 'On' : 'Off'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
                <div className="space-y-0.5 flex-1">
                  <Label className="text-sm font-medium dark:text-slate-200">Require Lowercase Letters</Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">At least one lowercase letter (a-z)</p>
                </div>
                <Button
                  variant={passwordPolicy.requireLowercase ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPasswordPolicy({ ...passwordPolicy, requireLowercase: !passwordPolicy.requireLowercase })}
                  className="ml-4"
                >
                  {passwordPolicy.requireLowercase ? 'On' : 'Off'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
                <div className="space-y-0.5 flex-1">
                  <Label className="text-sm font-medium dark:text-slate-200">Require Numbers</Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">At least one number (0-9)</p>
                </div>
                <Button
                  variant={passwordPolicy.requireNumbers ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPasswordPolicy({ ...passwordPolicy, requireNumbers: !passwordPolicy.requireNumbers })}
                  className="ml-4"
                >
                  {passwordPolicy.requireNumbers ? 'On' : 'Off'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
                <div className="space-y-0.5 flex-1">
                  <Label className="text-sm font-medium dark:text-slate-200">Require Special Characters</Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">At least one special character (!@#$%^&*)</p>
                </div>
                <Button
                  variant={passwordPolicy.requireSpecialChars ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPasswordPolicy({ ...passwordPolicy, requireSpecialChars: !passwordPolicy.requireSpecialChars })}
                  className="ml-4"
                >
                  {passwordPolicy.requireSpecialChars ? 'On' : 'Off'}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <Label className="text-base font-semibold dark:text-slate-200">Password Expiry</Label>
              <Select 
                value={passwordPolicy.expiryEnabled ? 'enabled' : 'never'}
                onValueChange={(value) => setPasswordPolicy({ ...passwordPolicy, expiryEnabled: value === 'enabled' })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="enabled">Every N days</SelectItem>
                </SelectContent>
              </Select>
              {passwordPolicy.expiryEnabled && (
                <div className="mt-2">
                  <Input
                    type="number"
                    min="30"
                    max="365"
                    value={passwordPolicy.expiryDays}
                    onChange={(e) => setPasswordPolicy({ ...passwordPolicy, expiryDays: parseInt(e.target.value) || 90 })}
                    className="w-full"
                    placeholder="Days"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold dark:text-slate-200">Password History</Label>
              <Input
                type="number"
                min="0"
                max="12"
                value={passwordPolicy.historyCount}
                onChange={(e) => setPasswordPolicy({ ...passwordPolicy, historyCount: parseInt(e.target.value) || 0 })}
                className="w-full"
                placeholder="Number of previous passwords"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">Prevent reuse of last N passwords</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: SESSION & AUTHENTICATION CONTROLS */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Session & Authentication Controls</CardTitle>
              <CardDescription className="mt-1">
                Configure session timeouts and authentication behavior
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-base font-semibold dark:text-slate-200">Session Timeout (minutes)</Label>
              <Input
                type="number"
                min="5"
                max="480"
                value={sessionControls.sessionTimeout}
                onChange={(e) => setSessionControls({ ...sessionControls, sessionTimeout: parseInt(e.target.value) || 30 })}
                className="w-full"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">Idle time before session expires</p>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold dark:text-slate-200">Maximum Concurrent Sessions</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={sessionControls.maxConcurrentSessions}
                onChange={(e) => setSessionControls({ ...sessionControls, maxConcurrentSessions: parseInt(e.target.value) || 1 })}
                className="w-full"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">Per user limit</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium dark:text-slate-200">Auto Logout on Inactivity</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Automatically log out users after session timeout</p>
              </div>
              <Button
                variant={sessionControls.autoLogout ? "default" : "outline"}
                size="sm"
                onClick={() => setSessionControls({ ...sessionControls, autoLogout: !sessionControls.autoLogout })}
                className="ml-4"
              >
                {sessionControls.autoLogout ? 'On' : 'Off'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium dark:text-slate-200">Force Logout on Password Change</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Logout user from all devices when password is changed</p>
              </div>
              <Button
                variant={sessionControls.forceLogoutOnPasswordChange ? "default" : "outline"}
                size="sm"
                onClick={() => setSessionControls({ ...sessionControls, forceLogoutOnPasswordChange: !sessionControls.forceLogoutOnPasswordChange })}
                className="ml-4"
              >
                {sessionControls.forceLogoutOnPasswordChange ? 'On' : 'Off'}
              </Button>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label className="text-base font-semibold dark:text-slate-200">Remember-Me Duration (days)</Label>
            <Input
              type="number"
              min="1"
              max="90"
              value={sessionControls.rememberMeDuration}
              onChange={(e) => setSessionControls({ ...sessionControls, rememberMeDuration: parseInt(e.target.value) || 30 })}
              className="w-32"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">If "Remember Me" is enabled</p>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: LOGIN PROTECTION & ABUSE PREVENTION */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Login Protection & Abuse Prevention</CardTitle>
              <CardDescription className="mt-1">
                Protect against brute force attacks and unauthorized access attempts
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-base font-semibold dark:text-slate-200">Failed Login Attempt Limit</Label>
              <Input
                type="number"
                min="3"
                max="10"
                value={loginProtection.failedAttemptLimit}
                onChange={(e) => setLoginProtection({ ...loginProtection, failedAttemptLimit: parseInt(e.target.value) || 5 })}
                className="w-full"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">Number of failed attempts before lockout</p>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold dark:text-slate-200">Lockout Duration (minutes)</Label>
              <Input
                type="number"
                min="5"
                max="1440"
                value={loginProtection.lockoutDuration}
                onChange={(e) => setLoginProtection({ ...loginProtection, lockoutDuration: parseInt(e.target.value) || 15 })}
                className="w-full"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">Time before account is unlocked</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium dark:text-slate-200">Temporary Account Lockout</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Lock account after failed login attempts</p>
              </div>
              <Button
                variant={loginProtection.accountLockout ? "default" : "outline"}
                size="sm"
                onClick={() => setLoginProtection({ ...loginProtection, accountLockout: !loginProtection.accountLockout })}
                className="ml-4"
              >
                {loginProtection.accountLockout ? 'On' : 'Off'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium dark:text-slate-200">CAPTCHA After Failed Attempts</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Require CAPTCHA after N failed login attempts (future-ready)</p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={loginProtection.captchaAfterAttempts}
                  onChange={(e) => setLoginProtection({ ...loginProtection, captchaAfterAttempts: parseInt(e.target.value) || 3 })}
                  className="w-20"
                  disabled={!loginProtection.captchaEnabled}
                />
                <Button
                  variant={loginProtection.captchaEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLoginProtection({ ...loginProtection, captchaEnabled: !loginProtection.captchaEnabled })}
                >
                  {loginProtection.captchaEnabled ? 'On' : 'Off'}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium dark:text-slate-200">IP / Device Tracking</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Track and log IP addresses and devices for security monitoring</p>
              </div>
              <Button
                variant={loginProtection.ipTracking ? "default" : "outline"}
                size="sm"
                onClick={() => setLoginProtection({ ...loginProtection, ipTracking: !loginProtection.ipTracking })}
                className="ml-4"
              >
                {loginProtection.ipTracking ? 'On' : 'Off'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 4: MULTI-FACTOR AUTHENTICATION (MFA) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Smartphone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Multi-Factor Authentication (MFA)</CardTitle>
              <CardDescription className="mt-1">
                Configure MFA requirements and methods (UI-only configuration)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-semibold dark:text-slate-200">MFA Required For</Label>
            <Select 
              value={mfaSettings.requiredFor}
              onValueChange={(value: 'admin' | 'qa' | 'all' | 'none') => setMfaSettings({ ...mfaSettings, requiredFor: value })}
            >
              <SelectTrigger className="w-full md:w-80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not Required</SelectItem>
                <SelectItem value="admin">Admin Users Only</SelectItem>
                <SelectItem value="qa">QA Users Only</SelectItem>
                <SelectItem value="all">All Users</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 dark:text-slate-400">Select which user roles require MFA</p>
          </div>

          <div className="space-y-3 pt-2">
            <Label className="text-base font-semibold dark:text-slate-200">MFA Methods (Future-Ready)</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
                <div className="space-y-0.5 flex-1">
                  <Label className="text-sm font-medium dark:text-slate-200">Authenticator App</Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">TOTP-based authenticator apps (Google Authenticator, Authy, etc.)</p>
                </div>
                <Button
                  variant={mfaSettings.authenticatorApp ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMfaSettings({ ...mfaSettings, authenticatorApp: !mfaSettings.authenticatorApp })}
                  className="ml-4"
                >
                  {mfaSettings.authenticatorApp ? 'On' : 'Off'}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
                <div className="space-y-0.5 flex-1">
                  <Label className="text-sm font-medium dark:text-slate-200">Email OTP</Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">One-time password sent via email</p>
                </div>
                <Button
                  variant={mfaSettings.emailOTP ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMfaSettings({ ...mfaSettings, emailOTP: !mfaSettings.emailOTP })}
                  className="ml-4"
                >
                  {mfaSettings.emailOTP ? 'On' : 'Off'}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <Label className="text-base font-semibold dark:text-slate-200">MFA Enforcement Grace Period (days)</Label>
            <Input
              type="number"
              min="0"
              max="30"
              value={mfaSettings.gracePeriod}
              onChange={(e) => setMfaSettings({ ...mfaSettings, gracePeriod: parseInt(e.target.value) || 0 })}
              className="w-32"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">Time period before MFA becomes mandatory</p>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 5: DEVICE & ACCESS CONTROL */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Smartphone className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Device & Access Control</CardTitle>
              <CardDescription className="mt-1">
                Control device access and IP restrictions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-semibold dark:text-slate-200">Allowed Login Devices</Label>
            <Select 
              value={deviceControl.allowedDevices}
              onValueChange={(value: 'any' | 'approved') => setDeviceControl({ ...deviceControl, allowedDevices: value })}
            >
              <SelectTrigger className="w-full md:w-80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Device</SelectItem>
                <SelectItem value="approved">Approved Devices Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium dark:text-slate-200">Device Registration Required</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Users must register devices before first login</p>
              </div>
              <Button
                variant={deviceControl.deviceRegistrationRequired ? "default" : "outline"}
                size="sm"
                onClick={() => setDeviceControl({ ...deviceControl, deviceRegistrationRequired: !deviceControl.deviceRegistrationRequired })}
                className="ml-4"
              >
                {deviceControl.deviceRegistrationRequired ? 'On' : 'Off'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <div className="space-y-0.5 flex-1">
                <Label className="text-sm font-medium dark:text-slate-200">New Device Verification Required</Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">Require additional verification for new devices</p>
              </div>
              <Button
                variant={deviceControl.newDeviceVerification ? "default" : "outline"}
                size="sm"
                onClick={() => setDeviceControl({ ...deviceControl, newDeviceVerification: !deviceControl.newDeviceVerification })}
                className="ml-4"
              >
                {deviceControl.newDeviceVerification ? 'On' : 'Off'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <Label className="text-base font-semibold dark:text-slate-200">IP Allowlist</Label>
              <Input
                type="text"
                value={deviceControl.ipAllowlist}
                onChange={(e) => setDeviceControl({ ...deviceControl, ipAllowlist: e.target.value })}
                className="w-full"
                placeholder="192.168.1.0/24, 10.0.0.0/8"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">Comma-separated IP addresses or CIDR ranges</p>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-semibold dark:text-slate-200">IP Blocklist</Label>
              <Input
                type="text"
                value={deviceControl.ipBlocklist}
                onChange={(e) => setDeviceControl({ ...deviceControl, ipBlocklist: e.target.value })}
                className="w-full"
                placeholder="192.168.1.100, 10.0.0.50"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">Comma-separated IP addresses to block</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 6: AUDIT & VISIBILITY (READ-ONLY) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Eye className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Audit & Visibility</CardTitle>
              <CardDescription className="mt-1">
                Security policy history and audit information
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Last Security Policy Update</Label>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-1">
                January 5, 2026 at 2:30 PM
              </p>
            </div>
            
            <div>
              <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Updated By</Label>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-1">
                The Gourang (Administrator)
              </p>
            </div>
          </div>

          <div className="pt-4 border-t dark:border-slate-700">
            <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Last Security Event</Label>
            <div className="mt-2 p-3 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
              <p className="text-sm text-slate-900 dark:text-slate-100">
                Password policy updated - Minimum length changed to 8 characters
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                2 hours ago
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/dashboard/audit">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                View Security Events in Audit Logs
                <ExternalLink className="h-3 w-3 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 7: COMPLIANCE & STANDARDS INFO (READ-ONLY) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
              <CheckCircle className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <CardTitle className="text-xl dark:text-slate-100">Compliance & Standards Info</CardTitle>
              <CardDescription className="mt-1">
                Security standards and compliance readiness information
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-semibold dark:text-slate-200 mb-3 block">Supported Standards</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">OAuth 2.0</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Authentication and authorization framework</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Role-Based Access Control (RBAC)</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Granular permission system for user roles</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] rounded-lg border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Encryption at Rest & in Transit</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Data encryption for storage and transmission</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t dark:border-slate-700">
            <Label className="text-base font-semibold dark:text-slate-200 mb-3 block">Compliance Readiness</Label>
            <div className="space-y-2">
              <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">GxP-Aligned Controls</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Security policies and audit trails aligned with Good Practice guidelines for pharmaceutical operations
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">21 CFR Part 11 (Partial Readiness)</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Electronic records and signatures compliance - Additional e-signature features required for full compliance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
