/**
 * Net Earnings Module Types
 * Types and interfaces for net earnings calculations including tax, NI, pension, and student loans
 */

export interface GrossEarnings {
  amount: number
  period: 'hour' | 'week' | 'month' | 'year'
  hours?: number // If hourly rate
}

export interface TaxCalculation {
  grossAnnual: number
  personalAllowance: number
  taxableIncome: number
  basicRateTax: number // 20% on £12,571-£50,270
  higherRateTax: number // 40% on £50,271-£125,140
  additionalRateTax: number // 45% above £125,140
  totalTax: number
  effectiveRate: number // percentage
}

export interface NICalculation {
  grossAnnual: number
  class1Primary: number // Employee NI
  lowerEarningsLimit: number // £6,396/year (£123/week)
  primaryThreshold: number // £12,570/year
  upperEarningsLimit: number // £50,270/year (£967/week)
  rate8Percent: number // 8% on £12,570-£50,270
  rate2Percent: number // 2% above £50,270
  totalNI: number
  effectiveRate: number
}

export interface PensionContribution {
  enabled: boolean
  percentage: number // e.g. 5% for auto-enrolment
  employeeContributionAnnual: number
  employerContributionAnnual?: number
  totalContributionAnnual?: number
  taxRelief?: number
}

export interface StudentLoanRepayment {
  enabled: boolean
  plan: 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgraduate'
  threshold: number
  rate: number // 9% for most plans
  repaymentAnnual: number
}

export interface NetEarningsCalculation {
  gross: GrossEarnings
  tax: TaxCalculation
  ni: NICalculation
  pension?: PensionContribution
  studentLoan?: StudentLoanRepayment
  netEarnings: number
  monthlyNet: number
  weeklyNet: number
  takeHomePercentage: number
}

export interface NetEarningsModuleProps {
  initialGross?: GrossEarnings
  enableManualOverride?: boolean
  onCalculationComplete: (result: NetEarningsCalculation) => void
}

export interface CalculationOptions {
  pension?: {
    enabled: boolean
    percentage: number
  }
  studentLoan?: {
    enabled: boolean
    plan: 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgraduate'
  }
}

// Tax Year 2025-26 Rates
export const TAX_RATES_2025_26 = {
  personalAllowance: 12570,
  basicRate: {
    threshold: 12570,
    limit: 50270,
    rate: 0.2,
  },
  higherRate: {
    threshold: 50270,
    limit: 125140,
    rate: 0.4,
  },
  additionalRate: {
    threshold: 125140,
    rate: 0.45,
  },
}

// National Insurance Rates 2025-26 (Class 1 - Employee)
export const NI_RATES_2025_26 = {
  lowerEarningsLimit: 6396, // No NI below this
  primaryThreshold: 12570, // Start paying 8%
  upperEarningsLimit: 50270, // Above this, pay 2%
  rate8Percent: 0.08,
  rate2Percent: 0.02,
}

// Student Loan Thresholds 2025-26
export const STUDENT_LOAN_THRESHOLDS_2025_26 = {
  plan1: { threshold: 24990, rate: 0.09 },
  plan2: { threshold: 27295, rate: 0.09 },
  plan4: { threshold: 31395, rate: 0.09 }, // Scotland
  plan5: { threshold: 25000, rate: 0.09 }, // Post-2023 loans
  postgraduate: { threshold: 21000, rate: 0.06 },
}

// Tax Year 2026-27 Rates (frozen until 2031)
export const TAX_RATES_2026_27 = {
  personalAllowance: 12570,
  basicRate: {
    threshold: 12570,
    limit: 50270,
    rate: 0.2,
  },
  higherRate: {
    threshold: 50270,
    limit: 125140,
    rate: 0.4,
  },
  additionalRate: {
    threshold: 125140,
    rate: 0.45,
  },
}

// National Insurance Rates 2026-27 (Class 1 - Employee) - frozen until 2031
export const NI_RATES_2026_27 = {
  lowerEarningsLimit: 6396, // No NI below this
  primaryThreshold: 12570, // Start paying 8%
  upperEarningsLimit: 50270, // Above this, pay 2%
  rate8Percent: 0.08,
  rate2Percent: 0.02,
}

// Student Loan Thresholds 2026-27
export const STUDENT_LOAN_THRESHOLDS_2026_27 = {
  plan1: { threshold: 26900, rate: 0.09 },
  plan2: { threshold: 29385, rate: 0.09 },
  plan4: { threshold: 33795, rate: 0.09 }, // Scotland
  plan5: { threshold: 25000, rate: 0.09 }, // Post-2023 loans (frozen until April 2027)
  postgraduate: { threshold: 21000, rate: 0.06 }, // Frozen since 2016
}

// Period conversion rates
export const PERIOD_CONVERSION = {
  hour_to_year: (hours: number, rate: number) => rate * hours * 52, // Assume 52 weeks
  week_to_year: 52,
  month_to_year: 12,
  year_to_year: 1,
}
