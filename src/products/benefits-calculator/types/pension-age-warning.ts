/**
 * State Pension Age Warning Types
 * Types and interfaces for pension age warnings and eligibility checks
 */

export interface PensionAgeWarning {
  personType: 'claimant' | 'partner'
  dateOfBirth: Date
  currentAge: number
  statePensionAge: number // Age in years
  statePensionDate: Date // Date they reach SPA
  hasReachedSPA: boolean
  yearsUntilSPA?: number
  monthsUntilSPA?: number
  warningLevel: 'critical' | 'warning' | 'info' | 'none'
  message: string
}

export interface MixedAgeCouple {
  isMixedAge: boolean
  olderPartnerReachedSPA: boolean
  reachedSPADate?: Date
  eligibleForUC: boolean
  reason: string
}

export interface StatePensionAgeWarningProps {
  claimantAge: number
  partnerAge?: number
  circumstances: 'single' | 'couple'
  onDismiss?: () => void
}

export interface WarningMessageTemplate {
  title: string
  message: string
  severity: 'critical' | 'warning' | 'info'
  action: string
}

// Warning message templates
export const WARNING_MESSAGES: Record<string, WarningMessageTemplate> = {
  bothReachedSPA: {
    title: '⚠️ IMPORTANT: State Pension Age Reached',
    message:
      'You and your partner have both reached State Pension Age. You cannot claim Universal Credit. You should apply for Pension Credit instead.',
    severity: 'critical',
    action: 'Claim Pension Credit',
  },

  claimantReachedSPA: {
    title: '⚠️ IMPORTANT: You have reached State Pension Age',
    message:
      'You have reached State Pension Age (age 66/67). You cannot claim Universal Credit. You should apply for Pension Credit instead.',
    severity: 'critical',
    action: 'Claim Pension Credit',
  },

  mixedAgeCouple: {
    title: 'State Pension Age Notice',
    message:
      'You are in a couple where one is older than State Pension Age and the other younger. This means you count as a \'mixed age couple\' and can use the calculator to calculate Universal Credit. To make the calculator work you will need to make the older member of the couple age 65.',
    severity: 'warning',
    action: 'Continue',
  },

  partnerReachedSPA: {
    title: '⚠️ WARNING: Your partner has reached State Pension Age',
    message:
      'Your partner has reached State Pension Age. You may not be eligible for Universal Credit (mixed-age couple rules apply). You should check if you can claim Pension Credit instead.',
    severity: 'warning',
    action: 'Check eligibility',
  },

  approachingSPA: {
    title: 'ℹ️ State Pension Age Approaching',
    message:
      'You will reach State Pension Age soon. Your Universal Credit will end at that point. You should prepare to transition to Pension Credit.',
    severity: 'info',
    action: 'Learn more',
  },
}

// State Pension Age thresholds (simplified - actual calculation is more complex)
export const STATE_PENSION_AGE = {
  default: 66, // Current SPA for most people
  future: 67, // For those born after April 1960
}

// Mixed-age couple cutoff date
export const MIXED_AGE_CUTOFF_DATE = new Date('2019-05-15')

// Pension Credit amounts (2024/25)
export const PENSION_CREDIT_AMOUNTS = {
  single: 218.15, // per week
  couple: 332.95, // per week
}
