/**
 * PDF Export Types
 * TypeScript interfaces for PDF export functionality
 */

import type { SavedScenario } from './saved-scenarios'

/**
 * PDF export options
 */
export interface PDFExportOptions {
  includeCalculationBreakdown: boolean
  includeHouseholdDetails: boolean
  includeBetterOffComparison: boolean
  includeScenarioComparison: boolean
  includeDisclaimer: boolean
  filename?: string
}

/**
 * PDF document structure
 */
export interface PDFDocument {
  title: string
  subtitle: string
  generatedDate: Date
  sections: PDFSection[]
}

/**
 * PDF section
 */
export interface PDFSection {
  title: string
  content: PDFContent[]
}

/**
 * PDF content types
 */
export type PDFContent =
  | { type: 'text'; value: string; style?: TextStyle }
  | { type: 'table'; headers: string[]; rows: string[][]; style?: TableStyle }
  | { type: 'heading'; value: string; level: 1 | 2 | 3 }
  | { type: 'spacer'; height: number }
  | { type: 'line'; style?: LineStyle }

/**
 * Text style options
 */
export interface TextStyle {
  fontSize?: number
  fontWeight?: 'normal' | 'bold'
  color?: string
  align?: 'left' | 'center' | 'right'
}

/**
 * Table style options
 */
export interface TableStyle {
  headerBg?: string
  headerColor?: string
  rowBg?: string
  alternateRowBg?: string
  fontSize?: number
}

/**
 * Line style options
 */
export interface LineStyle {
  color?: string
  width?: number
}

/**
 * Props for PDFExport component
 */
export interface PDFExportProps {
  scenarioData: SavedScenario
  betterOffData?: any
  comparisonScenarios?: SavedScenario[]
  options?: Partial<PDFExportOptions>
  onExportComplete?: (success: boolean, error?: string) => void
}

/**
 * Default export options
 */
export const DEFAULT_PDF_OPTIONS: PDFExportOptions = {
  includeCalculationBreakdown: true,
  includeHouseholdDetails: true,
  includeBetterOffComparison: false,
  includeScenarioComparison: false,
  includeDisclaimer: true,
}
