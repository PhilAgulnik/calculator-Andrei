/**
 * Free School Meals Eligibility Module
 * Displays FSM eligibility assessment based on UC status and income
 * Updated to include England September 2026 rule changes (UC > 0)
 */

import { useState, useEffect } from 'react'
import { assessFreeSchoolMealsEligibility } from '../utils/freeSchoolMealsEligibility'
import type { FreeSchoolMealsResult } from '../types/free-school-meals'
import { SchoolMealCostsModal } from './SchoolMealCostsModal'

const FSM_PERIOD_LABELS: Record<string, string> = {
  per_week: 'per week',
  per_2_weeks: 'per 2 weeks',
  per_4_weeks: 'per 4 weeks',
  per_month: 'per month',
  per_year: 'per year',
}

function fsmConvertFromMonthly(monthlyAmount: number, period: string): number {
  switch (period) {
    case 'per_week': return monthlyAmount * 12 / 52
    case 'per_2_weeks': return monthlyAmount * 12 / 26
    case 'per_4_weeks': return monthlyAmount * 12 / 13
    case 'per_month': return monthlyAmount
    case 'per_year': return monthlyAmount * 12
    default: return monthlyAmount
  }
}

function isLondonPostcode(postcode: string): boolean {
  const prefix = postcode.trim().toUpperCase().split(/\s/)[0]
  return /^(E|EC|N|NW|SE|SW|W|WC)\d/.test(prefix)
}

interface FreeSchoolMealsModuleProps {
  data: {
    area: string
    children: number
    childrenInfo?: { age: number }[]
    monthlyEarnings?: number
    partnerMonthlyEarnings?: number
    postcode?: string
  }
  ucResults: {
    calculation?: {
      finalAmount: number
    }
  }
  selectedPeriod?: string
  onFsmValueChange?: (values: { universal: number | null; meansTested: number | null }) => void
  /** Controlled value for the "include estimated value" checkbox — lifted to parent */
  includeValue?: boolean
  /** Callback when user toggles the checkbox — lifted to parent */
  onIncludeValueChange?: (v: boolean) => void
}

