/**
 * Benefit Rates Comparison Page
 * Compare UC rates between 2025/26 and 2026/27 (projected +3.8%)
 */

import { createFileRoute } from '@tanstack/react-router'
import { UniversalCreditCalculator } from '~/products/benefits-calculator/utils/calculator'
import { ChildBenefitCalculator } from '~/products/benefits-calculator/utils/childBenefitCalculator'
import {
  TAX_RATES_2025_26,
  TAX_RATES_2026_27,
  NI_RATES_2025_26,
  NI_RATES_2026_27,
  STUDENT_LOAN_THRESHOLDS_2025_26,
  STUDENT_LOAN_THRESHOLDS_2026_27,
} from '~/products/benefits-calculator/types/net-earnings'
import { HICBC_THRESHOLDS } from '~/products/benefits-calculator/types/child-benefit-charge'

const calculator = new UniversalCreditCalculator()
const rates2526 = calculator.rates['2025_26']
const rates2627 = calculator.rates['2026_27']

const cbCalculator = new ChildBenefitCalculator()
const cbRates2526 = cbCalculator.rates['2025_26']
const cbRates2627 = cbCalculator.rates['2026_27']

// Calculate 26/27 rates with additional 2.3% increase on standard allowance
const rates2627Enhanced = {
  standardAllowance: {
    single: {
      under25: Math.round(rates2627.standardAllowance.single.under25 * 1.023 * 100) / 100,
      over25: Math.round(rates2627.standardAllowance.single.over25 * 1.023 * 100) / 100,
    },
    couple: {
      under25: Math.round(rates2627.standardAllowance.couple.under25 * 1.023 * 100) / 100,
      over25: Math.round(rates2627.standardAllowance.couple.over25 * 1.023 * 100) / 100,
    },
  },
}

function formatCurrency(value: number) {
  return `£${value.toFixed(2)}`
}

function formatChange(old: number, newVal: number) {
  const change = newVal - old
  const pct = ((change / old) * 100).toFixed(1)
  return `+${formatCurrency(change)} (+${pct}%)`
}

function RateRow({ label, old, current, enhanced, showEnhanced = false }: { label: string; old: number; current: number; enhanced?: number; showEnhanced?: boolean }) {
  // For enhanced rows, show change from old to enhanced rate
  const changeValue = showEnhanced && enhanced !== undefined ? enhanced : current
  return (
    <tr className="border-b">
      <td className="py-2 px-4 w-[200px]">{label}</td>
      <td className="py-2 px-4 text-right w-[100px]">{formatCurrency(old)}</td>
      <td className="py-2 px-4 text-right w-[100px] font-semibold">{formatCurrency(current)}</td>
      {showEnhanced && (
        <td className="py-2 px-4 text-right w-[100px] font-semibold text-purple-700">
          {enhanced !== undefined ? formatCurrency(enhanced) : '-'}
        </td>
      )}
      <td className="py-2 px-4 text-right w-[140px] text-green-600">{formatChange(old, changeValue)}</td>
    </tr>
  )
}

