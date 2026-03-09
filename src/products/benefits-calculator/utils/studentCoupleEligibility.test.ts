import { describe, it, expect } from 'vitest'
import { detectStudentExceptions, detectPartnerStudentExceptions } from './studentEligibility'
import { UniversalCreditCalculator } from './calculator'

// ============================================================
// detectStudentExceptions — Exception 5 fix
// ============================================================
describe('detectStudentExceptions - Exception 5 partner verification', () => {
  it('should NOT suggest exception 5 when partner is not a student', () => {
    const data = {
      circumstances: 'couple',
      hasChildren: true,
      children: 1,
      age: 27,
      partnerIsFullTimeStudent: false,
    }
    const exceptions = detectStudentExceptions(data)
    expect(exceptions).not.toContain('couple_both_studying_partner_cares_for_child')
    // Should still detect "responsible for child"
    expect(exceptions).toContain('responsible_for_child')
  })

  it('should suggest exception 5 when partner IS a student and has children', () => {
    const data = {
      circumstances: 'couple',
      hasChildren: true,
      children: 1,
      age: 27,
      partnerIsFullTimeStudent: true,
    }
    const exceptions = detectStudentExceptions(data)
    expect(exceptions).toContain('couple_both_studying_partner_cares_for_child')
  })

  it('should NOT suggest exception 5 for single claimant', () => {
    const data = {
      circumstances: 'single',
      hasChildren: true,
      children: 1,
      age: 27,
    }
    const exceptions = detectStudentExceptions(data)
    expect(exceptions).not.toContain('couple_both_studying_partner_cares_for_child')
  })
})

// ============================================================
// detectPartnerStudentExceptions
// ============================================================
describe('detectPartnerStudentExceptions', () => {
  it('should detect under-21 exception for young partner', () => {
    const data = {
      circumstances: 'couple',
      partnerAge: 19,
      age: 25,
    }
    const exceptions = detectPartnerStudentExceptions(data)
    expect(exceptions).toContain('under21_non_advanced_no_parental_support')
  })

  it('should NOT detect under-21 exception for partner age 21+', () => {
    const data = {
      circumstances: 'couple',
      partnerAge: 22,
      age: 25,
    }
    const exceptions = detectPartnerStudentExceptions(data)
    expect(exceptions).not.toContain('under21_non_advanced_no_parental_support')
  })

  it('should detect responsible_for_child when children present', () => {
    const data = {
      circumstances: 'couple',
      partnerAge: 28,
      hasChildren: true,
      children: 1,
    }
    const exceptions = detectPartnerStudentExceptions(data)
    expect(exceptions).toContain('responsible_for_child')
  })

  it('should detect exception 5 only when claimant is also a student', () => {
    const dataWithClaimantStudent = {
      circumstances: 'couple',
      partnerAge: 28,
      hasChildren: true,
      children: 1,
      isFullTimeStudent: true,
    }
    expect(detectPartnerStudentExceptions(dataWithClaimantStudent)).toContain(
      'couple_both_studying_partner_cares_for_child'
    )

    const dataWithoutClaimantStudent = {
      circumstances: 'couple',
      partnerAge: 28,
      hasChildren: true,
      children: 1,
      isFullTimeStudent: false,
    }
    expect(detectPartnerStudentExceptions(dataWithoutClaimantStudent)).not.toContain(
      'couple_both_studying_partner_cares_for_child'
    )
  })

  it('should detect pension age exception for older partner with younger claimant', () => {
    const data = {
      circumstances: 'couple',
      partnerAge: 67,
      age: 55,
    }
    const exceptions = detectPartnerStudentExceptions(data)
    expect(exceptions).toContain('reached_state_pension_age_younger_partner')
  })

  it('should detect disability exception for partner with PIP and LCWRA', () => {
    const data = {
      circumstances: 'couple',
      partnerAge: 30,
      partnerClaimsDisabilityBenefits: 'yes',
      partnerHasLCWRA: 'yes',
    }
    const exceptions = detectPartnerStudentExceptions(data)
    expect(exceptions).toContain('receiving_pip_dla_aa_with_work_limitation')
  })
})

