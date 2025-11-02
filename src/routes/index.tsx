import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Accordion } from '~/components/Accordion'
import { CalculatorIcon } from '~/components/ProductIcon'

import { BASE_PATH as BenefitsCalculatorBasePath } from '~/products/benefits-calculator/constants'
import { useEntries } from '~/products/shared/use-entries'
import { Glyph } from '~/components/Glyph'
import { EntitledtoLogo } from '~/components/EntitledtoLogo'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const navigate = useNavigate()
  const benefitsCalculator = useEntries({ basePath: BenefitsCalculatorBasePath })

  return (
    <>
      <header className="p-4">
        <div className="w-full max-w-layout-max-width mx-auto flex justify-center items-center">
          <Link to="/">
            <EntitledtoLogo className="w-auto block h-[42px]" />
          </Link>
        </div>
      </header>

      <div className="py-12 px-4">
        <div className="w-full max-w-[500px] mx-auto">
          <div className="text-lg font-bold uppercase tracking-[2px] text-[0.9rem] text-slate-500 mb-2">
            Product Demos
          </div>

          <button
            onClick={() => {
              const newEntry = benefitsCalculator.addEntry()
              navigate({ to: '/benefits-calculator/$id', params: { id: newEntry.id } })
            }}
            className="w-full min-h-app-header-height flex items-center gap-2 px-7 sticky z-1 top-0 bg-main-bg rounded-md cursor-pointer"
          >
            <CalculatorIcon />
            <h1 className="text-lg font-bold">Benefits Calculator</h1>
            <div className="ml-auto pl-4 text-2xl text-slate-400">
              <Glyph name="add" className="w-6 h-6 fill-primary" />
            </div>
          </button>

          {benefitsCalculator.entries && Object.values(benefitsCalculator.entries).length > 0 && (
            <Accordion title="Saved entries" open={true} className="mt-4">
              {Object.values(benefitsCalculator.entries)
                .sort(
                  (a: any, b: any) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
                .map((entry: any) => (
                  <div key={entry.id} className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        navigate({ to: '/benefits-calculator/$id', params: { id: entry.id } })
                      }
                      className="text-primary py-1.5 px-2 hover:bg-slate-100 rounded-md flex-1 text-left cursor-pointer"
                    >
                      {new Date(entry.createdAt).toLocaleString()}
                    </button>

                    <button
                      onClick={() => benefitsCalculator.removeEntry(entry.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 cursor-pointer"
                    >
                      <Glyph name="close" className="w-3 h-3 fill-red-500" />
                    </button>
                  </div>
                ))}
            </Accordion>
          )}
        </div>
      </div>
    </>
  )
}
