import { createFileRoute, Link, useNavigate, useRouter } from '@tanstack/react-router'
import { Accordion } from '~/components/Accordion'
import { CalculatorIcon } from '~/components/ProductIcon'

import { BASE_PATH as BenefitsCalculatorBasePath } from '~/products/benefits-calculator/constants'
import { useEntries } from '~/products/shared/use-entries'
import { Glyph } from '~/components/Glyph'
import { EntitledtoLogo } from '~/components/EntitledtoLogo'
import { ExampleScenarios } from '~/shared/components/ExampleScenarios'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const navigate = useNavigate()
  const router = useRouter()
  const benefitsCalculator = useEntries({ basePath: BenefitsCalculatorBasePath })


  const handleLoadExample = (exampleData: Record<string, any>) => {
    // Create a temporary entry with the example data — marked so it is excluded from saved entries
    const newEntry = benefitsCalculator.addEntry(exampleData, { isExample: true })

    // Open results in a new tab so the home page stays open for comparison
    const location = router.buildLocation({ to: '/calculator/$id/$slug', params: { id: newEntry.id, slug: 'results' } })
    // Prepend BASE_URL so the link works on GitHub Pages (where base != '/')
    const base = import.meta.env.BASE_URL.replace(/\/$/, '')
    window.open(base + location.href, '_blank')
  }

  return (
    <>
      <header className="p-4">
        <div className="w-full max-w-layout-max-width mx-auto flex justify-between items-center">
          <Link to="/">
            <EntitledtoLogo className="w-auto block h-[42px]" />
          </Link>

          <Link
            to="/admin"
            className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1"
          >
            <Glyph name="settings" className="w-4 h-4 fill-current" />
            Admin
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
              navigate({ to: '/calculator/$id', params: { id: newEntry.id } })
            }}
            className="w-full min-h-app-header-height flex items-center gap-2 px-7 sticky z-1 top-0 bg-main-bg rounded-md cursor-pointer"
          >
            <CalculatorIcon />
            <h1 className="text-lg font-bold">Benefits Calculator</h1>
            <div className="ml-auto pl-4 text-2xl text-slate-400">
              <Glyph name="add" className="w-6 h-6 fill-primary" />
            </div>
          </button>

          {benefitsCalculator.entries && Object.values(benefitsCalculator.entries).filter((e: any) => !e.isExample).length > 0 && (
            <Accordion title="Saved entries" open={true} className="mt-4">
              {Object.values(benefitsCalculator.entries)
                .filter((e: any) => !e.isExample)
                .sort(
                  (a: any, b: any) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
                .map((entry: any) => (
                  <div key={entry.id} className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        navigate({ to: '/calculator/$id', params: { id: entry.id } })
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

          {/* Example Scenarios Section */}
          <Accordion title="Example Scenarios" open={true} className="mt-4">
            <div className="py-4">
              <ExampleScenarios onLoadExample={handleLoadExample} compact={false} />
            </div>
          </Accordion>
        </div>
      </div>
    </>
  )
}
