import { z } from 'zod'

import { useAppForm } from '~/components/Form/use-app-form'
import { Page } from '~/products/shared/Page'

import { useWorkflow } from '../shared/use-workflow'

const PAYMENT_PERIOD_OPTIONS = [
  { label: 'Weekly', value: '2' },
  { label: '4 weeks', value: '3' },
  { label: 'Monthly', value: '1' },
  { label: 'Yearly', value: '0' },
]

const schema = z.object({
  RentAmount: z.string().min(1, 'Please enter your rent amount'),
  RentPeriod: z.string(),
  UCAPA: z.boolean(),
  NumberOfRentFreeWeeks: z.string(),
  SanctuarySchemeBedroomTaxExemption: z.boolean(),
  BedroomsCount: z.string(),
  HasMoreInfoAboutDisabledChilrdren: z.boolean(),
  IncludeExtraBedroom: z.boolean(),
})

export function HousingCosts() {
  const { goToNextPage } = useWorkflow()

  const form = useAppForm({
    defaultValues: {
      RentAmount: '',
      RentPeriod: '2',
      UCAPA: false,
      NumberOfRentFreeWeeks: '0',
      SanctuarySchemeBedroomTaxExemption: false,
      BedroomsCount: '1',
      HasMoreInfoAboutDisabledChilrdren: false,
      IncludeExtraBedroom: false,
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
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="contents"
    >
      <Page.Main>
        <h1 className="text-3xl font-bold">Housing costs</h1>

        <p className="mt-4">
          You may qualify for help with your rent through Housing Benefit / Universal Credit housing
          costs element.
        </p>
        <p className="mt-3">
          Whether you are claiming Housing Benefit or Universal Credit, please enter your eligible
          rent as defined under Housing Benefit rent rules and Universal Credit rent rules.
        </p>

        <form.AppField
          name="RentAmount"
          children={(field) => (
            <field.NumberInputField
              label="How much is your eligible rent?"
              inputClassName="max-w-[140px]"
            />
          )}
        />

        <form.AppField
          name="RentPeriod"
          children={(field) => (
            <field.SelectField
              label="Period"
              options={PAYMENT_PERIOD_OPTIONS}
            />
          )}
        />

        <form.AppField
          name="UCAPA"
          defaultValue={false}
          children={(field) => (
            <field.BooleanRadioField
              label="Is help with housing costs paid directly to your landlord by the DWP?"
              descriptionBefore="If you have or have had trouble paying your rent you may have an Alternative Payment Arrangement. This means you receive a Universal Credit amount for you and your household but help with housing costs is paid directly to your landlord. If this applies to you please say yes to this question. If you are starting a new Universal Credit claim you should normally answer no."
            />
          )}
        />

        <form.AppField
          name="NumberOfRentFreeWeeks"
          children={(field) => (
            <field.NumberInputField
              label="Number of rent-free weeks"
              inputClassName="max-w-[140px]"
              descriptionBefore="If you have rent free weeks please read the help text accessed via the i icon next to this question. Please enter a valid value from 0 to 52."
            />
          )}
        />

        <form.AppField
          name="SanctuarySchemeBedroomTaxExemption"
          defaultValue={false}
          children={(field) => (
            <field.BooleanRadioField label="Do you live in a Sanctuary Scheme amended property?" />
          )}
        />

        <form.AppField
          name="BedroomsCount"
          children={(field) => (
            <field.NumberInputField
              label="How many bedrooms do you currently have?"
              inputClassName="max-w-[140px]"
              descriptionBefore="Please tell us how many bedrooms you have as determined by your landlord. For joint tenants, enter the number of bedrooms you have access to. Benefits to help with housing costs may not be based on your full eligible rent if you are thought to have more bedrooms than you need. Please enter a valid value from 0 to 6."
            />
          )}
        />

        <form.AppField
          name="HasMoreInfoAboutDisabledChilrdren"
          defaultValue={false}
          children={(field) => (
            <field.BooleanRadioField
              label="Would you like more information on when an extra bedroom may be included?"
              descriptionBefore="In some circumstances you may qualify for an extra bedroom when working out how many bedrooms you need. Select 'Yes' to find out more or add an extra bedroom to your entitlement."
            />
          )}
        />

        <form.AppField
          name="IncludeExtraBedroom"
          defaultValue={false}
          children={(field) => (
            <field.BooleanRadioField
              label="Should we include an extra bedroom in your calculation?"
              descriptionBefore={
                <>
                  <p>
                    The number of bedrooms a household needs can be increased in certain
                    circumstances. Special rules affect the following groups:
                  </p>
                  <ul>
                    <li>
                      A disabled adult, child or non-dependant who needs overnight care from a
                      non-resident carer or group of carers
                    </li>
                    <li>
                      An adult couple who are unable to share a room because of a disability or a
                      disabled child who would be expected to share a bedroom but cannot share
                      because of a disability
                    </li>
                    <li>
                      Foster carers between placements if they have fostered a child, or became a
                      foster parent, within the last 12 months.
                    </li>
                    <li>
                      Households with adult children in the armed forces who are away from home
                    </li>
                  </ul>
                  <p>
                    If you qualify under any of these exemptions please say 'yes' to the question
                    below and we will include an extra bedroom in your calculation. The rules in
                    this area are complicated and you may need to take advice on your individual
                    situation.
                  </p>
                </>
              }
            />
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
  )
}
