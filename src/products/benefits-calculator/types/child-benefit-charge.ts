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
  onCalculationComplete?: (result: ChildBenefitChargeCalculation) => void
}

// Child Benefit rates (2024/25 tax year)
export const CHILD_BENEFIT_RATES = {
  firstChild: 25.6, // £25.60 per week
  additionalChild: 16.95, // £16.95 per week per additional child
  taxYear: '2024/25',
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
