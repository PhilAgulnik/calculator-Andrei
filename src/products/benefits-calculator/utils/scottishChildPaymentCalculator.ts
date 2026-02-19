/**
 * Scottish Child Payment Calculator
 *
 * Calculates SCP entitlement based on:
 * - Must be in Scotland
 * - Must have children under 16
 * - Must be receiving Universal Credit (award > £0)
 *
 * Rate 2025/26: £27.15/week per eligible child under 16
 * Paid every 4 weeks. No limit on number of children.
 */

import {
  SCP_RATES,
  type ScottishChildPaymentResult,
  type ScottishChildPaymentChild,
} from '../types/scottish-child-payment'

interface SCPInput {
  area: string
  children: number
  childrenInfo?: { age: number }[]
  taxYear?: string
}

interface SCPUCResults {
  calculation?: {
    finalAmount: number
    totalElements: number
    workAllowance: number
    capitalDeduction: number
    benefitDeduction: number
    studentIncomeDeduction: number
  }
}

function buildEmptyResult(
  overrides: Partial<ScottishChildPaymentResult>
): ScottishChildPaymentResult {
  return {
    isScotland: false,
    eligible: false,
    reason: '',
    eligibleChildCount: 0,
    totalChildCount: 0,
    weeklyRate: 0,
    weeklyAmount: 0,
    fourWeeklyAmount: 0,
    monthlyEquivalent: 0,
    yearlyAmount: 0,
    taxYear: '2025_26',
    children: [],
    ucAmount: 0,
    earningsThresholdForUC: null,
    ...overrides,
  }
}

export function calculateScottishChildPayment(
  data: SCPInput,
  ucResults: SCPUCResults
): ScottishChildPaymentResult {
  const isScotland = (data.area || '').toLowerCase() === 'scotland'
  const taxYear = data.taxYear || '2025_26'
  const weeklyRate = SCP_RATES[taxYear] || SCP_RATES['2025_26']
  const calc = ucResults?.calculation
  const ucAmount = calc?.finalAmount || 0
  const totalChildCount = data.children || 0

  if (!isScotland) {
    return buildEmptyResult({
      reason: 'Scottish Child Payment is only available in Scotland.',
      taxYear,
      totalChildCount,
    })
  }

  if (totalChildCount === 0) {
    return buildEmptyResult({
      isScotland: true,
      reason: 'No children in household.',
      taxYear,
    })
  }

  // Assess each child
  const childrenAssessment: ScottishChildPaymentChild[] = []
  const childAges = data.childrenInfo?.map((c) => c.age) || []

  if (childAges.length > 0) {
    for (const age of childAges) {
      if (age < 16) {
        childrenAssessment.push({ age, eligible: true, reason: 'Under 16' })
      } else {
        childrenAssessment.push({ age, eligible: false, reason: 'Age 16 or over' })
      }
    }
  } else {
    // No detailed info - assume all children are eligible
    for (let i = 0; i < totalChildCount; i++) {
      childrenAssessment.push({ age: 0, eligible: true, reason: 'Assumed under 16' })
    }
  }

  const eligibleChildCount = childrenAssessment.filter((c) => c.eligible).length

  if (eligibleChildCount === 0) {
    return buildEmptyResult({
      isScotland: true,
      reason: 'No children under 16 in household.',
      taxYear,
      totalChildCount,
      children: childrenAssessment,
      ucAmount,
    })
  }

  // Check UC entitlement
  if (ucAmount <= 0) {
    // Calculate the net earnings threshold where UC would become > 0
    let earningsThreshold: number | null = null
    if (calc) {
      const otherDeductions =
        (calc.capitalDeduction || 0) +
        (calc.benefitDeduction || 0) +
        (calc.studentIncomeDeduction || 0)
      const availableForTaper = calc.totalElements - otherDeductions
      if (availableForTaper > 0) {
        earningsThreshold = availableForTaper / 0.55 + (calc.workAllowance || 0)
      }
    }

    const weeklyAmount = weeklyRate * eligibleChildCount

    return buildEmptyResult({
      isScotland: true,
      eligible: false,
      reason:
        'Your Universal Credit entitlement is £0. Scottish Child Payment requires a UC award greater than zero.',
      eligibleChildCount,
      totalChildCount,
      weeklyRate,
      weeklyAmount,
      fourWeeklyAmount: weeklyAmount * 4,
      monthlyEquivalent: (weeklyAmount * 52) / 12,
      yearlyAmount: weeklyAmount * 52,
      taxYear,
      children: childrenAssessment,
      ucAmount,
      earningsThresholdForUC: earningsThreshold,
    })
  }

  // Eligible
  const weeklyAmount = weeklyRate * eligibleChildCount

  return {
    isScotland: true,
    eligible: true,
    reason: `Eligible for Scottish Child Payment for ${eligibleChildCount} child${eligibleChildCount !== 1 ? 'ren' : ''} under 16.`,
    eligibleChildCount,
    totalChildCount,
    weeklyRate,
    weeklyAmount,
    fourWeeklyAmount: weeklyAmount * 4,
    monthlyEquivalent: (weeklyAmount * 52) / 12,
    yearlyAmount: weeklyAmount * 52,
    taxYear,
    children: childrenAssessment,
    ucAmount,
    earningsThresholdForUC: null,
  }
}
