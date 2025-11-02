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
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
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
          If you're not sure what classes as extra income please read our information on what counts
          as income.
        </p>

        <form.AppField
          name="IsClientIncomeNonStatePensions"
          defaultValue={false}
          children={(field) => (
            <field.BooleanRadioField
              label="Income from non-state pensions?"
              descriptionBefore="Enter the net amount of income received from non-state pensions, after any tax that is deductible. You should include money you get from occupational pensions, annuities, private pensions and any payments you receive from your former employer on account of early retirement."
            />
          )}
        />

        <form.AppField
          name="IncomeNonStatePension1"
          children={(field) => (
            <field.NumberInputField
              label="Income from pension 1 - Amount"
              inputClassName="max-w-[140px]"
            />
          )}
        />

        <form.AppField
          name="IncomeNonStatePensions1CalcPeriod"
          children={(field) => (
            <field.SelectField
              label="Period"
              options={PAYMENT_PERIOD_OPTIONS}
            />
          )}
        />

        <form.AppField
          name="IncomeNonStatePension2"
          children={(field) => (
            <field.NumberInputField
              label="Income from pension 2 - Amount"
              inputClassName="max-w-[140px]"
            />
          )}
        />

        <form.AppField
          name="IncomeNonStatePensions2CalcPeriod"
          children={(field) => (
            <field.SelectField
              label="Period"
              options={PAYMENT_PERIOD_OPTIONS}
            />
          )}
        />

        <form.AppField
          name="IncomeNonStatePension3"
          children={(field) => (
            <field.NumberInputField
              label="Income from pension 3 - Amount"
              inputClassName="max-w-[140px]"
            />
          )}
        />

        <form.AppField
          name="IncomeNonStatePensions3CalcPeriod"
          children={(field) => (
            <field.SelectField
              label="Period"
              options={PAYMENT_PERIOD_OPTIONS}
            />
          )}
        />

        <form.AppField
          name="IncomeNonStatePensions"
          children={(field) => (
            <field.NumberInputField label="Amount (per week)" inputClassName="max-w-[140px]" />
          )}
        />

        <form.AppField
          name="IsFosteringAllowanceOption"
          defaultValue={false}
          children={(field) => <field.BooleanRadioField label="Income from Fostering Allowance?" />}
        />

        <form.AppField
          name="FosteringAllowance"
          children={(field) => (
            <field.NumberInputField label="Amount" inputClassName="max-w-[140px]" />
          )}
        />

        <form.AppField
          name="FosteringAllowanceCalcPeriod"
          children={(field) => (
            <field.SelectField
              label="Period"
              options={PAYMENT_PERIOD_OPTIONS}
            />
          )}
        />

        <form.AppField
          name="IncomeFromSavingsChk"
          defaultValue={false}
          children={(field) => (
            <field.BooleanRadioField
              label="Household savings or capital over £6,000?"
              descriptionBefore="This includes things like cash, bonds, shares and any lump sum payments received as part of equity release."
            />
          )}
        />

        <form.AppField
          name="IsIncomeFromMaintenancePaymentsOption"
          defaultValue={false}
          children={(field) => (
            <field.BooleanRadioField label="Income from spousal maintenance payments" />
          )}
        />

        <form.AppField
          name="IncomeFromMaintenancePayments"
          children={(field) => (
            <field.NumberInputField label="Amount" inputClassName="max-w-[140px]" />
          )}
        />

        <form.AppField
          name="IncomeFromMaintenanceCalcPeriod"
          children={(field) => (
            <field.SelectField
              label="Period"
              options={PAYMENT_PERIOD_OPTIONS}
            />
          )}
        />

        <form.AppField
          name="IsIncomeFromVoluntaryCharitablePaymentsOption"
          defaultValue={false}
          children={(field) => (
            <field.BooleanRadioField
              label="Income from charity or voluntary sources"
              descriptionBefore="This income is not counted when working out entitlement to benefits."
            />
          )}
        />

        <form.AppField
          name="IncomeFromVoluntaryCharitablePayments"
          children={(field) => (
            <field.NumberInputField label="Amount" inputClassName="max-w-[140px]" />
          )}
        />

        <form.AppField
          name="IncomeFromVoluntaryCharitablePaymentsCalcPeriod"
          children={(field) => (
            <field.SelectField
              label="Period"
              options={PAYMENT_PERIOD_OPTIONS}
            />
          )}
        />

        <form.AppField
          name="OwnOtherProperty"
          defaultValue={false}
          children={(field) => (
            <field.BooleanRadioField
              label="Do you own land or property other than your current home?"
              descriptionBefore="The net value of property other than your main home counts as savings when means-tested benefits are calculated. We will ask for your valuation on the Savings page."
            />
          )}
        />

        <form.AppField
          name="IsOtherSourcesIncome"
          defaultValue={false}
          children={(field) => (
            <field.BooleanRadioField
              label="Income from sources not already mentioned"
              descriptionBefore="If you receive any income that you have not already entered, then you should use the 'i' icon to check if you should enter it here. Please DO NOT INCLUDE income from benefits that we have not asked about (e.g. tax credits, Housing Benefit, Universal Credit, Child Benefit etc.). We calculate means-tested benefits and income from these sources does not need to be entered. Also, do not include income from savings or investments but instead enter the value of these assets as savings."
            />
          )}
        />

        <form.AppField
          name="IncomeOtherSources"
          children={(field) => (
            <field.NumberInputField label="Amount" inputClassName="max-w-[140px]" />
          )}
        />

        <form.AppField
          name="IncomeOtherSourcesCalcPeriod"
          children={(field) => (
            <field.SelectField
              label="Period"
              options={PAYMENT_PERIOD_OPTIONS}
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
