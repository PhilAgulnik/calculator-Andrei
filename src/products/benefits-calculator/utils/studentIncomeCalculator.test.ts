/**
 * Student Income Calculator Tests
 *
 * Test scenarios based on UC Regulations 68-71
 * covering undergraduate loans, postgraduate loans, grants,
 * summer holidays, exceptions, and edge cases.
 */

import { describe, it, expect } from 'vitest'
import { calculateStudentIncome, hasQualifyingException } from './studentIncomeCalculator'
import type { StudentIncomeInput } from '../types/student-income'

const baseInput: StudentIncomeInput = {
  isFullTimeStudent: true,
  studentExceptions: ['responsible_for_child'],
  studentType: 'undergraduate',
  hasStudentLoan: false,
  studentLoanAnnualAmount: 0,
  hasPostgraduateLoan: false,
  postgraduateLoanAnnualAmount: 0,
  hasStudentGrant: false,
  studentGrantAnnualAmount: 0,
  courseAssessmentPeriods: 9,
  isInSummerHoliday: false,
}

describe('Student Income Calculator', () => {
  // ============================================
  // UNDERGRADUATE WITH LOAN
  // ============================================
  describe('Undergraduate with loan', () => {
    it('should calculate monthly income for standard undergraduate loan (£9,535 over 9 months)', () => {
      const result = calculateStudentIncome({
        ...baseInput,
        hasStudentLoan: true,
        studentLoanAnnualAmount: 9535,
        courseAssessmentPeriods: 9,
      })

      // £9,535 / 9 = £1,059.44 - £110 = £949.44
      expect(result.monthlyStudentIncome).toBeCloseTo(949.44, 1)
      expect(result.loanComponent).toBeCloseTo(1059.44, 1)
      expect(result.disregard).toBe(110)
      expect(result.assessmentPeriods).toBe(9)
      expect(result.meetsException).toBe(true)
    })

    it('should calculate monthly income for loan over 12 months', () => {
      const result = calculateStudentIncome({
        ...baseInput,
        hasStudentLoan: true,
        studentLoanAnnualAmount: 12000,
        courseAssessmentPeriods: 12,
      })

      // £12,000 / 12 = £1,000 - £110 = £890
      expect(result.monthlyStudentIncome).toBeCloseTo(890, 1)
      expect(result.loanComponent).toBeCloseTo(1000, 1)
    })

    it('should calculate for a smaller loan (£6,000 over 9 months)', () => {
      const result = calculateStudentIncome({
        ...baseInput,
        hasStudentLoan: true,
        studentLoanAnnualAmount: 6000,
        courseAssessmentPeriods: 9,
      })

      // £6,000 / 9 = £666.67 - £110 = £556.67
      expect(result.monthlyStudentIncome).toBeCloseTo(556.67, 1)
    })
  })

  // ============================================
  // POSTGRADUATE WITH LOAN (30% RULE)
  // ============================================
  describe('Postgraduate with loan (30% rule)', () => {
    it('should apply 30% rule for postgraduate loan (£12,167 over 12 months)', () => {
      const result = calculateStudentIncome({
        ...baseInput,
        studentType: 'postgraduate',
        hasPostgraduateLoan: true,
        postgraduateLoanAnnualAmount: 12167,
        courseAssessmentPeriods: 12,
      })

      // 30% of £12,167 = £3,650.10
      // £3,650.10 / 12 = £304.18 - £110 = £194.18
      const thirtyPercent = 12167 * 0.3
      expect(result.breakdown.postgraduateLoanIncluded).toBeCloseTo(thirtyPercent, 1)
      expect(result.postgraduateLoanComponent).toBeCloseTo(thirtyPercent / 12, 1)
      expect(result.monthlyStudentIncome).toBeCloseTo(thirtyPercent / 12 - 110, 1)
    })

    it('should apply 30% rule for smaller postgraduate loan (£5,000 over 9 months)', () => {
      const result = calculateStudentIncome({
        ...baseInput,
        studentType: 'postgraduate',
        hasPostgraduateLoan: true,
        postgraduateLoanAnnualAmount: 5000,
        courseAssessmentPeriods: 9,
      })

      // 30% of £5,000 = £1,500
      // £1,500 / 9 = £166.67 - £110 = £56.67
      expect(result.breakdown.postgraduateLoanIncluded).toBeCloseTo(1500, 1)
      expect(result.monthlyStudentIncome).toBeCloseTo(56.67, 1)
    })
  })

  // ============================================
  // STUDENT WITH LOAN AND GRANT
  // ============================================
  describe('Student with loan and grant', () => {
    it('should combine loan and grant in calculation', () => {
      const result = calculateStudentIncome({
        ...baseInput,
        hasStudentLoan: true,
        studentLoanAnnualAmount: 9535,
        hasStudentGrant: true,
        studentGrantAnnualAmount: 3000,
        courseAssessmentPeriods: 9,
      })

      // (£9,535 + £3,000) / 9 = £1,392.78 - £110 = £1,282.78
      expect(result.monthlyStudentIncome).toBeCloseTo(1282.78, 0)
      expect(result.loanComponent).toBeCloseTo(9535 / 9, 1)
      expect(result.grantComponent).toBeCloseTo(3000 / 9, 1)
    })

    it('should combine postgraduate loan and grant', () => {
      const result = calculateStudentIncome({
        ...baseInput,
        studentType: 'postgraduate',
        hasPostgraduateLoan: true,
        postgraduateLoanAnnualAmount: 12167,
        hasStudentGrant: true,
        studentGrantAnnualAmount: 2000,
        courseAssessmentPeriods: 12,
      })

      // 30% of £12,167 = £3,650.10
      // (£3,650.10 + £2,000) / 12 = £470.84 - £110 = £360.84
      const postGradIncluded = 12167 * 0.3
      const total = postGradIncluded + 2000
      expect(result.monthlyStudentIncome).toBeCloseTo(total / 12 - 110, 1)
    })
  })

  // ============================================
  // SUMMER HOLIDAY
  // ============================================
  describe('Summer holiday', () => {
    it('should return zero income during summer holiday', () => {
      const result = calculateStudentIncome({
        ...baseInput,
        hasStudentLoan: true,
        studentLoanAnnualAmount: 9535,
        isInSummerHoliday: true,
      })

      expect(result.monthlyStudentIncome).toBe(0)
      expect(result.warnings).toContain(
        'Student income is not counted during summer holidays after the course ends.'
      )
    })

    it('should still report exception status during summer holiday', () => {
      const result = calculateStudentIncome({
        ...baseInput,
        studentExceptions: ['responsible_for_child'],
        hasStudentLoan: true,
        studentLoanAnnualAmount: 9535,
        isInSummerHoliday: true,
      })

      expect(result.monthlyStudentIncome).toBe(0)
      expect(result.meetsException).toBe(true)
    })
  })

  // ============================================
  // NO EXCEPTION SELECTED
  // ============================================
  describe('No exception selected', () => {
    it('should not meet exception when none selected', () => {
      const result = calculateStudentIncome({
        ...baseInput,
        studentExceptions: [],
        hasStudentLoan: true,
        studentLoanAnnualAmount: 9535,
      })

      expect(result.meetsException).toBe(false)
      expect(result.warnings.length).toBe(0)
    })

    it('should still calculate student income even without exception', () => {
      const result = calculateStudentIncome({
        ...baseInput,
        studentExceptions: [],
        hasStudentLoan: true,
        studentLoanAnnualAmount: 9535,
        courseAssessmentPeriods: 9,
      })

      // Calculation still runs - the warning is informational
      expect(result.monthlyStudentIncome).toBeCloseTo(949.44, 1)
      expect(result.meetsException).toBe(false)
    })
  })

  // ============================================
  // EDGE CASES
  // ============================================
  describe('Edge cases', () => {
    it('should handle zero loan amount', () => {
      const result = calculateStudentIncome({
        ...baseInput,
        hasStudentLoan: true,
        studentLoanAnnualAmount: 0,
      })

      expect(result.monthlyStudentIncome).toBe(0)
    })

    it('should handle grant-only student', () => {
      const result = calculateStudentIncome({
        ...baseInput,
        hasStudentGrant: true,
        studentGrantAnnualAmount: 5000,
        courseAssessmentPeriods: 10,
      })

      // £5,000 / 10 = £500 - £110 = £390
      expect(result.monthlyStudentIncome).toBeCloseTo(390, 1)
      expect(result.grantComponent).toBeCloseTo(500, 1)
      expect(result.loanComponent).toBe(0)
    })

    it('should return zero when not a student', () => {
      const result = calculateStudentIncome({
        ...baseInput,
        isFullTimeStudent: false,
      })

      expect(result.monthlyStudentIncome).toBe(0)
      expect(result.meetsException).toBe(false)
    })

    it('should not go below zero after disregard', () => {
      const result = calculateStudentIncome({
        ...baseInput,
        hasStudentLoan: true,
        studentLoanAnnualAmount: 500,
        courseAssessmentPeriods: 12,
      })

      // £500 / 12 = £41.67 - £110 = negative -> £0
      expect(result.monthlyStudentIncome).toBe(0)
    })

    it('should handle single assessment period', () => {
      const result = calculateStudentIncome({
        ...baseInput,
        hasStudentLoan: true,
        studentLoanAnnualAmount: 9535,
        courseAssessmentPeriods: 1,
      })

      // £9,535 / 1 = £9,535 - £110 = £9,425
      expect(result.monthlyStudentIncome).toBeCloseTo(9425, 1)
    })

    it('should handle zero assessment periods (defaults to 1)', () => {
      const result = calculateStudentIncome({
        ...baseInput,
        hasStudentLoan: true,
        studentLoanAnnualAmount: 9535,
        courseAssessmentPeriods: 0,
      })

      // Should not divide by zero - defaults to 1
      expect(result.monthlyStudentIncome).toBeCloseTo(9425, 1)
    })

    it('should handle multiple exceptions selected', () => {
      const result = calculateStudentIncome({
        ...baseInput,
        studentExceptions: ['responsible_for_child', 'receiving_pip_dla_aa_with_work_limitation'],
        hasStudentLoan: true,
        studentLoanAnnualAmount: 9535,
      })

      expect(result.meetsException).toBe(true)
      expect(result.exceptions.length).toBe(2)
    })
  })

  // ============================================
  // HELPER FUNCTION TESTS
  // ============================================
  describe('hasQualifyingException', () => {
    it('should return true when exceptions exist', () => {
      expect(hasQualifyingException(['responsible_for_child'])).toBe(true)
    })

    it('should return false when no exceptions', () => {
      expect(hasQualifyingException([])).toBe(false)
    })
  })

  // ============================================
  // REAL-WORLD EXAMPLE SCENARIOS
  // ============================================
  describe('Real-world example scenarios', () => {
    it('Example 1: Single parent undergraduate student with maintenance loan', () => {
      // Sarah is a single parent with 1 child, studying full-time
      // She has a maintenance loan of £13,022 (max for living away from home, outside London)
      // Her course runs for 9 assessment periods
      const result = calculateStudentIncome({
        isFullTimeStudent: true,
        studentExceptions: ['responsible_for_child'],
        studentType: 'undergraduate',
        hasStudentLoan: true,
        studentLoanAnnualAmount: 13022,
        hasPostgraduateLoan: false,
        postgraduateLoanAnnualAmount: 0,
        hasStudentGrant: false,
        studentGrantAnnualAmount: 0,
        courseAssessmentPeriods: 9,
        isInSummerHoliday: false,
      })

      // £13,022 / 9 = £1,446.89 - £110 = £1,336.89
      expect(result.monthlyStudentIncome).toBeCloseTo(1336.89, 0)
      expect(result.meetsException).toBe(true)
      expect(result.warnings.length).toBe(0)
    })

    it('Example 2: Postgraduate student with disability', () => {
      // James is studying a Masters, receives PIP with LCWRA
      // He has a postgraduate loan of £12,167
      // His course runs for 12 assessment periods
      const result = calculateStudentIncome({
        isFullTimeStudent: true,
        studentExceptions: ['receiving_pip_dla_aa_with_work_limitation'],
        studentType: 'postgraduate',
        hasStudentLoan: false,
        studentLoanAnnualAmount: 0,
        hasPostgraduateLoan: true,
        postgraduateLoanAnnualAmount: 12167,
        hasStudentGrant: false,
        studentGrantAnnualAmount: 0,
        courseAssessmentPeriods: 12,
        isInSummerHoliday: false,
      })

      // 30% of £12,167 = £3,650.10
      // £3,650.10 / 12 = £304.18 - £110 = £194.18
      expect(result.monthlyStudentIncome).toBeCloseTo(194.18, 0)
      expect(result.meetsException).toBe(true)
    })

    it('Example 3: Undergraduate with loan and maintenance grant', () => {
      // Priya has a maintenance loan of £9,535 plus a £2,000 maintenance grant
      // She is responsible for a child
      // Course runs for 9 months
      const result = calculateStudentIncome({
        isFullTimeStudent: true,
        studentExceptions: ['responsible_for_child'],
        studentType: 'undergraduate',
        hasStudentLoan: true,
        studentLoanAnnualAmount: 9535,
        hasPostgraduateLoan: false,
        postgraduateLoanAnnualAmount: 0,
        hasStudentGrant: true,
        studentGrantAnnualAmount: 2000,
        courseAssessmentPeriods: 9,
        isInSummerHoliday: false,
      })

      // (£9,535 + £2,000) / 9 = £1,281.67 - £110 = £1,171.67
      expect(result.monthlyStudentIncome).toBeCloseTo(1171.67, 0)
    })

    it('Example 4: Student during summer break', () => {
      // Same as Example 1 but during summer holiday
      const result = calculateStudentIncome({
        isFullTimeStudent: true,
        studentExceptions: ['responsible_for_child'],
        studentType: 'undergraduate',
        hasStudentLoan: true,
        studentLoanAnnualAmount: 13022,
        hasPostgraduateLoan: false,
        postgraduateLoanAnnualAmount: 0,
        hasStudentGrant: false,
        studentGrantAnnualAmount: 0,
        courseAssessmentPeriods: 9,
        isInSummerHoliday: true,
      })

      // No student income during summer holiday
      expect(result.monthlyStudentIncome).toBe(0)
      expect(result.meetsException).toBe(true)
    })
  })
})
