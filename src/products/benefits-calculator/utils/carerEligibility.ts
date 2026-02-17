/**
 * Carer Eligibility Calculation Utilities
 * Logic for assessing UC Carer Element and Carer's Allowance eligibility
 */

import type {
  CarerAssessment,
  CarerEligibilityResult,
} from '../types/carer-module'
import { CARER_ELIGIBILITY_RULES } from '../types/carer-module'

/**
 * Assesses eligibility for both UC Carer Element and Carer's Allowance
 */
export function assessCarerEligibility(
  data: Partial<CarerAssessment>
): CarerEligibilityResult {
  const issues: string[] = []
  let eligibleForUCCarer = true
  let eligibleForCA = true

  // Must be a carer
  if (!data.isCarer) {
    return {
      eligibleForUCCarerElement: false,
      eligibleForCarersAllowance: false,
      issues: ['Not identified as a carer'],
      recommendation: 'If you provide care, please indicate this in the assessment.',
    }
  }

  // Check hours of care
  const hours = data.hoursPerWeek || 0
  if (hours < CARER_ELIGIBILITY_RULES.minHoursPerWeek) {
    issues.push(
      `You must provide care for at least ${CARER_ELIGIBILITY_RULES.minHoursPerWeek} hours per week (currently: ${hours} hours)`
    )
    eligibleForUCCarer = false
    eligibleForCA = false
  }

  // Check person being cared for receives qualifying benefit
  if (!data.personBeingCaredFor?.receivesBenefit) {
    issues.push(
      'The person you care for must receive a qualifying disability benefit (PIP Daily Living, Attendance Allowance, etc.)'
    )
    eligibleForUCCarer = false
    eligibleForCA = false
  }

  // Check if qualifying benefit type is specified
  if (
    data.personBeingCaredFor?.receivesBenefit &&
    !data.personBeingCaredFor?.benefitType
  ) {
    issues.push('Please specify which qualifying benefit the person receives')
    eligibleForUCCarer = false
    eligibleForCA = false
  }

  // Check earnings for Carer's Allowance only
  const weeklyEarnings = data.weeklyEarnings || 0
  if (weeklyEarnings > CARER_ELIGIBILITY_RULES.maxEarningsPerWeekForCA) {
    issues.push(
      `Your earnings (£${weeklyEarnings.toFixed(2)}/week) exceed the £${CARER_ELIGIBILITY_RULES.maxEarningsPerWeekForCA}/week limit for Carer's Allowance`
    )
    eligibleForCA = false
    // Note: Still eligible for UC Carer Element
  }

  return {
    eligibleForUCCarerElement: eligibleForUCCarer,
    eligibleForCarersAllowance: eligibleForCA,
    issues,
    recommendation: getRecommendation(eligibleForUCCarer, eligibleForCA, weeklyEarnings),
  }
}

/**
 * Generates a recommendation based on eligibility results
 */
function getRecommendation(
  ucEligible: boolean,
  caEligible: boolean,
  earnings: number
): string {
  if (!ucEligible && !caEligible) {
    return 'Unfortunately, you do not appear to meet the eligibility criteria for either the UC Carer Element or Carer\'s Allowance. Please check the requirements above.'
  }

  if (ucEligible && !caEligible) {
    return 'You are eligible for the UC Carer Element (£201.68/month). This will be automatically included in your Universal Credit payment.'
  }

  if (!ucEligible && caEligible) {
    return 'You are eligible for Carer\'s Allowance (£81.90/week). Note that this will be deducted pound-for-pound from your Universal Credit payment, but may qualify you for other benefits.'
  }

  // Both eligible - which is better?
  if (earnings < 100) {
    return 'You are eligible for both. Consider claiming Carer\'s Allowance (£81.90/week) as you have low earnings. Although it will be deducted from UC, it may qualify you for other benefits like a Council Tax discount.'
  }

  return 'You are eligible for both the UC Carer Element and Carer\'s Allowance. The UC Carer Element is simpler (automatically included in UC), while Carer\'s Allowance is a separate payment that may unlock other benefits. Discuss with an adviser which is best for your situation.'
}

/**
 * Converts monthly earnings to weekly
 */
export function monthlyToWeeklyEarnings(monthlyEarnings: number): number {
  return (monthlyEarnings * 12) / 52
}

/**
 * Converts weekly earnings to monthly
 */
export function weeklyToMonthlyEarnings(weeklyEarnings: number): number {
  return (weeklyEarnings * 52) / 12
}

/**
 * Validates hours input
 */
export function validateHours(hours: number): string | null {
  if (hours < 0) {
    return 'Hours cannot be negative'
  }
  if (hours > 168) {
    return 'There are only 168 hours in a week'
  }
  if (hours > 0 && hours < CARER_ELIGIBILITY_RULES.minHoursPerWeek) {
    return `You need to provide at least ${CARER_ELIGIBILITY_RULES.minHoursPerWeek} hours of care per week to qualify`
  }
  return null
}

/**
 * Validates earnings input
 */
export function validateEarnings(earnings: number): string | null {
  if (earnings < 0) {
    return 'Earnings cannot be negative'
  }
  return null
}
