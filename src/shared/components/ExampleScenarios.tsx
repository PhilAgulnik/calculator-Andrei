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
  category: 'simple' | 'complex' | 'edge-case' | 'real-world' | 'fsm-test' | 'student' | 'scp-test'
  data: Record<string, any>
}

const examples: ExampleScenario[] = [
  {
    id: 'single-no-children',
    name: 'Single person, no children',
    description: 'Basic single person scenario with no dependents',
    category: 'simple',
    data: {
      householdType: 'single',
      age: 32,
      numberOfChildren: 0,
      hasHousingCosts: true,
      monthlyRent: 650,
      brma: 'Manchester',
      hasEarnings: false,
    },
  },
  {
    id: 'single-parent-2-kids',
    name: 'Single parent, 2 children',
    description: 'Single parent with 2 children in Manchester',
    category: 'real-world',
    data: {
      householdType: 'single',
      age: 35,
      numberOfChildren: 2,
      children: [
        { age: 5, disabled: false },
        { age: 8, disabled: false },
      ],
      hasHousingCosts: true,
      monthlyRent: 820,
      brma: 'Manchester',
      hasEarnings: false,
    },
  },
  {
    id: 'couple-3-kids',
    name: 'Couple with 3 children',
    description: 'Couple with 3 children, one with disability',
    category: 'complex',
    data: {
      householdType: 'couple',
      claimantAge: 38,
      partnerAge: 40,
      numberOfChildren: 3,
      children: [
        { age: 4, disabled: false },
        { age: 7, disabled: true },
        { age: 12, disabled: false },
      ],
      hasHousingCosts: true,
      monthlyRent: 1100,
      brma: 'London',
      hasEarnings: true,
      monthlyEarnings: 1200,
    },
  },
  {
    id: 'part-time-worker',
    name: 'Part-time worker',
    description: 'Single person working 16 hours/week',
    category: 'real-world',
    data: {
      householdType: 'single',
      age: 28,
      numberOfChildren: 0,
      hasHousingCosts: true,
      monthlyRent: 550,
      brma: 'Leeds',
      hasEarnings: true,
      monthlyEarnings: 800,
      hoursPerWeek: 16,
      hourlyWage: 11.5,
    },
  },
  {
    id: 'carer-scenario',
    name: 'Carer for disabled parent',
    description: 'Single person caring for disabled parent 40+ hours/week',
    category: 'complex',
    data: {
      householdType: 'single',
      age: 45,
      numberOfChildren: 0,
      hasHousingCosts: true,
      monthlyRent: 600,
      brma: 'Birmingham',
      isCarer: true,
      hoursOfCarePerWeek: 45,
      hasEarnings: false,
    },
  },
  {
    id: 'pension-age-couple',
    name: 'Mixed-age couple (one at SPA)',
    description: 'Couple where partner has reached State Pension Age',
    category: 'edge-case',
    data: {
      householdType: 'couple',
      claimantAge: 55,
      partnerAge: 67, // Over State Pension Age
      numberOfChildren: 0,
      hasHousingCosts: true,
      monthlyRent: 750,
      brma: 'Glasgow',
      hasEarnings: false,
    },
  },
  {
    id: 'high-earner',
    name: 'High earner with children',
    description: 'Family with income over £60k (Child Benefit charge applies)',
    category: 'edge-case',
    data: {
      householdType: 'couple',
      claimantAge: 42,
      partnerAge: 40,
      numberOfChildren: 2,
      children: [
        { age: 6, disabled: false },
        { age: 10, disabled: false },
      ],
      hasHousingCosts: true,
      monthlyRent: 1200,
      brma: 'South East London',
      hasEarnings: true,
      annualIncome: 65000,
    },
  },
  {
    id: 'lcwra-element',
    name: 'Person with LCWRA',
    description: 'Single person with Limited Capability for Work and Work-Related Activity',
    category: 'complex',
    data: {
      householdType: 'single',
      age: 51,
      numberOfChildren: 0,
      hasHousingCosts: true,
      monthlyRent: 580,
      brma: 'Cardiff',
      hasLCWRA: true,
      hasEarnings: false,
    },
  },
  {
    id: 'childcare-costs',
    name: 'Working parent with childcare',
    description: 'Single parent working full-time with high childcare costs',
    category: 'real-world',
    data: {
      householdType: 'single',
      age: 33,
      numberOfChildren: 2,
      children: [
        { age: 2, disabled: false },
        { age: 4, disabled: false },
      ],
      hasHousingCosts: true,
      monthlyRent: 900,
      brma: 'Bristol',
      hasEarnings: true,
      monthlyEarnings: 1800,
      hasChildcareCosts: true,
      monthlyChildcareCosts: 1200,
    },
  },
  {
    id: 'zero-income',
    name: 'No income or housing costs',
    description: 'Edge case: Single person with no income living rent-free',
    category: 'edge-case',
    data: {
      householdType: 'single',
      age: 25,
      numberOfChildren: 0,
      hasHousingCosts: false,
      hasEarnings: false,
    },
  },
  // ============================================
  // STUDENT SCENARIOS
  // ============================================
  {
    id: 'student-parent-loan',
    name: 'Student parent with maintenance loan',
    description: 'Single parent studying undergraduate degree, qualifies via responsible for child exception',
    category: 'student',
    data: {
      area: 'england',
      postcode: 'M1 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 29,
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
      studentLoanAnnualAmount: 9535,
      hasPostgraduateLoan: false,
      postgraduateLoanAnnualAmount: 0,
      hasStudentGrant: false,
      studentGrantAnnualAmount: 0,
      courseAssessmentPeriods: 9,
      isInSummerHoliday: false,
    },
  },
  {
    id: 'student-postgrad-pip',
    name: 'Postgraduate student with PIP',
    description: 'Postgraduate student receiving PIP, qualifies via disability exception. 30% rule applies to postgrad loan',
    category: 'student',
    data: {
      area: 'england',
      postcode: 'LS1 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 34,
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
    },
  },
  {
    id: 'student-loan-and-grant',
    name: 'Student with loan and grant',
    description: 'Single parent with both maintenance loan and grant. Combined income spread over 9 months less £110 disregard',
    category: 'student',
    data: {
      area: 'england',
      postcode: 'B1 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 26,
      children: 2,
      childrenInfo: [
        { age: 3, hasDisability: 'no' },
        { age: 6, hasDisability: 'no' },
      ],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 700,
      rentPeriod: 'per_month',
      employmentType: 'not_working',
      isFullTimeStudent: true,
      studentExceptions: ['responsible_for_child'],
      studentType: 'undergraduate',
      hasStudentLoan: true,
      studentLoanAnnualAmount: 9535,
      hasPostgraduateLoan: false,
      postgraduateLoanAnnualAmount: 0,
      hasStudentGrant: true,
      studentGrantAnnualAmount: 3000,
      courseAssessmentPeriods: 9,
      isInSummerHoliday: false,
    },
  },
  {
    id: 'student-summer-holiday',
    name: 'Student in summer holiday',
    description: 'Student currently in summer vacation after course ended. Student income is NOT counted during summer holidays',
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
    id: 'student-under-21',
    name: 'Under 21 student without parental support',
    description: 'Young student under 21 in non-advanced education with no parental support, small maintenance loan',
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
      studentLoanAnnualAmount: 4500,
      hasPostgraduateLoan: false,
      postgraduateLoanAnnualAmount: 0,
      hasStudentGrant: false,
      studentGrantAnnualAmount: 0,
      courseAssessmentPeriods: 9,
      isInSummerHoliday: false,
    },
  },
  {
    id: 'student-couple-both-studying',
    name: 'Couple both studying',
    description: 'Both partners are students with partner caring for child. Both have maintenance loans',
    category: 'student',
    data: {
      area: 'england',
      postcode: 'OX1 1AA',
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
    },
  },
  {
    id: 'student-foster-parent',
    name: 'Student foster parent',
    description: 'Single foster parent studying with a child placed with them. Qualifies via foster parent exception, loan only',
    category: 'student',
    data: {
      area: 'wales',
      postcode: 'CF10 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 38,
      children: 1,
      childrenInfo: [{ age: 7, hasDisability: 'no' }],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 550,
      rentPeriod: 'per_month',
      employmentType: 'not_working',
      isFullTimeStudent: true,
      studentExceptions: ['single_foster_parent'],
      studentType: 'undergraduate',
      hasStudentLoan: true,
      studentLoanAnnualAmount: 7610,
      hasPostgraduateLoan: false,
      postgraduateLoanAnnualAmount: 0,
      hasStudentGrant: false,
      studentGrantAnnualAmount: 0,
      courseAssessmentPeriods: 9,
      isInSummerHoliday: false,
    },
  },
  {
    id: 'student-grant-only',
    name: 'Student with grant only (no loan)',
    description: 'Student with a bursary/grant but no maintenance loan. Qualifies via responsible for child',
    category: 'student',
    data: {
      area: 'scotland',
      postcode: 'EH1 1AA',
      taxYear: '2025_26',
      circumstances: 'single',
      age: 31,
      children: 1,
      childrenInfo: [{ age: 5, hasDisability: 'no' }],
      hasChildren: true,
      housingStatus: 'renting',
      tenantType: 'social',
      rent: 620,
      rentPeriod: 'per_month',
      employmentType: 'not_working',
      isFullTimeStudent: true,
      studentExceptions: ['responsible_for_child'],
      studentType: 'undergraduate',
      hasStudentLoan: false,
      studentLoanAnnualAmount: 0,
      hasPostgraduateLoan: false,
      postgraduateLoanAnnualAmount: 0,
      hasStudentGrant: true,
      studentGrantAnnualAmount: 5400,
      courseAssessmentPeriods: 9,
      isInSummerHoliday: false,
    },
  },
  {
    id: 'student-pension-age',
    name: 'Student at pension age with younger partner',
    description: 'Older student who has reached state pension age with a younger partner. 12-month postgraduate course with grant',
    category: 'student',
    data: {
      area: 'england',
      postcode: 'CB2 1AA',
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
  // ============================================
  // FSM TEST SCENARIOS
  // ============================================
  {
    id: 'fsm-england-eligible',
    name: 'England: FSM Eligible (below £7,400)',
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
    id: 'fsm-england-future',
    name: 'England: FSM Sept 2026 (above £7,400)',
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
    name: 'Scotland: Universal FSM (P1-P5)',
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
    name: 'Scotland: P6+ FSM (below £850/month)',
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
    name: 'Scotland: P6+ Not Eligible (above £850/month)',
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
    name: 'Wales: Universal Primary FSM',
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
    name: 'Wales: Secondary FSM Eligible',
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
    name: 'Wales: Secondary Not Eligible',
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
    name: 'N. Ireland: FSM Eligible (below £14,000)',
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
    name: 'N. Ireland: Not Eligible (above £14,000)',
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
    name: 'Scotland: Mixed Ages (P3 + Secondary)',
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
    name: 'Wales: Mixed Ages (Primary + Secondary)',
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
    name: 'Scotland: P4 universal + S2 over threshold',
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
    name: 'Wales: Year 4 universal + Year 9 over threshold',
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
    name: 'England: All children not eligible (no UC)',
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
    name: 'Scotland: All secondary, all not eligible',
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

  // --- Scottish Child Payment (SCP) Test Scenarios ---
  {
    id: 'scp-eligible-basic',
    name: 'Scotland: SCP Eligible (2 children)',
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
    name: 'Scotland: SCP with Low Earnings',
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
    name: 'Scotland: SCP Mixed Ages (2 of 3 eligible)',
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
  {
    id: 'scp-not-eligible-earnings',
    name: 'Scotland: SCP Not Eligible (UC = 0)',
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
