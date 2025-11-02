import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'

import { CalculatorIcon } from '~/components/ProductIcon'

import { PAGES } from '~/products/benefits-calculator/constants'
import { PagesMenu } from '~/products/shared/PagesMenu'
import { WorkflowProvider, useWorkflow } from '~/products/shared/use-workflow'
import { Fragment, useMemo } from 'react'
import { EntitledtoLogo } from '~/components/EntitledtoLogo'

export const Route = createFileRoute('/benefits-calculator/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <WorkflowProvider pages={PAGES} basePath="/benefits-calculator">
      <Product />
    </WorkflowProvider>
  )
}

function Product() {
  const location = useLocation()
  const match = Route.useMatch()

  const { visiblePages } = useWorkflow()

  const isHomepage = location.pathname === match.pathname
  const homepage = visiblePages[0]

  const HomepageComponent = useMemo(() => {
    return homepage?.component ?? Fragment
  }, [homepage])

  return (
    <div className="flex flex-col min-h-[100vh]">
      <header className="app-header">
        <div className="app-header-inner px-4 mq600:px-7">
          <Link to="/">
            <EntitledtoLogo className="w-auto block h-[42px]" />
          </Link>
        </div>
      </header>

      <aside className="app-aside">
        <div className="app-aside-cover" />

        <div className="py-5">
          <PagesMenu />
        </div>
      </aside>

      <main className="app-main">
        <header className="min-h-app-header-height flex items-center gap-2 px-4 mq600:px-7 sticky z-1 top-0 bg-main-bg">
          <CalculatorIcon />
          <h1 className="text-lg font-bold uppercase tracking-[2px] text-[0.9rem] text-primary-dark">
            Benefits Calculator
          </h1>
        </header>

        {isHomepage ? <HomepageComponent /> : <Outlet />}
      </main>
    </div>
  )
}
