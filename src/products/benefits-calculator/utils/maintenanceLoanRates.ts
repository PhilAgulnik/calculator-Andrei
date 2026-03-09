/**
 * Maximum maintenance loan rates for UC purposes (2025/26 academic year, England).
 *
 * UC regulations require the MAXIMUM loan a student is entitled to be used,
 * even if they chose to borrow less. These rates help users identify their
 * likely maximum based on living situation.
 *
 * Source: Student Finance England — Plan 2 maintenance loan rates 2025/26
 * https://www.gov.uk/student-finance/new-fulltime-students
 */

export type LivingSituation = 'at_home' | 'away_not_london' | 'away_london'

export interface MaintenanceLoanRates {
  /** Standard maximum for non-benefits-eligible students */
  standard: number
  /** Higher maximum for students on benefits (e.g. UC, income support) */
  benefitsEligible: number
}

/**
 * 2025/26 maximum maintenance loan rates (England, full-year basis).
 * These are the annualised amounts for a standard 39-week course.
 */
export const MAINTENANCE_LOAN_RATES_2025_26: Record<LivingSituation, MaintenanceLoanRates> = {
  at_home: {
    standard: 8877,
    benefitsEligible: 10473,
  },
  away_not_london: {
    standard: 10544,
    benefitsEligible: 12019,
  },
  away_london: {
    standard: 13762,
    benefitsEligible: 15008,
  },
}

export const LIVING_SITUATION_LABELS: Record<LivingSituation, string> = {
  at_home: 'Living at home with parents',
  away_not_london: 'Living away from home (outside London)',
  away_london: 'Living away from home (in London)',
}

/**
 * Checks if a postcode is in a London area.
 * London postcodes start with: E, EC, N, NW, SE, SW, W, WC
 */
export function isLondonPostcode(postcode: string): boolean {
  const prefix = postcode.trim().toUpperCase().split(/\s/)[0]
  return /^(E|EC|N|NW|SE|SW|W|WC)\d/.test(prefix)
}

/**
 * Suggests a likely living situation based on the user's age and postcode.
 * - Under 25 with no postcode info → default to 'away_not_london'
 * - London postcode → 'away_london'
 * - Otherwise → 'away_not_london'
 *
 * This is a suggestion only — the user selects their actual situation.
 */
export function suggestLivingSituation(postcode?: string): LivingSituation {
  if (postcode && isLondonPostcode(postcode)) {
    return 'away_london'
  }
  return 'away_not_london'
}

/**
 * Returns the suggested maximum maintenance loan for a given living situation.
 * Uses the standard (non-benefits-eligible) rate as the default suggestion,
 * since benefits-eligible students would already know their higher entitlement.
 */
export function getSuggestedMaxLoan(livingSituation: LivingSituation): number {
  return MAINTENANCE_LOAN_RATES_2025_26[livingSituation].standard
}

