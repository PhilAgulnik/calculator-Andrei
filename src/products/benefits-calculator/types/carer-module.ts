/**
 * Carer Module Types
 * Types and interfaces for carer eligibility assessment
 */

export interface PersonCaredFor {
  name?: string
  relationship: 'partner' | 'parent' | 'child' | 'other' | 'prefer-not-to-say'
  receivesBenefit: boolean
  benefitType?:
    | 'pip-daily-living'
    | 'attendance-allowance'
    | 'constant-attendance'
    | 'armed-forces-independence'
  benefitRate?: 'standard' | 'enhanced' | 'lower' | 'higher'
}

export interface CarerAssessment {
  isCarer: boolean
  hoursPerWeek: number
  personBeingCaredFor: PersonCaredFor
  eligibleForCarerElement: boolean
  eligibleForCarersAllowance: boolean
  weeklyEarnings: number
  reasonsNotEligible?: string[]
}

export interface CarerEligibilityResult {
  eligibleForUCCarerElement: boolean
  eligibleForCarersAllowance: boolean
  issues: string[]
  recommendation: string
}

export interface CarerModuleProps {
  personType: 'claimant' | 'partner'
  currentEarnings: number
  onCarerStatusChange: (assessment: CarerAssessment) => void
  initialData?: Partial<CarerAssessment>
}

export interface CarerEligibilityRules {
  minHoursPerWeek: 35
  maxEarningsPerWeekForCA: 151
  qualifyingBenefits: Array<{
    id: string
    label: string
    rates?: Array<{ id: string; label: string }>
  }>
}

// Constants for eligibility rules
export const CARER_ELIGIBILITY_RULES: CarerEligibilityRules = {
  minHoursPerWeek: 35,
  maxEarningsPerWeekForCA: 151,
  qualifyingBenefits: [
    {
      id: 'pip-daily-living',
      label: 'PIP Daily Living Component',
      rates: [
        { id: 'standard', label: 'Standard rate' },
        { id: 'enhanced', label: 'Enhanced rate' },
      ],
    },
    {
      id: 'attendance-allowance',
      label: 'Attendance Allowance',
      rates: [
        { id: 'lower', label: 'Lower rate' },
        { id: 'higher', label: 'Higher rate' },
      ],
    },
    {
      id: 'constant-attendance',
      label: 'Constant Attendance Allowance',
    },
    {
      id: 'armed-forces-independence',
      label: 'Armed Forces Independence Payment',
    },
  ],
}

// UC Carer Element monthly amount (2024/25)
export const UC_CARER_ELEMENT_MONTHLY = 201.68

// Carer's Allowance weekly amount (2024/25)
export const CARERS_ALLOWANCE_WEEKLY = 81.9
