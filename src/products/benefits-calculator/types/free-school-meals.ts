/**
 * Free School Meals Eligibility Types
 */

export interface FreeSchoolMealsChild {
  age: number
  eligible: boolean
  eligibleFromSeptember2026?: boolean // For England future eligibility
  reason?: string
  universalProvision?: boolean // For Scotland P1-5 or Wales primary
}

export interface FreeSchoolMealsResult {
  eligible: boolean
  eligibleFromSeptember2026: boolean // New: eligible under future threshold but not current
  anyChildEligible: boolean
  anyChildEligibleFromSeptember2026: boolean
  reason: string
  country: string
  threshold: number
  futureThreshold?: number // England September 2026 threshold
  netEarnedIncome: number
  eligibleChildren: FreeSchoolMealsChild[]
  hasUniversalCredit: boolean
  meetsIncomeThreshold: boolean
  meetsFutureIncomeThreshold: boolean
}

/**
 * FSM income thresholds by country (annual net earned income)
 * Current thresholds (2025/26)
 */
export const FSM_THRESHOLDS = {
  england: 7400,
  wales: 7400, // For secondary school children only (primary is universal)
  scotland: 10200, // £850/month for children not covered by universal provision (P6+)
  northern_ireland: 14000,
} as const

/**
 * England future FSM threshold from September 2026
 * The government announced an increase to £20,000
 */
export const FSM_ENGLAND_FUTURE_THRESHOLD = 20000
export const FSM_ENGLAND_FUTURE_DATE = 'September 2026'

/**
 * Scotland universal provision age range (P1-P5)
 * Primary 1 starts at age 4-5, Primary 5 ends at age 9-10
 */
export const SCOTLAND_UNIVERSAL_FSM_MAX_AGE = 10
export const SCOTLAND_UNIVERSAL_FSM_MIN_AGE = 4

/**
 * Wales universal provision age range (all primary school)
 * Reception through Year 6 (ages 4-11)
 */
export const WALES_UNIVERSAL_FSM_MAX_AGE = 11
export const WALES_UNIVERSAL_FSM_MIN_AGE = 4

/**
 * London (Mayor of London scheme) universal provision age range (all primary school)
 * Reception through Year 6 (ages 4-11)
 */
export const LONDON_UNIVERSAL_FSM_MIN_AGE = 4
export const LONDON_UNIVERSAL_FSM_MAX_AGE = 11

/**
 * School age range for FSM eligibility
 */
export const FSM_MIN_SCHOOL_AGE = 4
export const FSM_MAX_SCHOOL_AGE = 18
