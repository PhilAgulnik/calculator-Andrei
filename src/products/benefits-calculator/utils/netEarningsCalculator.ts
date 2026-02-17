/**
 * Net Earnings Calculator Utilities
 * Functions for calculating tax, NI, pension, student loan deductions
 */


import type {
  GrossEarnings,
  TaxCalculation,
  NICalculation,
  PensionContribution,
  StudentLoanRepayment,
  NetEarningsCalculation,
  CalculationOptions,
} from '../types/net-earnings'
import {
  TAX_RATES_2025_26,
  NI_RATES_2025_26,
  STUDENT_LOAN_THRESHOLDS_2025_26,
} from '../types/net-earnings'

/**
 * Converts any period amount to annual
 */
export function convertToAnnual(amount: number, period: string, hours?: number): number {
  switch (period) {
    case 'hour':
    case 'per_hour':
      return amount * (hours || 37.5) * 52 // Default to 37.5 hours/week if not specified
    case 'week':
    case 'per_week':
      return amount * 52
    case 'month':
    case 'per_month':
      return amount * 12
    case 'year':
    case 'per_year':
      return amount
    default:
      return amount * 12 // Default to monthly
  }
}

/**
 * Converts annual amount to monthly
 */
export function annualToMonthly(annual: number): number {
  return annual / 12
}

/**
 * Converts annual amount to weekly
 */
export function annualToWeekly(annual: number): number {
  return annual / 52
}

/**
 * Calculates income tax based on 2025-26 tax bands
 */
export function calculateIncomeTax(grossAnnual: number): TaxCalculation {
  const TAX_RATES = TAX_RATES_2025_26

  // Calculate taxable income (gross - personal allowance)
  let taxableIncome = grossAnnual - TAX_RATES.personalAllowance
  taxableIncome = Math.max(0, taxableIncome)

  let basicRateTax = 0
  let higherRateTax = 0
  let additionalRateTax = 0

  // Basic rate: 20% on £12,571 - £50,270
  if (taxableIncome > 0) {
    const basicRateBand = TAX_RATES.basicRate.limit - TAX_RATES.basicRate.threshold
    const taxableAtBasicRate = Math.min(taxableIncome, basicRateBand)
    basicRateTax = taxableAtBasicRate * TAX_RATES.basicRate.rate
  }

  // Higher rate: 40% on £50,271 - £125,140
  if (taxableIncome > TAX_RATES.higherRate.threshold - TAX_RATES.personalAllowance) {
    const higherRateBand = TAX_RATES.higherRate.limit - TAX_RATES.higherRate.threshold
    const inHigherBand =
      taxableIncome - (TAX_RATES.higherRate.threshold - TAX_RATES.personalAllowance)
    const taxableAtHigherRate = Math.min(inHigherBand, higherRateBand)
    higherRateTax = taxableAtHigherRate * TAX_RATES.higherRate.rate
  }

  // Additional rate: 45% above £125,140
  if (
    taxableIncome >
    TAX_RATES.additionalRate.threshold - TAX_RATES.personalAllowance
  ) {
    const inAdditionalBand =
      taxableIncome - (TAX_RATES.additionalRate.threshold - TAX_RATES.personalAllowance)
    additionalRateTax = inAdditionalBand * TAX_RATES.additionalRate.rate
  }

  const totalTax = basicRateTax + higherRateTax + additionalRateTax

  return {
    grossAnnual,
    personalAllowance: TAX_RATES.personalAllowance,
    taxableIncome,
    basicRateTax,
    higherRateTax,
    additionalRateTax,
    totalTax,
    effectiveRate: grossAnnual > 0 ? (totalTax / grossAnnual) * 100 : 0,
  }
}

/**
 * Calculates National Insurance (Class 1 - Employee) based on 2025-26 rates
 */
