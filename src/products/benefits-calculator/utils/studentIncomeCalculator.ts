/**
 * Student Income Calculator for Universal Credit
 * Based on UC Regulations 68-71
 *
 * Key rules:
 * - Student loan: Full annual amount / assessment periods - £110 disregard
 * - Postgraduate loan: 30% of annual amount / assessment periods - £110 disregard
 * - Grant: Full annual amount (minus excluded payments) / assessment periods - £110 disregard
 * - Student income is unearned income (deducted £1 for £1, no taper)
 * - Not counted during summer holidays when course has ended
 */

import {
  type StudentIncomeInput,
  type StudentIncomeResult,
  type StudentIncomeBreakdown,
  type StudentException,
  STUDENT_INCOME_DISREGARD,
} from '../types/student-income'

/**
 * Calculate monthly student income for UC deduction
 *
 * Regulation 71 formula:
 * Step 1: Determine applicable amount (loan + grant, or 30% of postgrad loan)
 * Step 2: Count assessment periods in course year
 * Step 3: Divide step 1 by step 2
 * Step 4: Deduct £110 disregard
 */
export function calculateStudentIncome(input: StudentIncomeInput): StudentIncomeResult {
  const warnings: string[] = []

  // If not a full-time student, no student income
  if (input.isFullTimeStudent !== 'full-time' && input.isFullTimeStudent !== true) {
    return createZeroResult(input)
  }

  // Check if student meets an exception to claim UC
  const meetsException = input.studentExceptions.length > 0

  // If in summer holiday, no student income counts (Regulation 68)
  if (input.isInSummerHoliday) {
    return {
      ...createZeroResult(input),
      meetsException,
      exceptions: input.studentExceptions,
      warnings: meetsException
        ? ['Student income is not counted during summer holidays after the course ends.']
        : warnings,
    }
  }

  const assessmentPeriods = Math.max(1, input.courseAssessmentPeriods)

  // Calculate loan component (Regulation 69)
  let loanComponent = 0
  if (input.hasStudentLoan && input.studentLoanAnnualAmount > 0) {
    loanComponent = input.studentLoanAnnualAmount / assessmentPeriods
  }

  // Calculate postgraduate loan component - 30% rule (Regulation 69)
  let postgraduateLoanComponent = 0
  let postgraduateLoanIncluded = 0
  if (input.hasPostgraduateLoan && input.postgraduateLoanAnnualAmount > 0) {
    postgraduateLoanIncluded = input.postgraduateLoanAnnualAmount * 0.3
    postgraduateLoanComponent = postgraduateLoanIncluded / assessmentPeriods
  }

  // Calculate grant component (Regulation 70)
  // Note: the amount entered should already have excluded payments removed
  // (tuition fees, disability support, travel, books, childcare, residential costs)
  let grantComponent = 0
  if (input.hasStudentGrant && input.studentGrantAnnualAmount > 0) {
    grantComponent = input.studentGrantAnnualAmount / assessmentPeriods
  }

  // Total before disregard
  const totalBeforeDisregard = loanComponent + postgraduateLoanComponent + grantComponent

  // Apply £110 disregard (Regulation 71, Step 4)
  const disregard = STUDENT_INCOME_DISREGARD
  const monthlyStudentIncome = Math.max(0, totalBeforeDisregard - disregard)

  const breakdown: StudentIncomeBreakdown = {
    annualLoanAmount: input.studentLoanAnnualAmount || 0,
    annualGrantAmount: input.studentGrantAnnualAmount || 0,
    annualPostgraduateLoanAmount: input.postgraduateLoanAnnualAmount || 0,
    postgraduateLoanIncluded,
    totalAnnualIncome:
      (input.studentLoanAnnualAmount || 0) +
      postgraduateLoanIncluded +
      (input.studentGrantAnnualAmount || 0),
    dividedByPeriods: totalBeforeDisregard,
    lessDisregard: disregard,
    monthlyStudentIncome,
  }

  return {
    monthlyStudentIncome,
    loanComponent,
    grantComponent,
    postgraduateLoanComponent,
    disregard,
    assessmentPeriods,
    breakdown,
    warnings,
    meetsException,
    exceptions: input.studentExceptions,
  }
}

/**
 * Check if a student has selected any qualifying exception
 */
export function hasQualifyingException(exceptions: StudentException[]): boolean {
  return exceptions.length > 0
}

function createZeroResult(input: StudentIncomeInput): StudentIncomeResult {
  return {
    monthlyStudentIncome: 0,
    loanComponent: 0,
    grantComponent: 0,
    postgraduateLoanComponent: 0,
    disregard: 0,
    assessmentPeriods: input.courseAssessmentPeriods || 0,
    breakdown: {
      annualLoanAmount: 0,
      annualGrantAmount: 0,
      annualPostgraduateLoanAmount: 0,
      postgraduateLoanIncluded: 0,
      totalAnnualIncome: 0,
      dividedByPeriods: 0,
      lessDisregard: 0,
      monthlyStudentIncome: 0,
    },
    warnings: [],
    meetsException: false,
    exceptions: [],
  }
}
