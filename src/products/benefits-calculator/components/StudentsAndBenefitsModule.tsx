/**
 * Students and Benefits Module
 * Displayed on the results page when the claimant and/or partner is a full-time student.
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
  /** When true, renders without the outer card wrapper (for embedding inside the UC panel) */
  embedded?: boolean
}

export function StudentsAndBenefitsModule({
  data,
  calc,
  selectedPeriod,
  convertFromMonthly,
  embedded = false,
}: StudentsAndBenefitsModuleProps) {
  const claimantIsStudent = data?.isFullTimeStudent === true
  const partnerIsStudent = data?.partnerIsFullTimeStudent === true && data?.circumstances === 'couple'

  if (!claimantIsStudent && !partnerIsStudent) return null

  const bothAreStudents = claimantIsStudent && partnerIsStudent
  const isSimpleCase = isSimpleStudentCase(data)
  const studentIncomeDetails = calc?.studentIncomeDetails
  const partnerStudentIncomeDetails = calc?.partnerStudentIncomeDetails
  const claimantMeetsException = studentIncomeDetails?.meetsException ?? false
  const partnerMeetsException = partnerStudentIncomeDetails?.meetsException ?? false
  const claimantExceptions: StudentException[] = studentIncomeDetails?.exceptions ?? data?.studentExceptions ?? []
  const partnerExceptions: StudentException[] = partnerStudentIncomeDetails?.exceptions ?? data?.partnerStudentExceptions ?? []
  const hasClaimantStudentIncome = studentIncomeDetails && studentIncomeDetails.monthlyStudentIncome > 0
  const hasPartnerStudentIncome = partnerStudentIncomeDetails && partnerStudentIncomeDetails.monthlyStudentIncome > 0
  const isInSummerHoliday = data?.isInSummerHoliday === true
  const partnerIsInSummerHoliday = data?.partnerIsInSummerHoliday === true

  // Determine overall eligibility
  const isEligible = !calc?.studentIneligible

  const content = (
    <div className={embedded ? "space-y-4" : "p-6 space-y-4"}>
      {isEligible ? (
        <>
          {/* Couple where only one is student: explain why eligible */}
          {!bothAreStudents && data?.circumstances === 'couple' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                {claimantIsStudent
                  ? 'Since your partner is not a full-time student, your couple can claim UC without needing a student exception. However, your student income is still taken into account.'
                  : 'Since you are not a full-time student, your couple can claim UC through you. However, your partner\'s student income is still taken into account.'}
              </p>
            </div>
          )}

          {/* Claimant eligible summary (when claimant is student) */}
          {claimantIsStudent && claimantMeetsException && (
            <EligibleSummary
              exceptions={claimantExceptions}
              label={bothAreStudents ? 'You are' : undefined}
            />
          )}

          {/* Partner eligible summary (when both are students) */}
          {bothAreStudents && partnerMeetsException && (
            <EligibleSummary
              exceptions={partnerExceptions}
              label="Your partner is"
            />
          )}

          {/* Claimant income breakdown */}
          {hasClaimantStudentIncome && (
            <StudentIncomeBreakdown
              studentIncomeDetails={studentIncomeDetails}
              selectedPeriod={selectedPeriod}
              convertFromMonthly={convertFromMonthly}
              label={bothAreStudents || partnerIsStudent ? 'Your student income' : undefined}
            />
          )}

          {/* Partner income breakdown */}
          {hasPartnerStudentIncome && (
            <StudentIncomeBreakdown
              studentIncomeDetails={partnerStudentIncomeDetails}
              selectedPeriod={selectedPeriod}
              convertFromMonthly={convertFromMonthly}
              label="Partner's student income"
            />
          )}

          {/* Rules for claimant */}
          {claimantIsStudent && (
            <EligibleRules
              data={data}
              isInSummerHoliday={isInSummerHoliday}
              hasStudentIncome={hasClaimantStudentIncome}
              label={bothAreStudents ? 'your' : undefined}
            />
          )}

          {/* Rules for partner */}
          {partnerIsStudent && (
            <EligibleRules
              data={{
                hasStudentLoan: data?.partnerHasStudentLoan,
                studentType: data?.partnerStudentType,
                hasStudentGrant: data?.partnerHasStudentGrant,
              }}
              isInSummerHoliday={partnerIsInSummerHoliday}
              hasStudentIncome={hasPartnerStudentIncome}
              label="your partner's"
            />
          )}
        </>
      ) : (
        // Ineligible: show explanation
        <IneligibleExplanation
          data={data}
          isSimpleCase={isSimpleCase}
          bothAreStudents={bothAreStudents}
        />
      )}
    </div>
  )

  if (embedded) {
    return (
      <div className="pt-2">
        <h3 className="text-lg font-semibold mb-3">Students and benefits</h3>
        {content}
      </div>
    )
  }

  return (
    <div className="bg-white border border-slate-300 rounded-lg overflow-hidden">
      <div className="bg-purple-50 border-b border-purple-200 p-6">
        <h2 className="text-2xl font-semibold mb-1">Students and benefits</h2>
        <p className="text-sm text-gray-600">
          How {bothAreStudents ? 'your student status' : partnerIsStudent && !claimantIsStudent ? "your partner's student status" : 'your student status'} affects your benefit entitlement
        </p>
      </div>
      {content}
    </div>
  )
}

