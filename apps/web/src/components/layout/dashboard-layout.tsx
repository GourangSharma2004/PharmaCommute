'use client'

import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[hsl(222.2,47%,11%)]">
      <div className="flex h-screen overflow-hidden">
        {/* Fixed Sidebar */}
        <Sidebar />
        {/* Main Content Area - Scrollable */}
        <div className="flex-1 flex flex-col overflow-hidden ml-64">
          {/* Sticky Topbar */}
          <div className="flex-shrink-0 sticky top-0 z-20 bg-white dark:bg-[hsl(217.2,32.6%,17.5%)] border-b border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
            <Topbar />
          </div>
          {/* Scrollable Main Content */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
