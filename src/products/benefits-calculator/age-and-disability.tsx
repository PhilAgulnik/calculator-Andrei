import { z } from 'zod'

import { useAppForm } from '~/components/Form/use-app-form'
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

const schema = z.object({
  Age: z
    .number()
    .min(16, 'Age must be between 16 and 120')
    .max(120, 'Age must be between 16 and 120'),
  ClientWorkStatus: z.enum(
    WORK_STATUS_OPTIONS.map((option) => option.value),
    'Please select your employment status'
  ),
  WeekWorkHoursAmount: z.string().min(1, 'Please enter work hours'),
  ClientDisbens: z.enum(
    DISBENS_OPTIONS.map((option) => option.value),
    'Please select an option'
  ),
  ClientDisabledNotClaiming: z.boolean(),
  ClientCareForDisabled: z.boolean(),
})

export function AgeAndDisability() {
  const { goToNextPage } = useWorkflow()

  const form = useAppForm({
    defaultValues: {
      Age: 0,
      ClientWorkStatus: 'NotEmployed',
      WeekWorkHoursAmount: '0',
      ClientDisbens: 'NotClaimed',
      ClientDisabledNotClaiming: false,
      ClientCareForDisabled: false,
    },
    onSubmit: async ({ value }) => {
      console.log('onSubmit', value)
      goToNextPage()
    },
    validators: {
      onSubmit: schema,
    },
  })

  return (
    <>
      <Form
        onSubmit={(values) => {
          console.log('onSubmit', { values })
          goToNextPage()
        }}
        className="contents"
      >
        <Page.Main>
          <h1 className="text-3xl font-bold">Age and disability status</h1>

          <Fields.NumberInput
            required
            label="Age"
            name="Age"
            inputClassName="max-w-[140px]"
            descriptionBefore="Please enter current age. Enter a valid value from 16 to 120."
          />

          <Fields.Radio
            required
            label="Which best describes your employment status?"
            name="ClientWorkStatus"
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
            inputClassName="max-w-[140px]"
            descriptionBefore="Please enter a valid value from 0 to 168."
          />

          <Fields.Radio
            required
            label="Do you receive a disability or sickness benefit?"
            name="ClientDisbens"
            options={DISBENS_OPTIONS}
            descriptionBefore="Common disability benefits are Attendance Allowance, Pension Age Disability Payment, Disability Living Allowance (DLA), Personal Independence Payment (PIP), Adult Disability Payment, Employment and Support Allowance (ESA), Universal Credit limited capability for work element (LCW/RA) and Statutory Sick Pay (SSP)."
          />

          <Fields.BooleanRadio
            label="Are you ill or disabled but not claiming one of the disability benefits listed below?"
            name="ClientDisabledNotClaiming"
            descriptionBefore="Answer 'yes' if you have have a health condition that affects your daily living or mobility and would like to find out more about Personal Independence Payment, Adult Disability Payment or Attendance Allowance."
          />

          <Fields.BooleanRadio
            label="Do you care for someone who is sick or disabled?"
            name="ClientCareForDisabled"
          />
        </Page.Main>

        <Page.Footer nextButton={<Button type="submit">Next →</Button>} />
      </Form>
    </>
  )
}
