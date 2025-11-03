import { Page } from '~/products/shared/Page'

import { useWorkflow } from '../shared/use-workflow'
import { Form, Fields, Show } from '~/components/Form'
import { Button } from '~/components/Button'

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
            name="getsUniversalCredit"
            defaultValue={false}
          />

          <Show when={({ formState }) => formState.values.GetsUniversalCredit === true}>
            <Fields.NumberInput
              label="Monthly Universal Credit payment received in last assessment period"
              name="universalCreditAmount"
              defaultValue="0"
              inputClassName="max-w-[200px]"
            />

            <Fields.BooleanRadio
              label="Do you get a transitional element in your Universal Credit award?"
              name="hasTransitionalElement"
              defaultValue={false}
            />
          </Show>

          <Fields.Select
            label="Which contributory benefit, if any, do you currently receive?"
            name="contributoryBenefit"
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
            name="partnerContributoryBenefit"
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
            name="getsCarersAllowance"
            defaultValue={false}
          />

          <Show when={({ formState }) => formState.values.GetsCarersAllowance === true}>
            <Fields.AmountPeriod label="Carer's Allowance income" name="carersAllowance" />
          </Show>

          <Fields.BooleanRadio
            label="Does your partner currently receive Carer's Allowance?"
            name="partnerGetsCarersAllowance"
            defaultValue={false}
          />

          <Show when={({ formState }) => formState.values.PartnerGetsCarersAllowance === true}>
            <Fields.AmountPeriod
              label="Partner's Carer's Allowance income"
              name="partnerCarersAllowance"
            />
          </Show>

          <Fields.BooleanRadio
            label="Do you get Guardian's Allowance?"
            name="getsGuardiansAllowance"
            defaultValue={false}
          />

          <Show when={({ formState }) => formState.values.GetsGuardiansAllowance === true}>
            <Fields.AmountPeriod label="Guardian's Allowance income" name="guardiansAllowance" />
          </Show>

          <Fields.BooleanRadio
            label="Do you get Maternity Allowance?"
            name="getsMaternityAllowance"
            defaultValue={false}
          />

          <Show when={({ formState }) => formState.values.GetsMaternityAllowance === true}>
            <Fields.AmountPeriod label="Maternity Allowance income" name="maternityAllowance" />
          </Show>

          <Fields.BooleanRadio
            label="Do you get Statutory Maternity, Paternity or Adoption pay?"
            name="getsStatutoryPay"
            defaultValue={false}
          />

          <Show when={({ formState }) => formState.values.GetsStatutoryPay === true}>
            <Fields.AmountPeriod label="Statutory pay income" name="statutoryPay" />
          </Show>

          <Fields.BooleanRadio
            label="Do you get Occupational Maternity Pay or Occupational Paternity Pay?"
            name="getsOccupationalPay"
            defaultValue={false}
          />

          <Show when={({ formState }) => formState.values.GetsOccupationalPay === true}>
            <Fields.AmountPeriod label="Occupational pay income" name="occupationalPay" />
          </Show>

          <Fields.BooleanRadio
            label="Do you get a War Pension or War Widower's Pension?"
            name="getsWarPension"
          />

          <Show when={({ formState }) => formState.values.GetsWarPension === true}>
            <Fields.Checkbox
              label="War Pension or War Widower's Pension"
              descriptionBefore="Select all that apply"
              name="warPension"
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
        </Page.Main>

        <Page.Footer nextButton={<Button type="submit">Next →</Button>} />
      </Form>
    </>
  )
}
