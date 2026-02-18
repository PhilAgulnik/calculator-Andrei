/**
 * Student Income Types for Universal Credit Calculator
 * Based on UC Regulations 12-14 (student definition) and 68-71 (student income)
 */

/** Student type - undergraduate or postgraduate */
export type StudentType = 'undergraduate' | 'postgraduate'

/** Exceptions under Regulation 14 that allow students to claim UC */
export type StudentException =
  | 'under21_non_advanced_no_parental_support'
  | 'receiving_pip_dla_aa_with_work_limitation'
  | 'responsible_for_child'
  | 'single_foster_parent'
  | 'couple_both_studying_partner_cares_for_child'
  | 'reached_state_pension_age_younger_partner'

/** Input for student income calculation */
export interface StudentIncomeInput {
  isFullTimeStudent: boolean
  studentExceptions: StudentException[]
  studentType: StudentType
  hasStudentLoan: boolean
  studentLoanAnnualAmount: number
  hasPostgraduateLoan: boolean
  postgraduateLoanAnnualAmount: number
  hasStudentGrant: boolean
  studentGrantAnnualAmount: number
  courseAssessmentPeriods: number
  isInSummerHoliday: boolean
}

/** Result of student income calculation */
export interface StudentIncomeResult {
  monthlyStudentIncome: number
  loanComponent: number
  grantComponent: number
  postgraduateLoanComponent: number
  disregard: number
  assessmentPeriods: number
  breakdown: StudentIncomeBreakdown
  warnings: string[]
  meetsException: boolean
  exceptions: StudentException[]
}

/** Detailed breakdown for display */
export interface StudentIncomeBreakdown {
  annualLoanAmount: number
  annualGrantAmount: number
  annualPostgraduateLoanAmount: number
  postgraduateLoanIncluded: number
  totalAnnualIncome: number
  dividedByPeriods: number
  lessDisregard: number
  monthlyStudentIncome: number
}

/** £110 per assessment period disregard (Regulation 71) */
export const STUDENT_INCOME_DISREGARD = 110

/** Student exception labels for display */
export const STUDENT_EXCEPTION_LABELS: Record<StudentException, string> = {
  under21_non_advanced_no_parental_support:
    'Under 21 in non-advanced education without parental support',
  receiving_pip_dla_aa_with_work_limitation:
    'Receiving PIP, DLA or AA with documented limited capability for work',
  responsible_for_child:
    'Responsible for a child or qualifying young person',
  single_foster_parent:
    'Single foster parent with a child placed with you',
  couple_both_studying_partner_cares_for_child:
    'Both members of couple are students and partner cares for a child',
  reached_state_pension_age_younger_partner:
    'Reached state pension age with a younger partner',
}
