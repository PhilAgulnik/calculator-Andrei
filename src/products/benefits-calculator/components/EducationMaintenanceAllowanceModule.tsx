/**
 * Education Maintenance Allowance (EMA) Module
 *
 * Displays EMA eligibility assessment for dependent young people (aged 16–19,
 * or 16–18 in Wales) who are in full-time further education.
 *
 * EMA is available in Wales (£40/week), Scotland (£30/week), and Northern Ireland
 * (£30/week). It is NOT available in England.
 */

import { assessEMAEligibility } from '../utils/educationMaintenanceAllowanceCalculator'
import type { EMAResult } from '../types/education-maintenance-allowance'

const EMA_PERIOD_LABELS: Record<string, string> = {
  per_week: 'per week',
  per_2_weeks: 'per 2 weeks',
  per_4_weeks: 'per 4 weeks',
  per_month: 'per month',
  per_year: 'per year',
}

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

  let headerBgClass: string
  let badgeBgClass: string
  let badgeText: string
  let headerMessage: string

  if (result.eligible) {
    headerBgClass = 'bg-green-50 border-green-200'
    badgeBgClass = 'bg-green-100 text-green-800'
    badgeText = '✓ Eligible'
    headerMessage =
      result.eligibleStudentCount === 1
        ? '1 young person is eligible for EMA'
        : `${result.eligibleStudentCount} young people are eligible for EMA`
  } else {
    headerBgClass = 'bg-gray-50 border-gray-200'
    badgeBgClass = 'bg-red-100 text-red-800'
    badgeText = '✗ Not eligible'
    headerMessage = 'Not currently eligible for EMA'
  }

  const areaLabel = result.country

  return (
    <div className="bg-white border border-slate-300 rounded-lg overflow-hidden">
      {/* Header */}
      <div className={`${headerBgClass} border-b p-6`}>
        <h2 className="text-2xl font-semibold mb-2">Education Maintenance Allowance (EMA)</h2>

        {result.eligible && (
          <p className="text-4xl font-bold text-slate-800 mb-2">
            £{displayAmount.toFixed(2)}{' '}
            <span className="text-lg font-normal">{EMA_PERIOD_LABELS[selectedPeriod]}</span>
          </p>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badgeBgClass}`}
          >
            {badgeText}
          </span>
          <span className="text-sm text-gray-600">{headerMessage}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Summary reason */}
        <p className="text-gray-700 mb-5">{result.reason}</p>

        {/* Key facts */}
        <div className="space-y-0 border border-slate-200 rounded-md overflow-hidden mb-5">
          <div className="flex justify-between px-4 py-2.5 border-b border-slate-200 bg-slate-50">
            <span className="text-sm text-gray-600">Country</span>
            <span className="text-sm font-medium">{areaLabel}</span>
          </div>
          <div className="flex justify-between px-4 py-2.5 border-b border-slate-200">
            <span className="text-sm text-gray-600">Annual household income</span>
            <span className="text-sm font-medium">
              £{result.annualHouseholdIncome.toLocaleString()}/year
            </span>
          </div>
          <div className="flex justify-between px-4 py-2.5 border-b border-slate-200">
            <span className="text-sm text-gray-600">Income threshold</span>
            <span className="text-sm font-medium">
              £{result.incomeThreshold.toLocaleString()}/year
            </span>
          </div>
          <div className="flex justify-between px-4 py-2.5 border-b border-slate-200">
            <span className="text-sm text-gray-600">Meets income threshold</span>
            <span
              className={`text-sm font-medium ${
                result.meetsIncomeThreshold ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {result.meetsIncomeThreshold ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between px-4 py-2.5">
            <span className="text-sm text-gray-600">Weekly rate per eligible student</span>
            <span className="text-sm font-medium">£{result.weeklyAmount / Math.max(result.eligibleStudentCount, 1)}/week</span>
          </div>
        </div>

        {/* Per-student breakdown */}
        {result.students.length > 0 && (
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Young people in age range</h3>
            <div className="border border-slate-200 rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="text-left px-3 py-2 text-gray-600 font-medium">Student</th>
                    <th className="text-left px-3 py-2 text-gray-600 font-medium">Age</th>
                    <th className="text-left px-3 py-2 text-gray-600 font-medium">In FTE</th>
                    <th className="text-right px-3 py-2 text-gray-600 font-medium">Eligible</th>
                  </tr>
                </thead>
                <tbody>
                  {result.students
                    .filter((s) => s.meetsAgeCriteria || s.isInFurtherEducation)
                    .map((student, i) => (
                      <tr key={i} className="border-t border-slate-200">
                        <td className="px-3 py-2 text-gray-700">Young person {i + 1}</td>
                        <td className="px-3 py-2 text-gray-700">{student.age}</td>
                        <td className="px-3 py-2 text-gray-700">
                          {student.isInFurtherEducation ? 'Yes' : 'No'}
                        </td>
                        <td
                          className={`px-3 py-2 text-right font-medium ${
                            student.eligible ? 'text-green-600' : 'text-gray-500'
                          }`}
                        >
                          {student.eligible ? 'Yes' : 'No'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Amount breakdown (if eligible) */}
        {result.eligible && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-5">
            <h3 className="text-sm font-semibold text-green-800 mb-3">EMA payment breakdown</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Weekly rate × {result.eligibleStudentCount} student{result.eligibleStudentCount !== 1 ? 's' : ''}
                </span>
                <span className="font-medium">£{result.weeklyAmount}/week</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">4-weekly</span>
                <span className="font-medium">£{result.fourWeeklyAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-green-200 pt-1.5 mt-1">
                <span className="text-gray-600 font-medium">Monthly equivalent</span>
                <span className="font-semibold">£{result.monthlyEquivalent.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Annual</span>
                <span className="font-medium">£{result.annualAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer: application information */}
        <div className="mt-2 border-t border-slate-200 pt-4 text-sm text-gray-600 space-y-2">
          <p className="font-medium text-gray-700">How to apply for EMA</p>
          {result.country === 'Wales' && (
            <p>
              Applications for EMA in Wales are made through{' '}
              <a
                href="https://www.studentfinancewales.co.uk/further-education-funding/education-maintenance-allowance/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Student Finance Wales
              </a>
              . The young person (or their parent/carer if under 18) applies online. Applications
              open each summer for the new academic year.
            </p>
          )}
          {result.country === 'Scotland' && (
            <p>
              Applications for EMA in Scotland are made through your local council. Contact your
              school or college for details. Applications typically open from July for the new
              academic year.
            </p>
          )}
          {result.country === 'Northern Ireland' && (
            <p>
              Applications for EMA in Northern Ireland are made through the Education Authority.
              Contact your school or college for details, or visit the{' '}
              <a
                href="https://www.nidirect.gov.uk/articles/education-maintenance-allowance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                NI Direct website
              </a>
              .
            </p>
          )}
          <p className="text-xs text-gray-500 italic">
            EMA is paid directly to the young person. Income thresholds and rates are for the
            2025/26 academic year. Rates may change in future years.
          </p>
        </div>
      </div>
    </div>
  )
}
