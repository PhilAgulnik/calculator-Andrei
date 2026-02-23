/**
 * Free School Meals Eligibility Assessment
 *
 * Eligibility rules:
 * - England: UC with net earned income <= £7,400/year (current)
 *            From September 2026: UC > 0 (any UC entitlement)
 * - Wales: Universal for all primary school children (ages 4-11)
 *          Secondary: UC with net earned income <= £7,400/year
 * - Scotland: Universal for P1-P5 (ages 4-10)
 *             P6+: UC with monthly earned income <= £850 (£10,200/year)
 * - Northern Ireland: UC with net earned income <= £14,000/year
 */

import {
  type FreeSchoolMealsResult,
  type FreeSchoolMealsChild,
  FSM_THRESHOLDS,
  FSM_ENGLAND_FUTURE_THRESHOLD,
  FSM_MIN_SCHOOL_AGE,
  FSM_MAX_SCHOOL_AGE,
  SCOTLAND_UNIVERSAL_FSM_MIN_AGE,
  SCOTLAND_UNIVERSAL_FSM_MAX_AGE,
  WALES_UNIVERSAL_FSM_MIN_AGE,
  WALES_UNIVERSAL_FSM_MAX_AGE,
} from '../types/free-school-meals'

interface AssessmentData {
  area: string
  children: number
  childrenInfo?: { age: number }[]
  monthlyEarnings?: number
  partnerMonthlyEarnings?: number
}

interface UCResults {
  calculation?: {
    finalAmount: number
  }
}

/**
 * Calculates annual net earned income from monthly earnings
 * Net earned income = gross earnings after tax and NI (not including benefits)
 */
function calculateAnnualNetEarnedIncome(
  monthlyEarnings: number = 0,
  partnerMonthlyEarnings: number = 0
): number {
  // For simplicity, we use the provided monthly earnings as net
  // In a full implementation, this would deduct tax and NI
  const totalMonthly = monthlyEarnings + partnerMonthlyEarnings
  return totalMonthly * 12
}

/**
 * Gets the FSM threshold for a given country/area
 */
function getThreshold(area: string): number {
  const normalizedArea = area.toLowerCase().replace(/ /g, '_')

  if (normalizedArea in FSM_THRESHOLDS) {
    return FSM_THRESHOLDS[normalizedArea as keyof typeof FSM_THRESHOLDS]
  }

  // Default to England threshold
  return FSM_THRESHOLDS.england
}

/**
 * Formats the country name for display
 */
function formatCountryName(area: string): string {
  const names: Record<string, string> = {
    england: 'England',
    wales: 'Wales',
    scotland: 'Scotland',
    northern_ireland: 'Northern Ireland',
  }
  return names[area.toLowerCase()] || area
}

/**
 * Checks if a child is of school age (eligible for FSM)
 */
function isSchoolAge(age: number): boolean {
  return age >= FSM_MIN_SCHOOL_AGE && age <= FSM_MAX_SCHOOL_AGE
}

/**
 * Checks if a child in Scotland qualifies for universal FSM provision (P1-P5)
 */
function isScotlandUniversalEligible(age: number): boolean {
  return age >= SCOTLAND_UNIVERSAL_FSM_MIN_AGE && age <= SCOTLAND_UNIVERSAL_FSM_MAX_AGE
}

/**
 * Checks if a child in Wales qualifies for universal FSM provision (all primary)
 */
function isWalesUniversalEligible(age: number): boolean {
  return age >= WALES_UNIVERSAL_FSM_MIN_AGE && age <= WALES_UNIVERSAL_FSM_MAX_AGE
}

/**
 * Assesses Free School Meals eligibility based on household data and UC calculation results
 */
