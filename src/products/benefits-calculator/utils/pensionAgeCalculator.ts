/**
 * State Pension Age Calculator
 *
 * Current rules:
 * - State pension age is currently 66
 * - Will increase to 67 from April 2026
 * - Future: Will need a formula for state pension age calculation
 */

/**
 * Calculate state pension age for a given birth date
 * @param {Date|string} birthDate - Birth date
 * @returns {number} State pension age in years
 */
export function calculateStatePensionAge(_birthDate: any) {
  // const date = new Date(birthDate);
  // const birthYear = date.getFullYear();

  // Current rule: State pension age is 66
  // From April 2026: Will increase to 67
  // For now, using 66 as the current age

  // TODO: Implement proper formula for state pension age calculation
  // when the rules change from April 2026

  return 66
}

/**
 * Check if a person is over state pension age
 * @param {number} Age - Person's age
 * @returns {boolean} True if over state pension age
 */
export function isOverStatePensionAge(Age: any) {
  const statePensionAge = 66 // Current state pension age
  const numericAge = parseInt(Age, 10)
  return numericAge >= statePensionAge
}

/**
 * Check if a couple is a "mixed age couple"
 * (one partner over state pension age, one under)
 * @param {number} Age - Main person's age
 * @param {number} PartnerAge - Partner's age (if applicable)
 * @returns {boolean} True if mixed age couple
 */
export function isMixedAgeCouple(Age: any, PartnerAge: any) {
  if (!PartnerAge) return false // Not a couple

  const mainOverPensionAge = isOverStatePensionAge(Age)
  const partnerOverPensionAge = isOverStatePensionAge(PartnerAge)

  // Mixed age couple: one over pension age, one under
  return (
    (mainOverPensionAge && !partnerOverPensionAge) || (!mainOverPensionAge && partnerOverPensionAge)
  )
}

/**
 * Check if both partners are over state pension age
 * @param {number} Age - Main person's age
 * @param {number} PartnerAge - Partner's age (if applicable)
 * @returns {boolean} True if both over state pension age
 */
export function bothOverStatePensionAge(Age: any, PartnerAge: any) {
  if (!PartnerAge) return isOverStatePensionAge(Age) // Single person

  return isOverStatePensionAge(Age) && isOverStatePensionAge(PartnerAge)
}

/**
 * Determine pension-age warning type based on formData
 * Returns: 'over' | 'mixed' | null
 */
export function getPensionAgeWarningType(formData: any) {
  const Age = formData?.Age || formData?.age
  const PartnerAge = formData?.PartnerAge || formData?.partnerAge
  const HasPartner = formData?.HasPartner !== undefined ? formData.HasPartner : formData?.circumstances === 'couple'

  const mainOver = isOverStatePensionAge(Age)
  const partnerOver = HasPartner ? isOverStatePensionAge(PartnerAge) : false

  if (!HasPartner) {
    return mainOver ? 'over' : null
  }

  if (mainOver && partnerOver) return 'over'
  if ((mainOver && !partnerOver) || (!mainOver && partnerOver)) return 'mixed'
  return null
}
