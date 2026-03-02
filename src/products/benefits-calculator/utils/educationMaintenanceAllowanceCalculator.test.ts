/**
 * Education Maintenance Allowance (EMA) Calculator Tests
 *
 * Tests cover:
 *  - England (not available)
 *  - Wales: single student eligible, single student income too high, two students threshold switch
 *  - Scotland: eligible, income too high
 *  - Northern Ireland: eligible, income too high
 *  - Age boundary conditions (min/max age per country)
 *  - Not in full-time further education
 *  - No children / no age-range children
 *  - Mixed households (some eligible, some not)
 *  - Zero income (always meets threshold)
 */

import { describe, it, expect } from 'vitest'
import { assessEMAEligibility } from './educationMaintenanceAllowanceCalculator'

// ---------------------------------------------------------------------------
// England – EMA abolished
// ---------------------------------------------------------------------------

describe('England – EMA not available', () => {
  it('returns availableInCountry: false for England', () => {
    const result = assessEMAEligibility({
      area: 'england',
      children: 1,
      childrenInfo: [{ age: 17, isInFurtherEducation: true }],
      monthlyEarnings: 1000,
    })
    expect(result.availableInCountry).toBe(false)
    expect(result.eligible).toBe(false)
    expect(result.weeklyAmount).toBe(0)
    expect(result.reason).toContain('not available in England')
  })

  it('returns availableInCountry: false regardless of income or children', () => {
    const result = assessEMAEligibility({
      area: 'England',
      children: 2,
      childrenInfo: [
        { age: 16, isInFurtherEducation: true },
        { age: 18, isInFurtherEducation: true },
      ],
      monthlyEarnings: 500,
    })
    expect(result.availableInCountry).toBe(false)
    expect(result.eligibleStudentCount).toBe(0)
  })
})

// ---------------------------------------------------------------------------
// Wales – £40/week, ages 16–18
// ---------------------------------------------------------------------------

describe('Wales – single eligible student', () => {
  it('is eligible when 17-year-old in FTE and income ≤ £23,400', () => {
    const result = assessEMAEligibility({
      area: 'wales',
      children: 1,
      childrenInfo: [{ age: 17, isInFurtherEducation: true }],
      monthlyEarnings: 1950, // £23,400/year – exactly at threshold
    })
    expect(result.availableInCountry).toBe(true)
    expect(result.eligible).toBe(true)
    expect(result.eligibleStudentCount).toBe(1)
    expect(result.weeklyAmount).toBe(40)
    expect(result.meetsIncomeThreshold).toBe(true)
    expect(result.incomeThreshold).toBe(23400)
  })

  it('is NOT eligible when income exceeds the single-student threshold (£23,400)', () => {
    const result = assessEMAEligibility({
      area: 'wales',
      children: 1,
      childrenInfo: [{ age: 17, isInFurtherEducation: true }],
      monthlyEarnings: 2000, // £24,000/year > £23,400
    })
    expect(result.eligible).toBe(false)
    expect(result.meetsIncomeThreshold).toBe(false)
    expect(result.weeklyAmount).toBe(0)
    expect(result.incomeThreshold).toBe(23400)
  })

  it('is NOT eligible when student is not in further education', () => {
    const result = assessEMAEligibility({
      area: 'wales',
      children: 1,
      childrenInfo: [{ age: 17, isInFurtherEducation: false }],
      monthlyEarnings: 1000,
    })
    expect(result.eligible).toBe(false)
    expect(result.eligibleStudentCount).toBe(0)
    expect(result.students[0].eligible).toBe(false)
    expect(result.students[0].isInFurtherEducation).toBe(false)
  })
})

describe('Wales – two eligible students (threshold switches to £25,974)', () => {
  it('uses the higher threshold when 2 eligible students exist', () => {
    const result = assessEMAEligibility({
      area: 'wales',
      children: 2,
      childrenInfo: [
        { age: 16, isInFurtherEducation: true },
        { age: 18, isInFurtherEducation: true },
      ],
      monthlyEarnings: 2100, // £25,200/year – between thresholds
    })
    expect(result.eligible).toBe(true)
    expect(result.eligibleStudentCount).toBe(2)
    expect(result.weeklyAmount).toBe(80) // 2 × £40
    expect(result.incomeThreshold).toBe(25974)
    expect(result.meetsIncomeThreshold).toBe(true)
  })

  it('would be ineligible under single threshold but eligible under dual threshold', () => {
    // Income between £23,400 and £25,974
    const singleResult = assessEMAEligibility({
      area: 'wales',
      children: 1,
      childrenInfo: [{ age: 17, isInFurtherEducation: true }],
      monthlyEarnings: 2000, // £24,000
    })
    const dualResult = assessEMAEligibility({
      area: 'wales',
      children: 2,
      childrenInfo: [
        { age: 17, isInFurtherEducation: true },
        { age: 18, isInFurtherEducation: true },
      ],
      monthlyEarnings: 2000, // £24,000
    })
    expect(singleResult.eligible).toBe(false) // above £23,400
    expect(dualResult.eligible).toBe(true)    // below £25,974
    expect(dualResult.weeklyAmount).toBe(80)
  })

  it('is NOT eligible when income exceeds the dual-student threshold (£25,974)', () => {
    const result = assessEMAEligibility({
      area: 'wales',
      children: 2,
      childrenInfo: [
        { age: 16, isInFurtherEducation: true },
        { age: 18, isInFurtherEducation: true },
      ],
      monthlyEarnings: 2200, // £26,400 > £25,974
    })
    expect(result.eligible).toBe(false)
    expect(result.meetsIncomeThreshold).toBe(false)
    expect(result.incomeThreshold).toBe(25974)
  })
})