export function assessFreeSchoolMealsEligibility(
  data: AssessmentData,
  ucResults: UCResults
): FreeSchoolMealsResult {
  const area = data.area || 'england'
  const normalizedArea = area.toLowerCase()
  const threshold = getThreshold(area)
  const countryName = formatCountryName(area)

  // England has new rules from September 2026: eligible if net earned income <= £20,000
  const isEngland = normalizedArea === 'england'

  // Calculate net earned income
  const netEarnedIncome = calculateAnnualNetEarnedIncome(
    data.monthlyEarnings,
    data.partnerMonthlyEarnings
  )

  // Check if receiving Universal Credit
  const ucAmount = ucResults?.calculation?.finalAmount || 0
  const hasUniversalCredit = ucAmount > 0

  // Check income thresholds
  const meetsIncomeThreshold = netEarnedIncome <= threshold

  // September 2026 rule for England: net earned income <= £20,000 (not just UC > 0)
  const meetsFutureIncomeThreshold = isEngland
    ? netEarnedIncome <= FSM_ENGLAND_FUTURE_THRESHOLD
    : meetsIncomeThreshold

  // No children = not applicable
  if (!data.children || data.children === 0) {
    return {
      eligible: false,
      eligibleFromSeptember2026: false,
      anyChildEligible: false,
      anyChildEligibleFromSeptember2026: false,
      reason: 'No children in household',
      country: countryName,
      threshold,
      futureThreshold: undefined,
      netEarnedIncome,
      eligibleChildren: [],
      hasUniversalCredit,
      meetsIncomeThreshold,
      meetsFutureIncomeThreshold,
    }
  }

  // Get child ages
  const childAges = data.childrenInfo?.map(c => c.age) || []

  // Check if any children are school age
  const hasSchoolAgeChildren = childAges.some(age => isSchoolAge(age))

  // Determine eligibility - if one child is eligible, all are
  let currentlyEligible = false
  let futureEligible = false
  let eligibilityReason = ''

  if (!hasSchoolAgeChildren) {
    eligibilityReason = 'No school-age children in household.'
  } else if (hasUniversalCredit && meetsIncomeThreshold) {
    // Currently eligible: UC > 0 AND income within current threshold
    currentlyEligible = true
    eligibilityReason = 'Your children are eligible for Free School Meals.'
  } else if (isEngland && meetsFutureIncomeThreshold) {
    // Not currently eligible, but will be from September 2026
    // This covers: income > £7,400 with UC, AND cases where UC = 0 but income <= £20,000
    futureEligible = true
    eligibilityReason = 'Your children will be eligible for Free School Meals from September 2026 when the new rules take effect for all Universal Credit claimants.'
  } else if (!hasUniversalCredit) {
    eligibilityReason = 'You are not receiving Universal Credit. FSM eligibility requires receiving UC.'
  } else {
    // Has UC but income over threshold (and not England, or income > £20,000)
    eligibilityReason = `Your annual net earned income (£${netEarnedIncome.toLocaleString()}) exceeds the £${threshold.toLocaleString()} threshold for ${countryName}.`
  }

  // Build eligible children list (simplified - all same status)
  const eligibleChildren: FreeSchoolMealsChild[] = childAges.map(age => {
    if (!isSchoolAge(age)) {
      return {
        age,
        eligible: false,
        eligibleFromSeptember2026: false,
        reason: age < FSM_MIN_SCHOOL_AGE ? 'Too young for school' : 'Over school age',
      }
    }

    // Scotland universal provision for P1-P5
    if (normalizedArea === 'scotland' && isScotlandUniversalEligible(age)) {
      return {
        age,
        eligible: true,
        eligibleFromSeptember2026: false,
        reason: 'Universal provision (P1-P5)',
        universalProvision: true,
      }
    }

    // Wales universal provision for all primary school children
    if (normalizedArea === 'wales' && isWalesUniversalEligible(age)) {
      return {
        age,
        eligible: true,
        eligibleFromSeptember2026: false,
        reason: 'Universal Primary Free School Meals',
        universalProvision: true,
      }
    }

    return {
      age,
      eligible: currentlyEligible,
      eligibleFromSeptember2026: futureEligible,
      reason: currentlyEligible
        ? 'Eligible through Universal Credit'
        : futureEligible
          ? 'Eligible from September 2026'
          : eligibilityReason,
    }
  })

  return {
    eligible: currentlyEligible,
    eligibleFromSeptember2026: futureEligible,
    anyChildEligible: currentlyEligible,
    anyChildEligibleFromSeptember2026: futureEligible,
    reason: eligibilityReason,
    country: countryName,
    threshold,
    futureThreshold: FSM_ENGLAND_FUTURE_THRESHOLD,
    netEarnedIncome,
    eligibleChildren,
    hasUniversalCredit,
    meetsIncomeThreshold,
    meetsFutureIncomeThreshold,
  }
}
