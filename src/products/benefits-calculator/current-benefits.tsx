import { useAppForm } from '~/components/Form/use-app-form'
import { Page } from '~/products/shared/Page'

import { useWorkflow } from '../shared/use-workflow'

export function CurrentBenefits() {
  const { goToNextPage } = useWorkflow()

  const form = useAppForm({
    defaultValues: {
      GetsUniversalCredit: false,
      UniversalCreditAmount: 0,
      HasTransitionalElement: false,
      ContributoryBenefit: '',
      PartnerContributoryBenefit: '',
      GetsCarersAllowance: false,
      CarersAllowanceAmount: 0,
      CarersAllowancePeriod: '',
      PartnerGetsCarersAllowance: false,
      PartnerCarersAllowanceAmount: 0,
      PartnerCarersAllowancePeriod: '',
      GetsGuardiansAllowance: false,
      GuardiansAllowanceAmount: 0,
      GuardiansAllowancePeriod: '',
      GetsMaternityAllowance: false,
      MaternityAllowanceAmount: 0,
      MaternityAllowancePeriod: '',
      GetsStatutoryPay: false,
      StatutoryPayAmount: 0,
      StatutoryPayPeriod: '',
      GetsOccupationalPay: false,
      OccupationalPayAmount: 0,
      OccupationalPayPeriod: '',
      WarPensionOptions: [] as string[],
      GetsArmedForcesCompensation: false,
      GetsServicePension: false,
      GetsBereavementSupport: false,
      BereavementSupportAmount: 0,
      BereavementSupportPeriod: '',
      GetsWidowedParent: false,
      WidowedParentAmount: 0,
      WidowedParentPeriod: '',
    },
    onSubmit: async ({ value }) => {
      console.log('onSubmit', value)
      goToNextPage()
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
          name="ContributoryBenefit"
          children={(field) => (
            <field.SelectField
              label="Which contributory benefit, if any, do you currently receive?"
              options={[
                { label: 'None', value: 'none' },
                { label: "Contributory Jobseeker's Allowance", value: 'contributory_jsa' },
                {
                  label: 'Contributory Employment and Support Allowance',
                  value: 'contributory_esa',
                },
                { label: "New-style Jobseeker's Allowance", value: 'newstyle_jsa' },
                { label: 'New-style Employment and Support Allowance', value: 'newstyle_esa' },
              ]}
            />
          )}
        />

        <form.AppField
          name="PartnerContributoryBenefit"
          children={(field) => (
            <field.SelectField
              label="Which contributory benefit, if any, does your partner currently receive?"
              options={[
                { label: 'None', value: 'none' },
                { label: "Contributory Jobseeker's Allowance", value: 'contributory_jsa' },
                {
                  label: 'Contributory Employment and Support Allowance',
                  value: 'contributory_esa',
                },
                { label: "New-style Jobseeker's Allowance", value: 'newstyle_jsa' },
                { label: 'New-style Employment and Support Allowance', value: 'newstyle_esa' },
              ]}
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
            <field.SelectField
              label="Period"
              options={[
                { label: 'Weekly', value: 'weekly' },
                { label: '4 weekly', value: '4weekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Yearly', value: 'yearly' },
              ]}
            />
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
            <field.SelectField
              label="Period"
              options={[
                { label: 'Weekly', value: 'weekly' },
                { label: '4 weekly', value: '4weekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Yearly', value: 'yearly' },
              ]}
            />
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
            <field.SelectField
              label="Period"
              options={[
                { label: 'Weekly', value: 'weekly' },
                { label: '4 weekly', value: '4weekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Yearly', value: 'yearly' },
              ]}
            />
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
            <field.SelectField
              label="Period"
              options={[
                { label: 'Weekly', value: 'weekly' },
                { label: '4 weekly', value: '4weekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Yearly', value: 'yearly' },
              ]}
            />
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
            <field.SelectField
              label="Period"
              options={[
                { label: 'Weekly', value: 'weekly' },
                { label: '4 weekly', value: '4weekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Yearly', value: 'yearly' },
              ]}
            />
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
            <field.SelectField
              label="Period"
              options={[
                { label: 'Weekly', value: 'weekly' },
                { label: '4 weekly', value: '4weekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Yearly', value: 'yearly' },
              ]}
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
            <field.SelectField
              label="Period"
              options={[
                { label: 'Weekly', value: 'weekly' },
                { label: '4 weekly', value: '4weekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Yearly', value: 'yearly' },
              ]}
            />
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
            <field.SelectField
              label="Period"
              options={[
                { label: 'Weekly', value: 'weekly' },
                { label: '4 weekly', value: '4weekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Yearly', value: 'yearly' },
              ]}
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
