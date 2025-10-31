import { createContext, useMemo, useState } from 'react'
import { Page, PAGES } from './pages'
import { useLocation } from '@tanstack/react-router'

export type WorkflowContext = {
  currentPage: Page | null
  nextPage: Page | null
  previousPage: Page | null
  progressPercentage: number
}

export const WorkflowContext = createContext<WorkflowContext>({
  currentPage: null,
  nextPage: null,
  previousPage: null,
  progressPercentage: 0,
})

export function WorkflowProvider(props: { children: React.ReactNode }) {
  const { children } = props

  const [pages, setPages] = useState<Page[]>(Array.from(PAGES))

  const location = useLocation()

  const visiblePages = useMemo(() => {
    return pages.filter((page) => page.isVisible)
  }, [pages])

  const visiblePagesLength = useMemo(() => {
    return visiblePages.length
  }, [visiblePages])

  const currentPage = useMemo(() => {
    return visiblePages.find((page) => page.path === location.pathname) ?? null
  }, [visiblePages, location.pathname])

  const nextPage = useMemo(() => {
    const index = visiblePages.findIndex((page) => page.path === location.pathname)
    if (index < 0) return null

    return visiblePages[index + 1] ?? null
  }, [location.pathname, visiblePages])

  const previousPage = useMemo(() => {
    const index = visiblePages.findIndex((page) => page.path === location.pathname)
    if (index < 0) return null

    return visiblePages[index - 1] ?? null
  }, [location.pathname, visiblePages])

  const progressPercentage = useMemo(() => {
    const index = visiblePages.findIndex((page) => page.path === location.pathname)
    if (index < 0) return 0

    return Math.round(((index + 1) / visiblePagesLength) * 100)
  }, [location.pathname, visiblePagesLength])

  const context = useMemo(
    () => ({
      currentPage,
      nextPage,
      previousPage,
      progressPercentage,
    }),
    [currentPage, nextPage, previousPage, progressPercentage]
  )

  return <WorkflowContext.Provider value={context}>{children}</WorkflowContext.Provider>
}
