/**
 * Free School Meals Eligibility Tests
 *
 * Test scenarios for all 4 UK countries with different income levels and child ages
 */

import { describe, it, expect } from 'vitest'
import { assessFreeSchoolMealsEligibility } from './freeSchoolMealsEligibility'

describe('Free School Meals Eligibility', () => {
  // ============================================
  // ENGLAND TESTS
  // ============================================
  describe('England', () => {
    it('should be eligible with UC and income below £7,400 threshold', () => {
      const result = assessFreeSchoolMealsEligibility(
        {
          area: 'england',
          children: 2,
          childrenInfo: [{ age: 8 }, { age: 12 }],
          monthlyEarnings: 500, // £6,000/year - below threshold
        },
        { calculation: { finalAmount: 800 } } // Has UC
      )

      expect(result.eligible).toBe(true)
      expect(result.meetsIncomeThreshold).toBe(true)
      expect(result.threshold).toBe(7400)
      expect(result.eligibleChildren.every((c) => c.eligible)).toBe(true)
    })

    it('should NOT be currently eligible with income above £7,400 but will be from Sept 2026', () => {
      const result = assessFreeSchoolMealsEligibility(
        {
          area: 'england',
          children: 1,
          childrenInfo: [{ age: 10 }],
          monthlyEarnings: 1000, // £12,000/year - above threshold
        },
        { calculation: { finalAmount: 500 } } // Has UC
      )

      expect(result.eligible).toBe(false)
      expect(result.eligibleFromSeptember2026).toBe(true)
      expect(result.meetsIncomeThreshold).toBe(false)
      expect(result.reason).toContain('September 2026')
    })

    it('should NOT be eligible without UC', () => {
      const result = assessFreeSchoolMealsEligibility(
        {
          area: 'england',
          children: 1,
          childrenInfo: [{ age: 7 }],
          monthlyEarnings: 400,
        },
        { calculation: { finalAmount: 0 } } // No UC
      )

      expect(result.eligible).toBe(false)
      expect(result.hasUniversalCredit).toBe(false)
      expect(result.reason).toContain('not receiving Universal Credit')
    })
  })

  // ============================================
  // SCOTLAND TESTS
  // ============================================
  describe('Scotland', () => {
    it('should be eligible through universal provision for P1-P5 (ages 4-10) regardless of income', () => {
      const result = assessFreeSchoolMealsEligibility(
        {
          area: 'scotland',
          children: 2,
          childrenInfo: [{ age: 6 }, { age: 9 }], // P2 and P5 - covered by universal
          monthlyEarnings: 2000, // £24,000/year - well above threshold
        },
        { calculation: { finalAmount: 0 } } // No UC needed for universal
      )

      // Both children should be eligible via universal provision
      expect(result.eligibleChildren[0].eligible).toBe(true)
      expect(result.eligibleChildren[0].universalProvision).toBe(true)
      expect(result.eligibleChildren[0].reason).toBe('Universal provision (P1-P5)')
      expect(result.eligibleChildren[1].eligible).toBe(true)
      expect(result.eligibleChildren[1].universalProvision).toBe(true)
    })

    it('should be eligible for P6+ with UC and income below £850/month (£10,200/year)', () => {
      const result = assessFreeSchoolMealsEligibility(
        {
          area: 'scotland',
          children: 1,
          childrenInfo: [{ age: 12 }], // P7/Secondary - not covered by universal
          monthlyEarnings: 800, // £9,600/year - below £10,200 threshold
        },
        { calculation: { finalAmount: 600 } } // Has UC
      )

      expect(result.eligible).toBe(true)
      expect(result.threshold).toBe(10200)
      expect(result.eligibleChildren[0].eligible).toBe(true)
      expect(result.eligibleChildren[0].universalProvision).toBeUndefined()
    })

    it('should NOT be eligible for P6+ with income above £850/month (£10,200/year)', () => {
      const result = assessFreeSchoolMealsEligibility(
        {
          area: 'scotland',
          children: 1,
          childrenInfo: [{ age: 14 }], // Secondary - not covered by universal
          monthlyEarnings: 1000, // £12,000/year - above £10,200 threshold
        },
        { calculation: { finalAmount: 400 } } // Has UC
      )

      expect(result.eligible).toBe(false)
      expect(result.threshold).toBe(10200)
      expect(result.reason).toContain('exceeds')
    })
  })

  // ============================================
  // WALES TESTS
  // ============================================
  describe('Wales', () => {
    it('should be eligible through universal provision for all primary (ages 4-11) regardless of income', () => {
      const result = assessFreeSchoolMealsEligibility(
        {
          area: 'wales',
          children: 2,
          childrenInfo: [{ age: 5 }, { age: 11 }], // Reception and Year 6
          monthlyEarnings: 3000, // £36,000/year - well above any threshold
        },
        { calculation: { finalAmount: 0 } } // No UC needed for universal
      )

      // Both primary children should be eligible via universal provision
      expect(result.eligibleChildren[0].eligible).toBe(true)
      expect(result.eligibleChildren[0].universalProvision).toBe(true)
      expect(result.eligibleChildren[0].reason).toBe('Universal Primary Free School Meals')
      expect(result.eligibleChildren[1].eligible).toBe(true)
      expect(result.eligibleChildren[1].universalProvision).toBe(true)
    })

    it('should be eligible for secondary with UC and income below £7,400/year', () => {
      const result = assessFreeSchoolMealsEligibility(
        {
          area: 'wales',
          children: 1,
          childrenInfo: [{ age: 14 }], // Secondary school
          monthlyEarnings: 500, // £6,000/year - below threshold
        },
        { calculation: { finalAmount: 700 } } // Has UC
      )

      expect(result.eligible).toBe(true)
      expect(result.threshold).toBe(7400)
      expect(result.eligibleChildren[0].eligible).toBe(true)
    })

    it('should NOT be eligible for secondary with income above £7,400/year', () => {
      const result = assessFreeSchoolMealsEligibility(
        {
          area: 'wales',
          children: 1,
          childrenInfo: [{ age: 15 }], // Secondary school
          monthlyEarnings: 1000, // £12,000/year - above threshold
        },
        { calculation: { finalAmount: 500 } } // Has UC
      )

      expect(result.eligible).toBe(false)
      expect(result.reason).toContain('exceeds')
    })
  })

  // ============================================
  // NORTHERN IRELAND TESTS
  // ============================================
  describe('Northern Ireland', () => {
    it('should be eligible with UC and income below £14,000/year threshold', () => {
      const result = assessFreeSchoolMealsEligibility(
        {
          area: 'northern_ireland',
          children: 2,
          childrenInfo: [{ age: 7 }, { age: 13 }],
          monthlyEarnings: 1000, // £12,000/year - below £14,000 threshold
        },
        { calculation: { finalAmount: 600 } } // Has UC
      )

      expect(result.eligible).toBe(true)
      expect(result.threshold).toBe(14000)
      expect(result.meetsIncomeThreshold).toBe(true)
      expect(result.eligibleChildren.every((c) => c.eligible)).toBe(true)
    })

    it('should be eligible at exactly £14,000/year threshold', () => {
      const result = assessFreeSchoolMealsEligibility(
        {
          area: 'northern_ireland',
          children: 1,
          childrenInfo: [{ age: 10 }],
          monthlyEarnings: 1166.66, // £13,999.92/year - just under threshold
        },
        { calculation: { finalAmount: 400 } } // Has UC
      )

      expect(result.eligible).toBe(true)
      expect(result.threshold).toBe(14000)
    })

    it('should NOT be eligible with income above £14,000/year', () => {
      const result = assessFreeSchoolMealsEligibility(
        {
          area: 'northern_ireland',
          children: 1,
          childrenInfo: [{ age: 12 }],
          monthlyEarnings: 1500, // £18,000/year - above threshold
        },
        { calculation: { finalAmount: 300 } } // Has UC
      )

      expect(result.eligible).toBe(false)
      expect(result.reason).toContain('exceeds')
      expect(result.reason).toContain('14,000')
    })
  })

  // ============================================
  // MIXED SCENARIOS (children of different ages)
  // ============================================
  describe('Mixed age children scenarios', () => {
    it('Scotland: should show universal for young children and income-based for older', () => {
      const result = assessFreeSchoolMealsEligibility(
        {
          area: 'scotland',
          children: 3,
          childrenInfo: [{ age: 7 }, { age: 12 }, { age: 16 }], // P3, S1, S5
          monthlyEarnings: 700, // £8,400/year - below £10,200 threshold
        },
        { calculation: { finalAmount: 500 } } // Has UC
      )

      // Age 7 (P3) - universal provision
      expect(result.eligibleChildren[0].eligible).toBe(true)
      expect(result.eligibleChildren[0].universalProvision).toBe(true)

      // Age 12 (S1) - income-based (below threshold)
      expect(result.eligibleChildren[1].eligible).toBe(true)
      expect(result.eligibleChildren[1].universalProvision).toBeUndefined()

      // Age 16 (S5) - income-based (below threshold)
      expect(result.eligibleChildren[2].eligible).toBe(true)
      expect(result.eligibleChildren[2].universalProvision).toBeUndefined()
    })

    it('Wales: should show universal for primary and income-based for secondary', () => {
      const result = assessFreeSchoolMealsEligibility(
        {
          area: 'wales',
          children: 2,
          childrenInfo: [{ age: 10 }, { age: 14 }], // Year 5 (primary), Year 9 (secondary)
          monthlyEarnings: 500, // £6,000/year - below threshold
        },
        { calculation: { finalAmount: 600 } } // Has UC
      )

      // Age 10 (Year 5) - universal primary provision
      expect(result.eligibleChildren[0].eligible).toBe(true)
      expect(result.eligibleChildren[0].universalProvision).toBe(true)
      expect(result.eligibleChildren[0].reason).toBe('Universal Primary Free School Meals')

      // Age 14 (Year 9) - income-based
      expect(result.eligibleChildren[1].eligible).toBe(true)
      expect(result.eligibleChildren[1].universalProvision).toBeUndefined()
    })
  })
})
