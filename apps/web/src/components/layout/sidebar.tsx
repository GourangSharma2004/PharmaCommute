'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth-store'
import { 
  Package, 
  FlaskConical, 
  AlertTriangle, 
  FileText, 
  Users, 
  Settings,
  BarChart3,
  Thermometer,
  Database,
  ShoppingCart,
  TrendingUp,
  FolderOpen,
  Truck,
  ChevronDown,
  ChevronRight,
  User,
  Shield,
  Sliders,
  Bell,
  UserCheck,
  GitBranch,
  Layers,
  Package2,
  CheckSquare,
  Zap,
  FileCheck,
  Plug,
  Lock,
  Building
} from 'lucide-react'

interface NavItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  permission?: string
  badge?: string
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    title: 'Master Data',
    href: '/dashboard/master-data',
    icon: Database,
    permission: 'inventory.view',
  },
  {
    title: 'Inventory',
    href: '/dashboard/inventory',
    icon: Package,
    permission: 'inventory.view',
  },
  {
    title: 'Procurement',
    href: '/dashboard/procurement',
    icon: ShoppingCart,
    permission: 'inventory.view',
  },
  {
    title: 'Quality & Compliance',
    href: '/dashboard/quality',
    icon: FlaskConical,
    permission: 'qc.view',
  },
  {
    title: 'Cold Chain',
    href: '/dashboard/cold-chain',
    icon: Thermometer,
    permission: 'inventory.view',
  },
  {
    title: 'Sales & Distribution',
    href: '/dashboard/sales',
    icon: Truck,
    permission: 'inventory.view',
  },
  {
    title: 'Recall & Traceability',
    href: '/dashboard/recalls',
    icon: AlertTriangle,
    permission: 'inventory.view',
  },
  {
    title: 'Reports & Analytics',
    href: '/dashboard/reports',
    icon: TrendingUp,
    permission: 'inventory.view',
  },
  {
    title: 'Documents',
    href: '/dashboard/documents',
    icon: FolderOpen,
    permission: 'inventory.view',
  },
  {
    title: 'Audit Logs',
    href: '/dashboard/audit',
    icon: FileText,
    permission: 'audit.view',
  },
  {
    title: 'Settings',
    icon: Settings,
    permission: 'system.config',
    children: [
      // User-level settings
      {
        title: 'My Profile',
        href: '/dashboard/settings/profile',
        icon: User,
      },
      {
        title: 'Security',
        href: '/dashboard/settings/security',
        icon: Shield,
      },
      {
        title: 'Preferences',
        href: '/dashboard/settings/preferences',
        icon: Sliders,
      },
      {
        title: 'Notifications',
        href: '/dashboard/settings/notifications',
        icon: Bell,
      },
      // Admin/System settings
      {
        title: 'User & Access Management',
        href: '/dashboard/settings/user-access',
        icon: UserCheck,
        permission: 'user.manage',
      },
      {
        title: 'Approval Workflows',
        href: '/dashboard/settings/approval-workflows',
        icon: GitBranch,
        permission: 'system.config',
      },
      {
        title: 'Master Data Governance',
        href: '/dashboard/settings/master-data-governance',
        icon: Layers,
        permission: 'system.config',
      },
      {
        title: 'Inventory Rules',
        href: '/dashboard/settings/inventory-rules',
        icon: Package2,
        permission: 'system.config',
      },
      {
        title: 'Cold Chain Configuration',
        href: '/dashboard/settings/cold-chain',
        icon: Thermometer,
        permission: 'system.config',
      },
      {
        title: 'Integrations',
        href: '/dashboard/settings/integrations',
        icon: Plug,
        permission: 'system.config',
      },
      {
        title: 'System & Security',
        href: '/dashboard/settings/system-security',
        icon: Lock,
        permission: 'system.config',
      },
      {
        title: 'Organization Settings',
        href: '/dashboard/settings/organization',
        icon: Building,
        permission: 'system.config',
      },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, getPermissions } = useAuthStore()
  const permissions = getPermissions()
  const [expandedItems, setExpandedItems] = useState<string[]>(['Settings'])

  if (!user || !permissions) {
    return null
  }

  // Filter navigation items based on user permissions
  const visibleNavItems = navigation.filter(item => {
    if (!item.permission) return true
    return permissions.can(item.permission as any)
  })

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.includes(item.title)
    const isActive = item.href ? pathname === item.href : false
    const isChildActive = item.children?.some(child => child.href === pathname)
    const Icon = item.icon

    // Filter children based on permissions
    const visibleChildren = item.children?.filter(child => {
      if (!child.permission) return true
      return permissions.can(child.permission as any)
    }) || []

    if (hasChildren) {
      return (
        <div key={item.title}>
          <button
            onClick={() => toggleExpanded(item.title)}
            className={cn(
              'w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
              level === 0 
                ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[hsl(217.2,32.6%,20%)] hover:text-slate-900 dark:hover:text-slate-100' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[hsl(217.2,32.6%,20%)]',
              isChildActive && level === 0 ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200' : ''
            )}
            style={{ paddingLeft: `${12 + level * 16}px` }}
          >
            <Icon className="mr-3 h-4 w-4" />
            {item.title}
            {hasChildren && (
              <span className="ml-auto">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            )}
            {item.badge && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {item.badge}
              </span>
            )}
          </button>
          
          {isExpanded && visibleChildren.length > 0 && (
            <div className="mt-1 space-y-1">
              {visibleChildren.map(child => renderNavItem(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.href}
        href={item.href!}
        className={cn(
          'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
          level === 0 
            ? (isActive 
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-700/50'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[hsl(217.2,32.6%,20%)] hover:text-slate-900 dark:hover:text-slate-100')
            : (isActive
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-700/50'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[hsl(217.2,32.6%,20%)] hover:text-slate-700 dark:hover:text-slate-200')
        )}
        style={{ paddingLeft: `${12 + level * 16}px` }}
      >
        <Icon className="mr-3 h-4 w-4" />
        {item.title}
        {item.badge && (
          <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <div className="pharma-sidebar fixed left-0 top-0 w-64 h-screen flex flex-col bg-white dark:bg-[hsl(217.2,32.6%,17.5%)] border-r border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] z-10">
      {/* Header section */}
      <div className="px-4 pt-3 pb-1.5 flex-shrink-0 border-b border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
        <Link href="/dashboard" className="flex items-center py-2">
          <Image
            src="/pharma-commute-logo.png"
            alt="Pharma Commute"
            width={180}
            height={80}
            className="h-auto w-auto max-w-[180px] object-contain"
            priority
          />
        </Link>
      </div>

      {/* Scrollable navigation section */}
      <div className="flex-1 overflow-y-auto px-4 min-h-0 pt-2">
        <nav className="space-y-2 pb-4">
          {visibleNavItems.map(item => renderNavItem(item))}
        </nav>
      </div>

      {/* Fixed user info at bottom */}
      <div className="p-4 pt-0 flex-shrink-0 border-t border-slate-200 dark:border-[hsl(217.2,32.6%,25%)]">
        <div className="bg-white dark:bg-[hsl(217.2,32.6%,17.5%)] border border-slate-200 dark:border-[hsl(217.2,32.6%,25%)] rounded-lg p-3">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user.role.replace('_', ' ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
