/**
 * Child Benefit High Income Charge Types
 * Types and interfaces for calculating HICBC (High Income Child Benefit Charge)
 */

export interface ChildBenefitChargeInputs {
  claimantIncome: number // Adjusted net income (annual)
  partnerIncome?: number // Optional partner adjusted net income
  numberOfChildren: number
  firstChildRate: number // Weekly CB rate for first child
  additionalChildRate: number // Weekly CB rate for additional children
}

export interface ChildBenefitChargeCalculation {
  totalChildBenefit: number // Annual Child Benefit amount
  totalChildBenefitWeekly: number // Weekly Child Benefit amount
  higherIncome: number // Highest of claimant/partner
  incomeOverThreshold: number // Amount over £60,000
  chargePercentage: number // 0-100% (1% per £200 over threshold)
  annualCharge: number // HICBC amount owed
  monthlyCharge: number // Monthly charge amount
  netBenefit: number // CB received minus charge
  netBenefitMonthly: number // Monthly net benefit
  shouldOptOut: boolean // True if charge >= benefit
  effectiveRate: number // Effective marginal tax rate increase
  isSubjectToCharge: boolean // True if income > threshold
}

export interface ChildBenefitChargeProps {
  numberOfChildren: number
  claimantIncome?: number
  partnerIncome?: number
  taxYear?: string
  onCalculationComplete?: (result: ChildBenefitChargeCalculation) => void
}

// Child Benefit rates by tax year
export const CHILD_BENEFIT_RATES_BY_YEAR: Record<string, { firstChild: number; additionalChild: number }> = {
  '2024_25': { firstChild: 25.60, additionalChild: 16.95 },
  '2025_26': { firstChild: 26.05, additionalChild: 17.25 },
  '2026_27': { firstChild: 27.05, additionalChild: 17.90 },
}

// Child Benefit rates (2025/26 tax year) — kept for backwards compatibility
export const CHILD_BENEFIT_RATES = {
  firstChild: 26.05, // £26.05 per week
  additionalChild: 17.25, // £17.25 per week per additional child
  taxYear: '2025/26',
}

// Helper to get CB rates for a given tax year (falls back to 2025/26)
export function getChildBenefitRates(taxYear?: string) {
  return CHILD_BENEFIT_RATES_BY_YEAR[taxYear ?? '2025_26'] ?? CHILD_BENEFIT_RATES_BY_YEAR['2025_26']
}

// HICBC thresholds
export const HICBC_THRESHOLDS = {
  startThreshold: 60000, // Charge starts at £60,000
  fullClawbackThreshold: 80000, // Full clawback at £80,000
  chargeRate: 200, // 1% charge per £200 over threshold
}

// Scenarios for comparison
export type HICBCScenario = 'keep' | 'optOut' | 'registerOnly'

export interface HICBCScenarioComparison {
  scenario: HICBCScenario
  childBenefitReceived: number // Annual amount
  chargeOwed: number // Annual charge
  netAmount: number // Net annual benefit
  niCreditsPreserved: boolean // Whether NI credits preserved for non-working parent
  description: string
}
