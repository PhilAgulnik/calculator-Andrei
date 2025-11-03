import { Page } from '~/products/shared/Page'

import { useWorkflow } from '../shared/use-workflow'
import { Form, Fields, Show } from '~/components/Informed'
import { Button } from '~/components/Button'

const CHILDCARE_PERIOD_OPTIONS = [
  { label: 'Weekly', value: '2' },
  { label: '4 weeks', value: '3' },
  { label: 'Monthly', value: '1' },
  { label: 'Yearly', value: '0' },
]

export function Children() {
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
          <h1 className="text-3xl font-bold">About your children</h1>

          <Fields.NumberInput
            required
            label="Child's age"
            name="Age"
            defaultValue={0}
            inputClassName="max-w-[140px]"
            descriptionBefore="If this child is not yet 1 year old, please enter 0 and you will be asked for their date of birth. If this child is not yet born, but you'd like to see your entitlements including them, enter their age as 0 and their date of birth as today."
          />

          <Show
            when={({ formState }) => formState.values.Age === 0 || formState.values.Age === '0'}
          >
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Please enter child's date of birth</h2>

              <div className="flex gap-3">
                <Fields.NumberInput
                  label="Day"
                  name="DOB_Day"
                  inputClassName="max-w-[80px]"
                  descriptionAfter="DD"
                />
                <Fields.NumberInput
                  label="Month"
                  name="DOB_Month"
                  inputClassName="max-w-[80px]"
                  descriptionAfter="MM"
                />
                <Fields.NumberInput
                  label="Year"
                  name="DOB_Year"
                  inputClassName="max-w-[120px]"
                  descriptionAfter="YYYY"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                <p>
                  Please enter the date your child was born in the form above. At the moment we are
                  unable to calculate benefits for children who are yet to be born. So if you are
                  pregnant and would like to see your benefits including this child, please enter
                  today's date as their date of birth.
                </p>
              </div>
            </div>
          </Show>

          <Fields.BooleanRadio
            label="Do you pay for their childcare?"
            name="PayForChildcare"
            defaultValue={false}
            descriptionBefore="The childcare must be with a registered childminder or nursery. This can also include childcare such as summer school and after-school clubs."
          />

          <Fields.AmountPeriod
            required
            label="Childcare Costs"
            name="ChildcareCosts"
            defaultAmount={0}
            defaultPeriod="per_month"
          />

          <Fields.BooleanRadio
            label="Does your child receive a disability benefit?"
            name="IsDisabledPerson"
            defaultValue={false}
            descriptionBefore="Please answer 'yes' if your child receives Disability Living Allowance, Child Disability Payment or Personal Independence Payment for some aged 16 or over."
          />

          <Show when={({ formState }) => formState.values.IsDisabledPerson === false}>
            <Fields.BooleanRadio
              label="Does your child have an illness or disability but you are not claiming a disability benefit for them?"
              name="IsDisabledNotClaiming"
              defaultValue={false}
              descriptionBefore="Please answer 'yes' if your child has an illness, disability or behavioural problem which means they have mobility or care needs but does not receive a disability benefit."
            />
          </Show>
        </Page.Main>

        <Page.Footer nextButton={<Button type="submit">Next →</Button>} />
      </Form>
    </>
  )
}
