import { useMemo, useState } from 'react'
import { useLocation, useMatch } from '@tanstack/react-router'

import { useContext } from 'react'
import { type Page, WorkflowContext } from './context'

type WorkflowProviderProps = {
  children: React.ReactNode
  pages: Page[]
  basePath: '/benefits-calculator'
}

export function WorkflowProvider(props: WorkflowProviderProps) {
  const { children, pages: initialPages, basePath } = props

  const [pages, setPages] = useState<Page[]>(initialPages)

  const match = useMatch({ from: `${basePath}/$slug`, shouldThrow: false })
  const slug = match?.params.slug || ''

  const visiblePages = useMemo(() => {
    return pages.filter((page) => page.isVisible)
  }, [pages])

  const visiblePagesLength = useMemo(() => {
    return visiblePages.length
  }, [visiblePages])

  const currentPage = useMemo(() => {
    return visiblePages.find((page) => page.slug === slug) ?? null
  }, [visiblePages, slug])

  const nextPage = useMemo(() => {
    const index = visiblePages.findIndex((page) => page.slug === slug)
    if (index < 0) return null

    return visiblePages[index + 1] ?? null
  }, [visiblePages, slug])

  const previousPage = useMemo(() => {
    const index = visiblePages.findIndex((page) => page.slug === slug)
    if (index < 0) return null

    return visiblePages[index - 1] ?? null
  }, [visiblePages, slug])

  const progressPercentage = useMemo(() => {
    const index = visiblePages.findIndex((page) => page.slug === slug)
    if (index < 0) return 0

    return Math.round(((index + 1) / visiblePagesLength) * 100)
  }, [visiblePagesLength, slug])

  const context = useMemo(
    () => ({
      currentPage,
      nextPage,
      previousPage,
      progressPercentage,
      visiblePages,
      basePath,
    }),
    [currentPage, nextPage, previousPage, progressPercentage, visiblePages]
  )

  return <WorkflowContext.Provider value={context}>{children}</WorkflowContext.Provider>
}

export const useWorkflow = () => {
  const context = useContext(WorkflowContext)

  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider')
  }

  return context
}
