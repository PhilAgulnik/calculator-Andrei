/**
 * Education Maintenance Allowance (EMA) Calculator
 *
 * Calculates EMA eligibility for households whose dependent young people
 * (aged 16–19, or 16–18 in Wales) are in full-time further education
 * (school sixth form or college, up to Level 3).
 *
 * EMA is NOT available in England (abolished 2011).
 *
 * Sources:
 *   https://www.gov.wales/education-maintenance-allowance-wales-scheme-2025-2026
 *   https://www.studentfinancewales.co.uk/further-education-funding/education-maintenance-allowance/eligibility/
 *   https://www.turn2us.org.uk/get-support/information-for-your-situation/education-maintenance-allowance-ema-scotland-wales-northern-ireland/
 */

import {
  type EMAResult,
  type EMAStudent,
  EMA_WEEKLY_RATES,
  EMA_WALES_THRESHOLDS,
  EMA_SCOTLAND_THRESHOLD,
  EMA_NORTHERN_IRELAND_THRESHOLD,
  EMA_MIN_AGE_WALES,
  EMA_MAX_AGE_WALES,
  EMA_MIN_AGE,
  EMA_MAX_AGE,
} from '../types/education-maintenance-allowance'

/** Child/student data from the form */
export interface EMAChildInfo {
  age: number
  /** Set to true if the child reported they are in full-time further education */
  isInFurtherEducation?: boolean
}