/** Shown when a student meets an exception */
function EligibleSummary({ exceptions, label }: { exceptions: StudentException[]; label?: string }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <p className="font-semibold text-green-800 mb-2">
        {label
          ? `${label} eligible for UC as a student`
          : 'Based on the information entered you are eligible for UC as a student'}
      </p>
      <p className="text-sm text-green-700 mb-2">
        {label ? `${label.charAt(0).toUpperCase() + label.slice(1)} meet` : 'You meet'} the following exception(s) that allow full-time students to claim Universal Credit:
      </p>
      <ul className="list-disc ml-5 space-y-1 text-sm text-green-700">
        {exceptions.map((exc) => (
          <li key={exc}>{STUDENT_EXCEPTION_LABELS[exc]}</li>
        ))}
      </ul>
    </div>
  )
}

/** Context-specific rules for eligible students */
function EligibleRules({
  data,
  isInSummerHoliday,
  hasStudentIncome,
  label,
}: {
  data: any
  isInSummerHoliday: boolean
  hasStudentIncome: boolean
  label?: string
}) {
  const rules: string[] = []
  const possessive = label || 'your'

  if (data?.hasStudentLoan) {
    rules.push(
      `The maintenance loan is assessed for UC purposes at the maximum amount ${possessive === 'your' ? 'you' : 'they'} could receive, even if ${possessive === 'your' ? 'you' : 'they'} chose to borrow less.`
    )
  }
  if (data?.studentType === 'postgraduate') {
    rules.push(
      `As a postgraduate student, only 30% of ${possessive} postgraduate loan is counted as income for UC purposes.`
    )
  }
  if (isInSummerHoliday) {
    rules.push(
      `${possessive === 'your' ? 'You are' : 'Your partner is'} in the summer holiday period after the course has ended. Student income is not counted during this period.`
    )
  }
  if (data?.hasStudentGrant) {
    rules.push(
      `${possessive.charAt(0).toUpperCase() + possessive.slice(1)} student grant is included after excluding amounts for: tuition fees, disability support, travel, books and equipment, childcare, and residential study costs.`
    )
  }
  if (!hasStudentIncome && !isInSummerHoliday) {
    rules.push(
      `No student income (loans or grants) has been reported for ${possessive === 'your' ? 'you' : 'your partner'}. If student funding is received, it would be assessed as unearned income and deducted from UC.`
    )
  }

  if (rules.length === 0) return null

  return (
    <div className="border-t border-slate-200 pt-4">
      <h3 className="font-semibold text-gray-900 mb-2 text-sm">
        How student rules apply to {possessive === 'your' ? 'you' : 'your partner'}
      </h3>
      <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700">
        {rules.map((rule, i) => (
          <li key={i}>{rule}</li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Explanation for ineligible students.
 * Combines the "not eligible" message with suggestions about what could change.
 */
function IneligibleExplanation({
  data,
  isSimpleCase,
  bothAreStudents,
}: {
  data: any
  isSimpleCase: boolean
  bothAreStudents: boolean
}) {
  const age = data?.age ?? 25
  const suggestions: string[] = []

  if (bothAreStudents) {
    suggestions.push('At least one of you having a qualifying exception (see below)')
  }

  if (age >= 21 && age < 25) {
    suggestions.push('Being under 21 and in non-advanced education without parental support')
  }
  if (!data?.hasChildren && (!data?.children || data.children === 0)) {
    suggestions.push('Being responsible for a child or qualifying young person')
  }
  if (data?.isDisabled !== 'yes' && data?.claimsDisabilityBenefits !== 'yes') {
    suggestions.push('Receiving PIP, DLA or AA with documented limited capability for work')
  }
  if (data?.circumstances !== 'couple') {
    suggestions.push('Being part of a couple where both are students and one cares for a child')
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-3">
      <p className="font-semibold text-amber-800">
        {bothAreStudents
          ? 'Both members of the couple are full-time students — not eligible for Universal Credit'
          : 'Full-time students are not eligible for Universal Credit'}
      </p>
      <p className="text-sm text-amber-700">
        {bothAreStudents
          ? 'When both members of a couple are full-time students, at least one must meet a Regulation 14 exception to claim UC. No qualifying exception was selected.'
          : isSimpleCase
            ? `Based on your circumstances (age ${age}, ${data?.circumstances !== 'couple' ? 'single' : 'couple'}, ${!data?.hasChildren && (!data?.children || data.children === 0) ? 'no children' : 'with children'}, ${data?.isDisabled !== 'yes' ? 'no disability benefits' : 'with disability'}), you do not meet any of the exceptions that allow students to claim UC.`
            : 'You did not select any qualifying exception on the student details page.'}
      </p>

      {suggestions.length > 0 && (
        <>
          <p className="text-sm text-amber-700 font-medium">
            Exceptions that could apply if your circumstances change:
          </p>
          <ul className="list-disc ml-5 space-y-1 text-sm text-amber-700">
            {suggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function StudentIncomeBreakdown({
  studentIncomeDetails,
  selectedPeriod,
  convertFromMonthly,
  label,
}: {
  studentIncomeDetails: any
  selectedPeriod: string
  convertFromMonthly: (amount: number, period: string) => number
  label?: string
}) {
  const title = label
    ? `${label} calculation details`
    : 'Student income calculation details'

  return (
    <Accordion title={title} open={false}>
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
          The £110 disregard applies per assessment period. Postgraduate loans are counted
          at 30% of the loan amount.
        </p>
      </div>
    </Accordion>
  )
}
