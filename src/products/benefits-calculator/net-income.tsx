import { Page } from '~/products/shared/Page'

import { useWorkflow } from '../shared/use-workflow'
import { Form, Fields, Show } from '~/components/Informed'
import { Button } from '~/components/Button'

export function NetIncome() {
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
            name="isClientIncomeNonStatePensions"
            descriptionBefore="Enter the net amount of income received from non-state pensions, after any tax that is deductible. You should include money you get from occupational pensions, annuities, private pensions and any payments you receive from your former employer on account of early retirement."
            defaultValue={false}
          />

          <Show when={({ formState }) => formState.values.IsClientIncomeNonStatePensions === true}>
            <Fields.AmountPeriod label="Income from pension 1" name="incomeNonStatePension1" />
            <Fields.AmountPeriod label="Income from pension 2" name="incomeNonStatePension2" />
            <Fields.AmountPeriod label="Income from pension 3" name="incomeNonStatePension3" />
          </Show>

          <Fields.BooleanRadio
            label="Income from Fostering Allowance?"
            name="isFosteringAllowanceOption"
          />

          <Show when={({ formState }) => formState.values.IsFosteringAllowanceOption === true}>
            <Fields.AmountPeriod
              label="Income from Fostering Allowance"
              name="fosteringAllowance"
            />
          </Show>

          <Fields.Radio
            label="Household savings or capital over £6,000?"
            name="hasSavingsOver6000"
            descriptionBefore="This includes things like cash, bonds, shares and any lump sum payments received as part of equity release."
            defaultValue="no"
            options={[
              { value: 'no', label: 'No' },
              { value: 'yes', label: 'Yes' },
            ]}
          />

          <Show when={({ formState }) => formState.values.hasSavingsOver6000 === 'yes'}>
            <Fields.AmountPeriod label="Savings Amount" name="savings" />
          </Show>

          <Fields.BooleanRadio
            label="Income from spousal maintenance payments"
            name="isIncomeFromMaintenancePaymentsOption"
          />

          <Show
            when={({ formState }) =>
              formState.values.IsIncomeFromMaintenancePaymentsOption === true
            }
          >
            <Fields.AmountPeriod
              label="Income from spousal maintenance payments"
              name="incomeFromMaintenancePayments"
            />
          </Show>

          <Fields.BooleanRadio
            label="Income from charity or voluntary sources"
            name="isIncomeFromVoluntaryCharitablePaymentsOption"
            descriptionBefore="This income is not counted when working out entitlement to benefits."
          />

          <Show
            when={({ formState }) =>
              formState.values.IsIncomeFromVoluntaryCharitablePaymentsOption === true
            }
          >
            <Fields.AmountPeriod
              label="Income from charity or voluntary sources"
              name="incomeFromVoluntaryCharitablePayments"
            />
          </Show>

          <Fields.BooleanRadio
            label="Do you own land or property other than your current home?"
            name="ownOtherProperty"
            descriptionBefore="The net value of property other than your main home counts as savings when means-tested benefits are calculated. We will ask for your valuation on the Savings page."
          />

          <Fields.BooleanRadio
            label="Income from sources not already mentioned"
            name="isOtherSourcesIncome"
            descriptionBefore="If you receive any income that you have not already entered, then you should use the 'i' icon to check if you should enter it here. Please DO NOT INCLUDE income from benefits that we have not asked about (e.g. tax credits, Housing Benefit, Universal Credit, Child Benefit etc.). We calculate means-tested benefits and income from these sources does not need to be entered. Also, do not include income from savings or investments but instead enter the value of these assets as savings."
          />

          <Show when={({ formState }) => formState.values.IsOtherSourcesIncome === true}>
            <Fields.AmountPeriod
              label="Income from sources not already mentioned"
              name="incomeOtherSources"
            />
          </Show>
        </Page.Main>

        <Page.Footer nextButton={<Button type="submit">Next →</Button>} />
      </Form>
    </>
  )
}
