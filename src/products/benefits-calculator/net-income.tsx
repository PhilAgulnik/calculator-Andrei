import { useAppForm } from '~/components/Form/use-app-form'

export function NetIncome() {
  const form = useAppForm({
    defaultValues: {},
    onSubmit: async ({ value }) => {
      console.log('onSubmit', value)
    },
  })

  return (
    <div className="">
      <h1 className="text-3xl font-bold">Net income</h1>

      <p className="mt-3">
        We need to check whether you (and your partner if you have one) receive any other income
        that we haven't already asked about.
      </p>

      <p className="mt-3">
        If you're not sure what classes as extra income please read our information on what counts
        as income.
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
              options={[
                { label: 'Weekly', value: '2' },
                { label: '4 weeks', value: '3' },
                { label: 'Monthly', value: '1' },
                { label: 'Yearly', value: '0' },
              ]}
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
              options={[
                { label: 'Weekly', value: '2' },
                { label: '4 weeks', value: '3' },
                { label: 'Monthly', value: '1' },
                { label: 'Yearly', value: '0' },
              ]}
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
              options={[
                { label: 'Weekly', value: '2' },
                { label: '4 weeks', value: '3' },
                { label: 'Monthly', value: '1' },
                { label: 'Yearly', value: '0' },
              ]}
            />
          )}
        />

        <form.AppField
          name="IncomeNonStatePensions"
          children={(field) => (
            <field.NumberInputField
              label="Amount (per week)"
              inputClassName="max-w-[140px]"
            />
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
              options={[
                { label: 'Weekly', value: '2' },
                { label: '4 weeks', value: '3' },
                { label: 'Monthly', value: '1' },
                { label: 'Yearly', value: '0' },
              ]}
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
              options={[
                { label: 'Weekly', value: '2' },
                { label: '4 weeks', value: '3' },
                { label: 'Monthly', value: '1' },
                { label: 'Yearly', value: '0' },
              ]}
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
              options={[
                { label: 'Weekly', value: '2' },
                { label: '4 weeks', value: '3' },
                { label: 'Monthly', value: '1' },
                { label: 'Yearly', value: '0' },
              ]}
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
