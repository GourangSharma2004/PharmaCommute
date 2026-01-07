'use client'

import { Bell, Search, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/auth-store'
import { ROLE_DISPLAY_NAMES } from '@/lib/permissions'

export function Topbar() {
  const { user, logout } = useAuthStore()

  if (!user) return null

  return (
    <header className="pharma-topbar h-16 px-6 flex items-center justify-between">
      {/* Search */}
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <Input
            placeholder="Search batches, products, or records..."
            className="pl-10 bg-slate-50 dark:bg-[hsl(217.2,32.6%,20%)] border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <Button variant="ghost" size="sm" className="relative text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 dark:bg-red-600 rounded-full"></span>
        </Button>

        {/* User menu */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {ROLE_DISPLAY_NAMES[user.role]}
            </p>
          </div>
          
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
              {user.firstName[0]}{user.lastName[0]}
            </span>
          </div>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={logout}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
