import { createFileRoute } from '@tanstack/react-router'
import { useAppForm } from '~/components/Form/use-app-form'

export const Route = createFileRoute('/benefits-calculator/')({
  component: RouteComponent,
})

function RouteComponent() {
  const form = useAppForm({
    defaultValues: {
      Postcode: '',
      NationalHousingStatus: '',
      CalcYears: '22',
    },
    onSubmit: async ({ value }) => {
      console.log('onSubmit', value)
    },
  })

  return (
    <div className="">
      <h1 className="text-3xl font-bold">What are you entitled to?</h1>
      <p className="text-xl text-slate-600 mt-1.5">
        Welcome to entitledto's free benefits calculator.
      </p>
      <p className="mt-3">
        To find out what you might be able to claim enter your details and you'll receive an
        estimate of your entitlement to benefits. If you work for an organisation helping people
        with benefits please see our tools for organisations.
      </p>
      <p className="mt-3">
        Before you start, collect together information about your income, savings, pensions and
        existing benefits for you and your partner, if you have one. See how to use the calculator
        for more tips.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="mt-5"
      >
        <form.AppField
          name="NationalHousingStatus"
          children={(field) => (
            <field.RadioField
              label="Which best describes your current housing status?"
              options={[
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
              ]}
            />
          )}
        />

        <form.AppField
          name="CalcYears"
          children={(field) => (
            <field.SelectField
              label="Work out my entitlements for year"
              options={[
                { label: '2023/24', value: '2023_24' },
                { label: '2024/25', value: '2024_25' },
                { label: '2025/26', value: '2025_26' },
              ]}
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
      </form>
    </div>
  )
}
