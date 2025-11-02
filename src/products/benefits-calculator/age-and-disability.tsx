import { Page } from '~/products/shared/Page'

import { useWorkflow } from '../shared/use-workflow'
import { Form, Fields } from '~/components/Informed'
import { Button } from '~/components/Button'

const WORK_STATUS_OPTIONS = [
  { value: 'NotEmployed', label: 'Not employed' },
  {
    value: 'NotEmployedButWorkedRecently',
    label: 'Not employed but worked in the last 2 years',
  },
  { value: 'Employed', label: 'Employed' },
  { value: 'EmployedOnStatutoryLeave', label: 'Employed - on statutory leave' },
  { value: 'SelfEmployed', label: 'Self-employed' },
]

const DISBENS_OPTIONS = [
  { value: 'NotClaimed', label: 'No' },
  { value: 'CurrentlyClaiming', label: 'Yes' },
]

export function AgeAndDisability() {
  const { entry, goToNextPage, updateEntryData } = useWorkflow()

  return (
    <>
      <Form
        onSubmit={({ values }) => {
          updateEntryData(values)
          goToNextPage()
        }}
        className="contents"
        initialValues={!!entry ? entry?.data : {}}
      >
        <Page.Main>
          <h1 className="text-3xl font-bold">Age and disability status</h1>

          <Fields.NumberInput
            required
            label="Age"
            name="Age"
            defaultValue={0}
            inputClassName="max-w-[140px]"
            descriptionBefore="Please enter current age. Enter a valid value from 16 to 120."
          />

          <Fields.Radio
            required
            label="Which best describes your employment status?"
            name="ClientWorkStatus"
            defaultValue="NotEmployed"
            options={WORK_STATUS_OPTIONS}
            descriptionBefore={
              <>
                <p>
                  If you are both employed and self-employed, select 'Self-employed' if more than
                  half your income is from self-employment. Otherwise select 'Employed'.
                </p>

                <p>
                  If you are not employed but have worked in the last 2 years we will ask for more
                  information to see if you could get help based on your national insurance
                  contributions.
                </p>
              </>
            }
          />

          <Fields.NumberInput
            required
            label="How many hours a week do you work?"
            name="WeekWorkHoursAmount"
            defaultValue="0"
            inputClassName="max-w-[140px]"
            descriptionBefore="Please enter a valid value from 0 to 168."
          />

          <Fields.Radio
            required
            label="Do you receive a disability or sickness benefit?"
            name="ClientDisbens"
            defaultValue="NotClaimed"
            options={DISBENS_OPTIONS}
            descriptionBefore="Common disability benefits are Attendance Allowance, Pension Age Disability Payment, Disability Living Allowance (DLA), Personal Independence Payment (PIP), Adult Disability Payment, Employment and Support Allowance (ESA), Universal Credit limited capability for work element (LCW/RA) and Statutory Sick Pay (SSP)."
          />

          <Fields.BooleanRadio
            label="Are you ill or disabled but not claiming one of the disability benefits listed below?"
            name="ClientDisabledNotClaiming"
            defaultValue={false}
            descriptionBefore="Answer 'yes' if you have have a health condition that affects your daily living or mobility and would like to find out more about Personal Independence Payment, Adult Disability Payment or Attendance Allowance."
          />

          <Fields.BooleanRadio
            label="Do you care for someone who is sick or disabled?"
            name="ClientCareForDisabled"
            defaultValue={false}
          />
        </Page.Main>

        <Page.Footer nextButton={<Button type="submit">Next →</Button>} />
      </Form>
    </>
  )
}
