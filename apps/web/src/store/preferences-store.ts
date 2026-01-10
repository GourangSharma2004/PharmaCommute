'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PreferencesState {
  // Appearance
  theme: 'light' | 'dark' | 'system'
  fontSize: 'small' | 'default' | 'large'
  tableDensity: 'compact' | 'comfortable'
  
  // Layout
  defaultLandingPage: 'dashboard' | 'inventory' | 'quality'
  sidebarExpanded: boolean
  rememberSidebarState: boolean
  stickyHeaders: boolean
  
  // Date & Time
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY'
  timeFormat: '12-hour' | '24-hour'
  timezone: string
  weekStartDay: 'monday' | 'sunday'
  
  // Data Display
  defaultPageSize: number
  decimalPlaces: number
  highlightNearExpiry: boolean
  highlightQuarantine: boolean
  
  // Accessibility
  highContrast: boolean
  reducedMotion: boolean
  keyboardFocus: boolean
  
  // Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setFontSize: (fontSize: 'small' | 'default' | 'large') => void
  setTableDensity: (density: 'compact' | 'comfortable') => void
  setDefaultLandingPage: (page: 'dashboard' | 'inventory' | 'quality') => void
  setSidebarExpanded: (expanded: boolean) => void
  setRememberSidebarState: (remember: boolean) => void
  setStickyHeaders: (sticky: boolean) => void
  setDateFormat: (format: 'MM/DD/YYYY' | 'DD/MM/YYYY') => void
  setTimeFormat: (format: '12-hour' | '24-hour') => void
  setTimezone: (timezone: string) => void
  setWeekStartDay: (day: 'monday' | 'sunday') => void
  setDefaultPageSize: (size: number) => void
  setDecimalPlaces: (places: number) => void
  setHighlightNearExpiry: (highlight: boolean) => void
  setHighlightQuarantine: (highlight: boolean) => void
  setHighContrast: (enabled: boolean) => void
  setReducedMotion: (enabled: boolean) => void
  setKeyboardFocus: (enabled: boolean) => void
  resetPreferences: () => void
}

const defaultPreferences = {
  theme: 'light' as const,
  fontSize: 'default' as const,
  tableDensity: 'comfortable' as const,
  defaultLandingPage: 'dashboard' as const,
  sidebarExpanded: true,
  rememberSidebarState: true,
  stickyHeaders: true,
  dateFormat: 'MM/DD/YYYY' as const,
  timeFormat: '12-hour' as const,
  timezone: 'auto',
  weekStartDay: 'monday' as const,
  defaultPageSize: 25,
  decimalPlaces: 2,
  highlightNearExpiry: true,
  highlightQuarantine: true,
  highContrast: false,
  reducedMotion: false,
  keyboardFocus: true,
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...defaultPreferences,
      
      setTheme: (theme) => {
        set({ theme })
        if (typeof window !== 'undefined') {
          applyTheme(theme)
        }
      },
      
      setFontSize: (fontSize) => {
        set({ fontSize })
        if (typeof window !== 'undefined') {
          applyFontSize(fontSize)
        }
      },
      
      setTableDensity: (tableDensity) => set({ tableDensity }),
      setDefaultLandingPage: (defaultLandingPage) => set({ defaultLandingPage }),
      setSidebarExpanded: (sidebarExpanded) => set({ sidebarExpanded }),
      setRememberSidebarState: (rememberSidebarState) => set({ rememberSidebarState }),
      setStickyHeaders: (stickyHeaders) => set({ stickyHeaders }),
      setDateFormat: (dateFormat) => set({ dateFormat }),
      setTimeFormat: (timeFormat) => set({ timeFormat }),
      setTimezone: (timezone) => set({ timezone }),
      setWeekStartDay: (weekStartDay) => set({ weekStartDay }),
      setDefaultPageSize: (defaultPageSize) => set({ defaultPageSize }),
      setDecimalPlaces: (decimalPlaces) => set({ decimalPlaces }),
      setHighlightNearExpiry: (highlightNearExpiry) => set({ highlightNearExpiry }),
      setHighlightQuarantine: (highlightQuarantine) => set({ highlightQuarantine }),
      setHighContrast: (highContrast) => {
        set({ highContrast })
        if (typeof window !== 'undefined') {
          applyHighContrast(highContrast)
        }
      },
      setReducedMotion: (reducedMotion) => {
        set({ reducedMotion })
        if (typeof window !== 'undefined') {
          applyReducedMotion(reducedMotion)
        }
      },
      setKeyboardFocus: (keyboardFocus) => set({ keyboardFocus }),
      
      resetPreferences: () => {
        set(defaultPreferences)
        if (typeof window !== 'undefined') {
          applyTheme(defaultPreferences.theme)
          applyFontSize(defaultPreferences.fontSize)
          applyHighContrast(defaultPreferences.highContrast)
          applyReducedMotion(defaultPreferences.reducedMotion)
        }
      },
    }),
    {
      name: 'pharmacommute-preferences',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme)
          applyFontSize(state.fontSize)
          applyHighContrast(state.highContrast)
          applyReducedMotion(state.reducedMotion)
        }
      },
    }
  )
)

// Helper functions to apply preferences
function applyTheme(theme: 'light' | 'dark' | 'system') {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  
  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    root.classList.toggle('dark', systemTheme === 'dark')
  } else {
    root.classList.toggle('dark', theme === 'dark')
  }
}

function applyFontSize(fontSize: 'small' | 'default' | 'large') {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  root.classList.remove('font-size-small', 'font-size-default', 'font-size-large')
  
  switch (fontSize) {
    case 'small':
      root.classList.add('font-size-small')
      root.style.setProperty('--font-size-base', '14px')
      break
    case 'default':
      root.classList.add('font-size-default')
      root.style.setProperty('--font-size-base', '16px')
      break
    case 'large':
      root.classList.add('font-size-large')
      root.style.setProperty('--font-size-base', '18px')
      break
  }
}

function applyHighContrast(enabled: boolean) {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  root.classList.toggle('high-contrast', enabled)
}

function applyReducedMotion(enabled: boolean) {
  if (typeof window === 'undefined') return
  
  const root = document.documentElement
  root.classList.toggle('reduced-motion', enabled)
}
