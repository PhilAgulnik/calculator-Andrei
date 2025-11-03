import { useCallback, useMemo, useState } from 'react'
import { useMatch, useNavigate, useParams } from '@tanstack/react-router'

import { useContext } from 'react'
import { type Page, WorkflowContext } from './context'
import { useEntries } from './use-entries'

type WorkflowProviderProps = {
  children: React.ReactNode
  pages: Page[]
  basePath: '/benefits-calculator'
}

export function WorkflowProvider(props: WorkflowProviderProps) {
  const { children, pages: initialPages, basePath } = props

  const navigate = useNavigate()

  // Entries
  const { entries, addEntry, removeEntry, updateEntryData } = useEntries({ basePath })

  const [pages, setPages] = useState<Page[]>(initialPages)

  const params = useParams({ strict: false })

  const id = params?.id || ''
  const slug = params?.slug || ''
  const entry = entries[id] || null

  // Pages
  const visiblePages = useMemo(() => {
    const res: Page[] = []

    for (const page of pages) {
      if (page.isVisible) {
        res.push(page)
        continue
      }

      if (page.getIsVisible?.(entry?.data)) {
        res.push(page)
      }
    }

    return res
  }, [pages, entry])

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

  const goToNextPage = useCallback(() => {
    if (!nextPage) return

    navigate({ to: `${basePath}/$id`, params: { id, slug: nextPage.slug } })
    navigate({ to: `${basePath}/$id/$slug`, params: { id, slug: nextPage.slug } })
  }, [basePath, nextPage])

  const setPageVisibility = useCallback(
    (slug: string, isVisible: boolean) => {
      setPages(pages.map((page) => (page.slug === slug ? { ...page, isVisible } : page)))
    },
    [pages]
  )

  const context = useMemo(
    () => ({
      currentPage,
      nextPage,
      previousPage,
      progressPercentage,
      visiblePages,
      basePath,
      goToNextPage,
      entry,
      entries,
      addEntry,
      removeEntry,
      updateEntryData: (data: any) => updateEntryData(id, data),
      setPageVisibility,
    }),
    [currentPage, nextPage, previousPage, progressPercentage, visiblePages, goToNextPage]
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
