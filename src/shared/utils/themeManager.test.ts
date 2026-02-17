import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  themes,
  getCurrentThemeName,
  getTheme,
  getCurrentTheme,
  getAllThemes,
  applyTheme,
  resetTheme,
  getThemeForRoute,
  initializeTheme,
  createCustomTheme,
} from './themeManager'
import type { ThemeName } from '../types/theme'

describe('themeManager', () => {
  beforeEach(() => {
    localStorage.clear()
    // Reset root styles
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.style.cssText = ''
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getTheme', () => {
    it('should get theme by name', () => {
      const theme = getTheme('entitledto')
      expect(theme.name).toBe('entitledto')
      expect(theme.displayName).toBe('EntitledTo')
      expect(theme.primaryColor).toBe('#1e40af')
    })

    it('should return default theme for invalid name', () => {
      const theme = getTheme('invalid' as ThemeName)
      expect(theme.name).toBe('entitledto')
    })

    it('should get rehabilitation theme', () => {
      const theme = getTheme('rehabilitation')
      expect(theme.name).toBe('rehabilitation')
      expect(theme.displayName).toBe('Rehabilitation Services')
      expect(theme.primaryColor).toBe('#7c3aed')
    })
  })

  describe('getCurrentThemeName', () => {
    it('should return default theme when no theme is set', () => {
      const themeName = getCurrentThemeName()
      expect(themeName).toBe('entitledto')
    })

    it('should return stored theme name from localStorage', () => {
      localStorage.setItem('selected-theme', 'rehabilitation')
      const themeName = getCurrentThemeName()
      expect(themeName).toBe('rehabilitation')
    })

    it('should return default for invalid stored theme', () => {
      localStorage.setItem('selected-theme', 'invalid-theme')
      const themeName = getCurrentThemeName()
      expect(themeName).toBe('entitledto')
    })
  })

  describe('getCurrentTheme', () => {
    it('should return current theme config', () => {
      const theme = getCurrentTheme()
      expect(theme.name).toBe('entitledto')
    })

    it('should return stored theme config', () => {
      localStorage.setItem('selected-theme', 'budgeting')
      const theme = getCurrentTheme()
      expect(theme.name).toBe('budgeting')
      expect(theme.displayName).toBe('Budgeting Tool')
    })
  })

  describe('getAllThemes', () => {
    it('should return all available themes', () => {
      const allThemes = getAllThemes()
      expect(allThemes).toHaveLength(5)
      expect(allThemes.map((t) => t.name)).toContain('entitledto')
      expect(allThemes.map((t) => t.name)).toContain('rehabilitation')
      expect(allThemes.map((t) => t.name)).toContain('budgeting')
      expect(allThemes.map((t) => t.name)).toContain('self-employment')
      expect(allThemes.map((t) => t.name)).toContain('custom')
    })
  })

  describe('applyTheme', () => {
    it('should apply theme CSS variables', () => {
      applyTheme('rehabilitation')

      const root = document.documentElement
      expect(root.style.getPropertyValue('--color-primary')).toBe('#7c3aed')
      expect(root.style.getPropertyValue('--color-secondary')).toBe('#a78bfa')
      expect(root.style.getPropertyValue('--color-accent')).toBe('#f59e0b')
    })

    it('should set data-theme attribute', () => {
      applyTheme('budgeting')

      const root = document.documentElement
      expect(root.getAttribute('data-theme')).toBe('budgeting')
    })

    it('should save theme to localStorage', () => {
      applyTheme('self-employment')
      expect(localStorage.getItem('selected-theme')).toBe('self-employment')
    })

    it('should dispatch theme-changed event', () => {
      const eventSpy = vi.fn()
      window.addEventListener('theme-changed', eventSpy)

      applyTheme('rehabilitation')

      expect(eventSpy).toHaveBeenCalled()
      window.removeEventListener('theme-changed', eventSpy)
    })
  })

  describe('resetTheme', () => {
    it('should reset to default theme', () => {
      applyTheme('rehabilitation')
      resetTheme()

      expect(getCurrentThemeName()).toBe('entitledto')
      expect(localStorage.getItem('selected-theme')).toBe('entitledto')
    })
  })

  describe('getThemeForRoute', () => {
    it('should return theme for matching route', () => {
      const theme = getThemeForRoute('/rehabilitation')
      expect(theme).toBe('rehabilitation')
    })

    it('should return theme for exact route match', () => {
      const theme = getThemeForRoute('/')
      expect(theme).toBe('entitledto')
    })

    it('should return current theme for non-matching route', () => {
      localStorage.setItem('selected-theme', 'budgeting')
      const theme = getThemeForRoute('/some-other-page')
      expect(theme).toBe('budgeting')
    })

    it('should match route prefixes', () => {
      const theme = getThemeForRoute('/self-employment/tools')
      expect(theme).toBe('self-employment')
    })
  })

  describe('initializeTheme', () => {
    it('should apply current theme on init', () => {
      localStorage.setItem('selected-theme', 'rehabilitation')
      initializeTheme()

      const root = document.documentElement
      expect(root.getAttribute('data-theme')).toBe('rehabilitation')
    })

    it('should apply default theme if none stored', () => {
      initializeTheme()

      const root = document.documentElement
      expect(root.getAttribute('data-theme')).toBe('entitledto')
    })
  })

  describe('createCustomTheme', () => {
    it('should create custom theme with partial config', () => {
      createCustomTheme({
        displayName: 'My Custom Theme',
        primaryColor: '#ff0000',
      })

      const customTheme = themes.custom
      expect(customTheme.displayName).toBe('My Custom Theme')
      expect(customTheme.primaryColor).toBe('#ff0000')
      expect(customTheme.name).toBe('custom')
    })

    it('should save custom theme to localStorage', () => {
      createCustomTheme({
        displayName: 'Test Theme',
        primaryColor: '#123456',
      })

      const stored = localStorage.getItem('custom-theme-config')
      expect(stored).toBeTruthy()

      const config = JSON.parse(stored!)
      expect(config.displayName).toBe('Test Theme')
    })
  })

  describe('Theme object structure', () => {
    it('should have all required theme properties', () => {
      Object.values(themes).forEach((theme) => {
        expect(theme).toHaveProperty('name')
        expect(theme).toHaveProperty('displayName')
        expect(theme).toHaveProperty('primaryColor')
        expect(theme).toHaveProperty('secondaryColor')
        expect(theme).toHaveProperty('accentColor')
        expect(theme).toHaveProperty('backgroundColor')
        expect(theme).toHaveProperty('textColor')
      })
    })

    it('should have valid color values', () => {
      Object.values(themes).forEach((theme) => {
        expect(theme.primaryColor).toMatch(/^#[0-9a-f]{6}$/i)
        expect(theme.secondaryColor).toMatch(/^#[0-9a-f]{6}$/i)
        expect(theme.accentColor).toMatch(/^#[0-9a-f]{6}$/i)
      })
    })
  })
})