function BenefitRatesPage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Universal Credit Benefit Rates</h1>
      <p className="text-slate-600 mb-6">
        Comparison of 2025/26 rates vs projected 2026/27 rates (3.8% uplift assumption)
      </p>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Standard Allowance (monthly)</h2>
        <table className="w-full border-collapse border rounded">
          <thead className="bg-slate-100">
            <tr>
              <th className="py-2 px-4 text-left w-[200px]">Category</th>
              <th className="py-2 px-4 text-right w-[100px]">2025/26</th>
              <th className="py-2 px-4 text-right w-[100px]">2026/27</th>
              <th className="py-2 px-4 text-right w-[140px]">Change</th>
            </tr>
          </thead>
          <tbody>
            <RateRow
              label="Single under 25"
              old={rates2526.standardAllowance.single.under25}
              current={rates2627.standardAllowance.single.under25}
            />
            <RateRow
              label="Single 25 or over"
              old={rates2526.standardAllowance.single.over25}
              current={rates2627.standardAllowance.single.over25}
            />
            <RateRow
              label="Couple both under 25"
              old={rates2526.standardAllowance.couple.under25}
              current={rates2627.standardAllowance.couple.under25}
            />
            <RateRow
              label="Couple (one or both 25+)"
              old={rates2526.standardAllowance.couple.over25}
              current={rates2627.standardAllowance.couple.over25}
            />
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Child Element (monthly)</h2>
        <table className="w-full border-collapse border rounded">
          <thead className="bg-slate-100">
            <tr>
              <th className="py-2 px-4 text-left w-[200px]">Category</th>
              <th className="py-2 px-4 text-right w-[100px]">2025/26</th>
              <th className="py-2 px-4 text-right w-[100px]">2026/27</th>
              <th className="py-2 px-4 text-right w-[140px]">Change</th>
            </tr>
          </thead>
          <tbody>
            <RateRow
              label="Born before 6 April 2017"
              old={rates2526.childElement.preTwoChildLimit}
              current={rates2627.childElement.preTwoChildLimit}
            />
            <RateRow
              label="Born on/after 6 April 2017"
              old={rates2526.childElement.postTwoChildLimit}
              current={rates2627.childElement.postTwoChildLimit}
            />
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Disabled Child Addition (monthly)</h2>
        <table className="w-full border-collapse border rounded">
          <thead className="bg-slate-100">
            <tr>
              <th className="py-2 px-4 text-left w-[200px]">Category</th>
              <th className="py-2 px-4 text-right w-[100px]">2025/26</th>
              <th className="py-2 px-4 text-right w-[100px]">2026/27</th>
              <th className="py-2 px-4 text-right w-[140px]">Change</th>
            </tr>
          </thead>
          <tbody>
            <RateRow
              label="Lower rate"
              old={rates2526.disabledChildElement.lowerRate}
              current={rates2627.disabledChildElement.lowerRate}
            />
            <RateRow
              label="Higher rate"
              old={rates2526.disabledChildElement.higherRate}
              current={rates2627.disabledChildElement.higherRate}
            />
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Childcare Element (monthly max)</h2>
        <table className="w-full border-collapse border rounded">
          <thead className="bg-slate-100">
            <tr>
              <th className="py-2 px-4 text-left w-[200px]">Category</th>
              <th className="py-2 px-4 text-right w-[100px]">2025/26</th>
              <th className="py-2 px-4 text-right w-[100px]">2026/27</th>
              <th className="py-2 px-4 text-right w-[140px]">Change</th>
            </tr>
          </thead>
          <tbody>
            <RateRow
              label="One child"
              old={rates2526.childcareElement.maxAmountOneChild}
              current={rates2627.childcareElement.maxAmountOneChild}
            />
            <RateRow
              label="Two or more children"
              old={rates2526.childcareElement.maxAmountTwoOrMore}
              current={rates2627.childcareElement.maxAmountTwoOrMore}
            />
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Carer Element (monthly)</h2>
        <table className="w-full border-collapse border rounded">
          <thead className="bg-slate-100">
            <tr>
              <th className="py-2 px-4 text-left w-[200px]">Element</th>
              <th className="py-2 px-4 text-right w-[100px]">2025/26</th>
              <th className="py-2 px-4 text-right w-[100px]">2026/27</th>
              <th className="py-2 px-4 text-right w-[140px]">Change</th>
            </tr>
          </thead>
          <tbody>
            <RateRow label="Carer Element" old={rates2526.carerElement} current={rates2627.carerElement} />
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Disability Elements (monthly)</h2>
        <table className="w-full border-collapse border rounded">
          <thead className="bg-slate-100">
            <tr>
              <th className="py-2 px-4 text-left w-[200px]">Element</th>
              <th className="py-2 px-4 text-right w-[100px]">2025/26</th>
              <th className="py-2 px-4 text-right w-[100px]">2026/27</th>
              <th className="py-2 px-4 text-right w-[140px]">Change</th>
            </tr>
          </thead>
          <tbody>
            <RateRow
              label="LCWRA (pre-April 26 claimants)"
              old={rates2526.lcwraElement}
              current={rates2627.lcwraElement}
            />
            <tr className="border-b">
              <td className="py-2 px-4 w-[200px]">LCWRA (post-April 26 new claimants)</td>
              <td className="py-2 px-4 text-right w-[100px]"></td>
              <td className="py-2 px-4 text-right w-[100px] font-semibold">{formatCurrency(217.26)}</td>
              <td className="py-2 px-4 text-right w-[140px]"></td>
            </tr>
          </tbody>
        </table>
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> From April 6, 2026, new LCWRA claimants (except those who are terminally ill or have severe lifelong conditions)
            will receive £217.26/month. Pre-April 2026 claimants and protected groups receive £{rates2627.lcwraElement.toFixed(2)}/month (uprated).
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Work Allowance (monthly)</h2>
        <table className="w-full border-collapse border rounded">
          <thead className="bg-slate-100">
            <tr>
              <th className="py-2 px-4 text-left w-[200px]">Category</th>
              <th className="py-2 px-4 text-right w-[100px]">2025/26</th>
              <th className="py-2 px-4 text-right w-[100px]">2026/27</th>
              <th className="py-2 px-4 text-right w-[140px]">Change</th>
            </tr>
          </thead>
          <tbody>
            <RateRow
              label="With housing costs"
              old={rates2526.workAllowance.single.withHousing}
              current={rates2627.workAllowance.single.withHousing}
            />
            <RateRow
              label="Without housing costs"
              old={rates2526.workAllowance.single.withoutHousing}
              current={rates2627.workAllowance.single.withoutHousing}
            />
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Child Benefit (weekly)</h2>
        <table className="w-full border-collapse border rounded">
          <thead className="bg-slate-100">
            <tr>
              <th className="py-2 px-4 text-left w-[200px]">Category</th>
              <th className="py-2 px-4 text-right w-[100px]">2025/26</th>
              <th className="py-2 px-4 text-right w-[100px]">2026/27</th>
              <th className="py-2 px-4 text-right w-[140px]">Change</th>
            </tr>
          </thead>
          <tbody>
            <RateRow
              label="Eldest/only child"
              old={cbRates2526.eldestChild}
              current={cbRates2627.eldestChild}
            />
            <RateRow
              label="Additional children (each)"
              old={cbRates2526.additionalChildren}
              current={cbRates2627.additionalChildren}
            />
          </tbody>
        </table>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Income Tax Rates (annual)</h2>
        <table className="w-full border-collapse border rounded">
          <thead className="bg-slate-100">
            <tr>
              <th className="py-2 px-4 text-left w-[200px]">Band</th>
              <th className="py-2 px-4 text-right w-[100px]">2025/26</th>
              <th className="py-2 px-4 text-right w-[100px]">2026/27</th>
              <th className="py-2 px-4 text-right w-[140px]">Change</th>
            </tr>
          </thead>
          <tbody>
            <RateRow
              label="Personal Allowance"
              old={TAX_RATES_2025_26.personalAllowance}
              current={TAX_RATES_2026_27.personalAllowance}
            />
            <RateRow
              label="Basic Rate (20%)"
              old={TAX_RATES_2025_26.basicRate.limit}
              current={TAX_RATES_2026_27.basicRate.limit}
            />
            <RateRow
              label="Higher Rate (40%)"
              old={TAX_RATES_2025_26.higherRate.limit}
              current={TAX_RATES_2026_27.higherRate.limit}
            />
            <RateRow
              label="Additional Rate (45%)"
              old={TAX_RATES_2025_26.additionalRate.threshold}
              current={TAX_RATES_2026_27.additionalRate.threshold}
            />
          </tbody>
        </table>
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Income tax thresholds frozen until April 2031.
          </p>
        </div>
        <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded">
          <p className="text-sm text-orange-800">
            <strong>⚠️ Not included in calculator yet:</strong> 2026/27 tax rates need to be selectable in calculator UI.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">National Insurance - Employee (annual)</h2>
        <table className="w-full border-collapse border rounded">
          <thead className="bg-slate-100">
            <tr>
              <th className="py-2 px-4 text-left w-[200px]">Threshold/Rate</th>
              <th className="py-2 px-4 text-right w-[100px]">2025/26</th>
              <th className="py-2 px-4 text-right w-[100px]">2026/27</th>
              <th className="py-2 px-4 text-right w-[140px]">Change</th>
            </tr>
          </thead>
          <tbody>
            <RateRow
              label="Primary Threshold"
              old={NI_RATES_2025_26.primaryThreshold}
              current={NI_RATES_2026_27.primaryThreshold}
            />
            <RateRow
              label="Upper Earnings Limit"
              old={NI_RATES_2025_26.upperEarningsLimit}
              current={NI_RATES_2026_27.upperEarningsLimit}
            />
            <tr className="border-b">
              <td className="py-2 px-4 w-[200px]">Rate (PT to UEL)</td>
              <td className="py-2 px-4 text-right w-[100px]">8%</td>
              <td className="py-2 px-4 text-right w-[100px] font-semibold">8%</td>
              <td className="py-2 px-4 text-right w-[140px] text-green-600">No change</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 w-[200px]">Rate (above UEL)</td>
              <td className="py-2 px-4 text-right w-[100px]">2%</td>
              <td className="py-2 px-4 text-right w-[100px] font-semibold">2%</td>
              <td className="py-2 px-4 text-right w-[140px] text-green-600">No change</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> NI thresholds and rates frozen until April 2031. Employee rate reduced from 12% to 8% in April 2024.
          </p>
        </div>
        <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded">
          <p className="text-sm text-orange-800">
            <strong>⚠️ Not included in calculator yet:</strong> 2026/27 NI rates need to be selectable in calculator UI.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Student Loan Repayment Thresholds (annual)</h2>
        <table className="w-full border-collapse border rounded">
          <thead className="bg-slate-100">
            <tr>
              <th className="py-2 px-4 text-left w-[200px]">Plan Type</th>
              <th className="py-2 px-4 text-right w-[100px]">2025/26</th>
              <th className="py-2 px-4 text-right w-[100px]">2026/27</th>
              <th className="py-2 px-4 text-right w-[140px]">Change</th>
            </tr>
          </thead>
          <tbody>
            <RateRow
              label="Plan 1 (9%)"
              old={STUDENT_LOAN_THRESHOLDS_2025_26.plan1.threshold}
              current={STUDENT_LOAN_THRESHOLDS_2026_27.plan1.threshold}
            />
            <RateRow
              label="Plan 2 (9%)"
              old={STUDENT_LOAN_THRESHOLDS_2025_26.plan2.threshold}
              current={STUDENT_LOAN_THRESHOLDS_2026_27.plan2.threshold}
            />
            <RateRow
              label="Plan 4 Scotland (9%)"
              old={STUDENT_LOAN_THRESHOLDS_2025_26.plan4.threshold}
              current={STUDENT_LOAN_THRESHOLDS_2026_27.plan4.threshold}
            />
            <RateRow
              label="Plan 5 Post-2023 (9%)"
              old={STUDENT_LOAN_THRESHOLDS_2025_26.plan5.threshold}
              current={STUDENT_LOAN_THRESHOLDS_2026_27.plan5.threshold}
            />
            <RateRow
              label="Postgraduate (6%)"
              old={STUDENT_LOAN_THRESHOLDS_2025_26.postgraduate.threshold}
              current={STUDENT_LOAN_THRESHOLDS_2026_27.postgraduate.threshold}
            />
          </tbody>
        </table>
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Plan 5 frozen at £25,000 until April 2027. Postgraduate frozen at £21,000 since 2016.
          </p>
        </div>
        <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded">
          <p className="text-sm text-orange-800">
            <strong>⚠️ Not included in calculator yet:</strong> 2026/27 student loan thresholds need to be selectable in calculator UI.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Child Benefit High Income Charge (annual)</h2>
        <table className="w-full border-collapse border rounded">
          <thead className="bg-slate-100">
            <tr>
              <th className="py-2 px-4 text-left w-[200px]">Threshold</th>
              <th className="py-2 px-4 text-right w-[100px]">2025/26</th>
              <th className="py-2 px-4 text-right w-[100px]">2026/27</th>
              <th className="py-2 px-4 text-right w-[140px]">Change</th>
            </tr>
          </thead>
          <tbody>
            <RateRow
              label="Charge starts"
              old={HICBC_THRESHOLDS.startThreshold}
              current={HICBC_THRESHOLDS.startThreshold}
            />
            <RateRow
              label="Full clawback"
              old={HICBC_THRESHOLDS.fullClawbackThreshold}
              current={HICBC_THRESHOLDS.fullClawbackThreshold}
            />
            <tr className="border-b">
              <td className="py-2 px-4 w-[200px]">Charge rate</td>
              <td className="py-2 px-4 text-right w-[100px]">1% per £200</td>
              <td className="py-2 px-4 text-right w-[100px] font-semibold">1% per £200</td>
              <td className="py-2 px-4 text-right w-[140px] text-green-600">No change</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> HICBC thresholds increased from £50,000/£60,000 to £60,000/£80,000 in April 2024. Based on individual income, not household.
          </p>
        </div>
        <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded">
          <p className="text-sm text-orange-800">
            <strong>⚠️ Not included in calculator yet:</strong> HICBC calculation is available but thresholds are not year-specific in code. Future threshold changes would need code updates.
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Universal Credit Capital Limits</h2>
        <table className="w-full border-collapse border rounded">
          <thead className="bg-slate-100">
            <tr>
              <th className="py-2 px-4 text-left w-[200px]">Limit</th>
              <th className="py-2 px-4 text-right w-[100px]">2025/26</th>
              <th className="py-2 px-4 text-right w-[100px]">2026/27</th>
              <th className="py-2 px-4 text-right w-[140px]">Change</th>
            </tr>
          </thead>
          <tbody>
            <RateRow
              label="Lower limit (disregard)"
              old={rates2526.capitalLowerLimit}
              current={rates2627.capitalLowerLimit}
            />
            <RateRow
              label="Upper limit"
              old={rates2526.capitalUpperLimit}
              current={rates2627.capitalUpperLimit}
            />
            <tr className="border-b">
              <td className="py-2 px-4 w-[200px]">Tariff income rate</td>
              <td className="py-2 px-4 text-right w-[100px]">£4.35 per £250</td>
              <td className="py-2 px-4 text-right w-[100px] font-semibold">£4.35 per £250</td>
              <td className="py-2 px-4 text-right w-[140px] text-green-600">No change</td>
            </tr>
          </tbody>
        </table>
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Capital limits apply to savings and investments. £6,000-£16,000 generates assumed 'tariff income'. Above £16,000 makes claimant ineligible for UC.
          </p>
        </div>
        <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded">
          <p className="text-sm text-orange-800">
            <strong>⚠️ Not included in calculator yet:</strong> Capital limits are defined but not currently used in calculator UI. Capital/savings assessment needs to be implemented.
          </p>
        </div>
      </div>

      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> UC rates for 2026/27 use official published rates. Tax and NI thresholds frozen until 2031.
        </p>
      </div>

      <div className="mt-4">
        <a href="/calculator-Andrei/" className="text-blue-600 hover:underline">
          ← Back to calculator
        </a>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/benefit-rates')({
  component: BenefitRatesPage,
})
