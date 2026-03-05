/**
 * Students and Benefits Module
 * Displayed on the results page for all full-time students.
 * Explains student-specific UC rules based on their circumstances,
 * and shows the student income calculation breakdown when relevant.
 */

import { Accordion } from '~/components/Accordion'
import { formatCurrency } from '~/utils/functions'
import { STUDENT_EXCEPTION_LABELS } from '../types/student-income'
import type { StudentException } from '../types/student-income'
import { isSimpleStudentCase } from '../utils/studentEligibility'

export interface StudentsAndBenefitsModuleProps {
  data: any
  calc: any
  selectedPeriod: string
  convertFromMonthly: (amount: number, period: string) => number
}

export function StudentsAndBenefitsModule({
  data,
  calc,
  selectedPeriod,
  convertFromMonthly,
}: StudentsAndBenefitsModuleProps) {
  if (!data?.isFullTimeStudent) return null

  const isSimpleCase = isSimpleStudentCase(data)
  const studentIncomeDetails = calc?.studentIncomeDetails
  const meetsException = studentIncomeDetails?.meetsException ?? false
  const exceptions: StudentException[] = studentIncomeDetails?.exceptions ?? data?.studentExceptions ?? []
  const hasStudentIncome = studentIncomeDetails && studentIncomeDetails.monthlyStudentIncome > 0
  const isInSummerHoliday = data?.isInSummerHoliday === true

  return (
    <div className="bg-white border border-slate-300 rounded-lg overflow-hidden">
      <div className="bg-purple-50 border-b border-purple-200 p-6">
        <h2 className="text-2xl font-semibold mb-1">Students and benefits</h2>
        <p className="text-sm text-gray-600">
          How your student status affects your benefit entitlement
        </p>
      </div>

      <div className="p-6 space-y-4">
        {/* Eligibility summary */}
        <EligibilitySummary
          isSimpleCase={isSimpleCase}
          meetsException={meetsException}
          exceptions={exceptions}
          data={data}
        />

        {/* Student income details — only when relevant */}
        {meetsException && hasStudentIncome && (
          <StudentIncomeBreakdown
            studentIncomeDetails={studentIncomeDetails}
            selectedPeriod={selectedPeriod}
            convertFromMonthly={convertFromMonthly}
          />
        )}

        {/* Context-specific rules */}
        <ContextSpecificRules
          data={data}
          meetsException={meetsException}
          isSimpleCase={isSimpleCase}
          isInSummerHoliday={isInSummerHoliday}
          hasStudentIncome={hasStudentIncome}
        />
      </div>
    </div>
  )
}

function EligibilitySummary({
  isSimpleCase,
  meetsException,
  exceptions,
  data,
}: {
  isSimpleCase: boolean
  meetsException: boolean
  exceptions: StudentException[]
  data: any
}) {
  if (meetsException && exceptions.length > 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="font-semibold text-green-800 mb-2">You may be eligible for UC as a student</p>
        <p className="text-sm text-green-700 mb-2">
          You meet the following exception(s) under Regulation 14 that allow full-time students to claim Universal Credit:
        </p>
        <ul className="list-disc ml-5 space-y-1 text-sm text-green-700">
          {exceptions.map((exc) => (
            <li key={exc}>{STUDENT_EXCEPTION_LABELS[exc]}</li>
          ))}
        </ul>
      </div>
    )
  }

  if (isSimpleCase) {
    const age = data?.age ?? 25
    const parts: string[] = []
    parts.push(`age ${age}`)
    if (data?.circumstances !== 'couple') parts.push('single')
    if (!data?.hasChildren && (!data?.children || data.children === 0)) parts.push('no children')
    if (data?.isDisabled !== 'yes' && data?.claimsDisabilityBenefits !== 'yes') parts.push('no disability benefits')

    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="font-semibold text-amber-800 mb-2">Full-time students are generally not eligible for UC</p>
        <p className="text-sm text-amber-700">
          Based on your circumstances ({parts.join(', ')}), you do not appear to meet any of the
          Regulation 14 exceptions that allow full-time students to claim Universal Credit.
        </p>
      </div>
    )
  }

  // Borderline case — page was shown but no exception selected
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <p className="font-semibold text-amber-800 mb-2">No qualifying exception selected</p>
      <p className="text-sm text-amber-700">
        You did not select any qualifying exception. Full-time students are generally not eligible
        for Universal Credit unless they meet one of the qualifying exceptions under Regulation 14.
      </p>
    </div>
  )
}