// ============================================================
// Calculator — couple student eligibility and income deduction
// ============================================================
describe('UniversalCreditCalculator - couple student scenarios', () => {
  const calculator = new UniversalCreditCalculator()

  const baseCouple = {
    circumstances: 'couple',
    age: 27,
    partnerAge: 26,
    area: 'england',
    taxYear: '2025_26',
    housingStatus: 'renting',
    tenantType: 'social',
    rent: 600,
    rentPeriod: 'per_month',
    employmentType: 'not_working',
    partnerEmploymentType: 'not_working',
    hasChildren: true,
    children: 1,
    childrenInfo: [{ age: 2, hasDisability: 'no' }],
    otherBenefits: 0,
    otherBenefitsPeriod: 'per_month',
    savings: 0,
    savingsAmount: 0,
    hasSavings: 'no',
  }

  it('should be eligible when only claimant is student (partner satisfies)', () => {
    const input = {
      ...baseCouple,
      isFullTimeStudent: true,
      studentExceptions: [],
      studentType: 'undergraduate',
      hasStudentLoan: true,
      studentLoanAnnualAmount: 9535,
      courseAssessmentPeriods: 9,
      partnerIsFullTimeStudent: false,
    }
    const result = calculator.calculate(input)
    expect(result.success).toBe(true)
    expect(result.calculation!.studentIneligible).toBe(false)
    // Claimant student income should be deducted
    expect(result.calculation!.studentIncomeDetails.monthlyStudentIncome).toBeGreaterThan(0)
    // Partner student income should be 0
    expect(result.calculation!.partnerStudentIncomeDetails.monthlyStudentIncome).toBe(0)
  })

  it('should be eligible when only partner is student (claimant satisfies)', () => {
    const input = {
      ...baseCouple,
      isFullTimeStudent: false,
      partnerIsFullTimeStudent: true,
      partnerStudentType: 'undergraduate',
      partnerHasStudentLoan: true,
      partnerStudentLoanAnnualAmount: 9535,
      partnerCourseAssessmentPeriods: 9,
    }
    const result = calculator.calculate(input)
    expect(result.success).toBe(true)
    expect(result.calculation!.studentIneligible).toBe(false)
    // Claimant student income should be 0
    expect(result.calculation!.studentIncomeDetails.monthlyStudentIncome).toBe(0)
    // Partner student income should be deducted
    expect(result.calculation!.partnerStudentIncomeDetails.monthlyStudentIncome).toBeGreaterThan(0)
  })

  it('should be eligible when both are students and at least one has exception', () => {
    const input = {
      ...baseCouple,
      isFullTimeStudent: true,
      studentExceptions: ['responsible_for_child'],
      studentType: 'undergraduate',
      hasStudentLoan: true,
      studentLoanAnnualAmount: 9535,
      courseAssessmentPeriods: 9,
      partnerIsFullTimeStudent: true,
      partnerStudentExceptions: [],
      partnerStudentType: 'undergraduate',
      partnerHasStudentLoan: true,
      partnerStudentLoanAnnualAmount: 8500,
      partnerCourseAssessmentPeriods: 9,
    }
    const result = calculator.calculate(input)
    expect(result.success).toBe(true)
    expect(result.calculation!.studentIneligible).toBe(false)
    // Both incomes should be deducted
    expect(result.calculation!.studentIncomeDetails.monthlyStudentIncome).toBeGreaterThan(0)
    expect(result.calculation!.partnerStudentIncomeDetails.monthlyStudentIncome).toBeGreaterThan(0)
    // Combined deduction
    const combinedDeduction =
      result.calculation!.studentIncomeDetails.monthlyStudentIncome +
      result.calculation!.partnerStudentIncomeDetails.monthlyStudentIncome
    expect(result.calculation!.studentIncomeDeduction).toBeCloseTo(combinedDeduction, 2)
  })

  it('should be ineligible when both are students and neither has exception', () => {
    const inputNoChildren = {
      ...baseCouple,
      hasChildren: false,
      children: 0,
      childrenInfo: [],
      isFullTimeStudent: true,
      studentExceptions: [],
      studentType: 'undergraduate',
      hasStudentLoan: true,
      studentLoanAnnualAmount: 9535,
      courseAssessmentPeriods: 9,
      partnerIsFullTimeStudent: true,
      partnerStudentExceptions: [],
      partnerStudentType: 'undergraduate',
      partnerHasStudentLoan: true,
      partnerStudentLoanAnnualAmount: 8000,
      partnerCourseAssessmentPeriods: 9,
    }
    const result = calculator.calculate(inputNoChildren)
    expect(result.success).toBe(true)
    expect(result.calculation!.studentIneligible).toBe(true)
    expect(result.calculation!.finalAmount).toBe(0)
  })

  it('should handle one in summer holiday and one not', () => {
    const input = {
      ...baseCouple,
      isFullTimeStudent: true,
      studentExceptions: ['responsible_for_child'],
      studentType: 'undergraduate',
      hasStudentLoan: true,
      studentLoanAnnualAmount: 9535,
      courseAssessmentPeriods: 9,
      isInSummerHoliday: true, // claimant in summer holiday
      partnerIsFullTimeStudent: true,
      partnerStudentExceptions: ['couple_both_studying_partner_cares_for_child'],
      partnerStudentType: 'undergraduate',
      partnerHasStudentLoan: true,
      partnerStudentLoanAnnualAmount: 8500,
      partnerCourseAssessmentPeriods: 9,
      partnerIsInSummerHoliday: false, // partner NOT in summer holiday
    }
    const result = calculator.calculate(input)
    expect(result.success).toBe(true)
    expect(result.calculation!.studentIneligible).toBe(false)
    // Claimant income should be 0 (summer holiday)
    expect(result.calculation!.studentIncomeDetails.monthlyStudentIncome).toBe(0)
    // Partner income should be deducted
    expect(result.calculation!.partnerStudentIncomeDetails.monthlyStudentIncome).toBeGreaterThan(0)
  })

  it('should give each person an independent £110 disregard', () => {
    const input = {
      ...baseCouple,
      isFullTimeStudent: true,
      studentExceptions: ['responsible_for_child'],
      studentType: 'undergraduate',
      hasStudentLoan: true,
      studentLoanAnnualAmount: 9000,
      courseAssessmentPeriods: 9,
      partnerIsFullTimeStudent: true,
      partnerStudentExceptions: ['couple_both_studying_partner_cares_for_child'],
      partnerStudentType: 'undergraduate',
      partnerHasStudentLoan: true,
      partnerStudentLoanAnnualAmount: 9000,
      partnerCourseAssessmentPeriods: 9,
    }
    const result = calculator.calculate(input)
    expect(result.success).toBe(true)

    // Each person: 9000/9 = 1000, minus 110 = 890
    expect(result.calculation!.studentIncomeDetails.monthlyStudentIncome).toBeCloseTo(890, 2)
    expect(result.calculation!.partnerStudentIncomeDetails.monthlyStudentIncome).toBeCloseTo(890, 2)
    expect(result.calculation!.studentIncomeDeduction).toBeCloseTo(1780, 2)
  })
})
