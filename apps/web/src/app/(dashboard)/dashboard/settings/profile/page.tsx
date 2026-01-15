'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/auth-store'
import { ROLE_DISPLAY_NAMES } from '@/lib/permissions'
import { 
  User, 
  Mail, 
  Shield, 
  Clock, 
  Smartphone, 
  Globe, 
  Lock, 
  LogOut,
  CheckCircle,
  Eye,
  EyeOff,
  Upload,
  X
} from 'lucide-react'

export default function MyProfilePage() {
  const { user } = useAuthStore()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Form state
  const [profileData, setProfileData] = useState({
    displayName: `${user?.firstName} ${user?.lastName}`,
    phoneNumber: '',
    timezone: 'America/New_York',
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  if (!user) return null

  // Mock data
  const lastLogin = new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  const accountCreated = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // 1 year ago
  const lastPasswordChange = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days ago

  const recentLogins = [
    { date: new Date(Date.now() - 2 * 60 * 60 * 1000), device: 'Chrome on MacOS', ip: '192.168.1.100' },
    { date: new Date(Date.now() - 24 * 60 * 60 * 1000), device: 'Chrome on MacOS', ip: '192.168.1.100' },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), device: 'Safari on iPhone', ip: '192.168.1.101' },
    { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), device: 'Chrome on MacOS', ip: '192.168.1.100' },
    { date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), device: 'Firefox on Windows', ip: '192.168.1.102' },
  ]

  const handleProfileSave = () => {
    // Mock save handler
    console.log('Saving profile:', profileData)
    alert('Profile updated successfully! (Mock)')
  }

  const handlePasswordChange = () => {
    // Mock password change handler
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!')
      return
    }
    console.log('Changing password:', passwordData)
    alert('Password changed successfully! (Mock)')
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleLogoutAll = () => {
    // Mock logout all handler
    if (confirm('Are you sure you want to logout from all devices?')) {
      console.log('Logging out from all devices')
      alert('Logged out from all devices! (Mock)')
    }
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setProfilePhoto(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">My Profile</h1>
        <p className="text-slate-600 dark:text-slate-300">Manage your personal information, security settings, and account details</p>
      </div>

      {/* SECTION 1: OVERVIEW */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle>Profile Overview</CardTitle>
          </div>
          <CardDescription>
            Your account information and current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Full Name</Label>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-1">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              
              <div>
                <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  Email Address
                </Label>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-1">{user.email}</p>
              </div>
              
              <div>
                <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Role</Label>
                <div className="mt-1">
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700/50">
                    {ROLE_DISPLAY_NAMES[user.role]}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Organization</Label>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-1">{user.tenantName}</p>
              </div>
              
              <div>
                <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Account Status</Label>
                <div className="mt-1">
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700/50">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Last Login
                </Label>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-1">
                  {formatDate(lastLogin)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: EDIT PROFILE */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <CardTitle>Edit Profile</CardTitle>
          </div>
          <CardDescription>
            Update your personal information and contact details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                  placeholder="Enter your display name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="flex items-center">
                  <Smartphone className="h-4 w-4 mr-1" />
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={profileData.phoneNumber}
                  onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timezone" className="flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                Timezone
              </Label>
              <select
                id="timezone"
                value={profileData.timezone}
                onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center overflow-hidden">
                  {profilePhoto ? (
                    <img 
                      src={profilePhoto} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-medium text-blue-900 dark:text-blue-200">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={triggerFileInput}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  {profilePhoto && (
                    <Button variant="ghost" size="sm" onClick={handleRemovePhoto}>
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">Max 5MB (JPG, PNG, GIF)</span>
              </div>
            </div>
            
            <div className="pt-4 border-t dark:border-slate-700">
              <Button onClick={handleProfileSave}>
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: MY ACCOUNT SECURITY */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <CardTitle>My Account Security</CardTitle>
              <CardDescription>
                Manage your personal security settings
              </CardDescription>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center space-x-1">
            <Shield className="h-3 w-3" />
            <span>These settings apply only to your account</span>
          </p>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-4">Change Password</h3>
                <div className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          placeholder="Enter current password"
                          className="w-full"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder="Enter new password"
                          className="w-full"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {passwordData.newPassword && (
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Password strength: <span className="text-green-600 dark:text-green-400 font-medium">Strong</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          placeholder="Confirm new password"
                          className="w-full"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={handlePasswordChange}>
                    <Lock className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                </div>
              </div>
              
              <div className="pt-4 border-t dark:border-slate-700">
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-4">Multi-Factor Authentication</h3>
                <div className="max-w-4xl">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <Label className="text-sm font-medium">Enable MFA for my account</Label>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Add an extra layer of security with two-factor authentication
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Setup MFA
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">Active Sessions</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Devices where you're currently logged in
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogoutAll}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout All
                  </Button>
                </div>
                
                <div className="max-w-4xl">
                  <div className="space-y-2">
                    {recentLogins.slice(0, 2).map((login, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border dark:border-slate-700"
                      >
                        <div className="flex items-center space-x-3">
                          <Smartphone className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {login.device}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {login.ip} • {formatDate(login.date)}
                            </p>
                          </div>
                        </div>
                        {index === 0 && (
                          <Badge variant="default" className="text-xs">Current</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 4: PERSONAL ACTIVITY LOG */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            <CardTitle>Personal Activity Log</CardTitle>
          </div>
          <CardDescription>
            Recent security-related actions on your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-900 dark:text-green-200">
                      Login Successful
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1 break-words">
                      {formatDate(recentLogins[0].date)}
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      {recentLogins[0].device}
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      IP: {recentLogins[0].ip}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                      Password Changed
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      {formatDate(lastPasswordChange)}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                      Password was successfully updated
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Smartphone className="h-5 w-5 text-slate-600 dark:text-slate-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      Account Created
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {formatDate(accountCreated)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                      Your account was successfully created
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}