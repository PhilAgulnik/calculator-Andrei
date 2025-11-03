import { Page } from '~/products/shared/Page'

import { useWorkflow } from '../shared/use-workflow'
import { Form, Fields, Show, ArrayField } from '~/components/Informed'
import { Button } from '~/components/Button'

const CHILDCARE_PERIOD_OPTIONS = [
  { label: 'Weekly', value: '2' },
  { label: '4 weeks', value: '3' },
  { label: 'Monthly', value: '1' },
  { label: 'Yearly', value: '0' },
]

export function Children() {
  const { entry, goToNextPage, updateEntryData }: any = useWorkflow()

  const childrenCount = entry?.data?.children || 0
  const initialValue: any = Array.from({ length: childrenCount }, (_, index) => ({
    name: `Child ${index + 1}`,
    age: 0,
  }))

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

          <Fields.AmountPeriod
            label="Monthly Childcare Costs"
            name="childcareCosts"
            defaultAmount={0}
            defaultPeriod="per_month"
            descriptionBefore="Enter the total monthly cost of childcare for all your children. Universal Credit can help with up to 85% of childcare costs."
          />

          <ArrayField name="childrenInfo" initialValue={initialValue}>
            {() => {
              return (
                <>
                  <ArrayField.Items>
                    {({ index }) => {
                      const childNumber = index + 1

                      return (
                        <>
                          <h2 className="text-2xl font-bold mt-8">Child #{childNumber}</h2>

                          <Fields.NumberInput
                            label="Child's age"
                            name="age"
                            inputClassName="max-w-[120px]"
                            descriptionAfter="If this child is not yet 1 year old, please enter 0 and you will be asked for their date of birth. If this child is not yet born, but you'd like to see your entitlements including them, enter their age as 0 and their date of birth as today."
                          />

                          <Fields.BooleanRadio
                            label={`Does Child ${childNumber} have an illness or disability?`}
                            name="hasDisability"
                            defaultValue={false}
                          />

                          <Show
                            when={({ formState }: any) =>
                              formState.values.childrenInfo?.[index]?.hasDisability === true
                            }
                          >
                            <Fields.BooleanRadio
                              label={`Does Child ${childNumber} claim Disability Living Allowance (DLA)?`}
                              name="claimsDLA"
                              defaultValue={false}
                            />

                            <Show
                              when={({ formState }: any) =>
                                formState.values.childrenInfo?.[index]?.claimsDLA === true
                              }
                            >
                              <Fields.Radio
                                label="DLA Care Component Rate"
                                name="careRate"
                                options={[
                                  { value: 'lowest', label: 'Lowest Rate (£26.90)' },
                                  { value: 'middle', label: 'Middle Rate (£68.10)' },
                                  { value: 'highest', label: 'Highest Rate (£101.75)' },
                                ]}
                              />

                              <Fields.Radio
                                label="DLA Mobility Component Rate"
                                name="mobilityRate"
                                options={[
                                  { value: 'lowest', label: 'Lowest Rate (£26.90)' },
                                  { value: 'highest', label: 'Highest Rate (£71.00)' },
                                ]}
                              />
                            </Show>
                          </Show>
                        </>
                      )
                    }}
                  </ArrayField.Items>
                </>
              )
            }}
          </ArrayField>

          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}
          {/*  */}

          <Fields.BooleanRadio
            label="Do you pay for their childcare?"
            name="payForChildcare"
            defaultValue={false}
            descriptionBefore="The childcare must be with a registered childminder or nursery. This can also include childcare such as summer school and after-school clubs."
          />

          <Fields.BooleanRadio
            label="Does your child receive a disability benefit?"
            name="isDisabledPerson"
            defaultValue={false}
            descriptionBefore="Please answer 'yes' if your child receives Disability Living Allowance, Child Disability Payment or Personal Independence Payment for some aged 16 or over."
          />

          <Show when={({ formState }) => formState.values.IsDisabledPerson === false}>
            <Fields.BooleanRadio
              label="Does your child have an illness or disability but you are not claiming a disability benefit for them?"
              name="isDisabledNotClaiming"
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
