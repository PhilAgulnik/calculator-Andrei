/**
 * Text Manager Types
 * For dynamic content management without code changes
 */

export type TextContext = 'calculator' | 'help' | 'admin' | 'error' | 'general'

export interface TextContent {
  key: string
  defaultText: string
  customText?: string
  context: TextContext
  description?: string
  locale?: string
}

export interface TextCollection {
  [key: string]: TextContent
}

export interface TextManagerConfig {
  defaultLocale: string
  fallbackToDefault: boolean
  enableCustomization: boolean
}

export interface TextExport {
  version: string
  exportDate: string
  locale: string
  texts: TextCollection
}
