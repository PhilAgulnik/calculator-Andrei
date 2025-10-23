import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { PagesMenu } from './-shared/PagesMenu'
import { EntitledtoLogo } from '~/components/EntitledtoLogo'
import CalculatorIcon from '~/components/ProductIcon'
import { Button } from '~/components/Button'

export const Route = createFileRoute('/benefits-calculator')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col min-h-[100vh]">
      <header className="app-header">
        <div className="app-header-inner">
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
        <header className="min-h-app-header-height flex items-center gap-2 px-7 sticky z-1 top-0 bg-main-bg">
          <CalculatorIcon />
          <h1 className="text-lg font-bold uppercase tracking-[2px] text-[0.9rem] text-primary-dark">
            Benefits Calculator
          </h1>
        </header>

        <div className="py-5 px-7">
          <Outlet />
        </div>

        <footer className="min-h-app-header-height flex items-center justify-between gap-2 px-7 sticky z-1 bottom-0 bg-main-bg border-t-1 border-divider">
          <Button>← Previous</Button>
          <Button>Next →</Button>
        </footer>
      </main>
    </div>
  )
}
