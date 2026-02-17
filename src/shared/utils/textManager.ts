/**
 * Text Manager Utility
 * Manages dynamic text content throughout the application
 */

import type { TextContent, TextCollection, TextContext, TextExport } from '../types/text-manager'

const CUSTOM_TEXTS_KEY = 'custom-texts'
const TEXT_VERSION = '1.0'

// Default texts - these can be overridden by custom texts
const defaultTexts: TextCollection = {
  // Calculator page texts
  'calculator.title': {
    key: 'calculator.title',
    defaultText: 'Universal Credit Calculator',
    context: 'calculator',
    description: 'Main calculator page title',
  },
  'calculator.subtitle': {
    key: 'calculator.subtitle',
    defaultText: 'Calculate your Universal Credit entitlement',
    context: 'calculator',
    description: 'Calculator page subtitle',
  },
  'calculator.start': {
    key: 'calculator.start',
    defaultText: 'Start Calculation',
    context: 'calculator',
    description: 'Button to start a new calculation',
  },
  'calculator.continue': {
    key: 'calculator.continue',
    defaultText: 'Continue',
    context: 'calculator',
    description: 'Button to continue to next step',
  },
  'calculator.back': {
    key: 'calculator.back',
    defaultText: 'Back',
    context: 'calculator',
    description: 'Button to go to previous step',
  },
  'calculator.save': {
    key: 'calculator.save',
    defaultText: 'Save Scenario',
    context: 'calculator',
    description: 'Button to save current scenario',
  },

  // Results page texts
  'results.title': {
    key: 'results.title',
    defaultText: 'Your Results',
    context: 'calculator',
    description: 'Results page title',
  },
  'results.monthly-uc': {
    key: 'results.monthly-uc',
    defaultText: 'Your monthly Universal Credit',
    context: 'calculator',
    description: 'Label for monthly UC amount',
  },
  'results.breakdown': {
    key: 'results.breakdown',
    defaultText: 'Breakdown of your Universal Credit',
    context: 'calculator',
    description: 'Heading for UC breakdown section',
  },
  'results.export-pdf': {
    key: 'results.export-pdf',
    defaultText: 'Export to PDF',
    context: 'calculator',
    description: 'Button to export results as PDF',
  },

  // Help texts
  'help.household': {
    key: 'help.household',
    defaultText: 'Enter details about your household composition',
    context: 'help',
    description: 'Help text for household section',
  },
  'help.housing': {
    key: 'help.housing',
    defaultText: 'Include your rent or mortgage costs',
    context: 'help',
    description: 'Help text for housing costs section',
  },
  'help.income': {
    key: 'help.income',
    defaultText: 'Enter your monthly income from all sources',
    context: 'help',
    description: 'Help text for income section',
  },

  // Error messages
  'error.required-field': {
    key: 'error.required-field',
    defaultText: 'This field is required',
    context: 'error',
    description: 'Generic required field error',
  },
  'error.invalid-number': {
    key: 'error.invalid-number',
    defaultText: 'Please enter a valid number',
    context: 'error',
    description: 'Invalid number format error',
  },
  'error.calculation-failed': {
    key: 'error.calculation-failed',
    defaultText: 'Calculation failed. Please check your inputs.',
    context: 'error',
    description: 'Generic calculation error',
  },

  // General texts
  'general.yes': {
    key: 'general.yes',
    defaultText: 'Yes',
    context: 'general',
    description: 'Yes option',
  },
  'general.no': {
    key: 'general.no',
    defaultText: 'No',
    context: 'general',
    description: 'No option',
  },
  'general.cancel': {
    key: 'general.cancel',
    defaultText: 'Cancel',
    context: 'general',
    description: 'Cancel action',
  },
  'general.confirm': {
    key: 'general.confirm',
    defaultText: 'Confirm',
    context: 'general',
    description: 'Confirm action',
  },
  'general.loading': {
    key: 'general.loading',
    defaultText: 'Loading...',
    context: 'general',
    description: 'Loading indicator',
  },
}

/**
 * Get custom texts from localStorage
 */
function getCustomTexts(): Record<string, string> {
  if (typeof window === 'undefined') return {}

  try {
    const stored = localStorage.getItem(CUSTOM_TEXTS_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load custom texts:', error)
  }

  return {}
}

/**
 * Save custom texts to localStorage
 */
function saveCustomTexts(customTexts: Record<string, string>): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CUSTOM_TEXTS_KEY, JSON.stringify(customTexts))

    // Dispatch event for React components
    window.dispatchEvent(new Event('texts-changed'))
  } catch (error) {
    console.error('Failed to save custom texts:', error)
  }
}

