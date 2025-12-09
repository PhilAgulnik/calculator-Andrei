/**
 * Minimum Income Floor (MIF) Calculator for Universal Credit
 *
 * The Minimum Income Floor affects self-employed UC claimants.
 * It assumes a minimum level of earnings based on work hour conditionality
 * and the National Minimum Wage.
 */

/**
 * National Minimum Wage rates (2025/26 tax year)
 * These should be updated annually
 */
export const NATIONAL_MINIMUM_WAGE = {
  '2025_26': {
    age21Plus: 12.21,    // £12.21 per hour for 21+
    age18to20: 10.00,    // £10.00 per hour for 18-20
    age16to17: 7.55,     // £7.55 per hour for 16-17
    apprentice: 7.55,    // £7.55 per hour for apprentices
  },
  '2026_27': {
    age21Plus: 12.21,    // Will be updated when rates are announced
    age18to20: 10.00,
    age16to17: 7.55,
    apprentice: 7.55,
  },
  '2024_25': {
    age21Plus: 11.44,
    age18to20: 8.60,
    age16to17: 6.40,
    apprentice: 6.40,
  },
  '2023_24': {
    age21Plus: 10.42,
    age18to20: 7.49,
    age16to17: 5.28,
    apprentice: 5.28,
  },
}

/**
 * Work hours conditionality thresholds
 * These determine the assumed working hours for MIF calculation
 */
export type WorkHoursConditionality = 0 | 16 | 35

/**
 * Get the appropriate minimum wage for a person's age
 */
export function getMinimumWageForAge(age: number, taxYear: string = '2025_26'): number {
  const rates = NATIONAL_MINIMUM_WAGE[taxYear as keyof typeof NATIONAL_MINIMUM_WAGE] || NATIONAL_MINIMUM_WAGE['2025_26']

  if (age >= 21) {
    return rates.age21Plus
  } else if (age >= 18) {
    return rates.age18to20
  } else {
    return rates.age16to17
  }
}

/**
 * Calculate UC Earnings Threshold
 * This is the amount UC assumes you earn based on your work conditionality
 *
 * Formula: UCEarningsThreshold = UCWorkHoursConditionality × minimum wage for age
 * Note: The calculation uses gross earnings before tax/NI deductions
 */
export function calculateUCEarningsThreshold(
  workHours: WorkHoursConditionality,
  age: number,
  taxYear: string = '2025_26'
): number {
  if (workHours === 0) {
    return 0
  }

  const minimumWage = getMinimumWageForAge(age, taxYear)

  // Calculate weekly earnings, then convert to monthly
  const weeklyEarnings = workHours * minimumWage
  const monthlyEarnings = weeklyEarnings * 52 / 12  // 52 weeks / 12 months

  return monthlyEarnings
}

/**
 * Calculate the Minimum Income Floor
 *
 * The MIF is compared against actual self-employed earnings.
 * If MIF is higher, it's used in UC calculation instead of actual earnings.
 *
 * @param workHours - Work hours conditionality (0, 16, or 35)
 * @param age - Person's age
 * @param actualEarnings - Actual self-employed earnings (monthly)
 * @param taxYear - Tax year for rates
 * @returns Object containing MIF details
 */
export function calculateMinimumIncomeFloor(
  workHours: WorkHoursConditionality,
  age: number,
  actualEarnings: number,
  taxYear: string = '2025_26'
) {
  const ucEarningsThreshold = calculateUCEarningsThreshold(workHours, age, taxYear)
  const minimumWage = getMinimumWageForAge(age, taxYear)

  // The income used in UC calculation is the higher of MIF or actual earnings
  const incomeUsedForUC = Math.max(ucEarningsThreshold, actualEarnings)

  return {
    workHours,
    minimumWage,
    ucEarningsThreshold,
    actualEarnings,
    incomeUsedForUC,
    mifApplies: ucEarningsThreshold > actualEarnings,
    shortfall: Math.max(0, ucEarningsThreshold - actualEarnings),
  }
}

/**
 * Calculate combined MIF for couples
 * Each member's MIF is calculated separately and then combined
 *
 * @param person1 - First person's details
 * @param person2 - Second person's details (optional)
 * @param taxYear - Tax year for rates
 */
export function calculateCombinedMinimumIncomeFloor(
  person1: {
    workHours: WorkHoursConditionality
    age: number
    actualEarnings: number
    isEmployed?: boolean
    isSelfEmployed?: boolean
  },
  person2: {
    workHours: WorkHoursConditionality
    age: number
    actualEarnings: number
    isEmployed?: boolean
    isSelfEmployed?: boolean
  } | null,
  taxYear: string = '2025_26'
) {
  // Calculate person 1's MIF (only if self-employed)
  const person1MIF = person1.isSelfEmployed
    ? calculateMinimumIncomeFloor(person1.workHours, person1.age, person1.actualEarnings, taxYear)
    : {
        workHours: 0 as WorkHoursConditionality,
        minimumWage: 0,
        ucEarningsThreshold: 0,
        actualEarnings: person1.actualEarnings,
        incomeUsedForUC: person1.actualEarnings,
        mifApplies: false,
        shortfall: 0,
      }

  // Calculate person 2's MIF if they exist (only if self-employed)
  let person2MIF = null
  if (person2) {
    person2MIF = person2.isSelfEmployed
      ? calculateMinimumIncomeFloor(person2.workHours, person2.age, person2.actualEarnings, taxYear)
      : {
          workHours: 0 as WorkHoursConditionality,
          minimumWage: 0,
          ucEarningsThreshold: 0,
          actualEarnings: person2.actualEarnings,
          incomeUsedForUC: person2.actualEarnings,
          mifApplies: false,
          shortfall: 0,
        }
  }

  // Calculate combined values
  const combinedUCEarningsThreshold = person1MIF.ucEarningsThreshold + (person2MIF?.ucEarningsThreshold || 0)
  const combinedActualEarnings = person1MIF.actualEarnings + (person2MIF?.actualEarnings || 0)
  const combinedIncomeUsedForUC = person1MIF.incomeUsedForUC + (person2MIF?.incomeUsedForUC || 0)

  return {
    person1: person1MIF,
    person2: person2MIF,
    combined: {
      ucEarningsThreshold: combinedUCEarningsThreshold,
      actualEarnings: combinedActualEarnings,
      incomeUsedForUC: combinedIncomeUsedForUC,
      mifApplies: combinedUCEarningsThreshold > combinedActualEarnings,
      shortfall: Math.max(0, combinedUCEarningsThreshold - combinedActualEarnings),
    },
  }
}

/**
 * Check if user should be shown the MIF warning and question
 *
 * @param isSelfEmployed - Is the person self-employed?
 * @param actualEarnings - Their actual earnings
 * @param workHours - Their work hours conditionality
 * @param age - Their age
 * @param taxYear - Tax year
 */
export function shouldShowMIFQuestion(
  isSelfEmployed: boolean,
  actualEarnings: number,
  workHours: WorkHoursConditionality,
  age: number,
  taxYear: string = '2025_26'
): boolean {
  if (!isSelfEmployed) {
    return false
  }

  const ucEarningsThreshold = calculateUCEarningsThreshold(workHours, age, taxYear)

  // Show question if earnings are below the threshold
  return actualEarnings < ucEarningsThreshold
}
