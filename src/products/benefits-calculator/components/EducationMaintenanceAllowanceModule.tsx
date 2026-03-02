/**
 * Education Maintenance Allowance (EMA) Module
 *
 * Displays EMA eligibility assessment for dependent young people (aged 16–19,
 * or 16–18 in Wales) who are in full-time further education.
 *
 * EMA is available in Wales (£40/week), Scotland (£30/week), and Northern Ireland
 * (£30/week). It is NOT available in England.
 *
 * This is an "eligibility indicator" — the amount is NOT included in the total
 * benefits entitlement panel.
 */

import { useState } from 'react'
import { assessEMAEligibility } from '../utils/educationMaintenanceAllowanceCalculator'
import type { EMAResult } from '../types/education-maintenance-allowance'

function convertFromWeekly(weeklyAmount: number, period: string): number {
  switch (period) {
    case 'per_week': return weeklyAmount
    case 'per_2_weeks': return weeklyAmount * 2
    case 'per_4_weeks': return weeklyAmount * 4
    case 'per_month': return (weeklyAmount * 52) / 12
    case 'per_year': return weeklyAmount * 52
    default: return weeklyAmount
  }
}

const PERIOD_LABELS: Record<string, string> = {
  per_week: 'per week',
  per_2_weeks: 'per 2 weeks',
  per_4_weeks: 'per 4 weeks',
  per_month: 'per month',
  per_year: 'per year',
}

interface EducationMaintenanceAllowanceModuleProps {
  data: {
    area: string
    children: number
    childrenInfo?: { age: number; isInFurtherEducation?: boolean }[]
    /** Gross monthly earnings for main claimant */
    monthlyEarnings?: number
    /** Gross monthly earnings for partner */
    partnerMonthlyEarnings?: number
  }
  selectedPeriod?: string
}

