import { Alert } from '~/components/Alert'
import { Button } from '~/components/Button'
import { Form, Fields, Show } from '~/components/Form'
import { Page } from '~/products/shared/Page'

import { useWorkflow } from '../shared/use-workflow'

const HOUSING_STATUS_OPTIONS = [
  { value: 'no_housing_costs', label: 'Living rent-free', isDefault: true },
  { value: 'renting', label: 'Renting' },
  { value: 'homeowner', label: 'Homeowner' },
  { value: 'other', label: 'Other' },
  { value: 'in_prison', label: 'In Prison' },
]

const TAX_YEARS_OPTIONS = [
  { value: '2025_26', label: '2025/26' },
  { value: '2024_25', label: '2024/25' },
  { value: '2023_24', label: '2023/24' },
]

export function WhereYouLive() {
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
          <h1 className="text-3xl font-bold">What are you entitled to?</h1>
          <p className="text-xl text-slate-600 mt-1.5">
            Welcome to entitledto's free benefits calculator.
          </p>
          <p className="mt-3">
            To find out what you might be able to claim enter your details and you'll receive an
            estimate of your entitlement to benefits. If you work for an organisation helping people
            with benefits please see our tools for organisations.
          </p>
          <p className="mt-3 mb-4">
            Before you start, collect together information about your income, savings, pensions and
            existing benefits for you and your partner, if you have one. See how to use the
            calculator for more tips.
          </p>

          <Fields.Radio
            required
            label="Which best describes your current housing status?"
            name="housingStatus"
            defaultValue="no_housing_costs"
            options={HOUSING_STATUS_OPTIONS}
          />

          <Show when={({ formState }) => formState.values.housingStatus === 'renting'}>
            <Fields.Radio
              required
              label="Tenant Type"
              name="tenantType"
              defaultValue="social"
              options={[
                { value: 'social', label: 'Social Housing' },
                { value: 'private', label: 'Private Tenant' },
              ]}
              descriptionBefore="Type of rental accommodation"
            />
          </Show>

          <Show
            when={({ formState }) =>
              formState.values.housingStatus === 'renting' &&
              formState.values.tenantType === 'private'
            }
          >
            <Fields.Select
              required
              label="Please select your Broad Rental Market Area"
              name="brma"
              defaultValue=""
              options={[]}
              descriptionBefore="We'll use your Broad Rental Market Area (BRMA) to set your Local Housing Allowance (LHA) cap. You can also find out about rent levels and LHA rates in other areas using our affordability map."
            />
          </Show>

          <Show when={({ formState }) => formState.values.housingStatus === 'renting'}>
            <Fields.AmountPeriod label="Monthly Rent" name="rent" defaultValue={0} />
          </Show>

          <Show when={({ formState }) => formState.values.housingStatus === 'renting'}>
            <Fields.AmountPeriod label="Service Charges" name="serviceCharges" defaultValue={0} />
          </Show>

          <Show when={({ formState }) => formState.values.housingStatus !== 'no_housing_costs'}>
            <Fields.Radio
              label="Number of Bedrooms"
              name="bedrooms"
              defaultValue={1}
              options={[
                { value: '0', label: 'Studio' },
                { value: '1', label: '1 Bedroom' },
                { value: '2', label: '2 Bedrooms' },
                { value: '3', label: '3 Bedrooms' },
                { value: '4', label: '4 Bedrooms' },
                { value: '5', label: '5+ Bedrooms' },
              ]}
            />
          </Show>

          <Show when={({ formState }) => formState.values.housingStatus !== 'no_housing_costs'}>
            <Fields.NumberInput
              label="Number of Non-Dependants"
              name="nonDependants"
              defaultValue={0}
              inputClassName="max-w-[140px]"
              descriptionBefore="If empty, defaults to 0."
            />
          </Show>

          <Fields.Select
            label="Work out my entitlements for year"
            name="taxYear"
            defaultValue="2025_26"
            options={TAX_YEARS_OPTIONS}
          />

          <Fields.Radio
            label="Area"
            name="area"
            defaultValue="england"
            options={[
              { value: 'england', label: 'England' },
              { value: 'scotland', label: 'Scotland' },
              { value: 'wales', label: 'Wales' },
            ]}
          />

          <Fields.TextInput
            required
            label="What is your postcode?"
            name="postcode"
            inputClassName="max-w-[150px]"
          />
        </Page.Main>

        <Page.Footer nextButton={<Button type="submit">Next →</Button>} />
      </Form>
    </>
  )
}
