import { z } from 'zod'

import { Page } from '~/products/shared/Page'

import { useWorkflow } from '../shared/use-workflow'
import { Form, Fields } from '~/components/Informed'
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

  return (
    <>
      <Form
        onSubmit={(values) => {
          console.log('onSubmit', { values })
          goToNextPage()
        }}
        className="contents"
      >
        <Page.Main>
          <h1 className="text-3xl font-bold">Current benefits</h1>

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
          />
        </Page.Main>

        <Page.Footer nextButton={<Button type="submit">Next →</Button>} />
      </Form>
    </>
  )
}
