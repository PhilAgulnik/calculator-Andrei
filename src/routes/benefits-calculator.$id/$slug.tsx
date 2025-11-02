import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useWorkflow } from '~/products/shared/use-workflow'

export const Route = createFileRoute('/benefits-calculator/$id/$slug')({
  component: RouteComponent,
})

function RouteComponent() {
  const { slug } = Route.useParams()
  const { visiblePages } = useWorkflow()

  const PageComponent = useMemo(() => {
    return visiblePages.find((page) => page.slug === slug)?.component ?? null
  }, [visiblePages, slug])

  if (!PageComponent) return null

  return <PageComponent />
}
