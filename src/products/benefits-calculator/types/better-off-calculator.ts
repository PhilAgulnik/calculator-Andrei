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
  childBenefit?: IncomeBreakdown
  scottishChildPayment?: IncomeBreakdown
  /** Universal FSM (Scotland P1-P5 / Wales primary) — always eligible regardless of earnings */
  freeSchoolMealsUniversal?: IncomeBreakdown
  /** Means-tested FSM — can be lost in work if earnings exceed the threshold */
  freeSchoolMealsMeansTested?: IncomeBreakdown
  /** Whether means-tested FSM is still eligible at the modelled in-work earnings */
  inWorkMeansTestedFsmEligible?: boolean
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
  /** Child Benefit monthly amount (unchanged by employment) */
  childBenefitMonthly?: number
  /** Scottish Child Payment monthly amount (out-of-work) */
  scpMonthly?: number
  /** Universal FSM monthly value (Scotland P1-P5 / Wales primary); null means not opted in */
  fsmUniversalMonthly?: number | null
  /** Means-tested FSM monthly value; null means not opted in */
  fsmMeansTestedMonthly?: number | null
  /** True if means-tested FSM eligible out of work but no value opted in — triggers a note */
  fsmEligibleOutOfWork?: boolean
  /** Annual earnings threshold for means-tested FSM in their area */
  fsmAnnualEarningsThreshold?: number
  /** Whether the user has opted to include the estimated FSM value in the comparison */
  fsmValueIncluded?: boolean
  /** Callback when the user toggles the FSM include checkbox in the BOC */
  onFsmValueIncludedChange?: (v: boolean) => void
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
