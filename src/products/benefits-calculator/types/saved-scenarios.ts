/**
 * Saved Scenarios Types
 * TypeScript interfaces for the Advanced Saved Scenarios feature
 */

/**
 * Saved scenario data structure (fixed version)
 */
export interface SavedScenario {
  id: string
  name: string
  description?: string
  taxYear: string
  savedAt: string // ISO timestamp
  lastModified?: string // ISO timestamp
  tags?: string[]
  formData: Record<string, any> // Raw form input data
  results: ScenarioResults
  betterOffData?: any // Optional Better-Off Calculator results
}

/**
 * Calculation results stored in scenario
 */
export interface ScenarioResults {
  success: boolean
  taxYear: string
  calculation: {
    standardAllowance: number
    housingElement: number
    childElement: number
    childcareElement: number
    carerElement: number
    lcwraElement: number
    totalElements: number
    workAllowance: number
    earningsReduction: number
    capitalDeduction: number
    benefitDeduction: number
    finalAmount: number
    lhaDetails?: any
  }
  warnings?: string[]
  calculatedAt: string
}

/**
 * Comparison field definition
 */
export interface ComparisonField {
  key: string
  label: string
  format: 'currency' | 'number' | 'boolean' | 'text' | 'date'
  getValue: (scenario: SavedScenario) => any
  category?: 'household' | 'income' | 'benefits' | 'deductions' | 'total'
}

/**
 * Scenario comparison data
 */
export interface ScenarioComparison {
  scenarios: SavedScenario[]
  fields: ComparisonField[]
  differences: Map<string, number[]> // field key -> array of differences
}

/**
 * Props for SavedScenarios component
 */
export interface SavedScenariosProps {
  currentScenario?: SavedScenario
  onLoadScenario: (scenario: SavedScenario) => void
  onSaveScenario: (name: string, description?: string) => void
}

/**
 * Props for ScenarioComparison component
 */
export interface ScenarioComparisonProps {
  scenarios: SavedScenario[]
  onClose: () => void
  onLoadScenario?: (scenario: SavedScenario) => void
}

/**
 * Scenario save dialog data
 */
export interface ScenarioSaveData {
  name: string
  description?: string
  tags?: string[]
}

/**
 * Scenario filter options
 */
export interface ScenarioFilter {
  searchTerm?: string
  taxYear?: string
  tags?: string[]
  sortBy: 'date' | 'name' | 'amount'
  sortOrder: 'asc' | 'desc'
}

/**
 * Export format for scenarios
 */
export interface ScenarioExport {
  version: string
  exportedAt: string
  scenarios: SavedScenario[]
  metadata?: {
    source: string
    calculatorVersion: string
  }
}
