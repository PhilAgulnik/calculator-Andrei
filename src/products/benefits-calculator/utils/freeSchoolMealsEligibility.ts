/**
 * Free School Meals Eligibility Assessment
 *
 * Eligibility rules:
 * - England (2025/26): UC with net earned income <= £7,400/year
 * - England (2026/27+): UC > 0 (any UC entitlement — rule active from September 2026)
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
  FSM_MIN_SCHOOL_AGE,
  FSM_MAX_SCHOOL_AGE,
  SCOTLAND_UNIVERSAL_FSM_MIN_AGE,
  SCOTLAND_UNIVERSAL_FSM_MAX_AGE,
  WALES_UNIVERSAL_FSM_MIN_AGE,
  WALES_UNIVERSAL_FSM_MAX_AGE,
  LONDON_UNIVERSAL_FSM_MIN_AGE,
  LONDON_UNIVERSAL_FSM_MAX_AGE,
} from '../types/free-school-meals'

interface AssessmentData {
  area: string
  children: number
  childrenInfo?: { age: number }[]
  monthlyEarnings?: number
  partnerMonthlyEarnings?: number
  postcode?: string
  taxYear?: string
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
 * Checks if a postcode is in London (Mayor of London universal primary FSM scheme)
 */
function isLondonPostcode(postcode: string): boolean {
  const prefix = postcode.trim().toUpperCase().split(/\s/)[0]
  return /^(E|EC|N|NW|SE|SW|W|WC)\d/.test(prefix)
}

/**
 * Checks if a child in London qualifies for universal FSM provision (all primary)
 */
function isLondonUniversalEligible(age: number): boolean {
  return age >= LONDON_UNIVERSAL_FSM_MIN_AGE && age <= LONDON_UNIVERSAL_FSM_MAX_AGE
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

  const isEngland = normalizedArea === 'england'
  const isLondon = isEngland && !!data.postcode && isLondonPostcode(data.postcode)
  // September 2026 rule is active when computing for 2026/27 or later
  const isSept2026Active = (data.taxYear ?? '2025_26') >= '2026_27'

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

  // From September 2026, England only requires UC > 0
  const meetsFutureIncomeThreshold = isEngland ? hasUniversalCredit : meetsIncomeThreshold

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
  } else if (hasUniversalCredit && (meetsIncomeThreshold || (isEngland && isSept2026Active))) {
    // Currently eligible: UC > 0 AND (income within threshold OR England 2026/27+ rule active)
    currentlyEligible = true
    eligibilityReason = 'Your children are eligible for Free School Meals.'
  } else if (isEngland && hasUniversalCredit && !isSept2026Active) {
    // Income above threshold but will be eligible from September 2026 (UC > 0 rule)
    futureEligible = true
    eligibilityReason = 'Your children will be eligible for Free School Meals from September 2026 when the new rules take effect for all Universal Credit claimants.'
  } else if (!hasUniversalCredit) {
    eligibilityReason = 'You are not receiving Universal Credit. FSM eligibility requires receiving UC.'
  } else {
    // Has UC but income over threshold
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

    // London (Mayor of London scheme) universal provision for all primary school children
    if (isLondon && isLondonUniversalEligible(age)) {
      return {
        age,
        eligible: true,
        eligibleFromSeptember2026: false,
        reason: 'Universal Primary Free School Meals (Mayor of London)',
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
          ? 'Will be eligible from September 2026'
          : eligibilityReason,
    }
  })

  const anyUniversalChild = eligibleChildren.some(c => c.eligible && c.universalProvision)

  return {
    eligible: currentlyEligible || anyUniversalChild,
    eligibleFromSeptember2026: futureEligible,
    anyChildEligible: currentlyEligible || anyUniversalChild,
    anyChildEligibleFromSeptember2026: futureEligible,
    reason: eligibilityReason,
    country: countryName,
    threshold,
    futureThreshold: undefined, // No threshold — rule is just UC > 0
    netEarnedIncome,
    eligibleChildren,
    hasUniversalCredit,
    meetsIncomeThreshold,
    meetsFutureIncomeThreshold,
  }
}
