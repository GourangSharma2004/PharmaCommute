'use client'

import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[hsl(222.2,47%,11%)]">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <main className="p-6 flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
