/**
 * Theme Manager Utility
 * Manages theme selection, application, and persistence
 */

import type { ThemeName, ThemeConfig, ThemeVariables } from '../types/theme'

// Define available themes
export const themes: Record<ThemeName, ThemeConfig> = {
  entitledto: {
    name: 'entitledto',
    displayName: 'EntitledTo',
    description: 'Default theme for general benefits advice',
    primaryColor: '#1e40af', // blue-800
    secondaryColor: '#3b82f6', // blue-500
    accentColor: '#10b981', // green-500
    backgroundColor: '#ffffff',
    textColor: '#111827', // gray-900
    routes: ['/', '/benefits-calculator'],
  },
  rehabilitation: {
    name: 'rehabilitation',
    displayName: 'Rehabilitation Services',
    description: 'Theme for rehabilitation services and prison leavers',
    primaryColor: '#7c3aed', // purple-600
    secondaryColor: '#a78bfa', // purple-400
    accentColor: '#f59e0b', // amber-500
    backgroundColor: '#ffffff',
    textColor: '#111827',
    routes: ['/rehabilitation'],
  },
  budgeting: {
    name: 'budgeting',
    displayName: 'Budgeting Tool',
    description: 'Theme for budgeting and financial planning tools',
    primaryColor: '#059669', // emerald-600
    secondaryColor: '#34d399', // emerald-400
    accentColor: '#3b82f6', // blue-500
    backgroundColor: '#ffffff',
    textColor: '#111827',
    routes: ['/budgeting'],
  },
  'self-employment': {
    name: 'self-employment',
    displayName: 'Self-Employment',
    description: 'Theme for self-employment and business tools',
    primaryColor: '#dc2626', // red-600
    secondaryColor: '#f87171', // red-400
    accentColor: '#fbbf24', // amber-400
    backgroundColor: '#ffffff',
    textColor: '#111827',
    routes: ['/self-employment'],
  },
  custom: {
    name: 'custom',
    displayName: 'Custom Theme',
    description: 'User-defined custom theme',
    primaryColor: '#6366f1', // indigo-500
    secondaryColor: '#818cf8', // indigo-400
    accentColor: '#ec4899', // pink-500
    backgroundColor: '#ffffff',
    textColor: '#111827',
  },
}

const THEME_STORAGE_KEY = 'selected-theme'
const DEFAULT_THEME: ThemeName = 'entitledto'

/**
 * Get the current theme from localStorage or use default
 */
export function getCurrentThemeName(): ThemeName {
  if (typeof window === 'undefined') return DEFAULT_THEME

  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored && stored in themes) {
    return stored as ThemeName
  }
  return DEFAULT_THEME
}

/**
 * Get theme configuration by name
 */
export function getTheme(themeName: ThemeName): ThemeConfig {
  return themes[themeName] || themes[DEFAULT_THEME]
}

/**
 * Get current theme configuration
 */
export function getCurrentTheme(): ThemeConfig {
  return getTheme(getCurrentThemeName())
}

/**
 * Get all available themes
 */
export function getAllThemes(): ThemeConfig[] {
  return Object.values(themes)
}

/**
 * Convert theme config to CSS variables
 */
function themeToVariables(theme: ThemeConfig): ThemeVariables {
  return {
    '--color-primary': theme.primaryColor,
    '--color-secondary': theme.secondaryColor,
    '--color-accent': theme.accentColor,
    '--color-background': theme.backgroundColor,
    '--color-text': theme.textColor,
  }
}

/**
 * Apply theme to the document root
 */
export function applyTheme(themeName: ThemeName): void {
  if (typeof window === 'undefined') return

  const theme = getTheme(themeName)
  const root = document.documentElement
  const variables = themeToVariables(theme)

  // Apply CSS variables
  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })

  // Update data attribute for CSS targeting
  root.setAttribute('data-theme', themeName)

  // Save to localStorage
  localStorage.setItem(THEME_STORAGE_KEY, themeName)

  // Dispatch event for React components to react to theme changes
  window.dispatchEvent(
    new CustomEvent('theme-changed', {
      detail: { themeName, theme },
    })
  )
}

/**
 * Get theme for a specific route
 */
export function getThemeForRoute(pathname: string): ThemeName {
  // Check each theme to see if it has a matching route
  for (const [name, config] of Object.entries(themes)) {
    if (config.routes) {
      for (const route of config.routes) {
        if (pathname.startsWith(route)) {
          return name as ThemeName
        }
      }
    }
  }

  // Return current theme if no route match
  return getCurrentThemeName()
}

/**
 * Auto-apply theme based on current route
 */
export function autoApplyThemeForRoute(pathname: string): void {
  const themeName = getThemeForRoute(pathname)
  applyTheme(themeName)
}

/**
 * Reset to default theme
 */
export function resetTheme(): void {
  applyTheme(DEFAULT_THEME)
}

/**
 * Initialize theme system
 * Call this once when the app loads
 */
export function initializeTheme(): void {
  if (typeof window === 'undefined') return

  const currentTheme = getCurrentThemeName()
  applyTheme(currentTheme)
}

/**
 * Create a custom theme
 */
export function createCustomTheme(config: Partial<ThemeConfig>): void {
  themes.custom = {
    ...themes.custom,
    ...config,
    name: 'custom',
  }

  // Save custom theme to localStorage
  localStorage.setItem('custom-theme-config', JSON.stringify(config))
}

/**
 * Load custom theme from localStorage
 */
export function loadCustomTheme(): void {
  if (typeof window === 'undefined') return

  const stored = localStorage.getItem('custom-theme-config')
  if (stored) {
    try {
      const config = JSON.parse(stored)
      createCustomTheme(config)
    } catch (error) {
      console.error('Failed to load custom theme:', error)
    }
  }
}