/**
 * Get text by key
 */
export function getText(key: string, fallback?: string): string {
  const customTexts = getCustomTexts()

  // Check for custom text first
  if (customTexts[key]) {
    return customTexts[key]
  }

  // Check default texts
  const defaultText = defaultTexts[key]
  if (defaultText) {
    return defaultText.defaultText
  }

  // Return fallback or key
  return fallback || key
}

/**
 * Set custom text for a key
 */
export function setText(key: string, value: string): void {
  const customTexts = getCustomTexts()
  customTexts[key] = value
  saveCustomTexts(customTexts)
}

/**
 * Reset text to default
 */
export function resetText(key: string): void {
  const customTexts = getCustomTexts()
  delete customTexts[key]
  saveCustomTexts(customTexts)
}

/**
 * Reset all texts to defaults
 */
export function resetAllTexts(): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem(CUSTOM_TEXTS_KEY)
  window.dispatchEvent(new Event('texts-changed'))
}

/**
 * Get all texts (merged default + custom)
 */
export function getAllTexts(): TextCollection {
  const customTexts = getCustomTexts()
  const allTexts: TextCollection = {}

  // Start with default texts
  Object.entries(defaultTexts).forEach(([key, content]) => {
    allTexts[key] = {
      ...content,
      customText: customTexts[key] || undefined,
    }
  })

  // Add any custom-only texts (not in defaults)
  Object.entries(customTexts).forEach(([key, value]) => {
    if (!allTexts[key]) {
      allTexts[key] = {
        key,
        defaultText: value,
        customText: value,
        context: 'general',
        description: 'Custom text (no default)',
      }
    }
  })

  return allTexts
}

/**
 * Get texts by context
 */
export function getTextsByContext(context: TextContext): TextCollection {
  const allTexts = getAllTexts()
  const filtered: TextCollection = {}

  Object.entries(allTexts).forEach(([key, content]) => {
    if (content.context === context) {
      filtered[key] = content
    }
  })

  return filtered
}

/**
 * Search texts by keyword
 */
export function searchTexts(query: string): TextCollection {
  const allTexts = getAllTexts()
  const results: TextCollection = {}
  const lowerQuery = query.toLowerCase()

  Object.entries(allTexts).forEach(([key, content]) => {
    const matchesKey = key.toLowerCase().includes(lowerQuery)
    const matchesText = content.defaultText.toLowerCase().includes(lowerQuery)
    const matchesCustom = content.customText?.toLowerCase().includes(lowerQuery)
    const matchesDescription = content.description?.toLowerCase().includes(lowerQuery)

    if (matchesKey || matchesText || matchesCustom || matchesDescription) {
      results[key] = content
    }
  })

  return results
}

/**
 * Export texts to JSON
 */
export function exportTexts(): string {
  const allTexts = getAllTexts()

  const exportData: TextExport = {
    version: TEXT_VERSION,
    exportDate: new Date().toISOString(),
    locale: 'en-GB',
    texts: allTexts,
  }

  return JSON.stringify(exportData, null, 2)
}

/**
 * Import texts from JSON
 */
export function importTexts(json: string): { success: boolean; message: string; count: number } {
  try {
    const data = JSON.parse(json) as TextExport

    // Validate structure
    if (!data.texts || typeof data.texts !== 'object') {
      return {
        success: false,
        message: 'Invalid import format',
        count: 0,
      }
    }

    const customTexts = getCustomTexts()
    let count = 0

    // Import custom texts
    Object.entries(data.texts).forEach(([key, content]) => {
      if (content.customText) {
        customTexts[key] = content.customText
        count++
      }
    })

    saveCustomTexts(customTexts)

    return {
      success: true,
      message: `Successfully imported ${count} custom text(s)`,
      count,
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to parse import file',
      count: 0,
    }
  }
}

/**
 * Get statistics about texts
 */
export function getTextStats(): {
  totalTexts: number
  customizedTexts: number
  contexts: Record<TextContext, number>
} {
  const allTexts = getAllTexts()
  const customizedTexts = Object.values(allTexts).filter((t) => t.customText).length

  const contexts: Record<TextContext, number> = {
    calculator: 0,
    help: 0,
    admin: 0,
    error: 0,
    general: 0,
  }

  Object.values(allTexts).forEach((text) => {
    contexts[text.context]++
  })

  return {
    totalTexts: Object.keys(allTexts).length,
    customizedTexts,
    contexts,
  }
}