export function FreeSchoolMealsModule({ data, ucResults, selectedPeriod = 'per_month', onFsmValueChange, includeValue: includeValueProp, onIncludeValueChange }: FreeSchoolMealsModuleProps) {
  const result: FreeSchoolMealsResult = assessFreeSchoolMealsEligibility(data, ucResults)

  const [localIncludeValue, setLocalIncludeValue] = useState(false)
  // Use controlled prop if provided by parent, otherwise fall back to local state
  const includeValue = includeValueProp !== undefined ? includeValueProp : localIncludeValue
  const handleIncludeChange = (v: boolean) => {
    if (onIncludeValueChange) onIncludeValueChange(v)
    else setLocalIncludeValue(v)
  }
  const [perChildAnnualInput, setPerChildAnnualInput] = useState('500')
  const [showMealCostsModal, setShowMealCostsModal] = useState(false)
  // Default daily meal cost is the UIFSM government funding rate for 2025/26 (£2.61 per meal).
  // TODO 2026/27: check for an updated UIFSM funding rate and use it here;
  // fall back to this 2025/26 value if no updated rate is available.
  const [costPerDay, setCostPerDay] = useState('2.61')
  const [schoolDays, setSchoolDays] = useState('190')

  // Don't show if no school-age children
  const schoolAgeChildren = result.eligibleChildren.filter(
    c => c.age >= 4 && c.age <= 18
  )
  if (schoolAgeChildren.length === 0) {
    return null
  }

  // Derive eligibility from per-child data so universal provision (Scotland P1-P5, Wales primary)
  // is correctly reflected even when the household income check fails.
  // "Not eligible" is only shown when ALL school-age children have no eligibility at all.
  const isCurrentlyEligible = schoolAgeChildren.some(c => c.eligible)
  const isFutureEligible = schoolAgeChildren.some(c => c.eligibleFromSeptember2026)

  // Split eligible children by type
  const universalChildren = schoolAgeChildren.filter(c => c.eligible && !!c.universalProvision)
  const meansTestedChildren = schoolAgeChildren.filter(c => c.eligible && !c.universalProvision)
  const hasUniversal = universalChildren.length > 0
  const hasMeansTested = meansTestedChildren.length > 0
  // True when every eligible child is universal — means-tested income rows are irrelevant
  const allEligibleAreUniversal = hasUniversal && !hasMeansTested

  // Country-specific checks
  const isEngland = result.country === 'England'
  const isScotland = result.country === 'Scotland'
  const isWales = result.country === 'Wales'
  const isLondon = isEngland && data.postcode ? isLondonPostcode(data.postcode) : false
  const isNotEligible = !isCurrentlyEligible && !isFutureEligible

  // Child age display
  const childAgeLabel = schoolAgeChildren.length === 1 ? 'Child age' : 'Child ages'
  const childAgeValue = schoolAgeChildren.map(c => c.age).join(', ')

  // Universal provision age checks (for footer notes)
  const hasScotlandP1P5Children = result.eligibleChildren.some(c => c.age >= 4 && c.age <= 10)
  const hasWalesPrimaryChildren = result.eligibleChildren.some(c => c.age >= 4 && c.age <= 11)

  // Show cross-country note when not eligible but has UC (and not in England)
  const showEnglandComparisonNote = isNotEligible && result.hasUniversalCredit && !isEngland

  const parsedAnnual = Math.max(0, parseFloat(perChildAnnualInput) || 0)
  const universalMonthly = (parsedAnnual * universalChildren.length) / 12
  const meansTestedMonthly = (parsedAnnual * meansTestedChildren.length) / 12
  const totalMonthly = universalMonthly + meansTestedMonthly

  const parsedCostPerDay = Math.max(0, parseFloat(costPerDay) || 0)
  const parsedSchoolDays = Math.max(0, parseFloat(schoolDays) || 0)
  const equatesWeekly = parsedCostPerDay * 5
  const equatesWeeks = parsedSchoolDays / 5
  const equatesAnnual = parsedCostPerDay * parsedSchoolDays
  const showEquates = parsedCostPerDay > 0 && parsedSchoolDays > 0

  function handleCostPerDayChange(value: string) {
    setCostPerDay(value)
    const d = parseFloat(value) || 0
    const n = parseFloat(schoolDays) || 0
    if (d > 0 && n > 0) setPerChildAnnualInput((d * n).toFixed(0))
  }

  function handleSchoolDaysChange(value: string) {
    setSchoolDays(value)
    const d = parseFloat(costPerDay) || 0
    const n = parseFloat(value) || 0
    if (d > 0 && n > 0) setPerChildAnnualInput((d * n).toFixed(0))
  }

  // Report monthly values (split by type) to parent whenever toggle or amounts change
  useEffect(() => {
    if (!onFsmValueChange) return
    if (includeValue && isCurrentlyEligible) {
      onFsmValueChange({
        universal: universalMonthly > 0 ? universalMonthly : null,
        meansTested: meansTestedMonthly > 0 ? meansTestedMonthly : null,
      })
    } else {
      onFsmValueChange({ universal: null, meansTested: null })
    }
  }, [includeValue, universalMonthly, meansTestedMonthly, isCurrentlyEligible])

  let headerMessage: string
  let headerBgClass: string
  let badgeBgClass: string

  const childOrChildren = schoolAgeChildren.length === 1 ? 'child' : 'children'

  if (isCurrentlyEligible) {
    if (hasUniversal && hasMeansTested) {
      headerMessage = `Your ${childOrChildren} qualify for universal and means-tested Free School Meals`
    } else if (hasUniversal) {
      headerMessage = `Your ${childOrChildren} are eligible for universal Free School Meals`
    } else {
      headerMessage = `Your ${childOrChildren} are eligible for means-tested Free School Meals`
    }
    headerBgClass = 'bg-green-50 border-green-200'
    badgeBgClass = 'bg-green-100 text-green-800'
  } else if (isFutureEligible) {
    headerMessage = `Your ${childOrChildren} ${schoolAgeChildren.length === 1 ? 'is' : 'are'} eligible for means-tested Free School Meals from September 2026`
    headerBgClass = 'bg-amber-50 border-amber-200'
    badgeBgClass = 'bg-amber-100 text-amber-800'
  } else {
    headerMessage = 'Not eligible'
    headerBgClass = 'bg-gray-50 border-gray-200'
    badgeBgClass = 'bg-red-100 text-red-800'
  }

  return (
    <>
    <div className="bg-white border border-slate-300 rounded-lg overflow-hidden">
      <div className={`${headerBgClass} border-b p-6`}>
        <h2 className="text-2xl font-semibold mb-2">Free School Meals</h2>
        {isCurrentlyEligible && includeValue && totalMonthly > 0 && (
          <p className="text-4xl font-bold text-slate-800 mb-2">
            £{fsmConvertFromMonthly(totalMonthly, selectedPeriod).toFixed(2)}{' '}
            <span className="text-lg font-normal">{FSM_PERIOD_LABELS[selectedPeriod]}</span>
          </p>
        )}
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeBgClass}`}
          >
            {isCurrentlyEligible || isFutureEligible ? (
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
        <p className="text-gray-700 mb-4">
          {allEligibleAreUniversal
            ? result.country === 'Scotland'
              ? 'Eligible children in P1–P5 receive free school meals automatically. No income test applies.'
              : 'Eligible children in primary school receive free school meals automatically. No income test applies.'
            : result.reason}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="text-gray-600">{childAgeLabel}</span>
            <span className="font-medium">{childAgeValue}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="text-gray-600">Country</span>
            <span className="font-medium">{result.country}{isLondon ? ' (London)' : ''}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="text-gray-600">Receiving Universal Credit</span>
            <span className={`font-medium ${result.hasUniversalCredit ? 'text-green-600' : 'text-red-600'}`}>
              {result.hasUniversalCredit ? 'Yes' : 'No'}
            </span>
          </div>
          {!allEligibleAreUniversal && (
            <>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-gray-600">Net earned income</span>
                <span className="font-medium">
                  £{(result.netEarnedIncome / 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per month
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-gray-600">Current income threshold ({result.country})</span>
                <span className="font-medium">
                  £{(result.threshold / 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per month
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200">
                <span className="text-gray-600">Meets current threshold</span>
                <span className={`font-medium ${result.meetsIncomeThreshold ? 'text-green-600' : 'text-red-600'}`}>
                  {result.meetsIncomeThreshold ? 'Yes' : 'No'}
                </span>
              </div>
            </>
          )}

          {/* Show September 2026 info only for future eligible cases (not currently eligible) */}
          {isFutureEligible && result.country === 'England' && (
            <>
              <div className="flex justify-between py-2 border-b border-slate-200 bg-amber-50 -mx-6 px-6">
                <span className="text-gray-600">September 2026 rule</span>
                <span className="font-medium">
                  Eligible if receiving any Universal Credit
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-200 bg-amber-50 -mx-6 px-6">
                <span className="text-gray-600">Meets September 2026 rule</span>
                <span className={`font-medium ${result.hasUniversalCredit ? 'text-green-600' : 'text-red-600'}`}>
                  {result.hasUniversalCredit ? 'Yes' : 'No'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Per-child breakdown */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Children</h3>
          <div className="border border-slate-200 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-3 py-2 text-gray-600 font-medium">Child</th>
                  <th className="text-left px-3 py-2 text-gray-600 font-medium">Age</th>
                  <th className="text-left px-3 py-2 text-gray-600 font-medium">Universal FSM</th>
                  <th className="text-right px-3 py-2 text-gray-600 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {schoolAgeChildren.map((child, i) => {
                  let universalLabel: string
                  if (child.universalProvision) {
                    if (result.country === 'Scotland') universalLabel = 'Yes – P1 to P5'
                    else if (result.country === 'Wales') universalLabel = 'Yes – all primary'
                    else universalLabel = 'Yes'
                  } else {
                    universalLabel = 'No'
                  }

                  let statusText: string
                  let statusClass: string
                  if (child.eligible) {
                    statusText = child.universalProvision ? 'Eligible (universal)' : 'Eligible'
                    statusClass = 'text-green-600'
                  } else if (child.eligibleFromSeptember2026) {
                    statusText = 'Eligible from Sep 2026'
                    statusClass = 'text-amber-600'
                  } else {
                    statusText = 'Not eligible'
                    statusClass = 'text-red-600'
                  }

                  return (
                    <tr key={i} className="border-t border-slate-200">
                      <td className="px-3 py-2 text-gray-700">Child {i + 1}</td>
                      <td className="px-3 py-2 text-gray-700">{child.age}</td>
                      <td className="px-3 py-2 text-gray-700">{universalLabel}</td>
                      <td className={`px-3 py-2 text-right font-medium ${statusClass}`}>{statusText}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* FSM value section — only when currently eligible */}
        {isCurrentlyEligible && (universalChildren.length > 0 || meansTestedChildren.length > 0) && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeValue}
                onChange={e => handleIncludeChange(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 accent-blue-600"
              />
              <span className="font-medium text-gray-800">
                Include estimated value of free school meals
              </span>
            </label>

            {includeValue && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                <p className="text-sm text-gray-700">
                  Free school meals are estimated to be worth around <strong>£500 per child per year</strong>, based on the{' '}
                  <button
                    onClick={() => setShowMealCostsModal(true)}
                    className="text-blue-600 hover:text-blue-800 underline underline-offset-2 cursor-pointer"
                  >
                    average cost of a school meal
                  </button>
                  . This is a guide figure — you can enter a different amount if you know the actual value at your child's school.
                </p>

                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Value per child per year:
                  </label>
                  <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white w-32">
                    <span className="px-2 py-1.5 bg-slate-100 text-slate-600 text-sm border-r border-slate-300">£</span>
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={perChildAnnualInput}
                      onChange={e => setPerChildAnnualInput(e.target.value)}
                      className="px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-blue-200 space-y-3">
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Or calculate from daily cost</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-700 whitespace-nowrap">Cost per day:</label>
                      <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white w-24">
                        <span className="px-2 py-1.5 bg-slate-100 text-slate-600 text-sm border-r border-slate-300">£</span>
                        <input
                          type="number"
                          min="0"
                          step="0.05"
                          value={costPerDay}
                          onChange={e => handleCostPerDayChange(e.target.value)}
                          className="px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-700 whitespace-nowrap">School days per year:</label>
                      <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white w-20">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={schoolDays}
                          onChange={e => handleSchoolDaysChange(e.target.value)}
                          className="px-2 py-1.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-blue-500 text-center"
                        />
                      </div>
                    </div>
                  </div>
                  {showEquates && (
                    <p className="text-sm text-gray-700">
                      This equates to a cost of{' '}
                      <strong>£{equatesWeekly.toFixed(2)}</strong> per week for{' '}
                      <strong>{Number.isInteger(equatesWeeks) ? equatesWeeks : equatesWeeks.toFixed(1)}</strong> weeks a year,
                      or <strong>£{equatesAnnual.toFixed(2)}</strong> per year
                    </p>
                  )}
                </div>

                {parsedAnnual > 0 && (universalChildren.length > 0 || meansTestedChildren.length > 0) && (
                  <div className="pt-2 border-t border-blue-300 space-y-1">
                    {universalChildren.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Universal FSM: {universalChildren.length} {universalChildren.length === 1 ? 'child' : 'children'} × £{parsedAnnual.toFixed(0)}/year
                        </span>
                        <span className="font-semibold text-blue-800">
                          £{fsmConvertFromMonthly(universalMonthly, selectedPeriod).toFixed(2)}{' '}
                          <span className="font-normal text-sm">{FSM_PERIOD_LABELS[selectedPeriod]}</span>
                        </span>
                      </div>
                    )}
                    {meansTestedChildren.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Means-tested FSM: {meansTestedChildren.length} {meansTestedChildren.length === 1 ? 'child' : 'children'} × £{parsedAnnual.toFixed(0)}/year
                        </span>
                        <span className="font-semibold text-blue-800">
                          £{fsmConvertFromMonthly(meansTestedMonthly, selectedPeriod).toFixed(2)}{' '}
                          <span className="font-normal text-sm">{FSM_PERIOD_LABELS[selectedPeriod]}</span>
                        </span>
                      </div>
                    )}
                    {universalChildren.length > 0 && meansTestedChildren.length > 0 && (
                      <div className="flex justify-between items-center pt-1 border-t border-blue-200">
                        <span className="text-sm font-medium text-gray-700">Total</span>
                        <span className="font-bold text-blue-800">
                          £{fsmConvertFromMonthly(totalMonthly, selectedPeriod).toFixed(2)}{' '}
                          <span className="font-normal text-sm">{FSM_PERIOD_LABELS[selectedPeriod]}</span>
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200">
          <p className="text-sm text-gray-600 mb-3">
            Free School Meals must be applied for through your local council.
            {isScotland && hasScotlandP1P5Children && (
              <span className="block mt-1">
                Note: In Scotland, all children in Primary 1–5 (ages 4–10) automatically receive free school meals, regardless of income.
              </span>
            )}
            {isWales && hasWalesPrimaryChildren && (
              <span className="block mt-1">
                Note: In Wales, all primary school children (ages 4–11) automatically receive free school meals, regardless of income.
              </span>
            )}
            {isFutureEligible && isEngland && (
              <span className="block mt-1 text-amber-700">
                {isLondon
                  ? 'Note: From September 2026, all Universal Credit claimants in England — including London — will be eligible for Free School Meals. You will be able to apply closer to that date.'
                  : 'Note: From September 2026, all Universal Credit claimants in England will be eligible for Free School Meals. You will be able to apply closer to that date.'
                }
              </span>
            )}
            {showEnglandComparisonNote && (
              <span className="block mt-2 text-gray-500">
                Note: In England, all households with a Universal Credit award will be eligible for free school meals from September 2026. However, these new rules do not apply in {result.country}, where the earnings limit remains £{result.threshold.toLocaleString()}/year (£{(result.threshold / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}/month).
              </span>
            )}
          </p>
          {(isCurrentlyEligible || !isFutureEligible) && (
            <a
              href="https://www.gov.uk/apply-free-school-meals"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline text-sm"
            >
              Apply for Free School Meals on GOV.UK
              <span className="ml-1">→</span>
            </a>
          )}
        </div>
      </div>
    </div>

    {showMealCostsModal && (
      <SchoolMealCostsModal onClose={() => setShowMealCostsModal(false)} />
    )}
    </>
  )
}
