import { createContext } from 'react'
import { z } from 'zod'

export type Page = {
  title: string
  slug: string
  glyph: string
  isVisible: boolean
  component: React.ComponentType<any>
  schema?: z.ZodSchema
}

export type WorkflowContext = {
  currentPage: Page | null
  nextPage: Page | null
  previousPage: Page | null
  progressPercentage: number
  visiblePages: Page[]
  basePath: '/benefits-calculator' | null
  goToNextPage: () => void
}

export const WorkflowContext = createContext<WorkflowContext>({
  currentPage: null,
  nextPage: null,
  previousPage: null,
  progressPercentage: 0,
  visiblePages: [],
  basePath: null,
  goToNextPage: () => {},
})
