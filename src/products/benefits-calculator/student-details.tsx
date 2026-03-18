import { useMemo, useEffect, useRef } from 'react'
import { useFormState, useFormApi } from 'informed'
import { Page } from '~/products/shared/Page'
import { useWorkflow } from '../shared/use-workflow'
import { Form, Fields, Show } from '~/components/Form'
import { Button } from '~/components/Button'
import { Alert } from '~/components/Alert'
import { Accordion } from '~/components/Accordion'
import { STUDENT_EXCEPTION_LABELS } from './types/student-income'
import type { StudentException } from './types/student-income'
import { detectStudentExceptions, detectPartnerStudentExceptions } from './utils/studentEligibility'
import {
  suggestLivingSituation,
  getSuggestedMaxLoan,
  LIVING_SITUATION_LABELS,
  type LivingSituation,
} from './utils/maintenanceLoanRates'

export function StudentDetails() {
  const { entry, goToNextPage, updateEntryData }: any = useWorkflow()

  const exceptionOptions: { value: string; label: string }[] = (
    Object.entries(STUDENT_EXCEPTION_LABELS) as [StudentException, string][]
  ).map(([value, label]) => ({ value, label }))

  // Auto-detect exceptions from data already collected on other pages
  const detectedExceptions = useMemo(() => {
    if (!entry?.data) return []
    return detectStudentExceptions(entry.data)
  }, [entry?.data])

  const detectedPartnerExceptions = useMemo(() => {
    if (!entry?.data) return []
    return detectPartnerStudentExceptions(entry.data)
  }, [entry?.data])

  // Use previously saved exceptions if they exist, otherwise use auto-detected ones
  const defaultExceptions = entry?.data?.studentExceptions?.length > 0
    ? entry.data.studentExceptions
    : detectedExceptions

  const defaultPartnerExceptions = entry?.data?.partnerStudentExceptions?.length > 0
    ? entry.data.partnerStudentExceptions
    : detectedPartnerExceptions

  const isClaimantStudent = entry?.data?.isFullTimeStudent === 'full-time'
  const isPartnerStudent = entry?.data?.partnerIsFullTimeStudent === 'full-time' && entry?.data?.circumstances === 'couple'
  const bothAreStudents = isClaimantStudent && isPartnerStudent

  // Living situation options for maintenance loan guidance
  const livingSituationOptions = (
    Object.entries(LIVING_SITUATION_LABELS) as [LivingSituation, string][]
  ).map(([value, label]) => ({ value, label }))

  // Suggest living situation based on postcode (if available)
  const suggestedLivingSituation = useMemo(() => {
    return suggestLivingSituation(entry?.data?.postcode)
  }, [entry?.data?.postcode])

  return (
    <>
      <Form
        onSubmit={({ values }: any) => {
          updateEntryData(values)
          goToNextPage()
        }}
        className="contents"
        initialValues={!!entry ? entry?.data : {}}
      >
        <Page.Main>
          <h1 className="text-3xl font-bold">Student details</h1>
          <p className="text-gray-600 mt-2">
            {bothAreStudents
              ? 'Both you and your partner are full-time students. We need details about both of your student circumstances to calculate your Universal Credit.'
              : isPartnerStudent
                ? "Your partner is a full-time student. We need details about their student income to calculate your Universal Credit."
                : 'As a full-time student, we need some additional information to work out how your student income affects your Universal Credit.'}
          </p>

          {/* ── Claimant student section ── */}
          {isClaimantStudent && (
            <>
              {bothAreStudents && (
                <h2 className="text-2xl font-semibold mt-6 mb-2">Your student details</h2>
              )}

              {detectedExceptions.length > 0 && (
                <Alert type="info" className="mb-2">
                  Based on the information you've already provided, we've pre-selected the exceptions
                  that may apply to you. Please review and adjust if needed.
                </Alert>
              )}

              <Fields.Checkbox
                label="Do you meet any of these exceptions that allow students to claim UC?"
                name="studentExceptions"
                defaultValue={defaultExceptions}
                layout="vertical"
                options={exceptionOptions}
                descriptionBefore="Full-time students can only claim UC if they meet one or more of these conditions. Select all that apply:"
              />

              <Fields.Radio
                label="What type of student are you?"
                name="studentType"
                defaultValue="undergraduate"
                options={[
                  { value: 'undergraduate', label: 'Undergraduate' },
                  { value: 'postgraduate', label: 'Postgraduate' },
                ]}
              />

              <Fields.BooleanRadio
                label="Do you have a student loan (maintenance loan)?"
                name="hasStudentLoan"
                defaultValue={false}
                descriptionBefore={<>This is the maintenance loan from Student Finance to help with living costs. For UC purposes, the maximum loan you are entitled to is used, even if you chose to borrow less. <a href="https://www.entitledto.co.uk/help/Student_income_Universal_Credit" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Find out more</a></>}
              />

              <Show when={({ formState }: any) => formState.values.hasStudentLoan === true}>
                <Fields.Radio
                  label="Where do you live during term time?"
                  name="studentLivingSituation"
                  defaultValue={entry?.data?.studentLivingSituation || suggestedLivingSituation}
                  options={livingSituationOptions}
                  descriptionBefore="Your living situation determines the maximum maintenance loan you are entitled to. UC uses the maximum amount, even if you chose to borrow less."
                />

                <AutoFilledLoanAmount
                  label="Maximum annual maintenance loan"
                  name="studentLoanAnnualAmount"
                  livingSituationFieldName="studentLivingSituation"
                  defaultLivingSituation={entry?.data?.studentLivingSituation || suggestedLivingSituation}
                />
              </Show>

              <Show when={({ formState }: any) => formState.values.studentType === 'postgraduate'}>
                <Fields.BooleanRadio
                  label="Do you have a postgraduate loan?"
                  name="hasPostgraduateLoan"
                  defaultValue={false}
                  descriptionBefore="This is the postgraduate Masters or Doctoral loan from Student Finance. Only 30% of this loan is counted as income for UC purposes."
                />

                <Show when={({ formState }: any) => formState.values.hasPostgraduateLoan === true}>
                  <Fields.NumberInput
                    label="What is your annual postgraduate loan amount?"
                    name="postgraduateLoanAnnualAmount"
                    defaultValue={0}
                    inputClassName="max-w-[200px]"
                    descriptionBefore={<>Enter the full annual postgraduate loan amount. Only 30% of this will be counted as income for UC purposes. <a href="https://www.entitledto.co.uk/help/Student_income_Universal_Credit" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Find out more</a></>}
                  />
                </Show>
              </Show>

              <Fields.BooleanRadio
                label="Do you receive any student grants or bursaries?"
                name="hasStudentGrant"
                defaultValue={false}
                descriptionBefore={<>This includes grants, bursaries or scholarships related to your course. <a href="https://www.entitledto.co.uk/help/Student_income_Universal_Credit" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Find out more</a></>}
              />

              <Show when={({ formState }: any) => formState.values.hasStudentGrant === true}>
                <Fields.NumberInput
                  label="What is your annual grant amount?"
                  name="studentGrantAnnualAmount"
                  defaultValue={0}
                  inputClassName="max-w-[200px]"
                  descriptionBefore={<>Only include grants that count as income for UC, such as: nursing and midwifery bursaries, care-experienced bursaries, FE bursary maintenance allowances, and dependent's or lone parent's grants paid alongside a student loan. Do <strong>not</strong> include: the special support loan (from 2024/25), tuition fee grants, disability-related grants, travel/books/equipment grants, childcare grants, or grants for residential study costs away from your institution — these are all excluded from the UC calculation.</>}
                />
              </Show>

              <Fields.NumberInput
                label="How many months does your course year cover?"
                name="courseAssessmentPeriods"
                defaultValue={9}
                inputClassName="max-w-[140px]"
                descriptionBefore="Enter the number of months your academic year covers. A typical undergraduate course year is 9 months (September to May). A full calendar year course would be 12 months. Your student income will be divided across these assessment periods."
              />

              <Fields.BooleanRadio
                label="Are you currently in the summer holiday period after your course has ended for the year?"
                name="isInSummerHoliday"
                defaultValue={false}
                descriptionBefore="Student income is not counted during the summer vacation after your course period ends. Vacation periods within the course (e.g. Christmas, Easter) DO still count as part of the course period."
              />
            </>
          )}

          {/* ── Partner student section ── */}
          {isPartnerStudent && (
            <>
              <h2 className="text-2xl font-semibold mt-8 mb-2 border-t border-slate-200 pt-6">
                Partner's student details
              </h2>

              {/* Partner exceptions: active when both are students, informational when only partner is student */}
              {bothAreStudents ? (
                <>
                  {detectedPartnerExceptions.length > 0 && (
                    <Alert type="info" className="mb-2">
                      Based on the information you've already provided, we've pre-selected the exceptions
                      that may apply to your partner. Please review and adjust if needed.
                    </Alert>
                  )}

                  <Fields.Checkbox
                    label="Does your partner meet any of these exceptions that allow students to claim UC?"
                    name="partnerStudentExceptions"
                    defaultValue={defaultPartnerExceptions}
                    layout="vertical"
                    options={exceptionOptions}
                    descriptionBefore="Since both of you are full-time students, at least one of you must meet an exception for the couple to claim UC. Select all that apply to your partner:"
                  />
                </>
              ) : (
                <Alert type="info" className="mb-2">
                  <p>
                    Since you are not a full-time student, your partner does not need to meet an
                    exception — the couple can claim UC through you. However, your partner's student income
                    (loans and grants) will still be taken into account when calculating your UC.
                  </p>
                </Alert>
              )}

              <Fields.Radio
                label="What type of student is your partner?"
                name="partnerStudentType"
                defaultValue="undergraduate"
                options={[
                  { value: 'undergraduate', label: 'Undergraduate' },
                  { value: 'postgraduate', label: 'Postgraduate' },
                ]}
              />

              <Fields.BooleanRadio
                label="Does your partner have a student loan (maintenance loan)?"
                name="partnerHasStudentLoan"
                defaultValue={false}
                descriptionBefore={<>This is the maintenance loan from Student Finance to help with living costs. For UC purposes, the maximum loan you are entitled to is used, even if you chose to borrow less. <a href="https://www.entitledto.co.uk/help/Student_income_Universal_Credit" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Find out more</a></>}
              />

              <Show when={({ formState }: any) => formState.values.partnerHasStudentLoan === true}>
                <Fields.Radio
                  label="Where does your partner live during term time?"
                  name="partnerStudentLivingSituation"
                  defaultValue={entry?.data?.partnerStudentLivingSituation || suggestedLivingSituation}
                  options={livingSituationOptions}
                  descriptionBefore="Your partner's living situation determines the maximum maintenance loan they are entitled to. UC uses the maximum amount, even if they chose to borrow less."
                />

                <AutoFilledLoanAmount
                  label="Partner's maximum annual maintenance loan"
                  name="partnerStudentLoanAnnualAmount"
                  livingSituationFieldName="partnerStudentLivingSituation"
                  defaultLivingSituation={entry?.data?.partnerStudentLivingSituation || suggestedLivingSituation}
                />
              </Show>

              <Show when={({ formState }: any) => formState.values.partnerStudentType === 'postgraduate'}>
                <Fields.BooleanRadio
                  label="Does your partner have a postgraduate loan?"
                  name="partnerHasPostgraduateLoan"
                  defaultValue={false}
                  descriptionBefore="This is the postgraduate Masters or Doctoral loan from Student Finance. Only 30% of this loan is counted as income for UC purposes."
                />

                <Show when={({ formState }: any) => formState.values.partnerHasPostgraduateLoan === true}>
                  <Fields.NumberInput
                    label="What is your partner's annual postgraduate loan amount?"
                    name="partnerPostgraduateLoanAnnualAmount"
                    defaultValue={0}
                    inputClassName="max-w-[200px]"
                    descriptionBefore="Enter the full annual postgraduate loan amount. Only 30% will be counted as income for UC purposes ."
                  />
                </Show>
              </Show>

              <Fields.BooleanRadio
                label="Does your partner receive any student grants or bursaries?"
                name="partnerHasStudentGrant"
                defaultValue={false}
                descriptionBefore={<>This includes grants, bursaries or scholarships related to their course. <a href="https://www.entitledto.co.uk/help/Student_income_Universal_Credit" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">Find out more</a></>}
              />

              <Show when={({ formState }: any) => formState.values.partnerHasStudentGrant === true}>
                <Fields.NumberInput
                  label="What is your partner's annual grant amount?"
                  name="partnerStudentGrantAnnualAmount"
                  defaultValue={0}
                  inputClassName="max-w-[200px]"
                  descriptionBefore={<>Only include grants that count as income for UC, such as: nursing and midwifery bursaries, care-experienced bursaries, FE bursary maintenance allowances, and dependent's or lone parent's grants paid alongside a student loan. Do <strong>not</strong> include: the special support loan (from 2024/25), tuition fee grants, disability-related grants, travel/books/equipment grants, childcare grants, or grants for residential study costs away from your institution — these are all excluded from the UC calculation.</>}
                />
              </Show>

              <Fields.NumberInput
                label="How many months does your partner's course year cover?"
                name="partnerCourseAssessmentPeriods"
                defaultValue={9}
                inputClassName="max-w-[140px]"
                descriptionBefore="Enter the number of months your partner's academic year covers. A typical undergraduate course year is 9 months (September to May)."
              />

              <Fields.BooleanRadio
                label="Is your partner currently in the summer holiday period after their course has ended?"
                name="partnerIsInSummerHoliday"
                defaultValue={false}
                descriptionBefore="Student income is not counted during the summer vacation after the course period ends."
              />
            </>
          )}

        </Page.Main>

        <Page.Footer nextButton={<Button type="submit">Next &rarr;</Button>} />
      </Form>
    </>
  )
}

/**
 * Auto-fills the maintenance loan amount based on the selected living situation,
 * and allows the user to override it if their situation differs.
 * Must be rendered inside an informed <Form>.
 */
function AutoFilledLoanAmount({
  label,
  name,
  livingSituationFieldName,
  defaultLivingSituation,
}: {
  label: string
  name: string
  livingSituationFieldName: string
  defaultLivingSituation: LivingSituation
}) {
  const formState = useFormState() as any
  const formApi = useFormApi()
  const prevLivingSituationRef = useRef<LivingSituation | null>(null)

  const livingSituation: LivingSituation =
    formState.values?.[livingSituationFieldName] || defaultLivingSituation
  const suggestedAmount = getSuggestedMaxLoan(livingSituation)
  const currentAmount = formState.values?.[name] ?? 0

  // Auto-fill when living situation changes
  useEffect(() => {
    if (prevLivingSituationRef.current !== null && prevLivingSituationRef.current !== livingSituation) {
      formApi.setValue(name, getSuggestedMaxLoan(livingSituation))
    }
    prevLivingSituationRef.current = livingSituation
  }, [livingSituation, name, formApi])

  const isOverridden = currentAmount !== 0 && currentAmount !== suggestedAmount

  return (
    <div>
      <Fields.NumberInput
        label={label}
        name={name}
        defaultValue={suggestedAmount}
        inputClassName="max-w-[200px]"
        descriptionBefore={
          <>
            For UC purposes, the DWP always uses the maximum maintenance loan you are entitled to — not the amount you actually borrowed or received. This is set to the standard maximum for your living situation (£{suggestedAmount.toLocaleString('en-GB')}). You can change this if your maximum entitlement is different.
          </>
        }
      />

      {isOverridden && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2 text-sm text-amber-800">
          <p>
            You have entered £{Number(currentAmount).toLocaleString('en-GB')}, which differs from
            the standard maximum of £{suggestedAmount.toLocaleString('en-GB')} for your living situation.
            This is fine if your entitlement is different — see the help section below for common reasons.
          </p>
        </div>
      )}

      <Accordion title="When might my maximum loan be different?" open={false}>
        <div className="mt-2 space-y-3 text-sm text-gray-700">
          <p>
            The amount shown is the standard maximum maintenance loan for England in 2025/26.
            Your actual maximum may be different if:
          </p>
          <ul className="list-disc ml-5 space-y-2">
            <li>
              <strong>You receive Universal Credit or Pension Credit</strong> —
              students receiving these benefits are entitled to a higher maximum maintenance loan
              (e.g. £12,019 instead of £10,544 for living away from home outside London)
            </li>
            <li>
              <strong>You are in your final year</strong> — final year loans are lower because
              they cover a shorter period (typically around two-thirds of the standard rate)
            </li>
            <li>
              <strong>You study in Scotland, Wales, or Northern Ireland</strong> — each nation
              has its own student finance body with different loan rates and grant arrangements.
              Check your entitlement with{' '}
              <a href="https://www.saas.gov.uk/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-900">SAAS (Scotland)</a>,{' '}
              <a href="https://www.studentfinancewales.co.uk/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-900">Student Finance Wales</a>, or{' '}
              <a href="https://www.studentfinanceni.co.uk/" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-900">Student Finance NI</a>
            </li>
            <li>
              <strong>You have a part-time course</strong> — loan amounts are calculated
              differently for part-time students and are usually proportional to the
              full-time equivalent
            </li>
            <li>
              <strong>You are on an NHS-funded, social work, or teacher training course</strong> —
              these may have separate bursary or grant funding arrangements that replace or
              supplement the standard maintenance loan
            </li>
          </ul>
          <div className="border-t border-gray-200 pt-3 space-y-2">
            <p>
              <strong>How UC assesses your loan:</strong> Under{' '}
              <a href="https://www.legislation.gov.uk/uksi/2013/376/regulation/69" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-900">Regulation 69</a>{' '}
              of the Universal Credit Regulations 2013, the DWP uses the maximum maintenance loan you
              are <em>entitled to</em>, not the amount you actually borrowed. This means even if you chose
              to take a reduced loan, or your household income reduced the amount you received, UC is
              calculated as if you had the full maximum. If you are unsure of your maximum entitlement,
              check your Student Finance account or award letter.
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <a
              href="https://www.gov.uk/student-finance/new-fulltime-students"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              GOV.UK: Student finance for new students
            </a>
            {' · '}
            <a
              href="https://www.entitledto.co.uk/help/Student_income_Universal_Credit"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              How student income affects UC
            </a>
            {' · '}
            <a
              href="https://cpag.org.uk/welfare-rights/benefits-scotland/more-info/uc-factsheets/uc-students"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              CPAG: UC and students
            </a>
          </p>
        </div>
      </Accordion>
    </div>
  )
}