describe('Wales – age boundaries', () => {
  it('age 16 is eligible (minimum age in Wales)', () => {
    const result = assessEMAEligibility({
      area: 'wales',
      children: 1,
      childrenInfo: [{ age: 16, isInFurtherEducation: true }],
      monthlyEarnings: 1000,
    })
    expect(result.students[0].meetsAgeCriteria).toBe(true)
    expect(result.eligible).toBe(true)
  })

  it('age 18 is eligible (maximum age in Wales)', () => {
    const result = assessEMAEligibility({
      area: 'wales',
      children: 1,
      childrenInfo: [{ age: 18, isInFurtherEducation: true }],
      monthlyEarnings: 1000,
    })
    expect(result.students[0].meetsAgeCriteria).toBe(true)
    expect(result.eligible).toBe(true)
  })

  it('age 15 is NOT eligible in Wales (too young)', () => {
    const result = assessEMAEligibility({
      area: 'wales',
      children: 1,
      childrenInfo: [{ age: 15, isInFurtherEducation: true }],
      monthlyEarnings: 1000,
    })
    expect(result.students[0].meetsAgeCriteria).toBe(false)
    expect(result.eligible).toBe(false)
    expect(result.students[0].reason).toContain('Too young')
  })

  it('age 19 is NOT eligible in Wales (too old)', () => {
    const result = assessEMAEligibility({
      area: 'wales',
      children: 1,
      childrenInfo: [{ age: 19, isInFurtherEducation: true }],
      monthlyEarnings: 1000,
    })
    expect(result.students[0].meetsAgeCriteria).toBe(false)
    expect(result.eligible).toBe(false)
    expect(result.students[0].reason).toContain('maximum age')
  })
})

// ---------------------------------------------------------------------------
// Scotland – £30/week, ages 16–19
// ---------------------------------------------------------------------------

