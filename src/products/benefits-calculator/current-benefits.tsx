import { z } from 'zod'

import { useAppForm } from '~/components/Form/use-app-form'
import { Page } from '~/products/shared/Page'

import { useWorkflow } from '../shared/use-workflow'

const CONTRIBUTORY_BENEFIT_OPTIONS = [
  { label: 'None', value: 'none' },
  { label: "Contributory Jobseeker's Allowance", value: 'contributory_jsa' },
  {
    label: 'Contributory Employment and Support Allowance',
    value: 'contributory_esa',
  },
  { label: "New-style Jobseeker's Allowance", value: 'newstyle_jsa' },
  { label: 'New-style Employment and Support Allowance', value: 'newstyle_esa' },
]

const PAYMENT_PERIOD_OPTIONS = [
  { label: 'Weekly', value: 'weekly' },
  { label: '4 weekly', value: '4weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
]

const WAR_PENSION_OPTIONS = [
  { label: 'No', value: 'wp_none' },
  { label: 'Yes, with Constant Attendance Allowance', value: 'wp_caa' },
  { label: 'Yes, with Mobility Supplement', value: 'wp_mobility' },
  { label: 'Yes, with Unemployability Supplement', value: 'wp_unsup' },
  { label: 'Yes, with Allowance for Lowered Standard of Occupation', value: 'wp_also' },
  { label: "Yes, War Widower's Pension", value: 'wp_widower' },
  { label: 'Yes, Other rate', value: 'wp_other' },
]

const schema = z.object({
  GetsUniversalCredit: z.boolean(),
  UniversalCreditAmount: z.string(),
  HasTransitionalElement: z.boolean(),
  GetsIncomeRelatedESA: z.boolean(),
  ContributoryBenefit: z.string(),
  PartnerContributoryBenefit: z.string(),
  GetsCarersAllowance: z.boolean(),
  CarersAllowanceAmount: z.string(),
  CarersAllowancePeriod: z.string(),
  PartnerGetsCarersAllowance: z.boolean(),
  PartnerCarersAllowanceAmount: z.string(),
  PartnerCarersAllowancePeriod: z.string(),
  GetsGuardiansAllowance: z.boolean(),
  GuardiansAllowanceAmount: z.string(),
  GuardiansAllowancePeriod: z.string(),
  GetsMaternityAllowance: z.boolean(),
  MaternityAllowanceAmount: z.string(),
  MaternityAllowancePeriod: z.string(),
  GetsStatutoryPay: z.boolean(),
  StatutoryPayAmount: z.string(),
  StatutoryPayPeriod: z.string(),
  GetsOccupationalPay: z.boolean(),
  OccupationalPayAmount: z.string(),
  OccupationalPayPeriod: z.string(),
  WarPensionOptions: z.any(),
  GetsArmedForcesCompensation: z.boolean(),
  GetsServicePension: z.boolean(),
  GetsBereavementSupport: z.boolean(),
  BereavementSupportAmount: z.string(),
  BereavementSupportPeriod: z.string(),
  GetsWidowedParent: z.boolean(),
  WidowedParentAmount: z.string(),
  WidowedParentPeriod: z.string(),
})

export function CurrentBenefits() {
  const { goToNextPage } = useWorkflow()

  const form = useAppForm({
    defaultValues: {
      GetsUniversalCredit: false,
      UniversalCreditAmount: '0',
      HasTransitionalElement: false,
      GetsIncomeRelatedESA: false,
      ContributoryBenefit: 'none',
      PartnerContributoryBenefit: 'none',
      GetsCarersAllowance: false,
      CarersAllowanceAmount: '0',
      CarersAllowancePeriod: 'weekly',
      PartnerGetsCarersAllowance: false,
      PartnerCarersAllowanceAmount: '0',
      PartnerCarersAllowancePeriod: 'weekly',
      GetsGuardiansAllowance: false,
      GuardiansAllowanceAmount: '0',
      GuardiansAllowancePeriod: 'weekly',
      GetsMaternityAllowance: false,
      MaternityAllowanceAmount: '0',
      MaternityAllowancePeriod: 'weekly',
      GetsStatutoryPay: false,
      StatutoryPayAmount: '0',
      StatutoryPayPeriod: 'weekly',
      GetsOccupationalPay: false,
      OccupationalPayAmount: '0',
      OccupationalPayPeriod: 'weekly',
      WarPensionOptions: null as any,
      GetsArmedForcesCompensation: false,
      GetsServicePension: false,
      GetsBereavementSupport: false,
      BereavementSupportAmount: '0',
      BereavementSupportPeriod: 'weekly',
      GetsWidowedParent: false,
      WidowedParentAmount: '0',
      WidowedParentPeriod: 'weekly',
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
        <h1 className="text-3xl font-bold">Current benefits</h1>

        <form.AppField
          name="GetsUniversalCredit"
          children={(field) => <field.BooleanRadioField label="Do you get Universal Credit?" />}
        />

        <form.AppField
          name="UniversalCreditAmount"
          children={(field) => (
            <field.NumberInputField
              label="Monthly Universal Credit payment received in last assessment period"
              inputClassName="max-w-[200px]"
            />
          )}
        />

        <form.AppField
          name="HasTransitionalElement"
          children={(field) => (
            <field.BooleanRadioField
              label="Do you get a transitional element in your Universal Credit award?"
              descriptionBefore="You may get a transitional element if you moved onto Universal Credit from your old benefits after receiving a migration notice."
            />
          )}
        />

        <form.AppField
          name="GetsIncomeRelatedESA"
          children={(field) => (
            <field.BooleanRadioField label="Do you get income-related Employment and Support Allowance (ESA)?" />
          )}
        />

        <form.AppField
          name="GetsIncomeRelatedESA"
          children={(field) => (
            <field.BooleanRadioField label="Do you get income-related Employment and Support Allowance (ESA)?" />
          )}
        />

        <form.AppField
          name="UniversalCreditAmount"
          children={(field) => (
            <field.NumberInputField
              label="Monthly Universal Credit payment received in last assessment period"
              inputClassName="max-w-[200px]"
            />
          )}
        />

        <form.AppField
          name="HasTransitionalElement"
          children={(field) => (
            <field.BooleanRadioField
              label="Do you get a transitional element in your Universal Credit award?"
              descriptionBefore="You may get a transitional element if you moved onto Universal Credit from your old benefits after receiving a migration notice."
            />
          )}
        />

        <form.AppField
          name="ContributoryBenefit"
          children={(field) => (
            <field.SelectField
              label="Which contributory benefit, if any, do you currently receive?"
              options={CONTRIBUTORY_BENEFIT_OPTIONS}
            />
          )}
        />

        <form.AppField
          name="PartnerContributoryBenefit"
          children={(field) => (
            <field.SelectField
              label="Which contributory benefit, if any, does your partner currently receive?"
              options={CONTRIBUTORY_BENEFIT_OPTIONS}
            />
          )}
        />

        <form.AppField
          name="GetsCarersAllowance"
          children={(field) => (
            <field.BooleanRadioField
              label="Do you currently receive Carer's Allowance?"
              descriptionBefore="You may be getting this if you care for someone receiving a disability benefit."
            />
          )}
        />

        <form.AppField
          name="CarersAllowanceAmount"
          children={(field) => (
            <field.NumberInputField
              label="Carer's Allowance income"
              inputClassName="max-w-[200px]"
            />
          )}
        />

        <form.AppField
          name="CarersAllowancePeriod"
          children={(field) => (
            <field.SelectField label="Period" options={PAYMENT_PERIOD_OPTIONS} />
          )}
        />

        <form.AppField
          name="PartnerGetsCarersAllowance"
          children={(field) => (
            <field.BooleanRadioField
              label="Does your partner currently receive Carer's Allowance?"
              descriptionBefore="Your partner may be getting this if s/he cares for someone receiving a disability benefit."
            />
          )}
        />

        <form.AppField
          name="PartnerCarersAllowanceAmount"
          children={(field) => (
            <field.NumberInputField
              label="Carer's Allowance income"
              inputClassName="max-w-[200px]"
            />
          )}
        />

        <form.AppField
          name="PartnerCarersAllowancePeriod"
          children={(field) => (
            <field.SelectField label="Period" options={PAYMENT_PERIOD_OPTIONS} />
          )}
        />

        <form.AppField
          name="GetsGuardiansAllowance"
          children={(field) => <field.BooleanRadioField label="Do you get Guardian's Allowance?" />}
        />

        <form.AppField
          name="GuardiansAllowanceAmount"
          children={(field) => (
            <field.NumberInputField label="Income amount" inputClassName="max-w-[200px]" />
          )}
        />

        <form.AppField
          name="GuardiansAllowancePeriod"
          children={(field) => (
            <field.SelectField label="Period" options={PAYMENT_PERIOD_OPTIONS} />
          )}
        />

        <form.AppField
          name="GetsMaternityAllowance"
          children={(field) => <field.BooleanRadioField label="Do you get Maternity Allowance?" />}
        />

        <form.AppField
          name="MaternityAllowanceAmount"
          children={(field) => (
            <field.NumberInputField label="Income amount" inputClassName="max-w-[200px]" />
          )}
        />

        <form.AppField
          name="MaternityAllowancePeriod"
          children={(field) => (
            <field.SelectField label="Period" options={PAYMENT_PERIOD_OPTIONS} />
          )}
        />

        <form.AppField
          name="GetsStatutoryPay"
          children={(field) => (
            <field.BooleanRadioField label="Do you get Statutory Maternity, Paternity or Adoption pay?" />
          )}
        />

        <form.AppField
          name="StatutoryPayAmount"
          children={(field) => (
            <field.NumberInputField label="Income amount" inputClassName="max-w-[200px]" />
          )}
        />

        <form.AppField
          name="StatutoryPayPeriod"
          children={(field) => (
            <field.SelectField label="Period" options={PAYMENT_PERIOD_OPTIONS} />
          )}
        />

        <form.AppField
          name="GetsOccupationalPay"
          children={(field) => (
            <field.BooleanRadioField
              label="Do you get Occupational Maternity Pay or Occupational Paternity Pay?"
              descriptionBefore="Do not include the Statutory Maternity, Paternity or Adoption pay you receive here or it will be counted twice."
            />
          )}
        />

        <form.AppField
          name="OccupationalPayAmount"
          children={(field) => (
            <field.NumberInputField label="Income amount" inputClassName="max-w-[200px]" />
          )}
        />

        <form.AppField
          name="OccupationalPayPeriod"
          children={(field) => (
            <field.SelectField label="Period" options={PAYMENT_PERIOD_OPTIONS} />
          )}
        />

        {/* <form.AppField
          name="WarPensionOptions"
          children={(field) => (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Do you get a War Pension or War Widower's Pension?
              </h3>
              <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
              <div className="space-y-2">
                {[
                  { value: 'none', label: 'No' },
                  { value: 'caa', label: 'Yes, with Constant Attendance Allowance' },
                  { value: 'mobility', label: 'Yes, with Mobility Supplement' },
                  { value: 'unsup', label: 'Yes, with Unemployability Supplement' },
                  {
                    value: 'also',
                    label: 'Yes, with Allowance for Lowered Standard of Occupation',
                  },
                  { value: 'widower', label: "Yes, War Widower's Pension" },
                  { value: 'other', label: 'Yes, Other rate' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={field.state.value?.includes(option.value) || false}
                      onChange={(e) => {
                        const currentValue = field.state.value || []
                        if (e.target.checked) {
                          if (option.value === 'none') {
                            field.handleChange([option.value])
                          } else {
                            const newValue = currentValue.filter((v) => v !== 'none')
                            field.handleChange([...newValue, option.value])
                          }
                        } else {
                          field.handleChange(currentValue.filter((v) => v !== option.value))
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        /> */}

        <form.AppField
          name="WarPensionOptions"
          children={(field) => (
            <field.CheckboxField
              label="Do you get a War Pension or War Widower's Pension?"
              options={WAR_PENSION_OPTIONS}
              layout="vertical"
            />
          )}
        />

        <form.AppField
          name="GetsArmedForcesCompensation"
          children={(field) => (
            <field.BooleanRadioField label="Do you get Armed Forces Compensation?" />
          )}
        />

        <form.AppField
          name="GetsServicePension"
          children={(field) => (
            <field.BooleanRadioField label="Do you get a Service Attributable Pension?" />
          )}
        />

        <form.AppField
          name="GetsBereavementSupport"
          children={(field) => (
            <field.BooleanRadioField label="Do you get a Bereavement Support Payment?" />
          )}
        />

        <form.AppField
          name="BereavementSupportAmount"
          children={(field) => (
            <field.NumberInputField
              label="Bereavement Support Payment income"
              inputClassName="max-w-[200px]"
            />
          )}
        />

        <form.AppField
          name="BereavementSupportPeriod"
          children={(field) => (
            <field.SelectField label="Period" options={PAYMENT_PERIOD_OPTIONS} />
          )}
        />

        <form.AppField
          name="GetsWidowedParent"
          children={(field) => (
            <field.BooleanRadioField label="Do you get a Widowed Parent's Allowance?" />
          )}
        />

        <form.AppField
          name="WidowedParentAmount"
          children={(field) => (
            <field.NumberInputField
              label="Widowed Parent's Allowance income"
              inputClassName="max-w-[200px]"
            />
          )}
        />

        <form.AppField
          name="WidowedParentPeriod"
          children={(field) => (
            <field.SelectField label="Period" options={PAYMENT_PERIOD_OPTIONS} />
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
