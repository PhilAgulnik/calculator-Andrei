/**
 * Education Maintenance Allowance (EMA) Types
 *
 * EMA is a weekly payment for young people aged 16–19 (16–18 in Wales) in full-time
 * further education (school or college, up to Level 3). It is not available in England
 * (abolished 2011) and is means-tested on household income.
 *
 * Weekly rates (2025/26):
 *   - Wales: £40/week (ages 16–18)
 *   - Scotland: £30/week (ages 16–19)
 *   - Northern Ireland: £30/week (ages 16–19)
 *   - England: not available
 *
 * Income thresholds:
 *   - Wales: ≤ £23,400/year (1 eligible student); ≤ £25,974/year (2+ eligible students)
 *   - Scotland: ≤ £26,884/year
 *   - Northern Ireland: ≤ £20,500/year
 *
 * Sources:
 *   https://www.gov.wales/education-maintenance-allowance-wales-scheme-2025-2026
 *   https://www.studentfinancewales.co.uk/further-education-funding/education-maintenance-allowance/eligibility/
 *   https://www.turn2us.org.uk/get-support/information-for-your-situation/education-maintenance-allowance-ema-scotland-wales-northern-ireland/
 */

/** Weekly EMA payment rates by country (2025/26 academic year) */
export const EMA_WEEKLY_RATES: Record<string, number> = {
  wales: 40,
  scotland: 30,
  northern_ireland: 30,
}

/**
 * Wales income thresholds (annual household income).
 * The threshold increases when there is more than one eligible young person in the household.
 */
export const EMA_WALES_THRESHOLDS = {
  /** Household has exactly 1 eligible young person */
  oneStudent: 23400,
  /** Household has 2 or more eligible young persons */
  twoOrMoreStudents: 25974,
} as const

/** Annual household income threshold for Scotland (2025/26) */
export const EMA_SCOTLAND_THRESHOLD = 26884

/** Annual household income threshold for Northern Ireland (2025/26) */
export const EMA_NORTHERN_IRELAND_THRESHOLD = 20500

/** Minimum age for EMA eligibility in Wales (must be 16+ on 31 August) */
export const EMA_MIN_AGE_WALES = 16
/** Maximum age for EMA eligibility in Wales */
export const EMA_MAX_AGE_WALES = 18

/** Minimum age for EMA eligibility in Scotland and Northern Ireland */
export const EMA_MIN_AGE = 16
/** Maximum age for EMA eligibility in Scotland and Northern Ireland */
export const EMA_MAX_AGE = 19

/** Countries where EMA is available */
export const EMA_AVAILABLE_COUNTRIES = ['wales', 'scotland', 'northern_ireland'] as const

/**
 * Per-child/student assessment result
 */
export interface EMAStudent {
  /** Student's age */
  age: number
  /** Whether this student meets the age criteria for EMA */
  meetsAgeCriteria: boolean
  /** Whether this student is reported as being in full-time further education */
  isInFurtherEducation: boolean
  /** Whether this student is individually eligible (age + FTE; income tested at household level) */
  eligible: boolean
  /** Human-readable reason for eligibility/ineligibility */
  reason: string
}

/**
 * Full EMA assessment result returned by the calculator
 */
export interface EMAResult {
  /** Whether EMA is available in the claimant's country */
  availableInCountry: boolean
  /** Whether the household is eligible for EMA overall */
  eligible: boolean
  /** Human-readable summary of the eligibility decision */
  reason: string
  /** Country / area name for display */
  country: string
  /** Number of eligible students */
  eligibleStudentCount: number
  /** Total number of students aged 16–19 (or 16–18 in Wales) in the household */
  totalStudentsInAgeRange: number
  /** Per-student breakdown */
  students: EMAStudent[]
  /** Annual income threshold that applies (depends on country and student count in Wales) */
  incomeThreshold: number
  /** Calculated annual household income used for means-testing */
  annualHouseholdIncome: number
  /** Whether household income meets the threshold */
  meetsIncomeThreshold: boolean
  /** Weekly EMA amount (if eligible) */
  weeklyAmount: number
  /** Monthly equivalent (weeklyAmount × 52 / 12) */
  monthlyEquivalent: number
  /** Four-weekly equivalent */
  fourWeeklyAmount: number
  /** Annual equivalent */
  annualAmount: number
  /** Tax year this assessment applies to */
  taxYear: string
}
