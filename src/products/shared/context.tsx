import { createContext } from 'react'

export type Page = {
  title: string
  slug: string
  glyph: string
  isVisible: boolean
  component: React.ComponentType<any>
}

export type WorkflowContext = {
  currentPage: Page | null
  nextPage: Page | null
  previousPage: Page | null
  progressPercentage: number
  visiblePages: Page[]
  basePath: '/benefits-calculator' | null
}

export const WorkflowContext = createContext<WorkflowContext>({
  currentPage: null,
  nextPage: null,
  previousPage: null,
  progressPercentage: 0,
  visiblePages: [],
  basePath: null,
})
