/**
 * This file contains the field definitions extracted from CalculatorForm.js
 * Each field includes: label, name, type, options, defaultValue, description, validation, helperText
 */

export interface FieldOption {
  value: string | number | boolean
  label: string
  isDefault?: boolean
}

export interface FieldDefinition {
  name: string
  label: string
  type: 'radio' | 'number' | 'select' | 'checkbox' | 'amountWithPeriod'
  options?: FieldOption[]
  defaultValue: any
  description?: string
  validation?: {
    min?: number
    max?: number
    required?: boolean
    conditional?: string
  }
  helperText?: string
  conditionalDisplay?: string
}

export const calculatorFields: Record<string, FieldDefinition> = {
  // Tax Year and Personal Details
  taxYear: {
    name: 'taxYear',
    label: 'Tax Year',
    type: 'radio',
    options: [
      { value: '2025_26', label: '2025/26', isDefault: true },
      { value: '2024_25', label: '2024/25' },
      { value: '2023_24', label: '2023/24' },
    ],
    defaultValue: '2025_26',
    description: 'Select the tax year for the calculation',
  },

  circumstances: {
    name: 'circumstances',
    label: 'Personal Circumstances',
    type: 'radio',
    options: [
      { value: 'single', label: 'Single', isDefault: true },
      { value: 'couple', label: 'Couple' },
    ],
    defaultValue: 'single',
    description: 'Your relationship status',
  },

  age: {
    name: 'age',
    label: 'Age',
    type: 'number',
    defaultValue: 25,
    validation: {
      min: 16,
      max: 120,
    },
    helperText: 'Minimum age is 16. If empty or below 16, defaults to 25.',
  },

  partnerAge: {
    name: 'partnerAge',
    label: "Partner's Age",
    type: 'number',
    defaultValue: 25,
    validation: {
      min: 16,
      max: 120,
    },
    helperText: 'Minimum age is 16. If empty or below 16, defaults to 25.',
    conditionalDisplay: "circumstances === 'couple'",
  },

  // Housing
  housingStatus: {
    name: 'housingStatus',
    label: 'Housing Status',
    type: 'radio',
    options: [
      { value: 'no_housing_costs', label: 'No Housing Costs', isDefault: true },
      { value: 'renting', label: 'Renting' },
      { value: 'homeowner', label: 'Homeowner' },
      { value: 'other', label: 'Other' },
      { value: 'in_prison', label: 'In Prison' },
    ],
    defaultValue: 'no_housing_costs',
    description: 'Your current housing situation',
  },

  tenantType: {
    name: 'tenantType',
    label: 'Tenant Type',
    type: 'radio',
    options: [
      { value: 'social', label: 'Social Housing', isDefault: true },
      { value: 'private', label: 'Private Tenant' },
    ],
    defaultValue: 'social',
    description: 'Type of rental accommodation',
    conditionalDisplay: "housingStatus === 'renting'",
  },

  brma: {
    name: 'brma',
    label: 'Please select your Broad Rental Market Area',
    type: 'select',
    options: [], // Populated dynamically from getGroupedBRMAs()
    defaultValue: '',
    validation: {
      required: true,
      conditional: "housingStatus === 'renting' && tenantType === 'private'",
    },
    helperText:
      "We'll use your Broad Rental Market Area (BRMA) to set your Local Housing Allowance (LHA) cap. You can also find out about rent levels and LHA rates in other areas using our affordability map.",
    conditionalDisplay: "housingStatus === 'renting' && tenantType === 'private'",
  },

  rent: {
    name: 'rent',
    label: 'Monthly Rent',
    type: 'amountWithPeriod',
    defaultValue: 0,
    validation: {
      min: 0,
    },
    conditionalDisplay: "housingStatus === 'renting'",
  },

  rentPeriod: {
    name: 'rentPeriod',
    label: 'Rent Period',
    type: 'select',
    options: [
      { value: 'per_week', label: 'per week' },
      { value: 'per_month', label: 'per month', isDefault: true },
      { value: 'per_year', label: 'per year' },
    ],
    defaultValue: 'per_month',
    conditionalDisplay: "housingStatus === 'renting'",
  },

  serviceCharges: {
    name: 'serviceCharges',
    label: 'Service Charges',
    type: 'amountWithPeriod',
    defaultValue: 0,
    validation: {
      min: 0,
    },
    conditionalDisplay: "housingStatus === 'renting'",
  },

  serviceChargesPeriod: {
    name: 'serviceChargesPeriod',
    label: 'Service Charges Period',
    type: 'select',
    options: [
      { value: 'per_week', label: 'per week' },
      { value: 'per_month', label: 'per month', isDefault: true },
      { value: 'per_year', label: 'per year' },
    ],
    defaultValue: 'per_month',
    conditionalDisplay: "housingStatus === 'renting'",
  },

  bedrooms: {
    name: 'bedrooms',
    label: 'Number of Bedrooms',
    type: 'radio',
    options: [
      { value: 0, label: 'Studio' },
      { value: 1, label: '1 Bedroom', isDefault: true },
      { value: 2, label: '2 Bedrooms' },
      { value: 3, label: '3 Bedrooms' },
      { value: 4, label: '4 Bedrooms' },
      { value: 5, label: '5+ Bedrooms' },
    ],
    defaultValue: 1,
    conditionalDisplay: "housingStatus !== 'no_housing_costs'",
  },

  nonDependants: {
    name: 'nonDependants',
    label: 'Number of Non-Dependants',
    type: 'number',
    defaultValue: 0,
    validation: {
      min: 0,
    },
    helperText: 'If empty, defaults to 0.',
    conditionalDisplay: "housingStatus !== 'no_housing_costs'",
  },

  // Employment and Disability - Main Person
  employmentType: {
    name: 'employmentType',
    label: 'Employment Status',
    type: 'radio',
    options: [
      { value: 'not_working', label: 'Not Working', isDefault: true },
      { value: 'employed', label: 'Employed' },
      { value: 'self-employed', label: 'Self-employed' },
    ],
    defaultValue: 'not_working',
    description: 'Your current employment status',
  },

  monthlyEarnings: {
    name: 'monthlyEarnings',
    label: 'Monthly gross earnings',
    type: 'amountWithPeriod',
    defaultValue: 0,
    validation: {
      min: 0,
    },
    conditionalDisplay: "employmentType === 'employed' || employmentType === 'self-employed'",
  },

  monthlyEarningsPeriod: {
    name: 'monthlyEarningsPeriod',
    label: 'Earnings Period',
    type: 'select',
    options: [
      { value: 'per_week', label: 'per week' },
      { value: 'per_month', label: 'per month', isDefault: true },
      { value: 'per_year', label: 'per year' },
    ],
    defaultValue: 'per_month',
    conditionalDisplay: "employmentType === 'employed' || employmentType === 'self-employed'",
  },

  pensionAmount: {
    name: 'pensionAmount',
    label: 'Pension Contributions (per month)',
    type: 'amountWithPeriod',
    defaultValue: 0,
    validation: {
      min: 0,
    },
    conditionalDisplay: "employmentType === 'employed' && pensionType === 'amount'",
  },

  pensionAmountPeriod: {
    name: 'pensionAmountPeriod',
    label: 'Pension Period',
    type: 'select',
    options: [
      { value: 'per_week', label: 'per week' },
      { value: 'per_month', label: 'per month', isDefault: true },
      { value: 'per_year', label: 'per year' },
    ],
    defaultValue: 'per_month',
    conditionalDisplay: "employmentType === 'employed' && pensionType === 'amount'",
  },

  pensionType: {
    name: 'pensionType',
    label: 'Pension Contribution Type',
    type: 'radio',
    options: [
      { value: 'amount', label: 'Fixed Amount', isDefault: true },
      { value: 'percentage', label: 'Percentage of Gross Earnings' },
    ],
    defaultValue: 'amount',
    conditionalDisplay: "employmentType === 'employed'",
  },

  pensionPercentage: {
    name: 'pensionPercentage',
    label: 'Pension Percentage',
    type: 'number',
    defaultValue: 3,
    validation: {
      min: 0,
      max: 100,
    },
    helperText: 'Percentage of gross earnings. Defaults to 3% if empty.',
    conditionalDisplay: "employmentType === 'employed' && pensionType === 'percentage'",
  },

  isDisabled: {
    name: 'isDisabled',
    label: 'Are you sick or disabled?',
    type: 'radio',
    options: [
      { value: 'no', label: 'No', isDefault: true },
      { value: 'yes', label: 'Yes' },
    ],
    defaultValue: 'no',
  },

  claimsDisabilityBenefits: {
    name: 'claimsDisabilityBenefits',
    label: 'Do you claim disability benefits?',
    type: 'radio',
    options: [
      { value: 'no', label: 'No', isDefault: true },
      { value: 'yes', label: 'Yes' },
    ],
    defaultValue: 'no',
    conditionalDisplay: "isDisabled === 'yes'",
  },

  disabilityBenefitType: {
    name: 'disabilityBenefitType',
    label: 'What disability benefit do you claim?',
    type: 'radio',
    options: [
      { value: 'pip', label: 'Personal Independence Payment (PIP)' },
      { value: 'dla', label: 'Disability Living Allowance (DLA)' },
      { value: 'aa', label: 'Attendance Allowance (AA)' },
      { value: 'other', label: 'Other' },
    ],
    defaultValue: '',
    conditionalDisplay: "isDisabled === 'yes' && claimsDisabilityBenefits === 'yes'",
  },

  pipDailyLivingRate: {
    name: 'pipDailyLivingRate',
    label: 'PIP Daily Living Component Rate',
    type: 'radio',
    options: [
      { value: 'none', label: 'No award', isDefault: true },
      { value: 'standard', label: 'Standard Rate (£72.65)' },
      { value: 'enhanced', label: 'Enhanced Rate (£108.55)' },
    ],
    defaultValue: 'none',
    conditionalDisplay: "claimsDisabilityBenefits === 'yes' && disabilityBenefitType === 'pip'",
  },

  pipMobilityRate: {
    name: 'pipMobilityRate',
    label: 'PIP Mobility Component Rate',
    type: 'radio',
    options: [
      { value: 'none', label: 'No award', isDefault: true },
      { value: 'standard', label: 'Standard Rate (£28.70)' },
      { value: 'enhanced', label: 'Enhanced Rate (£75.75)' },
    ],
    defaultValue: 'none',
    conditionalDisplay: "claimsDisabilityBenefits === 'yes' && disabilityBenefitType === 'pip'",
  },

  dlaCareRate: {
    name: 'dlaCareRate',
    label: 'DLA Care Component Rate',
    type: 'radio',
    options: [
      { value: 'none', label: 'No award', isDefault: true },
      { value: 'lowest', label: 'Lowest Rate (£28.70)' },
      { value: 'middle', label: 'Middle Rate (£72.65)' },
      { value: 'highest', label: 'Highest Rate (£108.55)' },
    ],
    defaultValue: 'none',
    conditionalDisplay: "claimsDisabilityBenefits === 'yes' && disabilityBenefitType === 'dla'",
  },

  dlaMobilityRate: {
    name: 'dlaMobilityRate',
    label: 'DLA Mobility Component Rate',
    type: 'radio',
    options: [
      { value: 'none', label: 'No award', isDefault: true },
      { value: 'lowest', label: 'Lowest Rate (£28.70)' },
      { value: 'highest', label: 'Highest Rate (£75.75)' },
    ],
    defaultValue: 'none',
    conditionalDisplay: "claimsDisabilityBenefits === 'yes' && disabilityBenefitType === 'dla'",
  },

  aaRate: {
    name: 'aaRate',
    label: 'Attendance Allowance Rate',
    type: 'radio',
    options: [
      { value: 'none', label: 'No award', isDefault: true },
      { value: 'lower', label: 'Lower Rate (£72.65)' },
      { value: 'higher', label: 'Higher Rate (£108.55)' },
    ],
    defaultValue: 'none',
    conditionalDisplay: "claimsDisabilityBenefits === 'yes' && disabilityBenefitType === 'aa'",
  },

  hasLCWRA: {
    name: 'hasLCWRA',
    label: 'Do you qualify for Limited Capability for Work and Work-Related Activity (LCWRA)?',
    type: 'radio',
    options: [
      { value: 'no', label: 'No', isDefault: true },
      { value: 'yes', label: 'Yes' },
      { value: 'waiting', label: 'Waiting for assessment' },
    ],
    defaultValue: 'no',
    conditionalDisplay: "isDisabled === 'yes'",
  },

  // Partner Employment and Disability
  partnerEmploymentType: {
    name: 'partnerEmploymentType',
    label: "Partner's Employment Status",
    type: 'radio',
    options: [
      { value: 'not_working', label: 'Not Working', isDefault: true },
      { value: 'employed', label: 'Employed' },
      { value: 'self-employed', label: 'Self-employed' },
    ],
    defaultValue: 'not_working',
    conditionalDisplay: "circumstances === 'couple'",
  },

  partnerMonthlyEarnings: {
    name: 'partnerMonthlyEarnings',
    label: "Partner's Monthly Earnings",
    type: 'amountWithPeriod',
    defaultValue: 0,
    validation: {
      min: 0,
    },
    conditionalDisplay:
      "circumstances === 'couple' && (partnerEmploymentType === 'employed' || partnerEmploymentType === 'self-employed')",
  },

  partnerMonthlyEarningsPeriod: {
    name: 'partnerMonthlyEarningsPeriod',
    label: "Partner's Earnings Period",
    type: 'select',
    options: [
      { value: 'per_week', label: 'per week' },
      { value: 'per_month', label: 'per month', isDefault: true },
      { value: 'per_year', label: 'per year' },
    ],
    defaultValue: 'per_month',
    conditionalDisplay:
      "circumstances === 'couple' && (partnerEmploymentType === 'employed' || partnerEmploymentType === 'self-employed')",
  },

  partnerPensionAmount: {
    name: 'partnerPensionAmount',
    label: "Partner's Pension Contributions (per month)",
    type: 'amountWithPeriod',
    defaultValue: 0,
    validation: {
      min: 0,
    },
    conditionalDisplay:
      "circumstances === 'couple' && partnerEmploymentType === 'employed' && partnerPensionType === 'amount'",
  },

  partnerPensionAmountPeriod: {
    name: 'partnerPensionAmountPeriod',
    label: "Partner's Pension Period",
    type: 'select',
    options: [
      { value: 'per_week', label: 'per week' },
      { value: 'per_month', label: 'per month', isDefault: true },
      { value: 'per_year', label: 'per year' },
    ],
    defaultValue: 'per_month',
    conditionalDisplay:
      "circumstances === 'couple' && partnerEmploymentType === 'employed' && partnerPensionType === 'amount'",
  },

  partnerPensionType: {
    name: 'partnerPensionType',
    label: "Partner's Pension Contribution Type",
    type: 'radio',
    options: [
      { value: 'amount', label: 'Fixed Amount', isDefault: true },
      { value: 'percentage', label: 'Percentage of Gross Earnings' },
    ],
    defaultValue: 'amount',
    conditionalDisplay: "circumstances === 'couple' && partnerEmploymentType === 'employed'",
  },

  partnerPensionPercentage: {
    name: 'partnerPensionPercentage',
    label: "Partner's Pension Percentage",
    type: 'number',
    defaultValue: 3,
    validation: {
      min: 0,
      max: 100,
    },
    helperText: 'Percentage of gross earnings. Defaults to 3% if empty.',
    conditionalDisplay:
      "circumstances === 'couple' && partnerEmploymentType === 'employed' && partnerPensionType === 'percentage'",
  },

  partnerIsDisabled: {
    name: 'partnerIsDisabled',
    label: 'Is your partner sick or disabled?',
    type: 'radio',
    options: [
      { value: 'no', label: 'No', isDefault: true },
      { value: 'yes', label: 'Yes' },
    ],
    defaultValue: 'no',
    conditionalDisplay: "circumstances === 'couple'",
  },

  partnerClaimsDisabilityBenefits: {
    name: 'partnerClaimsDisabilityBenefits',
    label: 'Does your partner claim disability benefits?',
    type: 'radio',
    options: [
      { value: 'no', label: 'No', isDefault: true },
      { value: 'yes', label: 'Yes' },
    ],
    defaultValue: 'no',
    conditionalDisplay: "circumstances === 'couple' && partnerIsDisabled === 'yes'",
  },

  partnerDisabilityBenefitType: {
    name: 'partnerDisabilityBenefitType',
    label: 'What disability benefit does your partner claim?',
    type: 'radio',
    options: [
      { value: 'pip', label: 'Personal Independence Payment (PIP)' },
      { value: 'dla', label: 'Disability Living Allowance (DLA)' },
      { value: 'aa', label: 'Attendance Allowance (AA)' },
      { value: 'other', label: 'Other' },
    ],
    defaultValue: '',
    conditionalDisplay:
      "circumstances === 'couple' && partnerIsDisabled === 'yes' && partnerClaimsDisabilityBenefits === 'yes'",
  },

  partnerPipDailyLivingRate: {
    name: 'partnerPipDailyLivingRate',
    label: "Partner's PIP Daily Living Component Rate",
    type: 'radio',
    options: [
      { value: 'none', label: 'No award', isDefault: true },
      { value: 'standard', label: 'Standard Rate (£72.65)' },
      { value: 'enhanced', label: 'Enhanced Rate (£108.55)' },
    ],
    defaultValue: 'none',
    conditionalDisplay:
      "circumstances === 'couple' && partnerClaimsDisabilityBenefits === 'yes' && partnerDisabilityBenefitType === 'pip'",
  },

  partnerPipMobilityRate: {
    name: 'partnerPipMobilityRate',
    label: "Partner's PIP Mobility Component Rate",
    type: 'radio',
    options: [
      { value: 'none', label: 'No award', isDefault: true },
      { value: 'standard', label: 'Standard Rate (£28.70)' },
      { value: 'enhanced', label: 'Enhanced Rate (£75.75)' },
    ],
    defaultValue: 'none',
    conditionalDisplay:
      "circumstances === 'couple' && partnerClaimsDisabilityBenefits === 'yes' && partnerDisabilityBenefitType === 'pip'",
  },

  partnerDlaCareRate: {
    name: 'partnerDlaCareRate',
    label: "Partner's DLA Care Component Rate",
    type: 'radio',
    options: [
      { value: 'none', label: 'No award', isDefault: true },
      { value: 'lowest', label: 'Lowest Rate (£28.70)' },
      { value: 'middle', label: 'Middle Rate (£72.65)' },
      { value: 'highest', label: 'Highest Rate (£108.55)' },
    ],
    defaultValue: 'none',
    conditionalDisplay:
      "circumstances === 'couple' && partnerClaimsDisabilityBenefits === 'yes' && partnerDisabilityBenefitType === 'dla'",
  },

  partnerDlaMobilityRate: {
    name: 'partnerDlaMobilityRate',
    label: "Partner's DLA Mobility Component Rate",
    type: 'radio',
    options: [
      { value: 'none', label: 'No award', isDefault: true },
      { value: 'lowest', label: 'Lowest Rate (£28.70)' },
      { value: 'highest', label: 'Highest Rate (£75.75)' },
    ],
    defaultValue: 'none',
    conditionalDisplay:
      "circumstances === 'couple' && partnerClaimsDisabilityBenefits === 'yes' && partnerDisabilityBenefitType === 'dla'",
  },

  partnerAaRate: {
    name: 'partnerAaRate',
    label: "Partner's Attendance Allowance Rate",
    type: 'radio',
    options: [
      { value: 'none', label: 'No award', isDefault: true },
      { value: 'lower', label: 'Lower Rate (£72.65)' },
      { value: 'higher', label: 'Higher Rate (£108.55)' },
    ],
    defaultValue: 'none',
    conditionalDisplay:
      "circumstances === 'couple' && partnerClaimsDisabilityBenefits === 'yes' && partnerDisabilityBenefitType === 'aa'",
  },

  partnerHasLCWRA: {
    name: 'partnerHasLCWRA',
    label:
      'Does your partner qualify for Limited Capability for Work and Work-Related Activity (LCWRA)?',
    type: 'radio',
    options: [
      { value: 'no', label: 'No', isDefault: true },
      { value: 'yes', label: 'Yes' },
      { value: 'waiting', label: 'Waiting for assessment' },
    ],
    defaultValue: 'no',
    conditionalDisplay: "circumstances === 'couple' && partnerIsDisabled === 'yes'",
  },

  // Children
  hasChildren: {
    name: 'hasChildren',
    label: 'Do you have children?',
    type: 'radio',
    options: [
      { value: false, label: 'No Children', isDefault: true },
      { value: true, label: 'Yes, I have children' },
    ],
    defaultValue: false,
  },

  children: {
    name: 'children',
    label: 'Number of Children',
    type: 'number',
    defaultValue: 0,
    validation: {
      min: 1,
      max: 10,
    },
    helperText: 'If empty or below 1, defaults to 1.',
    conditionalDisplay: 'hasChildren === true',
  },

  childcareCosts: {
    name: 'childcareCosts',
    label: 'Monthly Childcare Costs',
    type: 'amountWithPeriod',
    defaultValue: 0,
    validation: {
      min: 0,
    },
    helperText:
      'Enter the total monthly cost of childcare for all your children. Universal Credit can help with up to 85% of childcare costs.',
    conditionalDisplay: 'hasChildren === true',
  },

  childcareCostsPeriod: {
    name: 'childcareCostsPeriod',
    label: 'Childcare Costs Period',
    type: 'select',
    options: [
      { value: 'per_week', label: 'per week' },
      { value: 'per_month', label: 'per month', isDefault: true },
      { value: 'per_year', label: 'per year' },
    ],
    defaultValue: 'per_month',
    conditionalDisplay: 'hasChildren === true',
  },

  // Note: childAges, childDisabilities, and childGenders are arrays managed dynamically

  // Carer
  isCarer: {
    name: 'isCarer',
    label: 'Do you care for someone who is sick or disabled?',
    type: 'radio',
    options: [
      { value: 'no', label: 'No', isDefault: true },
      { value: 'yes', label: 'Yes' },
    ],
    defaultValue: 'no',
    description: 'This question will be replaced by BYR page redevelopment and new Carers Journey',
  },

  isPartnerCarer: {
    name: 'isPartnerCarer',
    label: 'Does your partner care for someone who is sick or disabled?',
    type: 'radio',
    options: [
      { value: 'no', label: 'No', isDefault: true },
      { value: 'yes', label: 'Yes' },
    ],
    defaultValue: 'no',
    conditionalDisplay: "circumstances === 'couple'",
  },

  // Other Benefits
  hasOtherBenefits: {
    name: 'hasOtherBenefits',
    label: 'Do you receive any other benefits?',
    type: 'radio',
    options: [
      { value: 'no', label: 'No', isDefault: true },
      { value: 'yes', label: 'Yes' },
    ],
    defaultValue: 'no',
    description: 'This question will be replaced by BYR page redevelopment and new Carers Journey',
  },

  // Note: otherBenefitsList is a checkbox group that includes 'child_benefit' and others
  // ------------------ DONE ^

  // Savings (from CalculatorPage.js initial state)
  hasSavings: {
    name: 'hasSavings',
    label: 'Do you have savings?',
    type: 'radio',
    options: [
      { value: 'no', label: 'No', isDefault: true },
      { value: 'yes', label: 'Yes' },
    ],
    defaultValue: 'no',
  },

  hasSavingsOver6000: {
    name: 'hasSavingsOver6000',
    label: 'Do you have savings over £6,000?',
    type: 'radio',
    options: [
      { value: 'no', label: 'No', isDefault: true },
      { value: 'yes', label: 'Yes' },
    ],
    defaultValue: 'no',
    conditionalDisplay: "hasSavings === 'yes'",
  },

  savingsAmount: {
    name: 'savingsAmount',
    label: 'Savings Amount',
    type: 'number',
    defaultValue: 0,
    validation: {
      min: 0,
    },
    conditionalDisplay: "hasSavings === 'yes'",
  },

  savings: {
    name: 'savings',
    label: 'Savings',
    type: 'number',
    defaultValue: 0,
    validation: {
      min: 0,
    },
    conditionalDisplay: "hasSavings === 'yes'",
  },

  savingsPeriod: {
    name: 'savingsPeriod',
    label: 'Savings Period',
    type: 'select',
    options: [
      { value: 'per_week', label: 'per week' },
      { value: 'per_month', label: 'per month', isDefault: true },
      { value: 'per_year', label: 'per year' },
    ],
    defaultValue: 'per_month',
    conditionalDisplay: "hasSavings === 'yes'",
  },

  // Area
  area: {
    name: 'area',
    label: 'Area',
    type: 'radio',
    options: [
      { value: 'england', label: 'England', isDefault: true },
      { value: 'scotland', label: 'Scotland' },
      { value: 'wales', label: 'Wales' },
    ],
    defaultValue: 'england',
  },
}