export function calculateNationalInsurance(grossAnnual: number): NICalculation {
  const NI_RATES = NI_RATES_2025_26

  let rate8Percent = 0
  let rate2Percent = 0

  // 8% on earnings between £12,570 and £50,270
  if (grossAnnual > NI_RATES.primaryThreshold) {
    const earningsInBand = Math.min(
      grossAnnual - NI_RATES.primaryThreshold,
      NI_RATES.upperEarningsLimit - NI_RATES.primaryThreshold
    )
    rate8Percent = earningsInBand * NI_RATES.rate8Percent
  }

  // 2% on earnings above £50,270
  if (grossAnnual > NI_RATES.upperEarningsLimit) {
    const earningsAboveUEL = grossAnnual - NI_RATES.upperEarningsLimit
    rate2Percent = earningsAboveUEL * NI_RATES.rate2Percent
  }

  const totalNI = rate8Percent + rate2Percent

  return {
    grossAnnual,
    class1Primary: totalNI,
    lowerEarningsLimit: NI_RATES.lowerEarningsLimit,
    primaryThreshold: NI_RATES.primaryThreshold,
    upperEarningsLimit: NI_RATES.upperEarningsLimit,
    rate12Percent: rate8Percent, // Keep old property name for compatibility
    rate2Percent,
    totalNI,
    effectiveRate: grossAnnual > 0 ? (totalNI / grossAnnual) * 100 : 0,
  }
}

/**
 * Calculates pension contribution
 */
export function calculatePensionContribution(
  grossAnnual: number,
  percentage: number
): PensionContribution {
  const employeeContribution = grossAnnual * (percentage / 100)

  return {
    enabled: true,
    percentage,
    employeeContributionAnnual: employeeContribution,
    employerContributionAnnual: employeeContribution, // Typically employer matches
    totalContributionAnnual: employeeContribution * 2,
    taxRelief: employeeContribution * 0.2, // Basic rate tax relief
  }
}

/**
 * Calculates student loan repayment
 */
export function calculateStudentLoanRepayment(
  grossAnnual: number,
  plan: 'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgraduate'
): StudentLoanRepayment {
  const THRESHOLDS = STUDENT_LOAN_THRESHOLDS_2025_26
  const loanDetails = THRESHOLDS[plan]

  let repayment = 0
  if (grossAnnual > loanDetails.threshold) {
    repayment = (grossAnnual - loanDetails.threshold) * loanDetails.rate
  }

  return {
    enabled: true,
    plan,
    threshold: loanDetails.threshold,
    rate: loanDetails.rate,
    repaymentAnnual: repayment,
  }
}

/**
 * Complete net earnings calculation
 */
export function calculateNetEarnings(
  input: GrossEarnings,
  options?: CalculationOptions
): NetEarningsCalculation {
  // Convert to annual gross
  const grossAnnual = convertToAnnual(input.amount, input.period, input.hours)

  // Calculate deductions
  const tax = calculateIncomeTax(grossAnnual)
  const ni = calculateNationalInsurance(grossAnnual)

  let pension: PensionContribution | undefined
  let pensionDeduction = 0
  if (options?.pension?.enabled && options.pension.percentage > 0) {
    pension = calculatePensionContribution(grossAnnual, options.pension.percentage)
    pensionDeduction = pension.employeeContributionAnnual
  }

  let studentLoan: StudentLoanRepayment | undefined
  let studentLoanDeduction = 0
  if (options?.studentLoan?.enabled) {
    studentLoan = calculateStudentLoanRepayment(grossAnnual, options.studentLoan.plan)
    studentLoanDeduction = studentLoan.repaymentAnnual
  }

  // Calculate net
  const netAnnual =
    grossAnnual - tax.totalTax - ni.totalNI - pensionDeduction - studentLoanDeduction
  const monthlyNet = annualToMonthly(netAnnual)
  const weeklyNet = annualToWeekly(netAnnual)

  return {
    gross: input,
    tax,
    ni,
    pension,
    studentLoan,
    netEarnings: netAnnual,
    monthlyNet,
    weeklyNet,
    takeHomePercentage: grossAnnual > 0 ? (netAnnual / grossAnnual) * 100 : 0,
  }
}

/**
 * Validates earnings input
 */
export function validateEarningsInput(amount: number, period: string): string | null {
  if (amount < 0) {
    return 'Earnings cannot be negative'
  }

  if (amount === 0) {
    return null // Allow zero earnings
  }

  // Sanity checks for unrealistic values
  switch (period) {
    case 'hour':
      if (amount > 1000) {
        return 'Hourly rate seems unusually high. Please check the amount.'
      }
      break
    case 'week':
      if (amount > 50000) {
        return 'Weekly earnings seem unusually high. Please check the amount.'
      }
      break
    case 'month':
      if (amount > 200000) {
        return 'Monthly earnings seem unusually high. Please check the amount.'
      }
      break
    case 'year':
      if (amount > 2000000) {
        return 'Annual earnings seem unusually high. Please check the amount.'
      }
      break
  }

  return null
}
