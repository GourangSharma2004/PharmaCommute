'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user, _hasHydrated, setHasHydrated } = useAuthStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Mark as mounted on client side
  useEffect(() => {
    setMounted(true)
    // If Zustand hasn't hydrated yet, mark it as hydrated after a short delay
    // This handles the case where onRehydrateStorage might not fire
    if (!_hasHydrated) {
      const timer = setTimeout(() => {
        setHasHydrated(true)
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [_hasHydrated, setHasHydrated])

  useEffect(() => {
    if (!mounted) return
    // Wait for Zustand to hydrate from localStorage
    if (!_hasHydrated) return
    
    // If not loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, _hasHydrated, mounted, router])

  // Show loading while mounting, hydrating, or auth is loading
  if (!mounted || !_hasHydrated || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[hsl(222.2,47%,11%)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, show nothing (redirect will happen)
  if (!isAuthenticated || !user) {
    return null
  }

  return <>{children}</>
}
