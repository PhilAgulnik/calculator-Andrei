import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

import { LinkButton } from '~/components/LinkButton'
import { ProgressBar } from '~/components/ProgressBar'
import CalculatorIcon from '~/components/ProductIcon'

import { PagesMenu } from './-shared/PagesMenu'
import { useWorkflow } from './-shared/use-workflow'
import { WorkflowProvider } from './-shared/context'

export const Route = createFileRoute('/benefits-calculator')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <WorkflowProvider>
      <div className="flex flex-col min-h-[100vh]">
        <header className="app-header">
          <div className="app-header-inner px-4 mq600:px-7">
            <Link to="/">
              <img src="/logo.svg" alt="" className="w-auto block h-[42px]" />
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

          <div className="py-5 px-4 mq600:px-7">
            <Outlet />
          </div>

          <WorkflowFooter />
        </main>
      </div>
    </WorkflowProvider>
  )
}

function WorkflowFooter() {
  const context = useWorkflow()

  const { nextPage, previousPage, progressPercentage } = context

  return (
    <footer className="min-h-app-header-height flex flex-nowrap items-center justify-between gap-2 mq600:gap-5 px-4 py-3 mq600:px-7 sticky z-1 bottom-0 bg-main-bg border-t-1 border-divider">
      <LinkButton disabled={!previousPage} to={previousPage?.path ?? '.'}>
        ← Previous
      </LinkButton>

      <div className="flex-1 px-5 flex items-center">
        <div className="text-center text-slate-500 whitespace-nowrap mq500:mr-4 mq500:mb-0 flex-1">
          {progressPercentage}% complete
        </div>
        <ProgressBar percentage={progressPercentage} className="hidden mq500:block" />
      </div>

      <LinkButton disabled={!nextPage} to={nextPage?.path ?? '.'}>
        Next →
      </LinkButton>
    </footer>
  )
}
