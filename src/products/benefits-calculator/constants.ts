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
