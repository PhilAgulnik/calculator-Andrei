import { createFileRoute, Link } from '@tanstack/react-router'
import { CalculatorIcon } from '~/components/ProductIcon'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <>
      <header className="p-4">
        <div className="w-full max-w-layout-max-width mx-auto flex justify-center items-center">
          <Link to="/">
            <img src="/logo.svg" alt="" className="w-auto block h-[42px]" />
          </Link>
        </div>
      </header>

      <div className="py-12 px-4">
        <div className="w-full max-w-[500px] mx-auto">
          <div className="text-lg font-bold uppercase tracking-[2px] text-[0.9rem] text-slate-500 mb-2">
            Product Demos
          </div>

          <Link
            to="/benefits-calculator"
            className="min-h-app-header-height flex items-center gap-2 px-7 sticky z-1 top-0 bg-main-bg rounded-md"
          >
            <CalculatorIcon />
            <h1 className="text-lg font-bold">Benefits Calculator</h1>
            <div className="ml-auto pl-4 text-2xl text-slate-400">→</div>
          </Link>
        </div>
      </div>
    </>
  )
}
