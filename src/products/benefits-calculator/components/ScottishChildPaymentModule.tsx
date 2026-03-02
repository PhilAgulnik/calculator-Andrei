/**
 * Scottish Child Payment Module
 * Displays SCP eligibility and entitlement for Scotland-based claimants with children.
 * Always shown when area = scotland and children > 0 (even when SCP = £0).
 */

import { formatCurrency } from '~/utils/functions'
import { calculateScottishChildPayment } from '../utils/scottishChildPaymentCalculator'

const SCP_PERIOD_LABELS: Record<string, string> = {
  per_week: 'per week',
  per_2_weeks: 'per 2 weeks',
  per_4_weeks: 'per 4 weeks',
  per_month: 'per month',
  per_year: 'per year',
}

function scpConvertFromMonthly(monthlyAmount: number, period: string): number {
  switch (period) {
    case 'per_week': return monthlyAmount * 12 / 52
    case 'per_2_weeks': return monthlyAmount * 12 / 26
    case 'per_4_weeks': return monthlyAmount * 12 / 13
    case 'per_month': return monthlyAmount
    case 'per_year': return monthlyAmount * 12
    default: return monthlyAmount
  }
}

interface ScottishChildPaymentModuleProps {
  data: {
    area: string
    children: number
    childrenInfo?: { age: number }[]
    taxYear?: string
  }
  ucResults: {
    calculation?: {
      finalAmount: number
      totalElements: number
      workAllowance: number
      capitalDeduction: number
      benefitDeduction: number
      studentIncomeDeduction: number
    }
  }
  selectedPeriod?: string
}

export function ScottishChildPaymentModule({ data, ucResults, selectedPeriod = 'per_month' }: ScottishChildPaymentModuleProps) {
  const result = calculateScottishChildPayment(data, ucResults)

  // Don't render if not Scotland or no children
  if (!result.isScotland || result.totalChildCount === 0) return null

  const isEligible = result.eligible
  const isUCZero = !isEligible && result.ucAmount <= 0 && result.eligibleChildCount > 0

  let headerBgClass: string
  let badgeBgClass: string
  let headerMessage: string

  if (isEligible) {
    headerMessage = 'Eligible'
    headerBgClass = 'bg-green-50 border-green-200'
    badgeBgClass = 'bg-green-100 text-green-800'
  } else if (isUCZero) {
    headerMessage = 'Not currently eligible'
    headerBgClass = 'bg-amber-50 border-amber-200'
    badgeBgClass = 'bg-amber-100 text-amber-800'
  } else {
    headerMessage = 'Not eligible'
    headerBgClass = 'bg-gray-50 border-gray-200'
    badgeBgClass = 'bg-red-100 text-red-800'
  }

  return (
    <div className="bg-white border border-slate-300 rounded-lg overflow-hidden">
      <div className={`${headerBgClass} border-b p-6`}>
        <h2 className="text-2xl font-semibold mb-2">Scottish Child Payment</h2>
        {isEligible && (
          <p className="text-4xl font-bold text-slate-800 mb-2">
            {formatCurrency(scpConvertFromMonthly(result.monthlyEquivalent, selectedPeriod))}{' '}
            <span className="text-lg">{SCP_PERIOD_LABELS[selectedPeriod]}</span>
          </p>
        )}
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeBgClass}`}
          >
            {isEligible ? (
              <>
                <span className="mr-1">&#10003;</span>
                {headerMessage}
              </>
            ) : (
              <>
                <span className="mr-1">&#10007;</span>
                {headerMessage}
              </>
            )}
          </span>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-700 mb-4">{result.reason}</p>

        {/* Amounts breakdown */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="text-gray-600">Children under 16</span>
            <span className="font-medium">{result.eligibleChildCount}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="text-gray-600">Weekly rate per child</span>
            <span className="font-medium">{formatCurrency(result.weeklyRate)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200 font-semibold">
            <span>Total amount</span>
            <span>{formatCurrency(scpConvertFromMonthly(result.monthlyEquivalent, selectedPeriod))} <span className="font-normal text-gray-500 text-sm">{SCP_PERIOD_LABELS[selectedPeriod]}</span></span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="text-gray-600">Receiving Universal Credit</span>
            <span className={`font-medium ${result.ucAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {result.ucAmount > 0 ? `Yes (${formatCurrency(scpConvertFromMonthly(result.ucAmount, selectedPeriod))} ${SCP_PERIOD_LABELS[selectedPeriod]})` : 'No (£0)'}
            </span>
          </div>
        </div>

        {/* Per-child breakdown */}
        {result.children.length > 0 && result.children.some((c) => c.age > 0) && (
          <div className="mb-4">
            <h3 className="font-semibold text-sm text-gray-700 mb-2">Per-child eligibility</h3>
            <div className="space-y-1">
              {result.children.map((child, index) => (
                <div
                  key={index}
                  className="flex justify-between py-1 text-sm border-b border-slate-100"
                >
                  <span className="text-gray-600">
                    Child {index + 1} (age {child.age})
                  </span>
                  <span className={`font-medium ${child.eligible ? 'text-green-600' : 'text-red-600'}`}>
                    {child.eligible ? 'Eligible' : child.reason}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UC = 0 advisory with earnings threshold */}
        {isUCZero && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-amber-800 mb-2">
              Your Universal Credit has been reduced to £0 by your earnings. Scottish Child Payment
              requires a UC award greater than zero.
            </p>
            {result.earningsThresholdForUC != null && result.earningsThresholdForUC > 0 && (
              <p className="text-sm text-amber-800 mb-2">
                If your combined net monthly earnings (after tax and National Insurance) were below
                approximately <strong>{formatCurrency(result.earningsThresholdForUC)}</strong>, you
                would receive some Universal Credit and qualify for Scottish Child Payment of{' '}
                <strong>{formatCurrency(result.weeklyRate)}/week</strong> per child under 16.
              </p>
            )}
            <p className="text-sm text-amber-800">
              If your earnings decrease or your circumstances change such that you receive some UC,
              you would become eligible for SCP.
            </p>
          </div>
        )}

        {/* EMA advisory for 16-18 year olds when UC > 0 */}
        {result.ucAmount > 0 && result.children.some((c) => c.age >= 16 && c.age <= 18) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800 font-semibold mb-1">
              Scottish Child Payment stops at age 16
            </p>
            <p className="text-sm text-blue-800">
              SCP ends when a child turns 16. If your child is aged 16–18 and in full-time further
              education, they may be eligible for{' '}
              <strong>Education Maintenance Allowance (EMA)</strong> — £30/week to help support
              continued study. The young person applies directly, and household income must be below
              £26,884/year.
            </p>
            <a
              href="https://www.mygov.scot/ema"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-700 hover:text-blue-900 hover:underline text-sm mt-2"
            >
              Find out about EMA in Scotland
              <span className="ml-1">&rarr;</span>
            </a>
          </div>
        )}

        {/* No eligible children advisory */}
        {result.eligibleChildCount === 0 && result.totalChildCount > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700">
              Scottish Child Payment is only available for children under 16. All children in this
              household are 16 or over.
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-sm text-gray-600 mb-2">
            Scottish Child Payment is paid every 4 weeks by Social Security Scotland. You do not need
            to apply separately for each child.
          </p>
          <a
            href="https://www.socialsecurity.gov.scot/scottish-child-payment"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline text-sm"
          >
            Apply for Scottish Child Payment on Social Security Scotland
            <span className="ml-1">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  )
}