describe('Scotland – eligible student', () => {
  it('is eligible for £30/week when 18-year-old in FTE and income ≤ £26,884', () => {
    const result = assessEMAEligibility({
      area: 'scotland',
      children: 1,
      childrenInfo: [{ age: 18, isInFurtherEducation: true }],
      monthlyEarnings: 2000, // £24,000 < £26,884
    })
    expect(result.availableInCountry).toBe(true)
    expect(result.eligible).toBe(true)
    expect(result.weeklyAmount).toBe(30)
    expect(result.incomeThreshold).toBe(26884)
    expect(result.meetsIncomeThreshold).toBe(true)
  })

  it('age 19 is eligible in Scotland (max age for Scotland/NI)', () => {
    const result = assessEMAEligibility({
      area: 'scotland',
      children: 1,
      childrenInfo: [{ age: 19, isInFurtherEducation: true }],
      monthlyEarnings: 1000,
    })
    expect(result.students[0].meetsAgeCriteria).toBe(true)
    expect(result.eligible).toBe(true)
  })

  it('age 20 is NOT eligible in Scotland (too old)', () => {
    const result = assessEMAEligibility({
      area: 'scotland',
      children: 1,
      childrenInfo: [{ age: 20, isInFurtherEducation: true }],
      monthlyEarnings: 1000,
    })
    expect(result.students[0].meetsAgeCriteria).toBe(false)
    expect(result.eligible).toBe(false)
  })

  it('is NOT eligible when income exceeds £26,884 in Scotland', () => {
    const result = assessEMAEligibility({
      area: 'scotland',
      children: 1,
      childrenInfo: [{ age: 17, isInFurtherEducation: true }],
      monthlyEarnings: 2500, // £30,000 > £26,884
    })
    expect(result.eligible).toBe(false)
    expect(result.meetsIncomeThreshold).toBe(false)
  })

  it('counts both partners earnings for income test', () => {
    const result = assessEMAEligibility({
      area: 'scotland',
      children: 1,
      childrenInfo: [{ age: 17, isInFurtherEducation: true }],
      monthlyEarnings: 1000,
      partnerMonthlyEarnings: 1500, // total £30,000 > £26,884
    })
    expect(result.annualHouseholdIncome).toBe(30000)
    expect(result.eligible).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Northern Ireland – £30/week, ages 16–19
// ---------------------------------------------------------------------------

describe('Northern Ireland – eligible student', () => {
  it('is eligible for £30/week when 17-year-old in FTE and income ≤ £20,500', () => {
    const result = assessEMAEligibility({
      area: 'northern_ireland',
      children: 1,
      childrenInfo: [{ age: 17, isInFurtherEducation: true }],
      monthlyEarnings: 1700, // £20,400 < £20,500
    })
    expect(result.availableInCountry).toBe(true)
    expect(result.eligible).toBe(true)
    expect(result.weeklyAmount).toBe(30)
    expect(result.incomeThreshold).toBe(20500)
  })

  it('is NOT eligible when income exceeds £20,500 in Northern Ireland', () => {
    const result = assessEMAEligibility({
      area: 'northern_ireland',
      children: 1,
      childrenInfo: [{ age: 17, isInFurtherEducation: true }],
      monthlyEarnings: 1800, // £21,600 > £20,500
    })
    expect(result.eligible).toBe(false)
  })
})

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe('Edge cases', () => {
  it('handles no childrenInfo gracefully (no eligible students)', () => {
    const result = assessEMAEligibility({
      area: 'wales',
      children: 0,
      monthlyEarnings: 1000,
    })
    expect(result.eligible).toBe(false)
    expect(result.eligibleStudentCount).toBe(0)
    expect(result.students).toHaveLength(0)
  })

  it('handles zero income (always meets threshold)', () => {
    const result = assessEMAEligibility({
      area: 'wales',
      children: 1,
      childrenInfo: [{ age: 17, isInFurtherEducation: true }],
      monthlyEarnings: 0,
      partnerMonthlyEarnings: 0,
    })
    expect(result.annualHouseholdIncome).toBe(0)
    expect(result.meetsIncomeThreshold).toBe(true)
    expect(result.eligible).toBe(true)
  })

  it('handles missing isInFurtherEducation (defaults to false)', () => {
    const result = assessEMAEligibility({
      area: 'wales',
      children: 1,
      childrenInfo: [{ age: 17 }], // no isInFurtherEducation field
      monthlyEarnings: 1000,
    })
    expect(result.students[0].isInFurtherEducation).toBe(false)
    expect(result.eligible).toBe(false)
  })

  it('handles mixed-age children – only age-eligible students get EMA', () => {
    const result = assessEMAEligibility({
      area: 'scotland',
      children: 3,
      childrenInfo: [
        { age: 10, isInFurtherEducation: false }, // too young
        { age: 17, isInFurtherEducation: true },  // eligible
        { age: 20, isInFurtherEducation: true },  // too old
      ],
      monthlyEarnings: 1500,
    })
    expect(result.eligibleStudentCount).toBe(1)
    expect(result.totalStudentsInAgeRange).toBe(1)
    expect(result.weeklyAmount).toBe(30)
    expect(result.students[0].eligible).toBe(false) // too young
    expect(result.students[1].eligible).toBe(true)  // eligible
    expect(result.students[2].eligible).toBe(false) // too old
  })

  it('handles mixed FTE status – only students in FTE get EMA', () => {
    const result = assessEMAEligibility({
      area: 'wales',
      children: 2,
      childrenInfo: [
        { age: 16, isInFurtherEducation: true },
        { age: 17, isInFurtherEducation: false }, // not in FTE
      ],
      monthlyEarnings: 1000,
    })
    // Only 1 in FTE → uses single-student threshold (£23,400)
    expect(result.eligibleStudentCount).toBe(1)
    expect(result.incomeThreshold).toBe(23400)
    expect(result.weeklyAmount).toBe(40)
  })

  it('calculates monthly equivalent correctly', () => {
    const result = assessEMAEligibility({
      area: 'wales',
      children: 1,
      childrenInfo: [{ age: 17, isInFurtherEducation: true }],
      monthlyEarnings: 1000,
    })
    expect(result.weeklyAmount).toBe(40)
    expect(result.fourWeeklyAmount).toBe(160)
    expect(result.annualAmount).toBe(2080) // 40 × 52
    expect(result.monthlyEquivalent).toBeCloseTo(2080 / 12, 2)
  })

  it('area string is case-insensitive', () => {
    const result = assessEMAEligibility({
      area: 'WALES',
      children: 1,
      childrenInfo: [{ age: 17, isInFurtherEducation: true }],
      monthlyEarnings: 1000,
    })
    expect(result.availableInCountry).toBe(true)
    expect(result.eligible).toBe(true)
  })

  it('area "Northern Ireland" with spaces is normalised correctly', () => {
    const result = assessEMAEligibility({
      area: 'Northern Ireland',
      children: 1,
      childrenInfo: [{ age: 17, isInFurtherEducation: true }],
      monthlyEarnings: 1000,
    })
    expect(result.availableInCountry).toBe(true)
    expect(result.incomeThreshold).toBe(20500)
  })
})