export function EducationMaintenanceAllowanceModule({
  data,
  selectedPeriod = 'per_month',
}: EducationMaintenanceAllowanceModuleProps) {
  const result: EMAResult = assessEMAEligibility({
    area: data.area,
    children: data.children,
    childrenInfo: data.childrenInfo,
    monthlyEarnings: data.monthlyEarnings,
    partnerMonthlyEarnings: data.partnerMonthlyEarnings,
  })

  // Don't render if EMA is not available in this country
  if (!result.availableInCountry) return null

  // Don't render if no children are in the EMA age range and none are in FTE
  if (result.totalStudentsInAgeRange === 0 && result.students.length === 0) return null

  // Only render if there are age-range students recorded
  const ageRangeStudents = result.students.filter((s) => s.meetsAgeCriteria)
  if (ageRangeStudents.length === 0) return null

  const displayAmount = convertFromWeekly(result.weeklyAmount, selectedPeriod)
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
      {/* "Other entitlements" section label */}
      <div className="bg-slate-200 border-b border-slate-300 px-4 py-2 flex items-center gap-2">
        <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          Other entitlement — possible eligibility indicated
        </span>
      </div>

      {/* Header — always visible, click to expand */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50 transition-colors"
      >
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Education Maintenance Allowance (EMA)
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">{result.country}</p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {result.eligible ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <span className="text-base leading-none">✓</span> Possibly eligible
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-600">
              <span className="text-base leading-none">✗</span> Not eligible
            </span>
          )}
          <span className="text-sm text-slate-500 font-medium">
            {expanded ? 'Show less' : 'Show more'}
          </span>
          <svg
            className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      {/* Body — shown only when expanded */}
      {expanded && <div className="p-6 space-y-4">

        {/* What is EMA */}
        <div className="text-sm text-gray-700 space-y-1.5">
          <p>
            <strong>Education Maintenance Allowance (EMA)</strong> is a weekly payment to help young people aged 16–19 (16–18 in Wales) stay in full-time further education at a school, college, or training provider.
          </p>
          <p>
            EMA is means-tested and based on household income. It is available in <strong>Wales, Scotland, and Northern Ireland</strong> — it is not available in England. The payment goes directly to the young person.
          </p>
        </div>

        {/* "Not in total" notice */}
        <div className="flex gap-2.5 bg-amber-50 border border-amber-200 rounded-md px-4 py-3 text-sm text-amber-800">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span>
            EMA is paid to the young person, not the household. The amount shown below is <strong>not included</strong> in the total benefits entitlement figure above.
          </span>
        </div>

        {/* Eligibility summary */}
        <p className="text-sm text-gray-700">{result.reason}</p>

        {/* Eligible: show indicative amount */}
        {result.eligible && (
          <div className="border border-slate-200 rounded-md bg-white overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Indicative EMA amount</p>
            </div>
            <div className="px-4 py-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-800">
                £{displayAmount.toFixed(2)}
              </span>
              <span className="text-sm text-slate-500">{PERIOD_LABELS[selectedPeriod]}</span>
              <span className="ml-auto text-xs text-slate-400">
                (£{result.weeklyAmount}/week × {result.eligibleStudentCount} student{result.eligibleStudentCount !== 1 ? 's' : ''})
              </span>
            </div>
          </div>
        )}

        {/* Key facts table */}
        <div className="border border-slate-200 rounded-md overflow-hidden bg-white text-sm">
          <div className="flex justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50">
            <span className="text-gray-500">Annual household income</span>
            <span className="font-medium">£{result.annualHouseholdIncome.toLocaleString()}/year</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 border-b border-slate-100">
            <span className="text-gray-500">Income threshold</span>
            <span className="font-medium">£{result.incomeThreshold.toLocaleString()}/year</span>
          </div>
          <div className="flex justify-between px-4 py-2.5">
            <span className="text-gray-500">Meets income threshold</span>
            <span className={`font-medium ${result.meetsIncomeThreshold ? 'text-green-600' : 'text-red-600'}`}>
              {result.meetsIncomeThreshold ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        {/* Per-student breakdown */}
        {result.students.filter((s) => s.meetsAgeCriteria || s.isInFurtherEducation).length > 0 && (
          <div className="border border-slate-200 rounded-md overflow-hidden bg-white">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Young people in age range</p>
            </div>
            <table className="w-full text-sm">
              <thead className="border-b border-slate-100">
                <tr>
                  <th className="text-left px-3 py-2 text-gray-500 font-medium">Student</th>
                  <th className="text-left px-3 py-2 text-gray-500 font-medium">Age</th>
                  <th className="text-left px-3 py-2 text-gray-500 font-medium">In FTE</th>
                  <th className="text-right px-3 py-2 text-gray-500 font-medium">Eligible</th>
                </tr>
              </thead>
              <tbody>
                {result.students
                  .filter((s) => s.meetsAgeCriteria || s.isInFurtherEducation)
                  .map((student, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="px-3 py-2 text-gray-700">Young person {i + 1}</td>
                      <td className="px-3 py-2 text-gray-700">{student.age}</td>
                      <td className="px-3 py-2 text-gray-700">{student.isInFurtherEducation ? 'Yes' : 'No'}</td>
                      <td className={`px-3 py-2 text-right font-medium ${student.eligible ? 'text-green-600' : 'text-slate-400'}`}>
                        {student.eligible ? 'Yes' : 'No'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* How to apply */}
        <div className="border-t border-slate-200 pt-4 text-sm text-gray-600 space-y-2">
          <p className="font-medium text-gray-700">How to apply</p>
          {result.country === 'Wales' && (
            <p>
              Apply through{' '}
              <a href="https://www.studentfinancewales.co.uk/further-education-funding/education-maintenance-allowance/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Student Finance Wales
              </a>
              . Applications open each summer for the new academic year.
            </p>
          )}
          {result.country === 'Scotland' && (
            <p>
              Apply through your local council. Contact your school or college for details. Applications typically open from July.
            </p>
          )}
          {result.country === 'Northern Ireland' && (
            <p>
              Apply through the Education Authority. Contact your school or college, or visit{' '}
              <a href="https://www.nidirect.gov.uk/articles/education-maintenance-allowance" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                NI Direct
              </a>
              .
            </p>
          )}
          <p className="text-xs text-gray-400 italic">
            Rates shown are for the 2025/26 academic year. EMA is paid directly to the young person.
          </p>
        </div>
      </div>}
    </div>
  )
}
