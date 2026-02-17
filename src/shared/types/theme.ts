/**
 * Theme System Types
 * Supports multi-theme configurations for white-label deployments
 */

export type ThemeName = 'entitledto' | 'rehabilitation' | 'budgeting' | 'self-employment' | 'custom'

export interface ThemeConfig {
  name: ThemeName
  displayName: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  logoUrl?: string
  routes?: string[] // Auto-apply to these routes
  description?: string
}

export interface ThemeVariables {
  '--color-primary': string
  '--color-secondary': string
  '--color-accent': string
  '--color-background': string
  '--color-text': string
}

export interface ThemeManager {
  currentTheme: ThemeName
  themes: Map<ThemeName, ThemeConfig>
  setTheme: (theme: ThemeName) => void
  getTheme: (theme: ThemeName) => ThemeConfig | undefined
  getCurrentTheme: () => ThemeConfig
  getThemeForRoute: (route: string) => ThemeName
  saveTheme: (theme: ThemeName) => void
  resetTheme: () => void
  getAllThemes: () => ThemeConfig[]
}
