import { createFileRoute, Link } from '@tanstack/react-router'
import { EntitledtoLogo } from '~/components/EntitledtoLogo'
import { Glyph } from '~/components/Glyph'

export const Route = createFileRoute('/self-employment-accounts')({
  component: SelfEmploymentAccounts,
})

const tools = [
  {
    title: 'Monthly Profit Tool',
    description: 'Report your income and expenses for each UC assessment period',
    route: '/monthly-profit' as const,
    available: false,
  },
  {
    title: 'Minimum Income Floor Calculator',
    description: 'Calculate how the MIF affects your Universal Credit payment',
    route: '/mif-calculator' as const,
    available: false,
  },
  {
    title: 'MIF Help Guide',
    description: 'Comprehensive guidance on MIF requirements and calculations',
    route: '/mif-help-guide' as const,
    available: false,
  },
  {
    title: 'Self-Assessment Tax Form',
    description: 'Complete your self-assessment with HMRC calculation support',
    route: '/self-assessment-tax-form' as const,
    available: false,
  },
  {
    title: 'Invoices & Receipts',
    description: 'Scan, store and categorise your business receipts and invoices',
    route: '/self-employment-accounts/invoices-receipts' as const,
    available: false,
  },
  {
    title: 'Income Maximisation',
    description: 'Strategies to optimise your self-employed income on Universal Credit',
    route: '/self-employment-accounts/income-maximisation' as const,
    available: false,
  },
]

function SelfEmploymentAccounts() {
  return (
    <>
      <header className="p-4 border-b border-slate-200">
        <div className="w-full max-w-layout-max-width mx-auto flex justify-between items-center">
          <Link to="/">
            <EntitledtoLogo className="w-auto block h-[42px]" />
          </Link>
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1"
          >
            <Glyph name="chevronRight" className="w-4 h-4 fill-current rotate-180" />
            Home
          </Link>
        </div>
      </header>

      <div className="py-12 px-4">
        <div className="w-full max-w-[600px] mx-auto">
          <h1 className="text-2xl font-bold mb-2">Self-Employment Tools</h1>
          <p className="text-slate-500 mb-8">
            Tools and resources for self-employed Universal Credit claimants.
          </p>

          <div className="flex flex-col gap-3">
            {tools.map((tool) => (
              <div
                key={tool.title}
                className="border border-slate-200 rounded-lg p-5 flex items-start gap-4"
              >
                <div className="flex-1">
                  <h2 className="text-base font-semibold mb-1">{tool.title}</h2>
                  <p className="text-sm text-slate-500">{tool.description}</p>
                </div>
                {!tool.available && (
                  <span className="text-xs bg-slate-100 text-slate-500 rounded-full px-3 py-1 whitespace-nowrap mt-0.5">
                    Coming soon
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
