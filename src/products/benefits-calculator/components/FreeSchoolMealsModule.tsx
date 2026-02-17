/**
 * Free School Meals Eligibility Module
 * Displays FSM eligibility assessment based on UC status and income
 * Updated to include England September 2026 rule changes (UC > 0)
 */

import { assessFreeSchoolMealsEligibility } from '../utils/freeSchoolMealsEligibility'
import type { FreeSchoolMealsResult } from '../types/free-school-meals'

interface FreeSchoolMealsModuleProps {
  data: {
    area: string
    children: number
    childrenInfo?: { age: number }[]
    monthlyEarnings?: number
    partnerMonthlyEarnings?: number
  }
  ucResults: {
    calculation?: {
      finalAmount: number
    }
  }
}

export function FreeSchoolMealsModule({ data, ucResults }: FreeSchoolMealsModuleProps) {
  const result: FreeSchoolMealsResult = assessFreeSchoolMealsEligibility(data, ucResults)

  // Don't show if no school-age children
  const schoolAgeChildren = result.eligibleChildren.filter(
    c => c.age >= 4 && c.age <= 18
  )
  if (schoolAgeChildren.length === 0) {
    return null
  }

  // Determine header message and styling
  const isCurrentlyEligible = result.eligible
  const isFutureEligible = result.eligibleFromSeptember2026

  let headerMessage: string
  let headerBgClass: string
  let badgeBgClass: string

  if (isCurrentlyEligible) {
    headerMessage = 'Your children are eligible'
    headerBgClass = 'bg-green-50 border-green-200'
    badgeBgClass = 'bg-green-100 text-green-800'
  } else if (isFutureEligible) {
    headerMessage = 'Your children are eligible from September 2026'
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
        <h2 className="text-2xl font-semibold mb-2">Free School Meals</h2>
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
        <p className="text-gray-700 mb-4">{result.reason}</p>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="text-gray-600">Country</span>
            <span className="font-medium">{result.country}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200">
            <span className="text-gray-600">Receiving Universal Credit</span>
            <span className={`font-medium ${result.hasUniversalCredit ? 'text-green-600' : 'text-red-600'}`}>
              {result.hasUniversalCredit ? 'Yes' : 'No'}
            </span>
          </div>
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

        <div className="mt-6 pt-4 border-t border-slate-200">
          <p className="text-sm text-gray-600 mb-3">
            Free School Meals must be applied for through your local council.
            {result.country === 'Scotland' && (
              <span className="block mt-1">
                Note: In Scotland, all children in Primary 1-5 automatically receive free school meals.
              </span>
            )}
            {isFutureEligible && result.country === 'England' && (
              <span className="block mt-1 text-amber-700">
                Note: From September 2026, all Universal Credit claimants in England will be eligible for Free School Meals. You will be able to apply closer to that date.
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
  )
}
