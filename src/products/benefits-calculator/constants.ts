import { AgeAndDisability } from './age-and-disability'
import { Children } from './children'
import { CouncilTax } from './council-tax'
import { CurrentBenefits } from './current-benefits'
import { HousingCosts } from './housing-costs'
import { NetIncome } from './net-income'
import { Results } from './results'
import { WhereYouLive } from './where-you-live'
import { YourHousehold } from './your-household'

import { type Page } from '../shared/context'

export const BASE_PATH = '/benefits-calculator'

export const PAGES: Page[] = [
  {
    title: 'Where you live',
    slug: '',
    isVisible: true,
    component: WhereYouLive,
  },
  {
    title: 'Your household',
    slug: 'your-household',
    isVisible: true,
    component: YourHousehold,
  },
  {
    title: 'Age and disability',
    slug: 'age-and-disability',
    isVisible: true,
    component: AgeAndDisability,
  },
  {
    title: 'About your children',
    slug: 'children',
    isVisible: false,
    getIsVisible: (entryData: any) => {
      if (!entryData?.children) return false
      return entryData.children > 0
    },
    component: Children,
  },
  {
    title: 'Benefits you currently receive',
    slug: 'current-benefits',
    isVisible: true,
    component: CurrentBenefits,
  },
  {
    title: 'Net income',
    slug: 'net-income',
    isVisible: true,
    component: NetIncome,
  },
  {
    title: 'Housing costs',
    slug: 'housing-costs',
    isVisible: true,
    component: HousingCosts,
  },
  {
    title: 'Council Tax',
    slug: 'council-tax',
    isVisible: true,
    component: CouncilTax,
  },
  {
    title: 'Results',
    slug: 'results',
    isVisible: true,
    component: Results,
  },
]

export const DEFAULT_VALUES = {
  // Tax Year and Circumstances
  taxYear: '2025_26',
  circumstances: 'single',
  age: 25,
  partnerAge: 25,

  // Housing
  housingStatus: 'no_housing_costs',
  tenantType: 'social',
  brma: '',
  rent: 0,
  rentPeriod: 'per_month',
  serviceCharges: 0,
  serviceChargesPeriod: 'per_month',
  bedrooms: 1,
  nonDependants: 0,

  // Employment and Disability - Main Person
  employmentType: 'not_working',
  monthlyEarnings: 0,
  monthlyEarningsPeriod: 'per_month',
  pensionAmount: 0,
  pensionAmountPeriod: 'per_month',
  pensionType: 'amount',
  pensionPercentage: 3,
  isDisabled: 'no',
  claimsDisabilityBenefits: 'no',
  disabilityBenefitType: '',
  pipDailyLivingRate: 'none',
  pipMobilityRate: 'none',
  dlaCareRate: 'none',
  dlaMobilityRate: 'none',
  aaRate: 'none',
  hasLCWRA: 'no',

  // Employment and Disability - Partner
  partnerEmploymentType: 'not_working',
  partnerMonthlyEarnings: 0,
  partnerMonthlyEarningsPeriod: 'per_month',
  partnerPensionAmount: 0,
  partnerPensionAmountPeriod: 'per_month',
  partnerPensionType: 'amount',
  partnerPensionPercentage: 3,
  partnerIsDisabled: 'no',
  partnerClaimsDisabilityBenefits: 'no',
  partnerDisabilityBenefitType: '',
  partnerPipDailyLivingRate: 'none',
  partnerPipMobilityRate: 'none',
  partnerDlaCareRate: 'none',
  partnerDlaMobilityRate: 'none',
  partnerAaRate: 'none',
  partnerHasLCWRA: 'no',

  // Children
  hasChildren: false,
  children: 0,
  childAges: [],
  childDisabilities: [],
  childGenders: [],
  childcareCosts: 0,
  childcareCostsPeriod: 'per_month',

  // Carer Status
  isCarer: 'no',
  isPartnerCarer: 'no',

  // Other Benefits
  hasOtherBenefits: 'no',
  otherBenefitsList: [],

  // Savings
  hasSavings: 'no',
  hasSavingsOver6000: 'no',
  savingsAmount: 0,
  savings: 0,
  savingsPeriod: 'per_month',

  // Area
  area: 'england',
}