/** Assessment input (mirrors the shape used by FSM and SCP modules) */
export interface EMAAssessmentData {
  /** Area/country string from form, e.g. 'england', 'wales', 'scotland', 'northern_ireland' */
  area: string
  /** Number of children recorded in the household */
  children: number
  /** Per-child detail array (must be provided for accurate assessment) */
  childrenInfo?: EMAChildInfo[]
  /** Monthly household earnings for the main claimant (gross, before tax/NI) */
  monthlyEarnings?: number
  /** Monthly household earnings for the partner (gross) */
  partnerMonthlyEarnings?: number
  /** Tax year string, e.g. '2025_26' */
  taxYear?: string
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function normaliseArea(area: string): string {
  return (area || '').toLowerCase().replace(/\s+/g, '_')
}

function formatCountryName(normalised: string): string {
  const names: Record<string, string> = {
    england: 'England',
    wales: 'Wales',
    scotland: 'Scotland',
    northern_ireland: 'Northern Ireland',
  }
  return names[normalised] ?? area2Display(normalised)
}

function area2Display(s: string): string {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Returns the annual income threshold for EMA given country and number of eligible students.
 * Wales has two thresholds depending on whether 1 or 2+ students are in the household.
 */
function getIncomeThreshold(normalisedArea: string, eligibleStudentCount: number): number {
  if (normalisedArea === 'wales') {
    return eligibleStudentCount >= 2
      ? EMA_WALES_THRESHOLDS.twoOrMoreStudents
      : EMA_WALES_THRESHOLDS.oneStudent
  }
  if (normalisedArea === 'scotland') return EMA_SCOTLAND_THRESHOLD
  if (normalisedArea === 'northern_ireland') return EMA_NORTHERN_IRELAND_THRESHOLD
  // England / unknown – no threshold (not applicable)
  return 0
}

/**
 * Returns the EMA age range for the given country.
 */
function getAgeRange(normalisedArea: string): { min: number; max: number } {
  if (normalisedArea === 'wales') return { min: EMA_MIN_AGE_WALES, max: EMA_MAX_AGE_WALES }
  return { min: EMA_MIN_AGE, max: EMA_MAX_AGE }
}

// ---------------------------------------------------------------------------
// Main calculator
// ---------------------------------------------------------------------------

/**
 * Assesses EMA eligibility for the household.
 *
 * The calculation is done in two passes:
 *   1. Identify students who meet the age and FTE criteria (age-eligible students).
 *   2. Apply the income test using the appropriate threshold for the student count.
 *   3. Mark each age-eligible student as eligible/ineligible based on the income test.
 */
export function assessEMAEligibility(data: EMAAssessmentData): EMAResult {
  const normalisedArea = normaliseArea(data.area)
  const country = formatCountryName(normalisedArea)
  const taxYear = data.taxYear ?? '2025_26'

  // EMA is not available in England
  if (normalisedArea === 'england' || !EMA_WEEKLY_RATES[normalisedArea]) {
    return {
      availableInCountry: false,
      eligible: false,
      reason:
        normalisedArea === 'england'
          ? 'Education Maintenance Allowance is not available in England. It was abolished in 2011.'
          : `Education Maintenance Allowance is not available in ${country}.`,
      country,
      eligibleStudentCount: 0,
      totalStudentsInAgeRange: 0,
      students: [],
      incomeThreshold: 0,
      annualHouseholdIncome: 0,
      meetsIncomeThreshold: false,
      weeklyAmount: 0,
      monthlyEquivalent: 0,
      fourWeeklyAmount: 0,
      annualAmount: 0,
      taxYear,
    }
  }

  const { min: minAge, max: maxAge } = getAgeRange(normalisedArea)
  const weeklyRate = EMA_WEEKLY_RATES[normalisedArea]

  // Annual household income (gross)
  const monthlyIncome = (data.monthlyEarnings ?? 0) + (data.partnerMonthlyEarnings ?? 0)
  const annualHouseholdIncome = monthlyIncome * 12

  // Derive per-student info from childrenInfo
  const childrenInfo: EMAChildInfo[] = data.childrenInfo ?? []

  // First pass: identify students who meet age and FTE criteria
  const students: EMAStudent[] = childrenInfo.map((child) => {
    const meetsAgeCriteria = child.age >= minAge && child.age <= maxAge
    const isInFurtherEducation = child.isInFurtherEducation ?? false

    if (!meetsAgeCriteria) {
      return {
        age: child.age,
        meetsAgeCriteria: false,
        isInFurtherEducation,
        eligible: false,
        reason:
          child.age < minAge
            ? `Too young for EMA in ${country} (minimum age ${minAge})`
            : `Over the maximum age for EMA in ${country} (maximum age ${maxAge})`,
      }
    }

    if (!isInFurtherEducation) {
      return {
        age: child.age,
        meetsAgeCriteria: true,
        isInFurtherEducation: false,
        eligible: false,
        reason: 'Not reported as being in full-time further education (school or college)',
      }
    }

    // Eligible pending income test — will be updated in second pass
    return {
      age: child.age,
      meetsAgeCriteria: true,
      isInFurtherEducation: true,
      eligible: true, // provisional; income test applied below
      reason: 'Meets age and further education criteria',
    }
  })

  // Count potential students (age + FTE criteria met)
  const potentialStudents = students.filter((s) => s.meetsAgeCriteria && s.isInFurtherEducation)
  const potentialCount = potentialStudents.length
  const totalStudentsInAgeRange = students.filter((s) => s.meetsAgeCriteria).length

  // Second pass: apply income threshold (uses student count for Wales threshold selection)
  const incomeThreshold = getIncomeThreshold(normalisedArea, potentialCount)
  const meetsIncomeThreshold = annualHouseholdIncome <= incomeThreshold

  // Update each potential student's eligibility based on income test
  students.forEach((student) => {
    if (student.meetsAgeCriteria && student.isInFurtherEducation) {
      student.eligible = meetsIncomeThreshold
      if (!meetsIncomeThreshold) {
        student.reason = `Household income (£${annualHouseholdIncome.toLocaleString()}/year) exceeds the EMA threshold (£${incomeThreshold.toLocaleString()}/year)`
      }
    }
  })

  const eligibleStudentCount = students.filter((s) => s.eligible).length
  const weeklyAmount = weeklyRate * eligibleStudentCount
  const monthlyEquivalent = (weeklyAmount * 52) / 12
  const fourWeeklyAmount = weeklyAmount * 4
  const annualAmount = weeklyAmount * 52

  // Build the overall eligibility reason
  let reason: string
  if (potentialCount === 0 && totalStudentsInAgeRange === 0) {
    reason = `No dependent young people aged ${minAge}–${maxAge} are recorded in the household.`
  } else if (potentialCount === 0) {
    reason = `${totalStudentsInAgeRange} young ${totalStudentsInAgeRange === 1 ? 'person' : 'people'} aged ${minAge}–${maxAge} ${totalStudentsInAgeRange === 1 ? 'is' : 'are'} recorded but ${totalStudentsInAgeRange === 1 ? 'is' : 'are'} not in full-time further education.`
  } else if (!meetsIncomeThreshold) {
    reason = `Household income of £${annualHouseholdIncome.toLocaleString()}/year exceeds the EMA income threshold of £${incomeThreshold.toLocaleString()}/year.`
  } else {
    reason =
      eligibleStudentCount === 1
        ? `1 young person is eligible for EMA of £${weeklyRate}/week.`
        : `${eligibleStudentCount} young people are eligible for EMA of £${weeklyRate}/week each (total £${weeklyAmount}/week).`
  }

  return {
    availableInCountry: true,
    eligible: eligibleStudentCount > 0,
    reason,
    country,
    eligibleStudentCount,
    totalStudentsInAgeRange,
    students,
    incomeThreshold,
    annualHouseholdIncome,
    meetsIncomeThreshold,
    weeklyAmount,
    monthlyEquivalent,
    fourWeeklyAmount,
    annualAmount,
    taxYear,
  }
}