/**
 * Child-specific field definitions (dynamically created per child)
 */
export const childFieldDefinitions = {
  childAge: {
    name: 'childAge',
    label: 'Age:',
    type: 'number',
    defaultValue: '',
    validation: {
      min: 0,
      max: 19,
    },
    helperText: 'If empty or below 0, defaults to 0.',
  },

  childGender: {
    name: 'childGender',
    label: 'Child Gender',
    type: 'radio',
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
    ],
    defaultValue: '',
    description:
      'We need to know the gender of your children to calculate the correct bedroom entitlement for Local Housing Allowance. Children of the same gender or under 10 years old can share a bedroom.',
    conditionalDisplay: "housingStatus === 'renting' && children >= 2",
  },

  childHasDisability: {
    name: 'childHasDisability',
    label: 'Does Child have an illness or disability?',
    type: 'radio',
    options: [
      { value: false, label: 'No' },
      { value: true, label: 'Yes' },
    ],
    defaultValue: false,
  },

  childClaimsDLA: {
    name: 'childClaimsDLA',
    label: 'Does Child claim Disability Living Allowance (DLA)?',
    type: 'radio',
    options: [
      { value: false, label: 'No' },
      { value: true, label: 'Yes' },
    ],
    defaultValue: false,
    conditionalDisplay: 'childHasDisability === true',
  },

  childDLACareRate: {
    name: 'childDLACareRate',
    label: 'DLA Care Component Rate',
    type: 'radio',
    options: [
      { value: 'lowest', label: 'Lowest Rate (£26.90)' },
      { value: 'middle', label: 'Middle Rate (£68.10)' },
      { value: 'highest', label: 'Highest Rate (£101.75)' },
    ],
    defaultValue: '',
    conditionalDisplay: 'childClaimsDLA === true',
  },

  childDLAMobilityRate: {
    name: 'childDLAMobilityRate',
    label: 'DLA Mobility Component Rate',
    type: 'radio',
    options: [
      { value: 'lowest', label: 'Lowest Rate (£26.90)' },
      { value: 'highest', label: 'Highest Rate (£71.00)' },
    ],
    defaultValue: '',
    conditionalDisplay: 'childClaimsDLA === true',
  },
}
