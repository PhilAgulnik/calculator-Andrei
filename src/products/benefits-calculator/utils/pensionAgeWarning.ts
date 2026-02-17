/**
 * Pension Age Warning Utilities
 * Functions for calculating and determining pension age warnings
 */

import { STATE_PENSION_AGE, WARNING_MESSAGES } from '../types/pension-age-warning'
import type { PensionAgeWarning, WarningMessageTemplate } from '../types/pension-age-warning'

/**
 * Determines the State Pension Age based on current age
 * Simplified version - actual SPA calculation is more complex
 */
export function calculateStatePensionAge(_age: number): number {
  // Simplified: Use 66 as default SPA
  // In reality, this would need to check birth date ranges
  // The _age parameter is reserved for future use when implementing
  // the full SPA calculation logic based on birth date
  return STATE_PENSION_AGE.default
}

/**
 * Calculates months until State Pension Age
 */
export function calculateMonthsUntilSPA(currentAge: number, spa: number): number {
  const yearsUntil = spa - currentAge
  return Math.max(0, Math.round(yearsUntil * 12))
}

/**
 * Determines warning level based on age and SPA
 */
export function determineWarningLevel(
  currentAge: number,
  spa: number
): 'critical' | 'warning' | 'info' | 'none' {
  if (currentAge >= spa) {
    return 'critical'
  }

  const monthsUntil = calculateMonthsUntilSPA(currentAge, spa)

  if (monthsUntil <= 6) {
    return 'info' // Approaching SPA (within 6 months)
  }

  return 'none'
}

/**
 * Generates pension age warning for claimant
 */
export function generateClaimantWarning(
  age: number,
  circumstances: 'single' | 'couple'
): PensionAgeWarning | null {
  const spa = calculateStatePensionAge(age)
  const warningLevel = determineWarningLevel(age, spa)

  if (warningLevel === 'none') {
    return null
  }

  const hasReachedSPA = age >= spa
  const monthsUntil = calculateMonthsUntilSPA(age, spa)

  let message = ''
  if (hasReachedSPA) {
    message =
      circumstances === 'couple'
        ? WARNING_MESSAGES.claimantReachedSPA.message
        : WARNING_MESSAGES.claimantReachedSPA.message
  } else if (monthsUntil <= 6) {
    message = WARNING_MESSAGES.approachingSPA.message.replace(
      '{months}',
      monthsUntil.toString()
    )
  }

  return {
    personType: 'claimant',
    dateOfBirth: new Date(), // Placeholder
    currentAge: age,
    statePensionAge: spa,
    statePensionDate: new Date(), // Placeholder
    hasReachedSPA,
    monthsUntilSPA: hasReachedSPA ? 0 : monthsUntil,
    warningLevel,
    message,
  }
}

/**
 * Generates pension age warning for partner
 */
export function generatePartnerWarning(age: number): PensionAgeWarning | null {
  const spa = calculateStatePensionAge(age)
  const warningLevel = determineWarningLevel(age, spa)

  if (warningLevel === 'none') {
    return null
  }

  const hasReachedSPA = age >= spa
  const monthsUntil = calculateMonthsUntilSPA(age, spa)

  let message = ''
  if (hasReachedSPA) {
    message = WARNING_MESSAGES.partnerReachedSPA.message
  } else if (monthsUntil <= 6) {
    message = WARNING_MESSAGES.approachingSPA.message.replace(
      '{months}',
      monthsUntil.toString()
    )
  }

  return {
    personType: 'partner',
    dateOfBirth: new Date(), // Placeholder
    currentAge: age,
    statePensionAge: spa,
    statePensionDate: new Date(), // Placeholder
    hasReachedSPA,
    monthsUntilSPA: hasReachedSPA ? 0 : monthsUntil,
    warningLevel: hasReachedSPA ? 'warning' : warningLevel,
    message,
  }
}

/**
 * Determines overall warning for household
 */
export function determineHouseholdWarning(
  claimantAge: number,
  partnerAge: number | undefined,
  circumstances: 'single' | 'couple'
): {
  level: 'critical' | 'warning' | 'info' | 'none'
  title: string
  message: string
  action: string
} {
  const claimantSPA = calculateStatePensionAge(claimantAge)
  const claimantReachedSPA = claimantAge >= claimantSPA

  if (circumstances === 'couple' && partnerAge !== undefined) {
    const partnerSPA = calculateStatePensionAge(partnerAge)
    const partnerReachedSPA = partnerAge >= partnerSPA

    // Both reached SPA
    if (claimantReachedSPA && partnerReachedSPA) {
      return {
        level: 'critical',
        ...WARNING_MESSAGES.bothReachedSPA,
      }
    }

    // Mixed-age couple - exactly one reached SPA (not both)
    if ((claimantReachedSPA && !partnerReachedSPA) || (!claimantReachedSPA && partnerReachedSPA)) {
      return {
        level: 'warning',
        ...WARNING_MESSAGES.mixedAgeCouple,
      }
    }

    // Check if either is approaching SPA
    const claimantMonths = calculateMonthsUntilSPA(claimantAge, claimantSPA)
    const partnerMonths = calculateMonthsUntilSPA(partnerAge, partnerSPA)

    if (claimantMonths <= 6 || partnerMonths <= 6) {
      const months = Math.min(claimantMonths, partnerMonths)
      return {
        level: 'info',
        title: WARNING_MESSAGES.approachingSPA.title,
        message: WARNING_MESSAGES.approachingSPA.message.replace(
          '{months}',
          months.toString()
        ),
        action: WARNING_MESSAGES.approachingSPA.action,
      }
    }
  } else {
    // Single person
    if (claimantReachedSPA) {
      return {
        level: 'critical',
        ...WARNING_MESSAGES.claimantReachedSPA,
      }
    }

    const monthsUntil = calculateMonthsUntilSPA(claimantAge, claimantSPA)
    if (monthsUntil <= 6) {
      return {
        level: 'info',
        title: WARNING_MESSAGES.approachingSPA.title,
        message: WARNING_MESSAGES.approachingSPA.message.replace(
          '{months}',
          monthsUntil.toString()
        ),
        action: WARNING_MESSAGES.approachingSPA.action,
      }
    }
  }

  return {
    level: 'none',
    title: '',
    message: '',
    action: '',
  }
}
