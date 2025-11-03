import { createContext } from 'react'
import { z } from 'zod'

export type Page = {
  title: string
  slug: string
  isVisible: boolean
  component: React.ComponentType<any>
  schema?: z.ZodSchema
  getIsVisible?: (entryData: any) => boolean
}

export type WorkflowContext = {
  currentPage: Page | null
  nextPage: Page | null
  previousPage: Page | null
  progressPercentage: number
  visiblePages: Page[]
  basePath: '/benefits-calculator' | null
  goToNextPage: () => void
  entry: Record<string, unknown> | null
  entries: Record<string, unknown>[]
  addEntry: () => void
  removeEntry: (id: string) => void
  updateEntryData: (data: any) => void
  setPageVisibility: (slug: string, isVisible: boolean) => void
}

export const WorkflowContext = createContext<WorkflowContext>({
  currentPage: null,
  nextPage: null,
  previousPage: null,
  progressPercentage: 0,
  visiblePages: [],
  basePath: null,
  goToNextPage: () => {},
  entry: null,
  entries: [],
  addEntry: () => {},
  removeEntry: () => {},
  updateEntryData: () => {},
  setPageVisibility: () => {},
})
