/**
 * Example Scenarios Component
 * Provides quick-fill example scenarios for testing and demonstration
 */

import { Button } from '~/components/Button'
import { Accordion } from '~/components/Accordion'

export interface ExampleScenario {
  id: string
  name: string
  description: string
  category: 'simple' | 'complex' | 'edge-case' | 'real-world' | 'fsm-test' | 'student' | 'scp-test' | 'ema-test'
  data: Record<string, any>
}

const examples: ExampleScenario[] = [
  {
    id: 'single-no-children',
    name: 'Simple 1: Single person, no children',
    description: 'Basic single person scenario with no dependents',
    category: 'simple',
    data: {
      area: 'england',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 32,
      children: 0,
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 650,
      rentPeriod: 'per_month',
      brma: 'Central Greater Manchester',
      employmentType: 'not_working',
    },
  },
  {
    id: 'single-parent-2-kids',
    name: 'Real World 1: Single parent, 2 children',
    description: 'Single parent with 2 children in Manchester',
    category: 'real-world',
    data: {
      area: 'england',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 35,
      children: 2,
      childrenInfo: [
        { age: 5, hasDisability: false },
        { age: 8, hasDisability: false },
      ],
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 820,
      rentPeriod: 'per_month',
      brma: 'Central Greater Manchester',
      employmentType: 'not_working',
    },
  },
  {
    id: 'couple-3-kids',
    name: 'Complex 1: Couple with 3 children',
    description: 'Couple with 3 children, one with disability',
    category: 'complex',
    data: {
      area: 'england',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 38,
      partnerAge: 40,
      children: 3,
      childrenInfo: [
        { age: 4, hasDisability: false },
        { age: 7, hasDisability: true },
        { age: 12, hasDisability: false },
      ],
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 1100,
      rentPeriod: 'per_month',
      brma: 'Outer South East London',
      employmentType: 'employed',
      monthlyEarnings: 1200,
      monthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'part-time-worker',
    name: 'Real World 2: Part-time worker',
    description: 'Single person working 16 hours/week at minimum wage (~£800/month)',
    category: 'real-world',
    data: {
      area: 'england',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 28,
      children: 0,
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 550,
      rentPeriod: 'per_month',
      brma: 'Leeds',
      employmentType: 'employed',
      monthlyEarnings: 800,
      monthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'carer-scenario',
    name: 'Complex 2: Carer for disabled parent',
    description: 'Single person caring for disabled parent 40+ hours/week',
    category: 'complex',
    data: {
      area: 'england',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 45,
      children: 0,
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 600,
      rentPeriod: 'per_month',
      brma: 'Birmingham',
      isCarer: 'yes',
      employmentType: 'not_working',
    },
  },
  {
    id: 'pension-age-couple',
    name: 'Edge Case 1: Mixed-age couple (one at SPA)',
    description: 'Couple where partner has reached State Pension Age',
    category: 'edge-case',
    data: {
      area: 'scotland',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 55,
      partnerAge: 67,
      children: 0,
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 750,
      rentPeriod: 'per_month',
      brma: 'Greater Glasgow',
      employmentType: 'not_working',
    },
  },
  {
    id: 'high-earner',
    name: 'Edge Case 2: High earner with children',
    description: 'Family with income over £60k (Child Benefit charge applies)',
    category: 'edge-case',
    data: {
      area: 'england',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 42,
      partnerAge: 40,
      children: 2,
      childrenInfo: [
        { age: 6, hasDisability: false },
        { age: 10, hasDisability: false },
      ],
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 1200,
      rentPeriod: 'per_month',
      brma: 'Outer South East London',
      employmentType: 'employed',
      monthlyEarnings: 5417,
      monthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'lcwra-element',
    name: 'Complex 3: Person with LCWRA',
    description: 'Single person with Limited Capability for Work and Work-Related Activity',
    category: 'complex',
    data: {
      area: 'wales',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 51,
      children: 0,
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 580,
      rentPeriod: 'per_month',
      brma: 'Cardiff',
      hasLCWRA: 'yes',
      employmentType: 'not_working',
    },
  },
  {
    id: 'childcare-costs',
    name: 'Real World 3: Working parent with childcare',
    description: 'Single parent working full-time with high childcare costs',
    category: 'real-world',
    data: {
      area: 'england',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 33,
      children: 2,
      childrenInfo: [
        { age: 2, hasDisability: false },
        { age: 4, hasDisability: false },
      ],
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 900,
      rentPeriod: 'per_month',
      brma: 'Bristol',
      employmentType: 'employed',
      monthlyEarnings: 1800,
      monthlyEarningsPeriod: 'per_month',
      childcareCosts: 1200,
      childcareCostsPeriod: 'per_month',
    },
  },
  {
    id: 'zero-income',
    name: 'Edge Case 3: No income or housing costs',
    description: 'Edge case: Single person with no income living rent-free',
    category: 'edge-case',
    data: {
      area: 'england',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 25,
      children: 0,
      housingStatus: 'no_housing_costs',
      employmentType: 'not_working',
    },
  },
  // ============================================
  // STUDENT SCENARIOS
  // Tests the restructured student flow: lead question on household page,
  // student details page moved to after Council Tax (just before Results),
  // auto-skip for simple cases, auto-detect exceptions for borderline cases,
  // and "Students and benefits" panel on results page.
  // ============================================
  {
    id: 'student-simple-skip',
    name: 'Student 1: Simple case (auto-skip)',
    description: 'Single, age 25, no children, no disability — student details page is skipped. Results show "Students and benefits" panel explaining no exception met.',
    category: 'student',
    data: {
      area: 'england',
      postcode: 'M1 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 25,
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 650,
      rentPeriod: 'per_month',
      employmentType: 'not_working',
      isFullTimeStudent: true,
      // No studentExceptions, studentType etc — page was skipped
    },
  },
  {
    id: 'student-parent-loan',
    name: 'Student 2: Parent with maintenance loan',
    description: 'Single parent, age 28, 1 child — borderline case, student details page shown with "responsible for child" auto-detected. Has undergraduate loan.',
    category: 'student',
    data: {
      area: 'england',
      postcode: 'B1 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 28,
      children: 1,
      childrenInfo: [{ age: 4, hasDisability: 'no' }],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 750,
      rentPeriod: 'per_month',
      employmentType: 'not_working',
      isFullTimeStudent: true,
      studentExceptions: ['responsible_for_child'],
      studentType: 'undergraduate',
      hasStudentLoan: true,
      studentLoanAnnualAmount: 9500,
      hasPostgraduateLoan: false,
      postgraduateLoanAnnualAmount: 0,
      hasStudentGrant: false,
      studentGrantAnnualAmount: 0,
      courseAssessmentPeriods: 9,
      isInSummerHoliday: false,
    },
  },
  {
    id: 'student-disability-exception',
    name: 'Student 3: Disability exception (PIP + LCWRA)',
    description: 'Single, age 30, PIP daily living standard, LCWRA — borderline case, student details page shown with disability exception auto-detected.',
    category: 'student',
    data: {
      area: 'england',
      postcode: 'LS1 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 30,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 600,
      rentPeriod: 'per_month',
      employmentType: 'not_working',
      isDisabled: 'yes',
      claimsDisabilityBenefits: 'yes',
      disabilityBenefitType: 'pip',
      pipDailyLivingRate: 'standard',
      pipMobilityRate: 'none',
      hasLCWRA: 'yes',
      isFullTimeStudent: true,
      studentExceptions: ['receiving_pip_dla_aa_with_work_limitation'],
      studentType: 'undergraduate',
      hasStudentLoan: true,
      studentLoanAnnualAmount: 8000,
      hasPostgraduateLoan: false,
      postgraduateLoanAnnualAmount: 0,
      hasStudentGrant: false,
      studentGrantAnnualAmount: 0,
      courseAssessmentPeriods: 9,
      isInSummerHoliday: false,
    },
  },
  {
    id: 'student-under-21',
    name: 'Student 4: Under 21',
    description: 'Age 19, single, no children — borderline because age < 21. Student details page shown with under-21 exception auto-detected.',
    category: 'student',
    data: {
      area: 'england',
      postcode: 'NE1 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 19,
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 450,
      rentPeriod: 'per_month',
      employmentType: 'not_working',
      isFullTimeStudent: true,
      studentExceptions: ['under21_non_advanced_no_parental_support'],
      studentType: 'undergraduate',
      hasStudentLoan: true,
      studentLoanAnnualAmount: 5000,
      hasPostgraduateLoan: false,
      postgraduateLoanAnnualAmount: 0,
      hasStudentGrant: false,
      studentGrantAnnualAmount: 0,
      courseAssessmentPeriods: 9,
      isInSummerHoliday: false,
    },
  },
  {
    id: 'student-postgrad-grant',
    name: 'Student 5: Postgraduate with loan and grant',
    description: 'Couple with child, postgraduate — tests 30% postgrad rule + grant. Student details page shown (couple = borderline).',
    category: 'student',
    data: {
      area: 'england',
      postcode: 'OX1 1AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 26,
      partnerAge: 25,
      children: 1,
      childrenInfo: [{ age: 3, hasDisability: 'no' }],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 900,
      rentPeriod: 'per_month',
      employmentType: 'not_working',
      partnerEmploymentType: 'not_working',
      isFullTimeStudent: true,
      studentExceptions: ['responsible_for_child'],
      studentType: 'postgraduate',
      hasStudentLoan: false,
      studentLoanAnnualAmount: 0,
      hasPostgraduateLoan: true,
      postgraduateLoanAnnualAmount: 12000,
      hasStudentGrant: true,
      studentGrantAnnualAmount: 2000,
      courseAssessmentPeriods: 12,
      isInSummerHoliday: false,
    },
  },
  {
    id: 'student-summer-holiday',
    name: 'Student 6: Summer holiday (£0 income)',
    description: 'Single parent, age 24, in summer holiday — student income should be £0. Shows summer holiday explanation in Students panel.',
    category: 'student',
    data: {
      area: 'england',
      postcode: 'SW1A 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 24,
      children: 1,
      childrenInfo: [{ age: 2, hasDisability: 'no' }],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 850,
      rentPeriod: 'per_month',
      employmentType: 'not_working',
      isFullTimeStudent: true,
      studentExceptions: ['responsible_for_child'],
      studentType: 'undergraduate',
      hasStudentLoan: true,
      studentLoanAnnualAmount: 9535,
      hasPostgraduateLoan: false,
      postgraduateLoanAnnualAmount: 0,
      hasStudentGrant: false,
      studentGrantAnnualAmount: 0,
      courseAssessmentPeriods: 9,
      isInSummerHoliday: true,
    },
  },
  {
    id: 'student-couple-both-studying',
    name: 'Student 7: Couple both studying',
    description: 'Couple, both students, 1 child, partner cares for child — tests exception 5. Both student incomes deducted with independent £110 disregards.',
    category: 'student',
    data: {
      area: 'england',
      postcode: 'CB2 1AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 27,
      partnerAge: 26,
      children: 1,
      childrenInfo: [{ age: 1, hasDisability: 'no' }],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 950,
      rentPeriod: 'per_month',
      employmentType: 'not_working',
      partnerEmploymentType: 'not_working',
      isFullTimeStudent: true,
      studentExceptions: ['couple_both_studying_partner_cares_for_child'],
      studentType: 'undergraduate',
      hasStudentLoan: true,
      studentLoanAnnualAmount: 9535,
      hasPostgraduateLoan: false,
      postgraduateLoanAnnualAmount: 0,
      hasStudentGrant: false,
      studentGrantAnnualAmount: 0,
      courseAssessmentPeriods: 9,
      isInSummerHoliday: false,
      partnerIsFullTimeStudent: true,
      partnerStudentExceptions: ['couple_both_studying_partner_cares_for_child'],
      partnerStudentType: 'undergraduate',
      partnerHasStudentLoan: true,
      partnerStudentLoanAnnualAmount: 8500,
      partnerHasPostgraduateLoan: false,
      partnerPostgraduateLoanAnnualAmount: 0,
      partnerHasStudentGrant: false,
      partnerStudentGrantAnnualAmount: 0,
      partnerCourseAssessmentPeriods: 9,
      partnerIsInSummerHoliday: false,
    },
  },
  {
    id: 'student-pension-age',
    name: 'Student 8: Pension age exception',
    description: 'Age 67 with partner age 55 — tests exception 6 (state pension age with younger partner). Postgraduate with grant.',
    category: 'student',
    data: {
      area: 'england',
      postcode: 'EH1 1AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 67,
      partnerAge: 55,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 700,
      rentPeriod: 'per_month',
      employmentType: 'not_working',
      partnerEmploymentType: 'not_working',
      isFullTimeStudent: true,
      studentExceptions: ['reached_state_pension_age_younger_partner'],
      studentType: 'postgraduate',
      hasStudentLoan: false,
      studentLoanAnnualAmount: 0,
      hasPostgraduateLoan: true,
      postgraduateLoanAnnualAmount: 12167,
      hasStudentGrant: true,
      studentGrantAnnualAmount: 2000,
      courseAssessmentPeriods: 12,
      isInSummerHoliday: false,
    },
  },
  {
    id: 'student-partner-only',
    name: 'Student 9: Partner-only student',
    description: 'Claimant is NOT a student, partner IS. No Reg 14 exception needed — couple claims through non-student. Partner student income deducted.',
    category: 'student',
    data: {
      area: 'england',
      postcode: 'M1 1AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 30,
      partnerAge: 28,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 650,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 800,
      monthlyEarningsPeriod: 'per_month',
      partnerEmploymentType: 'not_working',
      isFullTimeStudent: false,
      partnerIsFullTimeStudent: true,
      partnerStudentType: 'undergraduate',
      partnerHasStudentLoan: true,
      partnerStudentLoanAnnualAmount: 9535,
      partnerHasPostgraduateLoan: false,
      partnerPostgraduateLoanAnnualAmount: 0,
      partnerHasStudentGrant: false,
      partnerStudentGrantAnnualAmount: 0,
      partnerCourseAssessmentPeriods: 9,
      partnerIsInSummerHoliday: false,
    },
  },
  {
    id: 'student-both-ineligible',
    name: 'Student 10: Both students, no children (ineligible)',
    description: 'Both are full-time students, no children, no disability. Neither has a Reg 14 exception. Result: £0 UC.',
    category: 'student',
    data: {
      area: 'england',
      postcode: 'LS1 1AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 25,
      partnerAge: 24,
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 800,
      rentPeriod: 'per_month',
      employmentType: 'not_working',
      partnerEmploymentType: 'not_working',
      isFullTimeStudent: true,
      studentExceptions: [],
      studentType: 'undergraduate',
      hasStudentLoan: true,
      studentLoanAnnualAmount: 9535,
      hasPostgraduateLoan: false,
      postgraduateLoanAnnualAmount: 0,
      hasStudentGrant: false,
      studentGrantAnnualAmount: 0,
      courseAssessmentPeriods: 9,
      isInSummerHoliday: false,
      partnerIsFullTimeStudent: true,
      partnerStudentExceptions: [],
      partnerStudentType: 'undergraduate',
      partnerHasStudentLoan: true,
      partnerStudentLoanAnnualAmount: 8000,
      partnerHasPostgraduateLoan: false,
      partnerPostgraduateLoanAnnualAmount: 0,
      partnerHasStudentGrant: false,
      partnerStudentGrantAnnualAmount: 0,
      partnerCourseAssessmentPeriods: 9,
      partnerIsInSummerHoliday: false,
    },
  },
  {
    id: 'student-both-different-types',
    name: 'Student 11: Both students, different loan types',
    description: 'Claimant is undergraduate with maintenance loan, partner is postgraduate (30% rule). Both have "responsible for child" exception. Tests dual income deduction.',
    category: 'student',
    data: {
      area: 'england',
      postcode: 'B1 1AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 32,
      partnerAge: 34,
      children: 2,
      childrenInfo: [{ age: 3, hasDisability: 'no' }, { age: 5, hasDisability: 'no' }],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 550,
      rentPeriod: 'per_month',
      employmentType: 'not_working',
      partnerEmploymentType: 'not_working',
      isFullTimeStudent: true,
      studentExceptions: ['responsible_for_child'],
      studentType: 'undergraduate',
      hasStudentLoan: true,
      studentLoanAnnualAmount: 9535,
      hasPostgraduateLoan: false,
      postgraduateLoanAnnualAmount: 0,
      hasStudentGrant: false,
      studentGrantAnnualAmount: 0,
      courseAssessmentPeriods: 9,
      isInSummerHoliday: false,
      partnerIsFullTimeStudent: true,
      partnerStudentExceptions: ['responsible_for_child'],
      partnerStudentType: 'postgraduate',
      partnerHasStudentLoan: false,
      partnerStudentLoanAnnualAmount: 0,
      partnerHasPostgraduateLoan: true,
      partnerPostgraduateLoanAnnualAmount: 12167,
      partnerHasStudentGrant: true,
      partnerStudentGrantAnnualAmount: 2000,
      partnerCourseAssessmentPeriods: 12,
      partnerIsInSummerHoliday: false,
    },
  },
  {
    id: 'student-one-summer-holiday',
    name: 'Student 12: One in summer holiday',
    description: 'Both students with children. Claimant is in summer holiday (£0 income), partner is not (income deducted). Tests independent summer holiday handling.',
    category: 'student',
    data: {
      area: 'england',
      postcode: 'NE1 1AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 29,
      partnerAge: 27,
      children: 1,
      childrenInfo: [{ age: 2, hasDisability: 'no' }],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 600,
      rentPeriod: 'per_month',
      employmentType: 'not_working',
      partnerEmploymentType: 'not_working',
      isFullTimeStudent: true,
      studentExceptions: ['responsible_for_child'],
      studentType: 'undergraduate',
      hasStudentLoan: true,
      studentLoanAnnualAmount: 9535,
      hasPostgraduateLoan: false,
      postgraduateLoanAnnualAmount: 0,
      hasStudentGrant: false,
      studentGrantAnnualAmount: 0,
      courseAssessmentPeriods: 9,
      isInSummerHoliday: true,
      partnerIsFullTimeStudent: true,
      partnerStudentExceptions: ['couple_both_studying_partner_cares_for_child'],
      partnerStudentType: 'undergraduate',
      partnerHasStudentLoan: true,
      partnerStudentLoanAnnualAmount: 8500,
      partnerHasPostgraduateLoan: false,
      partnerPostgraduateLoanAnnualAmount: 0,
      partnerHasStudentGrant: false,
      partnerStudentGrantAnnualAmount: 0,
      partnerCourseAssessmentPeriods: 9,
      partnerIsInSummerHoliday: false,
    },
  },
  // ============================================
  // FSM TEST SCENARIOS
  // ============================================
  {
    id: 'fsm-england-eligible',
    name: 'FSM 1: England eligible (below £7,400)',
    description: 'Family in England with income below £7,400 threshold - FSM eligible',
    category: 'fsm-test',
    data: {
      area: 'england',
      postcode: 'M1 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 32,
      children: 2,
      childrenInfo: [
        { age: 8, hasDisability: 'no' },
        { age: 12, hasDisability: 'no' },
      ],
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 750,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 500, // £6,000/year - below £7,400 threshold
      monthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'fsm-england-no-earnings-age5',
    name: 'England: FSM Eligible (no earnings, child age 5)',
    description: 'Single parent in England with no earnings and a 5-year-old child — income is £0, well below the £7,400 threshold, so currently eligible for means-tested FSM',
    category: 'fsm-test',
    data: {
      area: 'england',
      postcode: 'M1 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 30,
      children: 1,
      childrenInfo: [{ age: 5, hasDisability: 'no' }],
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 700,
      rentPeriod: 'per_month',
      employmentType: 'not_working',
    },
  },
  {
    id: 'fsm-england-future',
    name: 'FSM 2: England Sept 2026 (above £7,400)',
    description: 'Family above threshold but will be eligible from September 2026',
    category: 'fsm-test',
    data: {
      area: 'england',
      postcode: 'M1 1AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 35,
      partnerAge: 33,
      children: 1,
      childrenInfo: [{ age: 10, hasDisability: 'no' }],
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 900,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 1000, // £12,000/year - above threshold but UC eligible
      monthlyEarningsPeriod: 'per_month',
      partnerEmploymentType: 'not_working',
    },
  },
  {
    id: 'fsm-scotland-universal',
    name: 'FSM 3: Scotland universal (P1-P5)',
    description: 'Scotland with children ages 6 and 9 - universal provision regardless of income',
    category: 'fsm-test',
    data: {
      area: 'scotland',
      postcode: 'EH1 1AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 38,
      partnerAge: 36,
      children: 2,
      childrenInfo: [
        { age: 6, hasDisability: 'no' }, // P2
        { age: 9, hasDisability: 'no' }, // P5
      ],
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 850,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 2000, // £24,000/year - above threshold but universal applies
      monthlyEarningsPeriod: 'per_month',
      partnerEmploymentType: 'not_working',
    },
  },
  {
    id: 'fsm-scotland-p6-eligible',
    name: 'FSM 4: Scotland P6+ eligible',
    description: 'Scotland with secondary child - eligible under £850/month threshold',
    category: 'fsm-test',
    data: {
      area: 'scotland',
      postcode: 'EH1 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 40,
      children: 1,
      childrenInfo: [{ age: 12, hasDisability: 'no' }], // S1 - secondary
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 700,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 800, // £9,600/year - below £10,200 threshold
      monthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'fsm-scotland-p6-not-eligible',
    name: 'FSM 5: Scotland P6+ not eligible',
    description: 'Scotland with secondary child - NOT eligible (income above threshold)',
    category: 'fsm-test',
    data: {
      area: 'scotland',
      postcode: 'EH1 1AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 42,
      partnerAge: 40,
      children: 1,
      childrenInfo: [{ age: 14, hasDisability: 'no' }], // S3 - secondary
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 900,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 1000, // £12,000/year - above £10,200 threshold
      monthlyEarningsPeriod: 'per_month',
      partnerEmploymentType: 'not_working',
    },
  },
  {
    id: 'fsm-wales-universal-primary',
    name: 'FSM 6: Wales universal primary',
    description: 'Wales with primary children (ages 5 and 11) - universal provision',
    category: 'fsm-test',
    data: {
      area: 'wales',
      postcode: 'CF10 1AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 36,
      partnerAge: 35,
      children: 2,
      childrenInfo: [
        { age: 5, hasDisability: 'no' }, // Reception
        { age: 11, hasDisability: 'no' }, // Year 6
      ],
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 800,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 3000, // £36,000/year - universal applies to all primary
      monthlyEarningsPeriod: 'per_month',
      partnerEmploymentType: 'not_working',
    },
  },
  {
    id: 'fsm-wales-secondary-eligible',
    name: 'FSM 7: Wales secondary eligible',
    description: 'Wales with secondary child - eligible under £7,400 threshold',
    category: 'fsm-test',
    data: {
      area: 'wales',
      postcode: 'CF10 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 38,
      children: 1,
      childrenInfo: [{ age: 14, hasDisability: 'no' }], // Year 9 - secondary
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 650,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 500, // £6,000/year - below £7,400 threshold
      monthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'fsm-wales-secondary-not-eligible',
    name: 'FSM 8: Wales secondary not eligible',
    description: 'Wales with secondary child - NOT eligible (income above threshold)',
    category: 'fsm-test',
    data: {
      area: 'wales',
      postcode: 'CF10 1AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 40,
      partnerAge: 38,
      children: 1,
      childrenInfo: [{ age: 15, hasDisability: 'no' }], // Year 10 - secondary
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 850,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 1000, // £12,000/year - above £7,400 threshold
      monthlyEarningsPeriod: 'per_month',
      partnerEmploymentType: 'not_working',
    },
  },
  {
    id: 'fsm-ni-eligible',
    name: 'FSM 9: N. Ireland eligible',
    description: 'Northern Ireland with income below £14,000 threshold - FSM eligible',
    category: 'fsm-test',
    data: {
      area: 'northern_ireland',
      postcode: 'BT1 1AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 35,
      partnerAge: 33,
      children: 2,
      childrenInfo: [
        { age: 7, hasDisability: 'no' },
        { age: 13, hasDisability: 'no' },
      ],
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 700,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 1000, // £12,000/year - below £14,000 threshold
      monthlyEarningsPeriod: 'per_month',
      partnerEmploymentType: 'not_working',
    },
  },
  {
    id: 'fsm-ni-not-eligible',
    name: 'FSM 10: N. Ireland not eligible',
    description: 'Northern Ireland with income above £14,000 threshold - NOT eligible',
    category: 'fsm-test',
    data: {
      area: 'northern_ireland',
      postcode: 'BT1 1AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 38,
      partnerAge: 36,
      children: 1,
      childrenInfo: [{ age: 12, hasDisability: 'no' }],
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 800,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 1500, // £18,000/year - above £14,000 threshold
      monthlyEarningsPeriod: 'per_month',
      partnerEmploymentType: 'not_working',
    },
  },
  {
    id: 'fsm-mixed-ages-scotland',
    name: 'FSM 11: Scotland mixed ages (P3 + secondary)',
    description: 'Scotland with P3 child (universal) and secondary child (income-based)',
    category: 'fsm-test',
    data: {
      area: 'scotland',
      postcode: 'EH1 1AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 40,
      partnerAge: 38,
      children: 3,
      childrenInfo: [
        { age: 7, hasDisability: 'no' }, // P3 - universal
        { age: 12, hasDisability: 'no' }, // S1 - income-based
        { age: 16, hasDisability: 'no' }, // S5 - income-based
      ],
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 950,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 700, // £8,400/year - below £10,200 threshold
      monthlyEarningsPeriod: 'per_month',
      partnerEmploymentType: 'not_working',
    },
  },
  {
    id: 'fsm-mixed-ages-wales',
    name: 'FSM 12: Wales mixed ages (primary + secondary)',
    description: 'Wales with Year 5 (universal) and Year 9 (income-based)',
    category: 'fsm-test',
    data: {
      area: 'wales',
      postcode: 'CF10 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 42,
      children: 2,
      childrenInfo: [
        { age: 10, hasDisability: 'no' }, // Year 5 - universal
        { age: 14, hasDisability: 'no' }, // Year 9 - income-based
      ],
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 750,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 500, // £6,000/year - below £7,400 threshold
      monthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'fsm-scotland-universal-over-threshold',
    name: 'FSM 13: Scotland P4 universal + S2 over threshold',
    description: 'Scotland with income above £10,200 threshold. P4 child (age 8) still gets universal FSM; S2 child (age 13) does not qualify. Panel shows eligible because universal provision applies.',
    category: 'fsm-test',
    data: {
      area: 'scotland',
      postcode: 'EH1 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 36,
      children: 2,
      childrenInfo: [
        { age: 8, hasDisability: 'no' },  // P4 - universal provision
        { age: 13, hasDisability: 'no' }, // S2 - income-based, over threshold
      ],
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 800,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 1100, // £13,200/year - above £10,200 threshold; P4 still universal
      monthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'fsm-wales-primary-universal-secondary-over-threshold',
    name: 'FSM 14: Wales Year 4 universal + Year 9 over threshold',
    description: 'Wales with income above £7,400 threshold. Year 4 child (age 9) gets universal primary FSM; Year 9 child (age 14) does not qualify. Panel shows eligible because universal provision applies.',
    category: 'fsm-test',
    data: {
      area: 'wales',
      postcode: 'CF10 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 38,
      children: 2,
      childrenInfo: [
        { age: 9, hasDisability: 'no' },  // Year 4 - universal primary
        { age: 14, hasDisability: 'no' }, // Year 9 - secondary, over threshold
      ],
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 750,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 800, // £9,600/year - above £7,400 secondary threshold; Year 4 still universal
      monthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'fsm-england-all-not-eligible',
    name: 'FSM 15: England all not eligible (no UC)',
    description: 'England couple with high combined earnings — UC tapers to £0 and income far exceeds threshold. Both school-age children are genuinely not eligible for FSM.',
    category: 'fsm-test',
    data: {
      area: 'england',
      postcode: 'M1 1AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 40,
      partnerAge: 38,
      children: 2,
      childrenInfo: [
        { age: 8, hasDisability: 'no' },
        { age: 12, hasDisability: 'no' },
      ],
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 1200,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 2500,         // combined £5,000/month = £60,000/year
      monthlyEarningsPeriod: 'per_month',
      partnerEmploymentType: 'employed',
      partnerMonthlyEarnings: 2500,  // UC tapers to £0 at this income level
      partnerMonthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'fsm-scotland-all-secondary-not-eligible',
    name: 'FSM 16: Scotland all secondary not eligible',
    description: 'Scotland with two secondary-age children and income above the £10,200 threshold. No universal provision applies. All children are genuinely not eligible.',
    category: 'fsm-test',
    data: {
      area: 'scotland',
      postcode: 'EH1 1AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 42,
      partnerAge: 40,
      children: 2,
      childrenInfo: [
        { age: 12, hasDisability: 'no' }, // S1 - no universal provision
        { age: 15, hasDisability: 'no' }, // S4 - no universal provision
      ],
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 900,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 1200, // £14,400/year - above £10,200 threshold
      monthlyEarningsPeriod: 'per_month',
      partnerEmploymentType: 'not_working',
    },
  },

  {
    id: 'fsm-england-uc-zero-advisory',
    name: 'FSM 17: England UC = £0 advisory',
    description: 'Single parent in Manchester earning £2,400/month. Earnings taper UC to £0, so no means-tested FSM. Should show the amber advisory with the earnings threshold at which UC would become positive.',
    category: 'fsm-test',
    data: {
      area: 'england',
      postcode: 'M1 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 34,
      children: 2,
      childrenInfo: [
        { age: 8, hasDisability: 'no' },
        { age: 11, hasDisability: 'no' },
      ],
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 900,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 2400,
      monthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'fsm-london-primary-universal',
    name: 'FSM 18: London primary universal (Mayor\'s scheme)',
    description: 'Single parent in London with two primary-age children. All London primary pupils receive free school meals under the Mayor\'s UFSM scheme regardless of income.',
    category: 'fsm-test',
    data: {
      area: 'england',
      postcode: 'SW1A 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 32,
      children: 2,
      childrenInfo: [
        { age: 6, hasDisability: 'no' },
        { age: 9, hasDisability: 'no' },
      ],
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 1400,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 1800,
      monthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'fsm-london-primary-and-secondary',
    name: 'FSM 19: London mixed primary + secondary',
    description: 'Single parent in London with one primary-age and one secondary-age child. Primary child gets universal FSM via Mayor\'s scheme. Secondary child is subject to means-tested rules.',
    category: 'fsm-test',
    data: {
      area: 'england',
      postcode: 'E1 6AW',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 38,
      children: 2,
      childrenInfo: [
        { age: 8, hasDisability: 'no' },   // primary — universal FSM
        { age: 14, hasDisability: 'no' },  // secondary — means-tested
      ],
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 1500,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 900,
      monthlyEarningsPeriod: 'per_month',
    },
  },

  {
    id: 'fsm-ni-no-uc',
    name: 'FSM 20: N. Ireland no UC',
    description: 'Single parent in Belfast earning £2,000/month. Earnings taper UC to £0 and income (£24,000/year) is well above the £14,000 NI threshold. Shows NI-specific not-eligible message with no universal FSM note.',
    category: 'fsm-test',
    data: {
      area: 'northern_ireland',
      postcode: 'BT1 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 36,
      children: 1,
      childrenInfo: [{ age: 10, hasDisability: 'no' }],
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 700,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 2000,
      monthlyEarningsPeriod: 'per_month',
    },
  },

  // --- FSM Mixed Universal + Means-Tested Scenarios ---
  {
    id: 'fsm-london-primary-universal-secondary-eligible',
    name: 'FSM 21: London primary universal + secondary eligible',
    description: 'Couple in East London. Age 7 child gets universal FSM via Mayor\'s scheme. Age 13 secondary child qualifies means-tested (earnings £500/month = £6,000/year, below £7,400 threshold).',
    category: 'fsm-test',
    data: {
      area: 'england',
      postcode: 'E3 2AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 37,
      partnerAge: 35,
      children: 2,
      childrenInfo: [
        { age: 7, hasDisability: 'no' },   // Year 3 — universal (Mayor of London)
        { age: 13, hasDisability: 'no' },  // Year 9 — means-tested, below £7,400
      ],
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 1100,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 500,
      monthlyEarningsPeriod: 'per_month',
      partnerEmploymentType: 'not_working',
    },
  },

  {
    id: 'fsm-scotland-p3-universal-s1-means-tested',
    name: 'FSM 22: Scotland P3 universal + S1 eligible',
    description: 'Single parent in Edinburgh. Age 8 child (P3) gets universal FSM. Age 12 child (S1) qualifies means-tested (earnings £700/month = £8,400/year, below £10,200 threshold).',
    category: 'fsm-test',
    data: {
      area: 'scotland',
      postcode: 'EH6 4AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 36,
      children: 2,
      childrenInfo: [
        { age: 8, hasDisability: 'no' },   // P3 — universal (P1-P5)
        { age: 12, hasDisability: 'no' },  // S1 — means-tested, below £10,200
      ],
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 800,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 700,
      monthlyEarningsPeriod: 'per_month',
    },
  },

  {
    id: 'fsm-wales-year3-universal-year9-means-tested',
    name: 'FSM 23: Wales Year 3 universal + Year 9 eligible',
    description: 'Couple in Cardiff. Age 8 child (Year 3) gets universal primary FSM. Age 14 child (Year 9) qualifies means-tested (earnings £500/month = £6,000/year, below £7,400 threshold).',
    category: 'fsm-test',
    data: {
      area: 'wales',
      postcode: 'CF24 2AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 39,
      partnerAge: 37,
      children: 2,
      childrenInfo: [
        { age: 8, hasDisability: 'no' },   // Year 3 — universal primary
        { age: 14, hasDisability: 'no' },  // Year 9 — means-tested, below £7,400
      ],
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 850,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 500,
      monthlyEarningsPeriod: 'per_month',
      partnerEmploymentType: 'not_working',
    },
  },

  {
    id: 'fsm-scotland-3-children-2-universal-1-means-tested',
    name: 'FSM 24: Scotland 3 children (2 universal, 1 means-tested)',
    description: 'Couple in Glasgow with three children. Ages 6 (P2) and 9 (P4) get universal FSM. Age 12 (S1) qualifies means-tested (earnings £800/month = £9,600/year, below £10,200 threshold).',
    category: 'fsm-test',
    data: {
      area: 'scotland',
      postcode: 'G1 1AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 41,
      partnerAge: 39,
      children: 3,
      childrenInfo: [
        { age: 6, hasDisability: 'no' },   // P2 — universal
        { age: 9, hasDisability: 'no' },   // P4 — universal
        { age: 12, hasDisability: 'no' },  // S1 — means-tested, below £10,200
      ],
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 950,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 800,
      monthlyEarningsPeriod: 'per_month',
      partnerEmploymentType: 'not_working',
    },
  },

  {
    id: 'fsm-london-3-children-2-primary-universal-1-secondary-means-tested',
    name: 'FSM 25: London 3 children (2 universal, 1 means-tested)',
    description: 'Single parent in South London. Ages 7 (Year 3) and 10 (Year 5) get universal FSM via Mayor\'s scheme. Age 15 (Year 10) qualifies means-tested (earnings £500/month = £6,000/year, below £7,400 threshold).',
    category: 'fsm-test',
    data: {
      area: 'england',
      postcode: 'SE15 3AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 40,
      children: 3,
      childrenInfo: [
        { age: 7, hasDisability: 'no' },   // Year 3 — universal (Mayor of London)
        { age: 10, hasDisability: 'no' },  // Year 5 — universal (Mayor of London)
        { age: 15, hasDisability: 'no' },  // Year 10 — means-tested, below £7,400
      ],
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 1300,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 500,
      monthlyEarningsPeriod: 'per_month',
    },
  },

  // --- Scottish Child Payment (SCP) Test Scenarios ---
  {
    id: 'scp-eligible-basic',
    name: 'SCP 1: Scotland eligible (2 children)',
    description: 'Single parent in Scotland with 2 children under 16, no earnings. Receives UC so qualifies for SCP at £27.15/week per child.',
    category: 'scp-test',
    data: {
      area: 'scotland',
      postcode: 'EH1 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 30,
      children: 2,
      childrenInfo: [
        { age: 5, hasDisability: 'no' },
        { age: 10, hasDisability: 'no' },
      ],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 650,
      rentPeriod: 'per_month',
      employmentType: 'not_working',
    },
  },
  {
    id: 'scp-eligible-low-earnings',
    name: 'SCP 2: Scotland with low earnings',
    description: 'Single parent in Scotland with 1 child, earning £800/month. UC still positive so qualifies for SCP.',
    category: 'scp-test',
    data: {
      area: 'scotland',
      postcode: 'G1 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 28,
      children: 1,
      childrenInfo: [{ age: 3, hasDisability: 'no' }],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 600,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 800,
      monthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'scp-mixed-ages',
    name: 'SCP 3: Scotland mixed ages',
    description: 'Couple in Scotland with 3 children (ages 5, 12, 16). Only 2 children under 16 are eligible for SCP.',
    category: 'scp-test',
    data: {
      area: 'scotland',
      postcode: 'AB1 1AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 38,
      partnerAge: 36,
      children: 3,
      childrenInfo: [
        { age: 5, hasDisability: 'no' },
        { age: 12, hasDisability: 'no' },
        { age: 16, hasDisability: 'no' },
      ],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 800,
      rentPeriod: 'per_month',
      employmentType: 'not_working',
      partnerEmploymentType: 'not_working',
    },
  },
  // ---------------------------------------------------------------------------
  // EMA test scenarios
  // ---------------------------------------------------------------------------
  {
    id: 'ema-wales-eligible-single',
    name: 'EMA 1: Wales eligible – 1 student',
    description: 'Single parent in Wales with a 17-year-old in full-time further education (A-levels) and low income of £1,500/month (£18,000/year). Should be eligible for £40/week EMA.',
    category: 'ema-test',
    data: {
      area: 'wales',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 40,
      children: 1,
      childrenInfo: [{ age: 17, isInFurtherEducation: true, hasDisability: false }],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 600,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 1500,
      monthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'ema-wales-income-too-high',
    name: 'EMA 2: Wales not eligible – income too high',
    description: 'Single parent in Wales with a 17-year-old in FTE but income of £2,200/month (£26,400/year) exceeds the single-student threshold of £23,400.',
    category: 'ema-test',
    data: {
      area: 'wales',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 42,
      children: 1,
      childrenInfo: [{ age: 17, isInFurtherEducation: true, hasDisability: false }],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 700,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 2200,
      monthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'ema-wales-two-students-higher-threshold',
    name: 'EMA 3: Wales eligible – 2 students',
    description: 'Couple in Wales with two young people (16 and 18) both in FTE and combined income of £2,000/month (£24,000/year). Ineligible under single threshold (£23,400) but eligible under dual threshold (£25,974). Both get £40/week = £80/week total.',
    category: 'ema-test',
    data: {
      area: 'wales',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 44,
      partnerAge: 42,
      children: 2,
      childrenInfo: [
        { age: 16, isInFurtherEducation: true, hasDisability: false },
        { age: 18, isInFurtherEducation: true, hasDisability: false },
      ],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 800,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 2000,
      monthlyEarningsPeriod: 'per_month',
      partnerEmploymentType: 'not_working',
    },
  },
  {
    id: 'ema-wales-not-in-fte',
    name: 'EMA 4: Wales not eligible – not in FTE',
    description: 'Single parent in Wales with a 17-year-old who is NOT in full-time further education (e.g. working, NEET, or on an apprenticeship). Income is within threshold but not eligible due to FTE requirement.',
    category: 'ema-test',
    data: {
      area: 'wales',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 38,
      children: 1,
      childrenInfo: [{ age: 17, isInFurtherEducation: false, hasDisability: false }],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 600,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 1200,
      monthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'ema-scotland-eligible',
    name: 'EMA 5: Scotland eligible – age 19',
    description: 'Single parent in Scotland with a 19-year-old in FTE at college. Scotland allows EMA up to age 19. Income of £1,800/month (£21,600/year) is below the £26,884 threshold. Eligible for £30/week.',
    category: 'ema-test',
    data: {
      area: 'scotland',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 41,
      children: 1,
      childrenInfo: [{ age: 19, isInFurtherEducation: true, hasDisability: false }],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 700,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 1800,
      monthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'ema-northern-ireland-eligible',
    name: 'EMA 6: N. Ireland eligible',
    description: 'Single parent in Northern Ireland with a 17-year-old in FTE. Income of £1,500/month (£18,000/year) is below the Northern Ireland threshold of £20,500. Eligible for £30/week EMA.',
    category: 'ema-test',
    data: {
      area: 'northern_ireland',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 39,
      children: 1,
      childrenInfo: [{ age: 17, isInFurtherEducation: true, hasDisability: false }],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 500,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 1500,
      monthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'ema-england-not-available',
    name: 'EMA 7: England not available',
    description: 'Single parent in England with a 17-year-old in FTE. EMA is not available in England (abolished 2011). EMA module should not appear.',
    category: 'ema-test',
    data: {
      area: 'england',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 38,
      children: 1,
      childrenInfo: [{ age: 17, isInFurtherEducation: true, hasDisability: false }],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'private',
      rent: 900,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 1500,
      monthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'ema-mixed-age-children',
    name: 'EMA 8: Scotland mixed ages',
    description: 'Couple in Scotland with a 10-year-old (too young for EMA) and a 17-year-old in FTE. Only the 17-year-old qualifies. Income is £1,600/month combined, below the £26,884 threshold.',
    category: 'ema-test',
    data: {
      area: 'scotland',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 40,
      partnerAge: 38,
      children: 2,
      childrenInfo: [
        { age: 10, isInFurtherEducation: false, hasDisability: false },
        { age: 17, isInFurtherEducation: true, hasDisability: false },
      ],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 750,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 1600,
      monthlyEarningsPeriod: 'per_month',
      partnerEmploymentType: 'not_working',
    },
  },
  {
    id: 'scp-not-eligible-earnings',
    name: 'SCP 4: Scotland not eligible (UC = 0)',
    description: 'Couple in Scotland with 1 child but high combined earnings (£4,000 + £3,000/month) reducing UC to zero. Shows earnings threshold message.',
    category: 'scp-test',
    data: {
      area: 'scotland',
      postcode: 'EH1 1AA',
      taxYear: '2025_26',
      circumstances: 'couple',
      age: 35,
      partnerAge: 33,
      children: 1,
      childrenInfo: [{ age: 8, hasDisability: 'no' }],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 700,
      rentPeriod: 'per_month',
      employmentType: 'employed',
      monthlyEarnings: 4000,
      monthlyEarningsPeriod: 'per_month',
      partnerEmploymentType: 'employed',
      partnerMonthlyEarnings: 3000,
      partnerMonthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'scp-ema-transition',
    name: 'SCP 5: Scotland – EMA note for 17-year-old',
    description: 'Single parent in Scotland with 2 children (ages 10 and 17). UC is positive so SCP applies for the 10-year-old. The 17-year-old is over 16 so no longer eligible for SCP — the EMA advisory note should appear. The 17-year-old is in further education (A-levels at college).',
    category: 'scp-test',
    data: {
      area: 'scotland',
      postcode: 'EH1 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 38,
      children: 2,
      childrenInfo: [
        { age: 10, hasDisability: 'no', isInFurtherEducation: false },
        { age: 17, hasDisability: 'no', isInFurtherEducation: true },
      ],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 600,
      rentPeriod: 'per_month',
      employmentType: 'part_time',
      monthlyEarnings: 800,
      monthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'ema-wales-age-transition',
    name: 'EMA 9: Wales – 17-year-old in A-levels',
    description: 'Single parent in Wales with a 17-year-old studying A-levels full-time. Monthly earnings of £1,400 (£16,800/year) are well below the single-student threshold of £23,400. Should be eligible for £40/week EMA.',
    category: 'ema-test',
    data: {
      area: 'wales',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 40,
      children: 1,
      childrenInfo: [{ age: 17, hasDisability: 'no', isInFurtherEducation: true }],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 550,
      rentPeriod: 'per_month',
      employmentType: 'part_time',
      monthlyEarnings: 1400,
      monthlyEarningsPeriod: 'per_month',
    },
  },
  {
    id: 'ema-ni-age-transition',
    name: 'EMA 10: Northern Ireland – 16-year-old starting college',
    description: 'Single parent in Northern Ireland with a 16-year-old who has just started full-time further education at college. Household income of £1,400/month (£16,800/year) is below the Northern Ireland threshold of £20,500. Should be eligible for £30/week EMA.',
    category: 'ema-test',
    data: {
      area: 'northern_ireland',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 36,
      children: 1,
      childrenInfo: [{ age: 16, hasDisability: 'no', isInFurtherEducation: true }],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 500,
      rentPeriod: 'per_month',
      employmentType: 'part_time',
      monthlyEarnings: 1400,
      monthlyEarningsPeriod: 'per_month',
    },
  },
]

const EXCEPTION_SHORT_LABELS: Record<string, string> = {
  responsible_for_child: 'Responsible for child',
  receiving_pip_dla_aa_with_work_limitation: 'PIP/DLA/AA',
  under21_non_advanced_no_parental_support: 'Under 21, no parental support',
  single_foster_parent: 'Foster parent',
  couple_both_studying_partner_cares_for_child: 'Couple both studying',
  reached_state_pension_age_younger_partner: 'State pension age',
}

interface ExampleScenariosProps {
  onLoadExample: (data: Record<string, any>) => void
  compact?: boolean
}

export function ExampleScenarios({ onLoadExample, compact = false }: ExampleScenariosProps) {
  const categories = [
    { id: 'ema-test', label: 'EMA Tests', color: 'yellow' },
    { id: 'scp-test', label: 'Scottish Child Payment', color: 'indigo' },
    { id: 'student', label: 'Students', color: 'teal' },
    { id: 'fsm-test', label: 'FSM Tests', color: 'orange' },
    { id: 'simple', label: 'Simple', color: 'green' },
    { id: 'real-world', label: 'Real World', color: 'blue' },
    { id: 'complex', label: 'Complex', color: 'purple' },
    { id: 'edge-case', label: 'Edge Cases', color: 'red' },
  ]

  if (compact) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Quick Examples:</label>
        <select
          onChange={(e) => {
            const example = examples.find((ex) => ex.id === e.target.value)
            if (example) {
              onLoadExample(example.data)
            }
          }}
          className="border border-gray-300 rounded px-3 py-2 w-full text-sm"
          defaultValue=""
        >
          <option value="">Select an example...</option>
          {categories.map((cat) => {
            const catExamples = examples.filter((ex) => ex.category === cat.id)
            if (catExamples.length === 0) return null
            return (
              <optgroup key={cat.id} label={cat.label}>
                {catExamples.map((example) => (
                  <option key={example.id} value={example.id}>
                    {example.name}
                  </option>
                ))}
              </optgroup>
            )
          })}
        </select>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-2">Example Scenarios</h2>
        <p className="text-gray-600 text-sm">
          Click any example below to quickly fill the calculator with test data.
          Expand a category to see its examples.
        </p>
      </div>

      {categories.map((cat) => {
        const categoryExamples = examples.filter((ex) => ex.category === cat.id)
        if (categoryExamples.length === 0) return null

        return (
          <Accordion
            key={cat.id}
            title={`${cat.label} (${categoryExamples.length})`}
            open={false}
            className="border border-gray-200 rounded-lg p-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              {categoryExamples.map((example) => (
                <div
                  key={example.id}
                  className="border border-gray-300 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 mb-1">{example.name}</h3>
                    <p className="text-sm text-gray-600">{example.description}</p>
                  </div>

                  <div className="mb-4 bg-gray-50 rounded p-3">
                    <dl className="text-xs space-y-1">
                      {example.data.area && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Area:</dt>
                          <dd className="font-medium text-gray-900">
                            {example.data.area === 'northern_ireland'
                              ? 'Northern Ireland'
                              : example.data.area.charAt(0).toUpperCase() + example.data.area.slice(1)}
                          </dd>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Household:</dt>
                        <dd className="font-medium text-gray-900">{example.data.householdType || example.data.circumstances}</dd>
                      </div>
                      {(() => {
                        const childCount = typeof example.data.children === 'number'
                          ? example.data.children
                          : Array.isArray(example.data.children)
                            ? example.data.children.length
                            : example.data.numberOfChildren || 0
                        return childCount > 0 ? (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Children:</dt>
                            <dd className="font-medium text-gray-900">{childCount}</dd>
                          </div>
                        ) : null
                      })()}
                      {(() => {
                        const childArray = example.data.childrenInfo || (Array.isArray(example.data.children) ? example.data.children : null)
                        return childArray && childArray.length > 0 ? (
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Child ages:</dt>
                            <dd className="font-medium text-gray-900">
                              {childArray.map((c: { age: number }) => c.age).join(', ')}
                            </dd>
                          </div>
                        ) : null
                      })()}
                      {(example.data.hasEarnings || example.data.monthlyEarnings) && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Monthly earnings:</dt>
                          <dd className="font-medium text-gray-900">
                            £{example.data.monthlyEarnings?.toLocaleString() || 0}
                          </dd>
                        </div>
                      )}
                      {example.data.isCarer && (
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Carer:</dt>
                          <dd className="font-medium text-gray-900">Yes</dd>
                        </div>
                      )}
                      {/* Student-specific details */}
                      {example.data.isFullTimeStudent && (
                        <>
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Student type:</dt>
                            <dd className="font-medium text-gray-900">
                              {example.data.studentType === 'postgraduate' ? 'Postgraduate' : 'Undergraduate'}
                            </dd>
                          </div>
                          {example.data.studentExceptions?.length > 0 && (
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Exception:</dt>
                              <dd className="font-medium text-gray-900">
                                {example.data.studentExceptions
                                  .map((e: string) => EXCEPTION_SHORT_LABELS[e] || e)
                                  .join(', ')}
                              </dd>
                            </div>
                          )}
                          {example.data.hasStudentLoan && (
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Annual loan:</dt>
                              <dd className="font-medium text-gray-900">
                                £{example.data.studentLoanAnnualAmount?.toLocaleString()}
                              </dd>
                            </div>
                          )}
                          {example.data.hasPostgraduateLoan && (
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Postgrad loan:</dt>
                              <dd className="font-medium text-gray-900">
                                £{example.data.postgraduateLoanAnnualAmount?.toLocaleString()} (30% counted)
                              </dd>
                            </div>
                          )}
                          {example.data.hasStudentGrant && (
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Annual grant:</dt>
                              <dd className="font-medium text-gray-900">
                                £{example.data.studentGrantAnnualAmount?.toLocaleString()}
                              </dd>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Course months:</dt>
                            <dd className="font-medium text-gray-900">{example.data.courseAssessmentPeriods}</dd>
                          </div>
                          {example.data.isInSummerHoliday && (
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Summer holiday:</dt>
                              <dd className="font-medium text-teal-700">Yes (no deduction)</dd>
                            </div>
                          )}
                        </>
                      )}

                      {/* Partner student details */}
                      {example.data.partnerIsFullTimeStudent && (
                        <>
                          <div className="flex justify-between border-t border-gray-200 pt-1 mt-1">
                            <dt className="text-gray-600">Partner student type:</dt>
                            <dd className="font-medium text-gray-900">
                              {example.data.partnerStudentType === 'postgraduate' ? 'Postgraduate' : 'Undergraduate'}
                            </dd>
                          </div>
                          {example.data.partnerStudentExceptions?.length > 0 && (
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Partner exception:</dt>
                              <dd className="font-medium text-gray-900">
                                {example.data.partnerStudentExceptions
                                  .map((e: string) => EXCEPTION_SHORT_LABELS[e] || e)
                                  .join(', ')}
                              </dd>
                            </div>
                          )}
                          {example.data.partnerHasStudentLoan && (
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Partner annual loan:</dt>
                              <dd className="font-medium text-gray-900">
                                £{example.data.partnerStudentLoanAnnualAmount?.toLocaleString()}
                              </dd>
                            </div>
                          )}
                          {example.data.partnerHasPostgraduateLoan && (
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Partner postgrad loan:</dt>
                              <dd className="font-medium text-gray-900">
                                £{example.data.partnerPostgraduateLoanAnnualAmount?.toLocaleString()} (30% counted)
                              </dd>
                            </div>
                          )}
                          {example.data.partnerHasStudentGrant && (
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Partner annual grant:</dt>
                              <dd className="font-medium text-gray-900">
                                £{example.data.partnerStudentGrantAnnualAmount?.toLocaleString()}
                              </dd>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <dt className="text-gray-600">Partner course months:</dt>
                            <dd className="font-medium text-gray-900">{example.data.partnerCourseAssessmentPeriods}</dd>
                          </div>
                          {example.data.partnerIsInSummerHoliday && (
                            <div className="flex justify-between">
                              <dt className="text-gray-600">Partner summer holiday:</dt>
                              <dd className="font-medium text-teal-700">Yes (no deduction)</dd>
                            </div>
                          )}
                        </>
                      )}
                    </dl>
                  </div>

                  <Button
                    onClick={() => onLoadExample(example.data)}
                    className="w-full px-3 py-1 text-sm"
                  >
                    Load This Example
                  </Button>
                </div>
              ))}
            </div>
          </Accordion>
        )
      })}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Using Examples</h3>
        <p className="text-sm text-blue-700">
          These examples are designed to help you test the calculator with realistic scenarios.
          After loading an example, you can modify any values to explore different situations.
        </p>
      </div>
    </div>
  )
}
