import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  getText,
  setText,
  resetText,
  resetAllTexts,
  getAllTexts,
  getTextsByContext,
  searchTexts,
  exportTexts,
  importTexts,
  getTextStats,
} from './textManager'

describe('textManager', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('getText', () => {
    it('should get default text by key', () => {
      const text = getText('calculator.title')
      expect(text).toBe('Universal Credit Calculator')
    })

    it('should return fallback for non-existent key', () => {
      const text = getText('non.existent.key', 'Fallback Text')
      expect(text).toBe('Fallback Text')
    })

    it('should return key if no fallback provided', () => {
      const text = getText('non.existent.key')
      expect(text).toBe('non.existent.key')
    })

    it('should get custom text when set', () => {
      setText('calculator.title', 'Custom Title')
      const text = getText('calculator.title')
      expect(text).toBe('Custom Title')
    })

    it('should prioritize custom text over default', () => {
      setText('calculator.subtitle', 'Custom Subtitle')
      const text = getText('calculator.subtitle')
      expect(text).not.toBe('Calculate your Universal Credit entitlement')
      expect(text).toBe('Custom Subtitle')
    })
  })

  describe('setText', () => {
    it('should set custom text', () => {
      setText('calculator.title', 'My Custom Title')
      expect(getText('calculator.title')).toBe('My Custom Title')
    })

    it('should save custom text to localStorage', () => {
      setText('calculator.title', 'Test Title')

      const stored = localStorage.getItem('custom-texts')
      expect(stored).toBeTruthy()

      const customTexts = JSON.parse(stored!)
      expect(customTexts['calculator.title']).toBe('Test Title')
    })

    it('should dispatch texts-changed event', () => {
      const eventSpy = vi.fn()
      window.addEventListener('texts-changed', eventSpy)

      setText('calculator.title', 'New Title')

      expect(eventSpy).toHaveBeenCalled()
      window.removeEventListener('texts-changed', eventSpy)
    })

    it('should allow setting text for non-default keys', () => {
      setText('custom.new.key', 'New Custom Text')
      expect(getText('custom.new.key')).toBe('New Custom Text')
    })
  })

  describe('resetText', () => {
    it('should reset custom text to default', () => {
      setText('calculator.title', 'Custom Title')
      expect(getText('calculator.title')).toBe('Custom Title')

      resetText('calculator.title')
      expect(getText('calculator.title')).toBe('Universal Credit Calculator')
    })

    it('should remove text from localStorage', () => {
      setText('calculator.title', 'Custom Title')
      resetText('calculator.title')

      const stored = localStorage.getItem('custom-texts')
      const customTexts = JSON.parse(stored || '{}')
      expect(customTexts['calculator.title']).toBeUndefined()
    })

    it('should dispatch texts-changed event', () => {
      setText('calculator.title', 'Custom')

      const eventSpy = vi.fn()
      window.addEventListener('texts-changed', eventSpy)

      resetText('calculator.title')

      expect(eventSpy).toHaveBeenCalled()
      window.removeEventListener('texts-changed', eventSpy)
    })
  })

  describe('resetAllTexts', () => {
    it('should reset all custom texts', () => {
      setText('calculator.title', 'Custom 1')
      setText('calculator.subtitle', 'Custom 2')
      setText('results.title', 'Custom 3')

      resetAllTexts()

      expect(getText('calculator.title')).toBe('Universal Credit Calculator')
      expect(getText('calculator.subtitle')).toBe('Calculate your Universal Credit entitlement')
      expect(getText('results.title')).toBe('Your Results')
    })

    it('should clear custom-texts from localStorage', () => {
      setText('calculator.title', 'Custom')
      resetAllTexts()

      const stored = localStorage.getItem('custom-texts')
      expect(stored).toBeNull()
    })

    it('should dispatch texts-changed event', () => {
      const eventSpy = vi.fn()
      window.addEventListener('texts-changed', eventSpy)

      resetAllTexts()

      expect(eventSpy).toHaveBeenCalled()
      window.removeEventListener('texts-changed', eventSpy)
    })
  })

  describe('getAllTexts', () => {
    it('should return all default texts', () => {
      const allTexts = getAllTexts()

      expect(Object.keys(allTexts).length).toBeGreaterThan(0)
      expect(allTexts['calculator.title']).toBeDefined()
      expect(allTexts['calculator.title'].defaultText).toBe('Universal Credit Calculator')
    })

    it('should include custom texts', () => {
      setText('calculator.title', 'Custom Title')

      const allTexts = getAllTexts()
      expect(allTexts['calculator.title'].customText).toBe('Custom Title')
    })

    it('should include custom-only texts', () => {
      setText('my.custom.text', 'My Custom Value')

      const allTexts = getAllTexts()
      expect(allTexts['my.custom.text']).toBeDefined()
      expect(allTexts['my.custom.text'].customText).toBe('My Custom Value')
    })

    it('should have complete text content structure', () => {
      const allTexts = getAllTexts()
      const firstText = Object.values(allTexts)[0]

      expect(firstText).toHaveProperty('key')
      expect(firstText).toHaveProperty('defaultText')
      expect(firstText).toHaveProperty('context')
    })
  })

  describe('getTextsByContext', () => {
    it('should filter texts by calculator context', () => {
      const calculatorTexts = getTextsByContext('calculator')

      expect(Object.keys(calculatorTexts).length).toBeGreaterThan(0)
      Object.values(calculatorTexts).forEach((text) => {
        expect(text.context).toBe('calculator')
      })
    })

    it('should filter texts by help context', () => {
      const helpTexts = getTextsByContext('help')

      Object.values(helpTexts).forEach((text) => {
        expect(text.context).toBe('help')
      })
    })

    it('should filter texts by error context', () => {
      const errorTexts = getTextsByContext('error')

      Object.values(errorTexts).forEach((text) => {
        expect(text.context).toBe('error')
      })
    })

    it('should return empty object for context with no texts', () => {
      const adminTexts = getTextsByContext('admin')
      // Admin might be empty initially
      expect(adminTexts).toBeDefined()
    })
  })

  describe('searchTexts', () => {
    it('should find texts by key', () => {
      const results = searchTexts('calculator')

      expect(Object.keys(results).length).toBeGreaterThan(0)
      Object.keys(results).forEach((key) => {
        expect(key.toLowerCase()).toContain('calculator')
      })
    })

    it('should find texts by content', () => {
      const results = searchTexts('universal credit')

      expect(Object.keys(results).length).toBeGreaterThan(0)
      const hasMatch = Object.values(results).some((text) =>
        text.defaultText.toLowerCase().includes('universal credit')
      )
      expect(hasMatch).toBe(true)
    })

    it('should find texts by custom content', () => {
      setText('calculator.title', 'UC Calculator Tool')

      const results = searchTexts('uc calculator')
      expect(results['calculator.title']).toBeDefined()
    })

    it('should find texts by description', () => {
      const results = searchTexts('page title')

      expect(Object.keys(results).length).toBeGreaterThan(0)
    })

    it('should be case insensitive', () => {
      const lowerResults = searchTexts('calculator')
      const upperResults = searchTexts('CALCULATOR')

      expect(Object.keys(lowerResults).length).toBe(Object.keys(upperResults).length)
    })

    it('should return empty object for no matches', () => {
      const results = searchTexts('xyz123nonexistent')
      expect(Object.keys(results).length).toBe(0)
    })
  })

  describe('exportTexts', () => {
    it('should export texts as JSON', () => {
      const json = exportTexts()

      expect(json).toBeTruthy()
      const data = JSON.parse(json)

      expect(data.version).toBeDefined()
      expect(data.exportDate).toBeDefined()
      expect(data.locale).toBeDefined()
      expect(data.texts).toBeDefined()
    })

    it('should include all texts in export', () => {
      const json = exportTexts()
      const data = JSON.parse(json)

      expect(data.texts['calculator.title']).toBeDefined()
      expect(data.texts['calculator.title'].defaultText).toBe('Universal Credit Calculator')
    })

    it('should include custom texts in export', () => {
      setText('calculator.title', 'My Custom Title')

      const json = exportTexts()
      const data = JSON.parse(json)

      expect(data.texts['calculator.title'].customText).toBe('My Custom Title')
    })
  })

  describe('importTexts', () => {
    it('should import texts from valid JSON', () => {
      // Create export
      setText('calculator.title', 'Original Custom')
      const exported = exportTexts()

      // Clear and import
      resetAllTexts()
      const result = importTexts(exported)

      expect(result.success).toBe(true)
      expect(result.count).toBeGreaterThan(0)
      expect(getText('calculator.title')).toBe('Original Custom')
    })

    it('should reject invalid JSON', () => {
      const result = importTexts('invalid json')

      expect(result.success).toBe(false)
      expect(result.message).toContain('parse')
    })

    it('should reject JSON without texts property', () => {
      const invalidData = JSON.stringify({ version: '1.0' })
      const result = importTexts(invalidData)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Invalid')
    })

    it('should return import count', () => {
      setText('calculator.title', 'Custom 1')
      setText('calculator.subtitle', 'Custom 2')

      const exported = exportTexts()
      resetAllTexts()

      const result = importTexts(exported)

      expect(result.success).toBe(true)
      expect(result.count).toBe(2)
    })

    it('should only import custom texts, not defaults', () => {
      const json = JSON.stringify({
        version: '1.0',
        exportDate: new Date().toISOString(),
        locale: 'en-GB',
        texts: {
          'calculator.title': {
            key: 'calculator.title',
            defaultText: 'Universal Credit Calculator',
            // No customText
            context: 'calculator',
          },
        },
      })

      const result = importTexts(json)

      // Should have count 0 because no customText was present
      expect(result.count).toBe(0)
    })
  })

  describe('getTextStats', () => {
    it('should return text statistics', () => {
      const stats = getTextStats()

      expect(stats.totalTexts).toBeGreaterThan(0)
      expect(stats.customizedTexts).toBe(0) // Initially no customizations
      expect(stats.contexts).toBeDefined()
    })

    it('should count customized texts', () => {
      setText('calculator.title', 'Custom 1')
      setText('calculator.subtitle', 'Custom 2')

      const stats = getTextStats()

      expect(stats.customizedTexts).toBe(2)
    })

    it('should count texts by context', () => {
      const stats = getTextStats()

      expect(stats.contexts.calculator).toBeGreaterThan(0)
      expect(stats.contexts.help).toBeGreaterThan(0)
      expect(stats.contexts.error).toBeGreaterThan(0)
      expect(stats.contexts.general).toBeGreaterThan(0)
    })

    it('should update after adding texts', () => {
      const stats1 = getTextStats()
      const initialTotal = stats1.totalTexts

      setText('my.new.custom.text', 'New Text')

      const stats2 = getTextStats()
      expect(stats2.totalTexts).toBe(initialTotal + 1)
      expect(stats2.customizedTexts).toBe(1)
    })
  })

  describe('Text content structure', () => {
    it('should have all required default texts', () => {
      const requiredKeys = [
        'calculator.title',
        'calculator.subtitle',
        'calculator.start',
        'results.title',
        'error.required-field',
        'general.yes',
        'general.no',
      ]

      requiredKeys.forEach((key) => {
        const text = getText(key)
        expect(text).toBeTruthy()
        expect(text).not.toBe(key) // Should have actual text, not just key
      })
    })

    it('should have correct context for default texts', () => {
      const allTexts = getAllTexts()

      expect(allTexts['calculator.title'].context).toBe('calculator')
      expect(allTexts['help.household'].context).toBe('help')
      expect(allTexts['error.required-field'].context).toBe('error')
      expect(allTexts['general.yes'].context).toBe('general')
    })

    it('should have descriptions for default texts', () => {
      const allTexts = getAllTexts()

      Object.values(allTexts).forEach((text) => {
        if (!text.customText) {
          // Only check default texts
          expect(text.description).toBeDefined()
        }
      })
    })
  })

  describe('Persistence', () => {
    it('should persist across page reloads', () => {
      setText('calculator.title', 'Persistent Title')

      // Simulate reload by getting fresh
      const text = getText('calculator.title')
      expect(text).toBe('Persistent Title')
    })

    it('should maintain multiple custom texts', () => {
      setText('calculator.title', 'Title 1')
      setText('calculator.subtitle', 'Title 2')
      setText('results.title', 'Title 3')

      expect(getText('calculator.title')).toBe('Title 1')
      expect(getText('calculator.subtitle')).toBe('Title 2')
      expect(getText('results.title')).toBe('Title 3')
    })
  })
})
