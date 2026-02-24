/**
 * School Meal Costs Help Modal
 * Analysis of England school meal costs 2025-26
 * Data source: England_School_Meal_Costs_2025-26.xlsx (compiled February 2026)
 */

interface SchoolMealCostsModalProps {
  onClose: () => void
}

const KNOWN_PRICES = [
  { la: 'Cornwall', region: 'South West', price: 2.50 },
  { la: 'Devon', region: 'South West', price: 2.60 },
  { la: 'South Tyneside', region: 'North East', price: 2.60 },
  { la: 'Essex', region: 'East', price: 2.70 },
  { la: 'Surrey', region: 'South East', price: 2.70 },
  { la: 'West Sussex', region: 'South East', price: 2.71 },
  { la: 'Norfolk', region: 'East', price: 2.75 },
  { la: 'Warrington', region: 'North West', price: 2.80 },
  { la: 'Durham', region: 'North East', price: 2.95 },
  { la: 'Hampshire', region: 'South East', price: 3.00 },
  { la: 'Nottinghamshire', region: 'East Midlands', price: 3.16 },
  { la: 'Derbyshire', region: 'East Midlands', price: 3.25 },
]

const avgPrice = KNOWN_PRICES.reduce((sum, r) => sum + r.price, 0) / KNOWN_PRICES.length
const SCHOOL_DAYS = 190

export function SchoolMealCostsModal({ onClose }: SchoolMealCostsModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">School Meal Costs in England 2025–26</h2>
            <p className="text-sm text-gray-500 mt-1">Analysis compiled February 2026</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4 flex-shrink-0"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* How £500 is derived */}
          <section>
            <h3 className="text-base font-semibold text-gray-800 mb-2">How the £500 estimate is calculated</h3>
            <p className="text-sm text-gray-700">
              The government funds Universal Infant Free School Meals (UIFSM) at{' '}
              <strong>£2.61 per meal</strong> in 2025/26. Over a typical school year of{' '}
              <strong>{SCHOOL_DAYS} days</strong>, this gives:
            </p>
            <div className="mt-2 bg-blue-50 border border-blue-200 rounded-md px-4 py-3 text-sm">
              £2.61 &times; {SCHOOL_DAYS} days ={' '}
              <strong>£{(2.61 * SCHOOL_DAYS).toFixed(2)}</strong> per child per year
              {' '}(rounded to <strong>£500</strong> as a guide figure)
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Based on the 12 local authorities with published prices (see table below), the average
              paid meal cost is <strong>£{avgPrice.toFixed(2)}</strong> per day, which over{' '}
              {SCHOOL_DAYS} days gives <strong>£{(avgPrice * SCHOOL_DAYS).toFixed(0)}</strong> per year.
            </p>
          </section>

          {/* Coverage note */}
          <section className="bg-amber-50 border border-amber-200 rounded-md px-4 py-3">
            <p className="text-sm text-amber-800">
              <strong>Coverage note:</strong> Of England's 150 local authorities, only 12 publish
              centralised meal prices. Most councils leave pricing to individual schools —
              academy schools in particular set their own rates. Prices may have changed since the
              data was collected.
            </p>
          </section>

          {/* Known prices table */}
          <section>
            <h3 className="text-base font-semibold text-gray-800 mb-2">
              Local authorities with published primary school meal prices
            </h3>
            <div className="border border-slate-200 rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-3 py-2 text-gray-600 font-medium">Local Authority</th>
                    <th className="text-left px-3 py-2 text-gray-600 font-medium">Region</th>
                    <th className="text-right px-3 py-2 text-gray-600 font-medium">Per meal</th>
                    <th className="text-right px-3 py-2 text-gray-600 font-medium">Per year ({SCHOOL_DAYS} days)</th>
                  </tr>
                </thead>
                <tbody>
                  {KNOWN_PRICES.map((row, i) => (
                    <tr key={row.la} className={`border-t border-slate-200 ${i % 2 === 1 ? 'bg-slate-50' : ''}`}>
                      <td className="px-3 py-2 text-gray-700">{row.la}</td>
                      <td className="px-3 py-2 text-gray-500">{row.region}</td>
                      <td className="px-3 py-2 text-right font-medium">£{row.price.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right text-gray-600">£{(row.price * SCHOOL_DAYS).toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-slate-300 bg-slate-100">
                  <tr>
                    <td className="px-3 py-2 font-semibold text-gray-700" colSpan={2}>Average</td>
                    <td className="px-3 py-2 text-right font-semibold">£{avgPrice.toFixed(2)}</td>
                    <td className="px-3 py-2 text-right font-semibold">£{(avgPrice * SCHOOL_DAYS).toFixed(0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* London note */}
          <section>
            <h3 className="text-base font-semibold text-gray-800 mb-2">London</h3>
            <p className="text-sm text-gray-700">
              All 33 London boroughs provide <strong>free primary school meals</strong> under the
              Mayor of London's Universal Free School Meals scheme, funded at £3.00 per meal by
              the Greater London Authority. Secondary school meals are charged separately by schools.
            </p>
          </section>

          {/* UIFSM note */}
          <section>
            <h3 className="text-base font-semibold text-gray-800 mb-2">Universal Infant Free School Meals</h3>
            <p className="text-sm text-gray-700">
              All children in Reception, Year 1 and Year 2 receive free school meals under the
              Universal Infant Free School Meals (UIFSM) scheme, regardless of income. The
              government funding rate for 2025/26 is <strong>£2.61 per meal</strong>.
            </p>
          </section>

          <p className="text-xs text-gray-400 border-t border-slate-100 pt-4">
            Source: local authority websites and council announcements. Compiled February 2026.
            Many local authorities do not publish centralised pricing — individual schools, particularly
            academies, set their own prices. Data may not reflect the most current prices.
          </p>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
