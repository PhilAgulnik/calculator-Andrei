import { z } from 'zod'

import { useAppForm } from '~/components/Form/use-app-form'
import { Page } from '~/products/shared/Page'

import { useWorkflow } from '../shared/use-workflow'
import { Form, Fields } from '~/components/Informed'
import { Button } from '~/components/Button'

const PAYMENT_PERIOD_OPTIONS = [
  { label: 'Weekly', value: '2' },
  { label: '4 weeks', value: '3' },
  { label: 'Monthly', value: '1' },
  { label: 'Yearly', value: '0' },
]

const schema = z.object({
  IsClientIncomeNonStatePensions: z.boolean(),
  IncomeNonStatePension1: z.string(),
  IncomeNonStatePensions1CalcPeriod: z.string(),
  IncomeNonStatePension2: z.string(),
  IncomeNonStatePensions2CalcPeriod: z.string(),
  IncomeNonStatePension3: z.string(),
  IncomeNonStatePensions3CalcPeriod: z.string(),
  IncomeNonStatePensions: z.string(),
  IsFosteringAllowanceOption: z.boolean(),
  FosteringAllowance: z.string(),
  FosteringAllowanceCalcPeriod: z.string(),
  IncomeFromSavingsChk: z.boolean(),
  IsIncomeFromMaintenancePaymentsOption: z.boolean(),
  IncomeFromMaintenancePayments: z.string(),
  IncomeFromMaintenanceCalcPeriod: z.string(),
  IsIncomeFromVoluntaryCharitablePaymentsOption: z.boolean(),
  IncomeFromVoluntaryCharitablePayments: z.string(),
  IncomeFromVoluntaryCharitablePaymentsCalcPeriod: z.string(),
  OwnOtherProperty: z.boolean(),
  IsOtherSourcesIncome: z.boolean(),
  IncomeOtherSources: z.string(),
  IncomeOtherSourcesCalcPeriod: z.string(),
})

