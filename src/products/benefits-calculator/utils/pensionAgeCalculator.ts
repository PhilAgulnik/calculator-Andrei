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
export function calculateStatePensionAge(birthDate) {
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
 * @param {number} age - Person's age
 * @returns {boolean} True if over state pension age
 */
export function isOverStatePensionAge(age) {
  const statePensionAge = 66 // Current state pension age
  const numericAge = parseInt(age, 10)
  return numericAge >= statePensionAge
}

/**
 * Check if a couple is a "mixed age couple"
 * (one partner over state pension age, one under)
 * @param {number} mainAge - Main person's age
 * @param {number} partnerAge - Partner's age (if applicable)
 * @returns {boolean} True if mixed age couple
 */
export function isMixedAgeCouple(mainAge, partnerAge) {
  if (!partnerAge) return false // Not a couple

  const mainOverPensionAge = isOverStatePensionAge(mainAge)
  const partnerOverPensionAge = isOverStatePensionAge(partnerAge)

  // Mixed age couple: one over pension age, one under
  return (
    (mainOverPensionAge && !partnerOverPensionAge) || (!mainOverPensionAge && partnerOverPensionAge)
  )
}

/**
 * Check if both partners are over state pension age
 * @param {number} mainAge - Main person's age
 * @param {number} partnerAge - Partner's age (if applicable)
 * @returns {boolean} True if both over state pension age
 */
export function bothOverStatePensionAge(mainAge, partnerAge) {
  if (!partnerAge) return isOverStatePensionAge(mainAge) // Single person

  return isOverStatePensionAge(mainAge) && isOverStatePensionAge(partnerAge)
}

/**
 * Determine pension-age warning type based on formData
 * Returns: 'over' | 'mixed' | null
 */
export function getPensionAgeWarningType(formData) {
  const age = formData?.age
  const partnerAge = formData?.partnerAge
  const circumstances = formData?.circumstances
  const isCouple = circumstances === 'couple'

  const mainOver = isOverStatePensionAge(age)
  const partnerOver = isCouple ? isOverStatePensionAge(partnerAge) : false

  if (!isCouple) {
    return mainOver ? 'over' : null
  }

  if (mainOver && partnerOver) return 'over'
  if ((mainOver && !partnerOver) || (!mainOver && partnerOver)) return 'mixed'
  return null
}
