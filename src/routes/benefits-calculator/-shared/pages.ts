export type Page = (typeof PAGES)[number]

export const PAGES = [
  {
    title: 'Where you live',
    path: '/benefits-calculator',
    glyph: 'chevronRight',
    isVisible: true,
  },
  {
    title: 'Your household',
    path: '/benefits-calculator/your-household',
    glyph: 'chevronRight',
    isVisible: true,
  },
  {
    title: 'Age and disability',
    path: '/benefits-calculator/age-and-disability',
    glyph: 'chevronRight',
    isVisible: true,
  },
  {
    title: 'Benefits you currently receive',
    path: '/benefits-calculator/current-benefits',
    glyph: 'chevronRight',
    isVisible: true,
  },
  {
    title: 'Net income',
    path: '/benefits-calculator/net-income',
    glyph: 'chevronRight',
    isVisible: true,
  },
  {
    title: 'Housing costs',
    path: '/benefits-calculator/housing-costs',
    glyph: 'chevronRight',
    isVisible: true,
  },
  {
    title: 'Council Tax',
    path: '/benefits-calculator/council-tax',
    glyph: 'chevronRight',
    isVisible: true,
  },
  {
    title: 'Results',
    path: '/benefits-calculator/results',
    glyph: 'chevronRight',
    isVisible: true,
  },
] as const
