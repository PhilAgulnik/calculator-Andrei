/**
 * Child Benefit High Income Charge Calculator
 * Calculates HICBC (High Income Child Benefit Charge) for families with adjusted net income over £60,000
 */

import {
  CHILD_BENEFIT_RATES,
  HICBC_THRESHOLDS,
} from '../types/child-benefit-charge'
import type {
  ChildBenefitChargeInputs,
  ChildBenefitChargeCalculation,
  HICBCScenarioComparison,
} from '../types/child-benefit-charge'

/**
 * Calculates the High Income Child Benefit Charge
 * @param inputs Child benefit charge inputs (incomes and number of children)
 * @returns Detailed calculation breakdown
 */
export function calculateChildBenefitCharge(
  inputs: ChildBenefitChargeInputs
): ChildBenefitChargeCalculation {
  const {
    claimantIncome,
    partnerIncome,
    numberOfChildren,
    firstChildRate,
    additionalChildRate,
  } = inputs

  // 1. Calculate total annual Child Benefit
  const firstChildCB = firstChildRate * 52 // Convert weekly to annual
  const additionalCB =
    numberOfChildren > 1 ? additionalChildRate * 52 * (numberOfChildren - 1) : 0
  const totalChildBenefit = firstChildCB + additionalCB
  const totalChildBenefitWeekly = totalChildBenefit / 52

  // 2. Determine which income is higher (charge based on higher earner)
  const higherIncome = Math.max(claimantIncome, partnerIncome || 0)

  // 3. Check if charge applies (income must exceed £60,000)
  const threshold = HICBC_THRESHOLDS.startThreshold
  const fullClawbackThreshold = HICBC_THRESHOLDS.fullClawbackThreshold

  if (higherIncome <= threshold) {
    // No charge if income at or below threshold
    return {
      totalChildBenefit,
      totalChildBenefitWeekly,
      higherIncome,
      incomeOverThreshold: 0,
      chargePercentage: 0,
      annualCharge: 0,
      monthlyCharge: 0,
      netBenefit: totalChildBenefit,
      netBenefitMonthly: totalChildBenefit / 12,
      shouldOptOut: false,
      effectiveRate: 0,
      isSubjectToCharge: false,
    }
  }

  // 4. Calculate charge percentage (1% per £200 over threshold)
  const incomeOverThreshold = higherIncome - threshold
  const chargePercentage = Math.min(100, (incomeOverThreshold / HICBC_THRESHOLDS.chargeRate))

  // 5. Calculate annual charge
  const annualCharge = (totalChildBenefit * chargePercentage) / 100
  const monthlyCharge = annualCharge / 12

  // 6. Calculate net benefit (CB received minus charge)
  const netBenefit = totalChildBenefit - annualCharge
  const netBenefitMonthly = netBenefit / 12

  // 7. Determine if should opt out (if charge >= benefit, better to opt out)
  const shouldOptOut = annualCharge >= totalChildBenefit

  // 8. Calculate effective marginal rate impact
  // HICBC effectively adds 1% per £200 to marginal tax rate
  // For every £100 earned, you lose £(totalChildBenefit/20000) of CB
  const effectiveRate =
    incomeOverThreshold > 0 ? (annualCharge / incomeOverThreshold) * 100 : 0

  return {
    totalChildBenefit,
    totalChildBenefitWeekly,
    higherIncome,
    incomeOverThreshold,
    chargePercentage,
    annualCharge,
    monthlyCharge,
    netBenefit,
    netBenefitMonthly,
    shouldOptOut,
    effectiveRate,
    isSubjectToCharge: true,
  }
}

/**
 * Generates scenario comparisons (keep CB vs opt out vs register only)
 * @param calculation The HICBC calculation result
 * @returns Array of scenario comparisons
 */
export function generateScenarioComparisons(
  calculation: ChildBenefitChargeCalculation
): HICBCScenarioComparison[] {
  return [
    {
      scenario: 'keep',
      childBenefitReceived: calculation.totalChildBenefit,
      chargeOwed: calculation.annualCharge,
      netAmount: calculation.netBenefit,
      niCreditsPreserved: true,
      description:
        'Claim Child Benefit and pay the High Income Charge. You keep the net amount after paying the charge.',
    },
    {
      scenario: 'optOut',
      childBenefitReceived: 0,
      chargeOwed: 0,
      netAmount: 0,
      niCreditsPreserved: false,
      description:
        'Opt out of receiving Child Benefit payments. No charge to pay, but you lose NI credits for non-working parent.',
    },
    {
      scenario: 'registerOnly',
      childBenefitReceived: 0,
      chargeOwed: 0,
      netAmount: 0,
      niCreditsPreserved: true,
      description:
        'Register for Child Benefit but opt out of payment. No charge to pay, and NI credits are preserved.',
    },
  ]
}

/**
 * Validates income inputs
 * @param income Income to validate
 * @returns Error message if invalid, null if valid
 */
export function validateIncome(income: number | undefined): string | null {
  if (income === undefined || income === null) {
    return null // Optional field
  }

  if (income < 0) {
    return 'Income cannot be negative'
  }

  if (income > 10000000) {
    return 'Income value seems unrealistic'
  }

  return null
}

/**
 * Formats the charge percentage for display
 * @param percentage Charge percentage (0-100)
 * @returns Formatted string
 */
export function formatChargePercentage(percentage: number): string {
  if (percentage === 0) return '0%'
  if (percentage === 100) return '100%'
  return `${percentage.toFixed(1)}%`
}

/**
 * Calculates adjusted net income helper text
 * This is a simplified explanation - actual calculation is complex
 */
export const ADJUSTED_NET_INCOME_EXPLANATION = `
Adjusted net income is your total taxable income, minus:
- Personal pension contributions (not employer contributions)
- Gift Aid donations
- Trading losses

It is NOT your take-home pay. It's calculated before tax deductions.

Your adjusted net income is typically:
- Slightly less than your gross salary if you pay into a pension
- Equal to your gross salary if you don't contribute to a pension
- Higher than your gross salary if you have other income (savings, rental, etc.)

For an accurate calculation, check your Self Assessment tax return or P60.
`.trim()
