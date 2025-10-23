import { createFileRoute } from '@tanstack/react-router'
import { useAppForm } from '~/components/Form/use-app-form'

export const Route = createFileRoute('/benefits-calculator/')({
  component: RouteComponent,
})

function RouteComponent() {
  const form = useAppForm({
    defaultValues: {
      postcode: '',
      housing_status: '',
      tax_year: '2025_26',
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
          name="housing_status"
          children={(field) => (
            <field.RadioField
              label="Which best describes your current housing status?"
              options={[
                {
                  label: 'Council or housing association tenant',
                  value: 'council_or_housing_association_tenant',
                },
                { label: 'Tenant - private sector', value: 'tenant__private_sector' },
                { label: 'Mortgage or owned outright', value: 'mortgage_or_owned_outright' },
                { label: 'Shared ownership', value: 'shared_ownership' },
                { label: 'Boarder or lodger', value: 'boarder_or_lodger' },
                { label: 'Supported accommodation', value: 'supported_accommodation' },
                { label: 'Temporary accommodation', value: 'temporary_accommodation' },
                {
                  label: 'Living rent-free with friends/family',
                  value: 'living_rentfree_with_friends_family',
                },
                { label: 'Homeless', value: 'homeless' },
              ]}
            />
          )}
        />

        <form.AppField
          name="tax_year"
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
          name="postcode"
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
