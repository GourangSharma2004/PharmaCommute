'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AuthState, User, UserRole } from '@/types/auth'
import { createPermissionUtils } from '@/lib/permissions'

interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  setLoading: (loading: boolean) => void
  getPermissions: () => ReturnType<typeof createPermissionUtils> | null
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

type AuthStore = AuthState & AuthActions

// Mock users for development
const MOCK_USERS: Record<string, { user: User; password: string }> = {
  'admin@pharmacommute.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@pharmacommute.com',
      firstName: 'The',
      lastName: 'Gourang',
      role: UserRole.ADMIN,
      tenantId: 'tenant-1',
      tenantName: 'PharmaCommute',
    },
  },
  'qa.manager@pharmacommute.com': {
    password: 'qa123',
    user: {
      id: '2',
      email: 'qa.manager@pharmacommute.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: UserRole.QA_MANAGER,
      tenantId: 'tenant-1',
      tenantName: 'PharmaCommute',
    },
  },
  'warehouse@pharmacommute.com': {
    password: 'warehouse123',
    user: {
      id: '3',
      email: 'warehouse@pharmacommute.com',
      firstName: 'Mike',
      lastName: 'Wilson',
      role: UserRole.WAREHOUSE_MANAGER,
      tenantId: 'tenant-1',
      tenantName: 'PharmaCommute',
    },
  },
  'auditor@pharmacommute.com': {
    password: 'auditor123',
    user: {
      id: '4',
      email: 'auditor@pharmacommute.com',
      firstName: 'Lisa',
      lastName: 'Chen',
      role: UserRole.AUDITOR,
      tenantId: 'tenant-1',
      tenantName: 'PharmaCommute',
    },
  },
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({ _hasHydrated: state })
      },

      // Actions
      login: async (email: string, password: string) => {
        set({ isLoading: true })
        
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const mockUser = MOCK_USERS[email]
          
          if (!mockUser || mockUser.password !== password) {
            throw new Error('Invalid credentials')
          }
          
          // Mock JWT token
          const mockToken = `mock-jwt-token-${Date.now()}`
          
          set({
            user: mockUser.user,
            accessToken: mockToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      getPermissions: () => {
        const { user } = get()
        if (!user) return null
        return createPermissionUtils(user.role)
      },
    }),
    {
      name: 'pharmacommute-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => {
        return (state) => {
          state?.setHasHydrated(true)
        }
      },
    }
  )
)
