/**
 * useTheme React Hook
 * Provides theme management functionality to React components
 */

import { useState, useEffect } from 'react'
import type { ThemeName, ThemeConfig } from '../types/theme'
import {
  getCurrentThemeName,
  getCurrentTheme,
  getAllThemes,
  applyTheme,
  resetTheme,
} from '../utils/themeManager'

interface UseThemeReturn {
  currentThemeName: ThemeName
  currentTheme: ThemeConfig
  allThemes: ThemeConfig[]
  setTheme: (theme: ThemeName) => void
  resetTheme: () => void
}

export function useTheme(): UseThemeReturn {
  const [currentThemeName, setCurrentThemeName] = useState<ThemeName>(getCurrentThemeName)
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(getCurrentTheme)
  const [allThemes] = useState<ThemeConfig[]>(getAllThemes)

  useEffect(() => {
    // Listen for theme changes
    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent
      setCurrentThemeName(customEvent.detail.themeName)
      setCurrentTheme(customEvent.detail.theme)
    }

    window.addEventListener('theme-changed', handleThemeChange)

    return () => {
      window.removeEventListener('theme-changed', handleThemeChange)
    }
  }, [])

  const handleSetTheme = (theme: ThemeName) => {
    applyTheme(theme)
  }

  const handleResetTheme = () => {
    resetTheme()
  }

  return {
    currentThemeName,
    currentTheme,
    allThemes,
    setTheme: handleSetTheme,
    resetTheme: handleResetTheme,
  }
}
