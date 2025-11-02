import { Page } from '~/products/shared/Page'

import { useWorkflow } from '../shared/use-workflow'
import { Form, Fields, Show } from '~/components/Informed'
import { Button } from '~/components/Button'

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

export function CurrentBenefits() {
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
          <h1 className="text-3xl font-bold">Current benefits</h1>

          <Fields.BooleanRadio
            label="Do you get Universal Credit?"
            name="GetsUniversalCredit"
            defaultValue={false}
          />

          <Show when={({ formState }) => formState.values.GetsUniversalCredit === true}>
            <Fields.NumberInput
              label="Monthly Universal Credit payment received in last assessment period"
              name="UniversalCreditAmount"
              defaultValue="0"
              inputClassName="max-w-[200px]"
            />

            <Fields.BooleanRadio
              label="Do you get a transitional element in your Universal Credit award?"
              name="HasTransitionalElement"
              defaultValue={false}
            />
          </Show>

          <Fields.Select
            label="Which contributory benefit, if any, do you currently receive?"
            name="ContributoryBenefit"
            defaultValue="none"
            options={[
              { label: 'Select a contributory benefit', value: '' },
              { label: 'None', value: 'none' },
              { label: "Contributory Jobseeker's Allowance", value: 'contributory_jsa' },
              { label: 'Contributory Employment and Support Allowance', value: 'contributory_esa' },
              { label: "New-style Jobseeker's Allowance", value: 'newstyle_jsa' },
              { label: 'New-style Employment and Support Allowance', value: 'newstyle_esa' },
            ]}
          />

          <Fields.Select
            label="Which contributory benefit, if any, does your partner currently receive?"
            name="PartnerContributoryBenefit"
            defaultValue="none"
            options={[
              { label: 'Select a contributory benefit', value: '' },
              { label: 'None', value: 'none' },
              { label: "Contributory Jobseeker's Allowance", value: 'contributory_jsa' },
              { label: 'Contributory Employment and Support Allowance', value: 'contributory_esa' },
              { label: "New-style Jobseeker's Allowance", value: 'newstyle_jsa' },
              { label: 'New-style Employment and Support Allowance', value: 'newstyle_esa' },
            ]}
          />

          <Fields.BooleanRadio
            label="Do you currently receive Carer's Allowance?"
            name="GetsCarersAllowance"
            defaultValue={false}
          />

          <Show when={({ formState }) => formState.values.GetsCarersAllowance === true}>
            <Fields.AmountPeriod label="Carer's Allowance income" name="CarersAllowance" />
          </Show>

          <Fields.BooleanRadio
            label="Does your partner currently receive Carer's Allowance?"
            name="PartnerGetsCarersAllowance"
            defaultValue={false}
          />

          <Show when={({ formState }) => formState.values.PartnerGetsCarersAllowance === true}>
            <Fields.AmountPeriod
              label="Partner's Carer's Allowance income"
              name="PartnerCarersAllowance"
            />
          </Show>

          <Fields.BooleanRadio
            label="Do you get Guardian's Allowance?"
            name="GetsGuardiansAllowance"
            defaultValue={false}
          />

          <Show when={({ formState }) => formState.values.GetsGuardiansAllowance === true}>
            <Fields.AmountPeriod label="Guardian's Allowance income" name="GuardiansAllowance" />
          </Show>

          <Fields.BooleanRadio
            label="Do you get Maternity Allowance?"
            name="GetsMaternityAllowance"
            defaultValue={false}
          />

          <Show when={({ formState }) => formState.values.GetsMaternityAllowance === true}>
            <Fields.AmountPeriod label="Maternity Allowance income" name="MaternityAllowance" />
          </Show>

          <Fields.BooleanRadio
            label="Do you get Statutory Maternity, Paternity or Adoption pay?"
            name="GetsStatutoryPay"
            defaultValue={false}
          />

          <Show when={({ formState }) => formState.values.GetsStatutoryPay === true}>
            <Fields.AmountPeriod label="Statutory pay income" name="StatutoryPay" />
          </Show>

          <Fields.BooleanRadio
            label="Do you get Occupational Maternity Pay or Occupational Paternity Pay?"
            name="GetsOccupationalPay"
            defaultValue={false}
          />

          <Show when={({ formState }) => formState.values.GetsOccupationalPay === true}>
            <Fields.AmountPeriod label="Occupational pay income" name="OccupationalPay" />
          </Show>

          <Fields.BooleanRadio
            label="Do you get a War Pension or War Widower's Pension?"
            name="GetsWarPension"
          />

          <Show when={({ formState }) => formState.values.GetsWarPension === true}>
            <Fields.Checkbox
              label="War Pension or War Widower's Pension"
              descriptionBefore="Select all that apply"
              name="WarPension"
              layout="vertical"
              options={[
                { label: 'Yes, with Constant Attendance Allowance', value: 'wp_caa' },
                { label: 'Yes, with Mobility Supplement', value: 'wp_mobility' },
                { label: 'Yes, with Unemployability Supplement', value: 'wp_unsup' },
                {
                  label: 'Yes, with Allowance for Lowered Standard of Occupation',
                  value: 'wp_also',
                },
                { label: "Yes, War Widower's Pension", value: 'wp_widower' },
                { label: 'Yes, Other rate', value: 'wp_other' },
              ]}
            />
          </Show>

          <Fields.AmountPeriod label="Armed Forces Compensation" name="ArmedForcesCompensation" />

          {/* 
          <Fields.BooleanRadio
            label="Do you get Universal Credit?"
            name="GetsUniversalCredit"
            defaultValue={false}
          />

          <Fields.NumberInput
            label="Monthly Universal Credit payment received in last assessment period"
            name="UniversalCreditAmount"
            defaultValue="0"
            inputClassName="max-w-[200px]"
          />

          <Fields.BooleanRadio
            label="Do you get a transitional element in your Universal Credit award?"
            name="HasTransitionalElement"
            defaultValue={false}
            descriptionBefore="You may get a transitional element if you moved onto Universal Credit from your old benefits after receiving a migration notice."
          />

          <Fields.BooleanRadio
            label="Do you get income-related Employment and Support Allowance (ESA)?"
            name="GetsIncomeRelatedESA"
            defaultValue={false}
          />

          <Fields.Select
            label="Which contributory benefit, if any, do you currently receive?"
            name="ContributoryBenefit"
            defaultValue="none"
            options={CONTRIBUTORY_BENEFIT_OPTIONS}
          />

          <Fields.Select
            label="Which contributory benefit, if any, does your partner currently receive?"
            name="PartnerContributoryBenefit"
            defaultValue="none"
            options={CONTRIBUTORY_BENEFIT_OPTIONS}
          />

          <Fields.BooleanRadio
            label="Do you currently receive Carer's Allowance?"
            name="GetsCarersAllowance"
            defaultValue={false}
            descriptionBefore="You may be getting this if you care for someone receiving a disability benefit."
          />

          <Fields.AmountPeriod
            label="Carer's Allowance income"
            name="CarersAllowance"
            defaultAmount={0}
            defaultPeriod="weekly"
          />

          <Fields.Select
            label="Period"
            name="CarersAllowancePeriod"
            defaultValue="weekly"
            options={PAYMENT_PERIOD_OPTIONS}
          />

          <Fields.BooleanRadio
            label="Does your partner currently receive Carer's Allowance?"
            name="PartnerGetsCarersAllowance"
            defaultValue={false}
            descriptionBefore="Your partner may be getting this if s/he cares for someone receiving a disability benefit."
          />

          <Fields.NumberInput
            label="Carer's Allowance income"
            name="PartnerCarersAllowanceAmount"
            defaultValue="0"
            inputClassName="max-w-[200px]"
          />

          <Fields.Select
            label="Period"
            name="PartnerCarersAllowancePeriod"
            defaultValue="weekly"
            options={PAYMENT_PERIOD_OPTIONS}
          />

          <Fields.BooleanRadio
            label="Do you get Guardian's Allowance?"
            name="GetsGuardiansAllowance"
            defaultValue={false}
          />

          <Fields.NumberInput
            label="Income amount"
            name="GuardiansAllowanceAmount"
            defaultValue="0"
            inputClassName="max-w-[200px]"
          />

          <Fields.Select
            label="Period"
            name="GuardiansAllowancePeriod"
            defaultValue="weekly"
            options={PAYMENT_PERIOD_OPTIONS}
          />

          <Fields.BooleanRadio
            label="Do you get Maternity Allowance?"
            name="GetsMaternityAllowance"
            defaultValue={false}
          />

          <Fields.NumberInput
            label="Income amount"
            name="MaternityAllowanceAmount"
            defaultValue="0"
            inputClassName="max-w-[200px]"
          />

          <Fields.Select
            label="Period"
            name="MaternityAllowancePeriod"
            defaultValue="weekly"
            options={PAYMENT_PERIOD_OPTIONS}
          />

          <Fields.BooleanRadio
            label="Do you get Statutory Maternity, Paternity or Adoption pay?"
            name="GetsStatutoryPay"
            defaultValue={false}
          />

          <Fields.NumberInput
            label="Income amount"
            name="StatutoryPayAmount"
            defaultValue="0"
            inputClassName="max-w-[200px]"
          />

          <Fields.Select
            label="Period"
            name="StatutoryPayPeriod"
            defaultValue="weekly"
            options={PAYMENT_PERIOD_OPTIONS}
          />

          <Fields.BooleanRadio
            label="Do you get Occupational Maternity Pay or Occupational Paternity Pay?"
            name="GetsOccupationalPay"
            defaultValue={false}
            descriptionBefore="Do not include the Statutory Maternity, Paternity or Adoption pay you receive here or it will be counted twice."
          />

          <Fields.NumberInput
            label="Income amount"
            name="OccupationalPayAmount"
            defaultValue="0"
            inputClassName="max-w-[200px]"
          />

          <Fields.Select
            label="Period"
            name="OccupationalPayPeriod"
            defaultValue="weekly"
            options={PAYMENT_PERIOD_OPTIONS}
          />

          <Fields.Checkbox
            label="Do you get a War Pension or War Widower's Pension?"
            name="WarPensionOptions"
            defaultValue={null}
            options={WAR_PENSION_OPTIONS}
            layout="vertical"
          />

          <Fields.BooleanRadio
            label="Do you get Armed Forces Compensation?"
            name="GetsArmedForcesCompensation"
            defaultValue={false}
          />

          <Fields.BooleanRadio
            label="Do you get a Service Attributable Pension?"
            name="GetsServicePension"
            defaultValue={false}
          />

          <Fields.BooleanRadio
            label="Do you get a Bereavement Support Payment?"
            name="GetsBereavementSupport"
            defaultValue={false}
          />

          <Fields.NumberInput
            label="Bereavement Support Payment income"
            name="BereavementSupportAmount"
            defaultValue="0"
            inputClassName="max-w-[200px]"
          />

          <Fields.Select
            label="Period"
            name="BereavementSupportPeriod"
            defaultValue="weekly"
            options={PAYMENT_PERIOD_OPTIONS}
          />

          <Fields.BooleanRadio
            label="Do you get a Widowed Parent's Allowance?"
            name="GetsWidowedParent"
            defaultValue={false}
          />

          <Fields.NumberInput
            label="Widowed Parent's Allowance income"
            name="WidowedParentAmount"
            defaultValue="0"
            inputClassName="max-w-[200px]"
          />

          <Fields.Select
            label="Period"
            name="WidowedParentPeriod"
            defaultValue="weekly"
            options={PAYMENT_PERIOD_OPTIONS}
          /> */}
        </Page.Main>

        <Page.Footer nextButton={<Button type="submit">Next →</Button>} />
      </Form>
    </>
  )
}