function StudentIncomeBreakdown({
  studentIncomeDetails,
  selectedPeriod,
  convertFromMonthly,
}: {
  studentIncomeDetails: any
  selectedPeriod: string
  convertFromMonthly: (amount: number, period: string) => number
}) {
  return (
    <Accordion title="Student income calculation details" open={false}>
      <div className="bg-gray-50 border border-gray-200 rounded p-4 text-sm space-y-3 mt-2">
        <p className="text-gray-700">
          Student income is treated as unearned income and deducted pound-for-pound
          from your UC entitlement.
        </p>
        <div className="bg-white p-3 rounded border border-gray-300">
          <h4 className="font-semibold text-gray-900 mb-2">Calculation Breakdown</h4>
          <div className="grid gap-1 text-sm">
            {studentIncomeDetails.breakdown.annualLoanAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Annual student loan:</span>
                <span className="font-medium">
                  {formatCurrency(studentIncomeDetails.breakdown.annualLoanAmount)}
                </span>
              </div>
            )}
            {studentIncomeDetails.breakdown.annualPostgraduateLoanAmount > 0 && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Annual postgraduate loan:</span>
                  <span className="font-medium">
                    {formatCurrency(studentIncomeDetails.breakdown.annualPostgraduateLoanAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">30% counted for UC:</span>
                  <span className="font-medium">
                    {formatCurrency(studentIncomeDetails.breakdown.postgraduateLoanIncluded)}
                  </span>
                </div>
              </>
            )}
            {studentIncomeDetails.breakdown.annualGrantAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Annual grant (after exclusions):</span>
                <span className="font-medium">
                  {formatCurrency(studentIncomeDetails.breakdown.annualGrantAmount)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-300 pt-1 mt-1">
              <span className="text-gray-600">
                Divided by {studentIncomeDetails.assessmentPeriods} assessment periods:
              </span>
              <span className="font-medium">
                {formatCurrency(studentIncomeDetails.breakdown.dividedByPeriods)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Less £110 disregard:</span>
              <span className="font-medium text-green-600">
                -{formatCurrency(studentIncomeDetails.disregard)}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-300 pt-1 mt-1">
              <span className="text-gray-900 font-semibold">
                Monthly student income deduction:
              </span>
              <span className="font-semibold text-red-600">
                {formatCurrency(studentIncomeDetails.monthlyStudentIncome)}
              </span>
            </div>
          </div>
        </div>

        {studentIncomeDetails.warnings.length > 0 && (
          <div className="bg-yellow-50 p-3 rounded border border-yellow-300">
            {studentIncomeDetails.warnings.map((w: string, i: number) => (
              <p key={i} className="text-sm text-yellow-800">{w}</p>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-600 italic">
          Student income is calculated per assessment period based on UC Regulations 68-71.
          The £110 disregard applies per assessment period. Postgraduate loans are counted
          at 30% of the loan amount.
        </p>
      </div>
    </Accordion>
  )
}

function ContextSpecificRules({
  data,
  meetsException,
  isSimpleCase,
  isInSummerHoliday,
  hasStudentIncome,
}: {
  data: any
  meetsException: boolean
  isSimpleCase: boolean
  isInSummerHoliday: boolean
  hasStudentIncome: boolean
}) {
  const rules: string[] = []

  if (meetsException) {
    if (data?.hasStudentLoan) {
      rules.push(
        'Your maintenance loan is assessed for UC purposes at the maximum amount you could receive, even if you chose to borrow less.'
      )
    }
    if (data?.studentType === 'postgraduate') {
      rules.push(
        'As a postgraduate student, only 30% of your postgraduate loan is counted as income for UC purposes (Regulation 69).'
      )
    }
    if (isInSummerHoliday) {
      rules.push(
        'You are in the summer holiday period after your course has ended. Student income is not counted during this period, so no student income deduction applies.'
      )
    }
    if (data?.hasStudentGrant) {
      rules.push(
        'Your student grant is included after excluding amounts for: tuition fees, disability support, travel, books and equipment, childcare, and residential study costs.'
      )
    }
    if (!hasStudentIncome && !isInSummerHoliday) {
      rules.push(
        'You have not reported any student income (loans or grants). If you do receive student funding, it would be assessed as unearned income and deducted from your UC.'
      )
    }
  } else {
    // Not eligible — explain what would need to change
    rules.push(
      'Full-time students can only claim UC if they meet one of the exceptions under Regulation 14 of the Universal Credit Regulations 2013.'
    )

    if (isSimpleCase) {
      const suggestions: string[] = []
      const age = data?.age ?? 25
      if (age >= 21 && age < 25) {
        suggestions.push('If you were under 21 and in non-advanced education without parental support, you would qualify.')
      }
      if (!data?.hasChildren && (!data?.children || data.children === 0)) {
        suggestions.push('If you were responsible for a child or qualifying young person, you would qualify.')
      }
      if (data?.isDisabled !== 'yes') {
        suggestions.push('If you received PIP, DLA or AA with documented limited capability for work, you would qualify.')
      }
      if (suggestions.length > 0) {
        rules.push('Exceptions that could apply if your circumstances change: ' + suggestions.join(' '))
      }
    }
  }

  if (rules.length === 0) return null

  return (
    <div className="border-t border-slate-200 pt-4">
      <h3 className="font-semibold text-gray-900 mb-2 text-sm">How student rules apply to you</h3>
      <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
        {rules.map((rule, i) => (
          <li key={i}>{rule}</li>
        ))}
      </ul>
      <p className="text-xs text-gray-500 italic mt-3">
        Based on UC Regulations 12-14 (student definition and exceptions) and Regulations 68-71 (student income).
      </p>
    </div>
  )
}
