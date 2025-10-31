import { useAppForm } from '~/components/Form/use-app-form'

export function CouncilTax() {
  const form = useAppForm({
    defaultValues: {
      CouncilTaxBand: '',
      EligibleDisabilityReduction: false,
      DiscountsApplicable: '25',
      AmountIsCorrect: true,
      CouncilTax: '0',
      CouncilTaxPeriod: '0',
    },
    onSubmit: async ({ value }) => {
      console.log('onSubmit', value)
    },
  })

  return (
    <div className="">
      <h1 className="text-3xl font-bold">Council Tax</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="mt-5"
      >
        <div className="font-bold mb-4">
          <h2 className="text-xl mb-2">Local authority</h2>
          <strong>East Lothian</strong>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6" role="alert">
          In the Council Tax Reduction scheme, only the Council Tax rate is eligible for
          support, not the water and sewerage payments, so don't include these charges here. We
          will provide information about Scotland's Water Charges Reduction Scheme on the
          results page if you qualify.
        </div>

        <form.AppField
          name="CouncilTaxBand"
          children={(field) => (
            <field.SelectField
              label="Council Tax band for property"
              descriptionBefore="If you are unsure you can select 'don't know' and we'll look it up for you. If you are exempt or disregarded from paying Council Tax you can select 'no CT liability' from the options here."
              options={[
                { label: 'Please select', value: '' },
                { label: "Don't Know", value: 'DontKnow' },
                { label: 'no CT liability', value: 'X' },
                { label: 'A', value: 'A' },
                { label: 'B', value: 'B' },
                { label: 'C', value: 'C' },
                { label: 'D', value: 'D' },
                { label: 'E', value: 'E' },
                { label: 'F', value: 'F' },
                { label: 'G', value: 'G' },
                { label: 'H', value: 'H' },
              ]}
            />
          )}
        />

        <form.AppField
          name="EligibleDisabilityReduction"
          defaultValue={false}
          children={(field) => (
            <field.BooleanRadioField
              label="Eligible for disability-related reduction?"
              descriptionBefore="Please select 'yes' if you have already successfully applied for a reduction because you have an extra room or adaptations needed for a disabled person."
            />
          )}
        />

        <form.AppField
          name="DiscountsApplicable"
          children={(field) => (
            <field.SelectField
              label="Discounts applicable"
              descriptionBefore="If you are the only adult in the household you normally qualify for a 25% discount. If no adults count for Council Tax purposes a 50% discount could apply. If you qualify as severely mentally impaired you can select the appropriate discount rate here."
              options={[
                { label: 'none', value: '0' },
                { label: '25%', value: '25' },
                { label: '50%', value: '50' },
                { label: '100%', value: '100' },
              ]}
            />
          )}
        />

        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Council Tax liability</h2>
          <p className="mb-4">
            Based on the information provided we believe this is your Council Tax liability
            after any discounts and reductions but before Council Tax Support is taken off.
          </p>
          <strong className="text-2xl">
            <span>£</span>
            <span>0.00</span>
          </strong>
        </div>

        <form.AppField
          name="AmountIsCorrect"
          defaultValue={true}
          children={(field) => (
            <field.BooleanRadioField
              label="Is the amount shown for your Council Tax liability correct?"
              descriptionBefore="If you are a joint tenant please enter your proportion of the Council Tax here. If your Council Tax liability is different to the amount shown above select 'no' and enter the correct amount."
            />
          )}
        />

        <form.AppField
          name="CouncilTax"
          children={(field) => (
            <field.NumberInputField
              label="Council Tax liability (AFTER any discounts eg, disability, single person)"
              inputClassName="max-w-[140px]"
              descriptionBefore="Please tell us your Council Tax liability after any discounts and reductions but before Council Tax Support is taken off."
            />
          )}
        />

        <form.AppField
          name="CouncilTaxPeriod"
          children={(field) => (
            <field.SelectField
              label="Payment period"
              options={[
                { label: 'Weekly', value: '2' },
                { label: '4 weeks', value: '3' },
                { label: 'Monthly', value: '1' },
                { label: 'Yearly', value: '0' },
              ]}
            />
          )}
        />
      </form>
    </div>
  )
}
