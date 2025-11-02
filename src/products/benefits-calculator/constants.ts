import { AgeAndDisability } from './age-and-disability'
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
    glyph: 'chevronRight',
    isVisible: true,
    component: WhereYouLive,
  },
  {
    title: 'Your household',
    slug: 'your-household',
    glyph: 'chevronRight',
    isVisible: true,
    component: YourHousehold,
  },
  {
    title: 'Age and disability',
    slug: 'age-and-disability',
    glyph: 'chevronRight',
    isVisible: true,
    component: AgeAndDisability,
  },
  {
    title: 'Benefits you currently receive',
    slug: 'current-benefits',
    glyph: 'chevronRight',
    isVisible: true,
    component: CurrentBenefits,
  },
  {
    title: 'Net income',
    slug: 'net-income',
    glyph: 'chevronRight',
    isVisible: true,
    component: NetIncome,
  },
  {
    title: 'Housing costs',
    slug: 'housing-costs',
    glyph: 'chevronRight',
    isVisible: true,
    component: HousingCosts,
  },
  {
    title: 'Council Tax',
    slug: 'council-tax',
    glyph: 'chevronRight',
    isVisible: true,
    component: CouncilTax,
  },
  {
    title: 'Results',
    slug: 'results',
    glyph: 'chevronRight',
    isVisible: true,
    component: Results,
  },
]