export function NetIncome() {
  const { goToNextPage } = useWorkflow()

  const form = useAppForm({
    defaultValues: {
      IsClientIncomeNonStatePensions: false,
      IncomeNonStatePension1: '0',
      IncomeNonStatePensions1CalcPeriod: '2',
      IncomeNonStatePension2: '0',
      IncomeNonStatePensions2CalcPeriod: '2',
      IncomeNonStatePension3: '0',
      IncomeNonStatePensions3CalcPeriod: '2',
      IncomeNonStatePensions: '0',
      IsFosteringAllowanceOption: false,
      FosteringAllowance: '0',
      FosteringAllowanceCalcPeriod: '2',
      IncomeFromSavingsChk: false,
      IsIncomeFromMaintenancePaymentsOption: false,
      IncomeFromMaintenancePayments: '0',
      IncomeFromMaintenanceCalcPeriod: '2',
      IsIncomeFromVoluntaryCharitablePaymentsOption: false,
      IncomeFromVoluntaryCharitablePayments: '0',
      IncomeFromVoluntaryCharitablePaymentsCalcPeriod: '0',
      OwnOtherProperty: false,
      IsOtherSourcesIncome: false,
      IncomeOtherSources: '0',
      IncomeOtherSourcesCalcPeriod: '2',
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
    <>
      <Form
        onSubmit={(values) => {
          console.log('onSubmit', { values })
          goToNextPage()
        }}
        className="contents"
      >
        <Page.Main>
          <h1 className="text-3xl font-bold">Net income</h1>

          <p className="mt-3">
            We need to check whether you (and your partner if you have one) receive any other income
            that we haven't already asked about.
          </p>

          <p className="mt-3">
            If you're not sure what classes as extra income please read our information on what
            counts as income.
          </p>

          <Fields.BooleanRadio
            label="Income from non-state pensions?"
            name="IsClientIncomeNonStatePensions"
            descriptionBefore="Enter the net amount of income received from non-state pensions, after any tax that is deductible. You should include money you get from occupational pensions, annuities, private pensions and any payments you receive from your former employer on account of early retirement."
            defaultValue={false}
          />

          <Fields.NumberInput
            label="Income from pension 1 - Amount"
            name="IncomeNonStatePension1"
            inputClassName="max-w-[140px]"
          />

          <Fields.Select
            label="Period"
            name="IncomeNonStatePensions1CalcPeriod"
            options={PAYMENT_PERIOD_OPTIONS}
          />

          <Fields.NumberInput
            label="Income from pension 2 - Amount"
            name="IncomeNonStatePension2"
            inputClassName="max-w-[140px]"
          />

          <Fields.Select
            label="Period"
            name="IncomeNonStatePensions2CalcPeriod"
            options={PAYMENT_PERIOD_OPTIONS}
          />

          <Fields.NumberInput
            label="Income from pension 3 - Amount"
            name="IncomeNonStatePension3"
            inputClassName="max-w-[140px]"
          />

          <Fields.Select
            label="Period"
            name="IncomeNonStatePensions3CalcPeriod"
            options={PAYMENT_PERIOD_OPTIONS}
          />

          <Fields.NumberInput
            label="Amount (per week)"
            name="IncomeNonStatePensions"
            inputClassName="max-w-[140px]"
          />

          <Fields.BooleanRadio
            label="Income from Fostering Allowance?"
            name="IsFosteringAllowanceOption"
          />

          <Fields.NumberInput
            label="Amount"
            name="FosteringAllowance"
            inputClassName="max-w-[140px]"
          />

          <Fields.Select
            label="Period"
            name="FosteringAllowanceCalcPeriod"
            options={PAYMENT_PERIOD_OPTIONS}
          />

          <Fields.BooleanRadio
            label="Household savings or capital over £6,000?"
            name="IncomeFromSavingsChk"
            descriptionBefore="This includes things like cash, bonds, shares and any lump sum payments received as part of equity release."
          />

          <Fields.BooleanRadio
            label="Income from spousal maintenance payments"
            name="IsIncomeFromMaintenancePaymentsOption"
          />

          <Fields.NumberInput
            label="Amount"
            name="IncomeFromMaintenancePayments"
            inputClassName="max-w-[140px]"
          />

          <Fields.Select
            label="Period"
            name="IncomeFromMaintenanceCalcPeriod"
            options={PAYMENT_PERIOD_OPTIONS}
          />

          <Fields.BooleanRadio
            label="Income from charity or voluntary sources"
            name="IsIncomeFromVoluntaryCharitablePaymentsOption"
            descriptionBefore="This income is not counted when working out entitlement to benefits."
          />

          <Fields.NumberInput
            label="Amount"
            name="IncomeFromVoluntaryCharitablePayments"
            inputClassName="max-w-[140px]"
          />

          <Fields.Select
            label="Period"
            name="IncomeFromVoluntaryCharitablePaymentsCalcPeriod"
            options={PAYMENT_PERIOD_OPTIONS}
          />

          <Fields.BooleanRadio
            label="Do you own land or property other than your current home?"
            name="OwnOtherProperty"
            descriptionBefore="The net value of property other than your main home counts as savings when means-tested benefits are calculated. We will ask for your valuation on the Savings page."
          />

          <Fields.BooleanRadio
            label="Income from sources not already mentioned"
            name="IsOtherSourcesIncome"
            descriptionBefore="If you receive any income that you have not already entered, then you should use the 'i' icon to check if you should enter it here. Please DO NOT INCLUDE income from benefits that we have not asked about (e.g. tax credits, Housing Benefit, Universal Credit, Child Benefit etc.). We calculate means-tested benefits and income from these sources does not need to be entered. Also, do not include income from savings or investments but instead enter the value of these assets as savings."
          />

          <Fields.NumberInput
            label="Amount"
            name="IncomeOtherSources"
            inputClassName="max-w-[140px]"
          />

          <Fields.Select
            label="Period"
            name="IncomeOtherSourcesCalcPeriod"
            options={PAYMENT_PERIOD_OPTIONS}
          />
        </Page.Main>

        <Page.Footer nextButton={<Button type="submit">Next →</Button>} />
      </Form>
    </>
  )
}
