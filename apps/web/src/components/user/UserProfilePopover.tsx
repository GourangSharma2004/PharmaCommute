'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import type { User as AuthUser } from '@/types/auth'
import { ROLE_DISPLAY_NAMES } from '@/lib/permissions'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Mail,
  Phone,
  Clock,
  Globe,
  Shield,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  FileText,
  Sliders,
} from 'lucide-react'

interface UserProfileData {
  name: string
  role: string
  email: string
  phone: string
  lastLogin: string
  timezone: string
  mfaEnabled: boolean
  trustedDevices: number
  accountStatus: 'Active' | 'Inactive' | 'Suspended'
  sessionExpiryMinutes: number
}

// Mock user data - will be replaced with real data later
const getMockUserData = (user: AuthUser): UserProfileData => ({
  name: `${user.firstName} ${user.lastName}`,
  role: ROLE_DISPLAY_NAMES[user.role] ?? user.role.replace('_', ' '),
  email: user.email,
  phone: '+91-99999-99999',
  lastLogin: 'Today, 10:42 AM',
  timezone: 'IST (UTC+5:30)',
  mfaEnabled: true,
  trustedDevices: 3,
  accountStatus: 'Active',
  sessionExpiryMinutes: 23,
})

interface UserProfilePopoverProps {
  children: React.ReactNode
}

export function UserProfilePopover({ children }: UserProfilePopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const router = useRouter()

  if (!user) return null

  const userData = getMockUserData(user)

  const handleLogout = () => {
    logout()
    router.push('/auth/login')
    setIsOpen(false)
  }

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsOpen(false)
  }

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const getSecurityStatusColor = () => {
    if (userData.mfaEnabled && userData.trustedDevices > 0) {
      return 'text-green-600 dark:text-green-400'
    }
    if (userData.mfaEnabled || userData.trustedDevices > 0) {
      return 'text-amber-600 dark:text-amber-400'
    }
    return 'text-red-600 dark:text-red-400'
  }

  const getSecurityStatusIcon = () => {
    if (userData.mfaEnabled && userData.trustedDevices > 0) {
      return <ShieldCheck className="h-4 w-4" />
    }
    if (userData.mfaEnabled || userData.trustedDevices > 0) {
      return <ShieldAlert className="h-4 w-4" />
    }
    return <Shield className="h-4 w-4" />
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="top"
        sideOffset={8}
        alignOffset={-4}
        className="w-80 p-0 bg-white dark:bg-[hsl(217.2,32.6%,17.5%)] border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] shadow-xl rounded-lg overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=top]:slide-in-from-bottom-2"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)]">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                {userData.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="outline" 
                  className="text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700/50"
                >
                  {userData.role}
                </Badge>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400"></div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {userData.accountStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Details Section */}
        <div className="p-4 space-y-3 border-b border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5">
                Email
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {userData.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="h-4 w-4 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5">
                Phone
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {userData.phone}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5">
                Last Login
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {userData.lastLogin}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Globe className="h-4 w-4 text-slate-400 dark:text-slate-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5">
                Timezone
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {userData.timezone}
              </p>
            </div>
          </div>
        </div>

        {/* Security Status Strip */}
        <div className={`p-3 border-b border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] ${getSecurityStatusColor()}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getSecurityStatusIcon()}
              <div className="flex items-center gap-3 text-xs">
                <span className="font-medium">
                  MFA: {userData.mfaEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <span className="font-medium">
                  {userData.trustedDevices} Trusted Device{userData.trustedDevices !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="p-2 space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[hsl(217.2,32.6%,20%)]"
            onClick={() => handleNavigation('/dashboard/settings/profile')}
          >
            <User className="h-4 w-4 mr-2" />
            View / Edit Profile
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[hsl(217.2,32.6%,20%)]"
            onClick={() => handleNavigation('/dashboard/settings/security')}
          >
            <Shield className="h-4 w-4 mr-2" />
            Security Settings
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[hsl(217.2,32.6%,20%)]"
            onClick={() => handleNavigation('/dashboard/settings/profile')}
          >
            <FileText className="h-4 w-4 mr-2" />
            My Activity Log
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-sm font-normal text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[hsl(217.2,32.6%,20%)]"
            onClick={() => handleNavigation('/dashboard/settings/preferences')}
          >
            <Sliders className="h-4 w-4 mr-2" />
            Preferences
          </Button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Session expires in
            </span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {userData.sessionExpiryMinutes} min
            </span>
          </div>
          <Button
            variant="outline"
            className="w-full border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-800 dark:hover:text-red-300"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
