'use client'

import { useEffect, useState } from 'react'
import { usePreferencesStore } from '@/store/preferences-store'

export function ThemeProvider() {
  const [mounted, setMounted] = useState(false)
  const { theme, fontSize, highContrast, reducedMotion } = usePreferencesStore()
  
  // Apply initial theme immediately on mount (before Zustand hydrates)
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      const stored = localStorage.getItem('pharmacommute-preferences')
      const root = document.documentElement
      
      if (stored) {
        const parsed = JSON.parse(stored)
        const initialTheme = parsed.state?.theme || 'light'
        
        if (initialTheme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          root.classList.toggle('dark', systemTheme === 'dark')
        } else {
          root.classList.toggle('dark', initialTheme === 'dark')
        }
      }
    } catch (e) {
      // Ignore errors, use default light theme
    }
    
    setMounted(true)
  }, [])
  
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return
    
    const root = document.documentElement
    
    // Apply theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.toggle('dark', systemTheme === 'dark')
      
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        root.classList.toggle('dark', e.matches)
      }
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } else {
      root.classList.toggle('dark', theme === 'dark')
    }
  }, [mounted, theme])
  
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return
    
    const root = document.documentElement
    
    // Apply font size
    root.classList.remove('font-size-small', 'font-size-default', 'font-size-large')
    root.classList.add(`font-size-${fontSize}`)
    
    switch (fontSize) {
      case 'small':
        root.style.setProperty('--font-size-base', '14px')
        break
      case 'default':
        root.style.setProperty('--font-size-base', '16px')
        break
      case 'large':
        root.style.setProperty('--font-size-base', '18px')
        break
    }
  }, [mounted, fontSize])
  
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return
    const root = document.documentElement
    root.classList.toggle('high-contrast', highContrast)
  }, [mounted, highContrast])
  
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return
    const root = document.documentElement
    root.classList.toggle('reduced-motion', reducedMotion)
  }, [mounted, reducedMotion])
  
  return null
}
