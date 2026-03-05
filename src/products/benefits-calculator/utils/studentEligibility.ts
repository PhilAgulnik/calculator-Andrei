import type { StudentException } from '../types/student-income'

/** State pension age threshold (approximate — men and women both 66 as of 2024/25) */
const STATE_PENSION_AGE = 66

/**
 * Determines if a student case is "simple" — meaning no Regulation 14 exception
 * can possibly apply based on the data collected on other pages.
 *
 * When this returns true, the student details page is skipped entirely.
 * We only skip when ALL exception routes are clearly ruled out.
 */
export function isSimpleStudentCase(data: any): boolean {
  if (!data?.isFullTimeStudent) return false

  // Exception 1: Under 21 in non-advanced education without parental support
  const age = data.age ?? 25
  if (age < 21) return false

  // Exception 2: Receiving PIP, DLA or AA with limited capability for work
  const hasDisabilityBenefit =
    data.claimsDisabilityBenefits === 'yes' ||
    data.isDisabled === 'yes' ||
    (data.disabilityBenefitType && data.disabilityBenefitType !== '')
  if (hasDisabilityBenefit) return false

  const hasLCWRA = data.hasLCWRA === 'yes' || data.hasLCWRA === 'waiting'
  if (hasLCWRA) return false

  // Exception 3: Responsible for a child or qualifying young person
  const hasChildren = data.hasChildren === true || (data.children && data.children > 0)
  if (hasChildren) return false

  // Exception 4: Single foster parent — if they have children this is already caught above
  // Exception 5: Both members of couple are students and partner cares for child
  const isCouple = data.circumstances === 'couple'
  if (isCouple) return false

  // Exception 6: Reached state pension age with a younger partner
  if (age >= STATE_PENSION_AGE) return false

  // Exception 2 (partner side): partner disability
  const partnerHasDisability =
    data.partnerClaimsDisabilityBenefits === 'yes' ||
    data.partnerIsDisabled === 'yes'
  if (partnerHasDisability) return false

  // Carer status (related to exceptions involving children/dependants)
  if (data.isCarer === 'yes') return false

  // All exception routes ruled out — this is a simple case
  return true
}

/**
 * Auto-detects which Regulation 14 exceptions likely apply based on
 * data already collected on other pages. Used to pre-populate the
 * student exceptions checkboxes when the student details page IS shown.
 */
export function detectStudentExceptions(data: any): StudentException[] {
  const detected: StudentException[] = []

  const age = data.age ?? 25

  // Exception 1: Under 21
  if (age < 21) {
    detected.push('under21_non_advanced_no_parental_support')
  }

  // Exception 2: PIP/DLA/AA with LCWRA
  const hasDisabilityBenefit =
    data.claimsDisabilityBenefits === 'yes' ||
    (data.disabilityBenefitType && ['pip', 'dla', 'aa'].includes(data.disabilityBenefitType))
  const hasLCWRA = data.hasLCWRA === 'yes' || data.hasLCWRA === 'waiting'
  if (hasDisabilityBenefit && hasLCWRA) {
    detected.push('receiving_pip_dla_aa_with_work_limitation')
  }

  // Exception 3: Responsible for a child
  const hasChildren = data.hasChildren === true || (data.children && data.children > 0)
  if (hasChildren) {
    detected.push('responsible_for_child')
  }

  // Exception 5: Couple both studying, partner cares for child
  if (data.circumstances === 'couple' && hasChildren) {
    detected.push('couple_both_studying_partner_cares_for_child')
  }

  // Exception 6: State pension age with younger partner
  if (age >= STATE_PENSION_AGE && data.circumstances === 'couple') {
    const partnerAge = data.partnerAge ?? 25
    if (partnerAge < STATE_PENSION_AGE) {
      detected.push('reached_state_pension_age_younger_partner')
    }
  }

  return detected
}
