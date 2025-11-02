import { z } from 'zod'

import { useAppForm } from '~/components/Form/use-app-form'
import { Page } from '~/products/shared/Page'
import { useWorkflow } from '../shared/use-workflow'

const HOUSING_STATUS_OPTIONS = [
  {
    label: 'Council or housing association tenant',
    value: 'CouncilTenant',
  },
  { label: 'Tenant - private sector', value: 'TenantPrivateSector' },
  { label: 'Mortgage or owned outright', value: 'MortgageOrOwned' },
  { label: 'Shared ownership', value: 'SharedOwnership' },
  { label: 'Boarder or lodger', value: 'BoarderOrLodger' },
  { label: 'Supported accommodation', value: 'SupportedAccommodation' },
  { label: 'Temporary accommodation', value: 'TemporaryAccommodation' },
  {
    label: 'Living rent-free with friends/family',
    value: 'LivingWithParents',
  },
  { label: 'Homeless', value: 'Homeless' },
]

const CALC_YEARS_OPTIONS = [
  { label: '2023/24', value: '2023_24' },
  { label: '2024/25', value: '2024_25' },
  { label: '2025/26', value: '2025_26' },
]

const schema = z.object({
  NationalHousingStatus: z.enum(
    HOUSING_STATUS_OPTIONS.map((option) => option.value),
    'Please select a housing status'
  ),
  CalcYears: z.enum(
    CALC_YEARS_OPTIONS.map((option) => option.value),
    'Please select a tax year'
  ),
  Postcode: z.string().min(1, 'Please enter a valid postcode'),
})

export function WhereYouLive() {
  const { goToNextPage } = useWorkflow()

  const form = useAppForm({
    defaultValues: {
      Postcode: '',
      NationalHousingStatus: '',
      CalcYears: '2024_25',
    },
    onSubmit: async ({ value, meta }) => {
      console.log('onSubmit', { value, meta })
      goToNextPage()
    },
    validators: {
      onSubmit: schema,
    },
  })

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="contents"
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

          <form.AppField
            name="NationalHousingStatus"
            children={(field) => (
              <field.RadioField
                label="Which best describes your current housing status?"
                options={HOUSING_STATUS_OPTIONS}
              />
            )}
          />

          <form.AppField
            name="CalcYears"
            children={(field) => (
              <field.SelectField
                label="Work out my entitlements for year"
                options={CALC_YEARS_OPTIONS}
              />
            )}
          />

          <form.AppField
            name="Postcode"
            children={(field) => (
              <field.TextInputField label="What is your postcode?" inputClassName="max-w-[150px]" />
            )}
          />

          {/* <form.AppForm>
            <form.FormDebug />
          </form.AppForm> */}
        </Page.Main>

        <Page.Footer
          nextButton={
            <form.AppForm>
              <form.SubmitButton>Next →</form.SubmitButton>
            </form.AppForm>
          }
        />
      </form>
    </>
  )
}
