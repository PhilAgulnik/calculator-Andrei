import { useMemo } from 'react'
import { Page } from '~/products/shared/Page'
import { useWorkflow } from '../shared/use-workflow'
import { Form, Fields, Show } from '~/components/Form'
import { Button } from '~/components/Button'
import { Accordion } from '~/components/Accordion'
import { Alert } from '~/components/Alert'
import { STUDENT_EXCEPTION_LABELS } from './types/student-income'
import type { StudentException } from './types/student-income'
import { detectStudentExceptions } from './utils/studentEligibility'

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

  // Use previously saved exceptions if they exist, otherwise use auto-detected ones
  const defaultExceptions = entry?.data?.studentExceptions?.length > 0
    ? entry.data.studentExceptions
    : detectedExceptions

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
            As a full-time student, we need some additional information to work out
            how your student income affects your Universal Credit.
          </p>

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
            descriptionBefore="Under Regulation 14, full-time students can only claim UC if they meet one or more of these conditions. Select all that apply:"
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
            descriptionBefore="This is the maintenance loan from Student Finance to help with living costs. For UC purposes, the maximum loan you are entitled to is used, even if you chose to borrow less."
          />

          <Show when={({ formState }: any) => formState.values.hasStudentLoan === true}>
            <Fields.NumberInput
              label="What is your annual student loan amount?"
              name="studentLoanAnnualAmount"
              defaultValue={0}
              inputClassName="max-w-[200px]"
              descriptionBefore="Enter the maximum maintenance loan amount you are entitled to for the academic year. UC uses the maximum amount you could receive, not necessarily what you chose to take out."
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
                descriptionBefore="Enter the full annual postgraduate loan amount. Only 30% of this will be counted as income for UC purposes (Regulation 69)."
              />
            </Show>
          </Show>

          <Fields.BooleanRadio
            label="Do you have a student grant?"
            name="hasStudentGrant"
            defaultValue={false}
            descriptionBefore="This includes maintenance grants, bursaries or scholarships. Do not include amounts specifically for tuition fees, disability support, travel, books and equipment, childcare or residential study costs, as these are excluded from the UC calculation (Regulation 70)."
          />

          <Show when={({ formState }: any) => formState.values.hasStudentGrant === true}>
            <Fields.NumberInput
              label="What is your annual student grant amount?"
              name="studentGrantAnnualAmount"
              defaultValue={0}
              inputClassName="max-w-[200px]"
              descriptionBefore="Enter the annual amount after excluding: tuition fees, disability-related support, travel expenses, books and equipment, childcare costs, and residential study costs away from your institution."
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

          <Accordion title="How student income affects Universal Credit" open={false}>
            <div className="bg-gray-50 border border-gray-200 rounded p-4 text-sm space-y-3 mt-2">
              <p>Student income is treated as unearned income in UC. This means:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>It is deducted pound-for-pound from your UC entitlement (not subject to the 55% taper rate)</li>
                <li>The first £110 per assessment period is disregarded</li>
                <li>For undergraduate maintenance loans, the maximum loan you could receive is used (even if you borrow less)</li>
                <li>For postgraduate loans, only 30% of the loan amount is counted</li>
                <li>Student grants are included minus excluded amounts (tuition fees, disability support, travel, books, childcare, residential costs)</li>
                <li>Student income is NOT counted during summer holidays after the course ends</li>
              </ul>
              <p className="text-xs text-gray-500 italic mt-2">
                Based on UC Regulations 68-71 (The Universal Credit Regulations 2013).
              </p>
            </div>
          </Accordion>
        </Page.Main>

        <Page.Footer nextButton={<Button type="submit">Next &rarr;</Button>} />
      </Form>
    </>
  )
}
