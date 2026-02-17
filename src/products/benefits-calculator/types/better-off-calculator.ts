/**
 * Better-Off Calculator Types
 * TypeScript interfaces for the Better-Off Calculator component
 */

/**
 * Time period options for costs
 */
export type CostPeriod = 'perWeek' | 'per4Weeks' | 'perMonth' | 'perYear'

/**
 * Employment type
 */
export type EmploymentType = 'employee' | 'self-employed'

/**
 * Calculation period for displaying results
 */
export type CalculationPeriod = 'weekly' | '4weeks' | 'monthly'

/**
 * Individual cost category with multiple time period options
 */
export interface CostCategory {
  perWeek: number
  per4Weeks: number
  perMonth: number
  perYear: number
}

/**
 * All cost categories for the Better-Off Calculator
 */
export interface CostsData {
  childcare: CostCategory
  schoolMeals: CostCategory
  prescriptions: CostCategory
  workClothing: CostCategory
  workTravel: CostCategory
  otherWorkCosts: CostCategory
  energySavings: CostCategory
  otherSavings: CostCategory
}

/**
 * Work/employment details
 */
export interface WorkData {
  employmentType: EmploymentType
  hoursPerWeek: number
  hourlyWage: number
  calculationPeriod: CalculationPeriod
}

/**
 * Income breakdown structure (used for before/after comparison)
 */
export interface IncomeBreakdown {
  current: number
  inWork: number
  impact: number
}

/**
 * Work costs summary
 */
export interface WorkCostsSummary {
  total: number
  savings: number
  net: number
}

/**
 * Complete calculation result
 */
export interface BetterOffCalculation {
  grossEarnings: IncomeBreakdown
  netEarnings: IncomeBreakdown
  universalCredit: IncomeBreakdown
  totalIncome: IncomeBreakdown
  workCosts: WorkCostsSummary
  betterOffAmount: number
  calculationPeriod: CalculationPeriod
}

/**
 * Props for the BetterOffCalculator component
 */
export interface BetterOffCalculatorProps {
  /** Current UC amount from main calculator */
  currentUCAmount: number
  /** Whether the household has housing costs (affects work allowance) */
  hasHousingCosts: boolean
  /** Whether the household has children */
  hasChildren?: boolean
  /** Whether the main person has LCWRA */
  hasLCWRA?: boolean
  /** Callback when calculation is complete */
  onCalculationComplete?: (result: BetterOffCalculation) => void
}

/**
 * Helper type for cost category keys
 */
export type CostCategoryKey = keyof CostsData

/**
 * Cost category metadata for display
 */
export interface CostCategoryMeta {
  key: CostCategoryKey
  label: string
  description: string
  isSaving?: boolean
}
