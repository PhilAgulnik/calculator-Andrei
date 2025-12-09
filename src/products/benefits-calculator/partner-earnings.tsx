/**
 * Partner Earnings Page
 * Collects earnings information for the partner
 */

import { useState } from 'react'
import { useFormState } from 'informed'
import { Page } from '~/products/shared/Page'
import { useWorkflow } from '../shared/use-workflow'
import { Form, Fields, Show } from '~/components/Form'
import { Button } from '~/components/Button'
import { calculateNetEarnings } from './utils/netEarningsCalculator'
import { Accordion } from '~/components/Accordion'
import {
  shouldShowMIFQuestion,
  calculateUCEarningsThreshold,
  type WorkHoursConditionality,
} from './utils/minimumIncomeFloor'

function NetEarningsBreakdown({ formValues, useManualNet }: { formValues: any; useManualNet: boolean }) {
  if (useManualNet) return null

  const grossAmount = formValues.partnerMonthlyEarnings || 0
  if (grossAmount <= 0) return null

  try {
    const period = formValues.partnerMonthlyEarningsPeriod || 'month'
    const pensionType = formValues.partnerPensionType || 'amount'
    const pensionPercentage = pensionType === 'percentage' ? (formValues.partnerPensionPercentage || 3) : 0

    const grossEarnings = {
      amount: grossAmount,
      period: period as 'hour' | 'week' | 'month' | 'year',
    }

    const netCalculation = calculateNetEarnings(grossEarnings, {
      pension: pensionPercentage > 0 ? {
        enabled: true,
        percentage: pensionPercentage,
      } : undefined,
    })

    const formatCurrency = (value: number) => {
      return `£${value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    return (
      <div className="bg-green-50 border border-green-300 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Calculated Net Earnings</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Monthly net (take-home)</p>
            <p className="text-2xl font-bold text-green-700">
              {formatCurrency(netCalculation.monthlyNet)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Take-home %</p>
            <p className="text-2xl font-bold text-green-700">
              {netCalculation.takeHomePercentage.toFixed(1)}%
            </p>
          </div>
        </div>

        <Accordion title="How we worked out your partner's net earnings" open={false} className="mt-4">
          <div className="bg-white border border-gray-300 rounded p-4 text-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 font-semibold">Item</th>
                  <th className="text-right py-2 font-semibold">Annual</th>
                  <th className="text-right py-2 font-semibold">Monthly</th>
                </tr>
              </thead>
              <tbody className="space-y-1">
                <tr className="border-b border-gray-200">
                  <td className="py-2 font-semibold">Gross Earnings</td>
                  <td className="text-right py-2">
                    {formatCurrency(netCalculation.tax.grossAnnual)}
                  </td>
                  <td className="text-right py-2">
                    {formatCurrency(netCalculation.tax.grossAnnual / 12)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Less: Income Tax</td>
                  <td className="text-right py-2 text-red-600">
                    -{formatCurrency(netCalculation.tax.totalTax)}
                  </td>
                  <td className="text-right py-2 text-red-600">
                    -{formatCurrency(netCalculation.tax.totalTax / 12)}
                  </td>
                </tr>
                {netCalculation.tax.basicRateTax > 0 && (
                  <tr>
                    <td className="py-1 pl-8 text-xs text-gray-600">Basic rate (20%)</td>
                    <td className="text-right py-1 text-xs text-gray-600">
                      {formatCurrency(netCalculation.tax.basicRateTax)}
                    </td>
                    <td></td>
                  </tr>
                )}
                {netCalculation.tax.higherRateTax > 0 && (
                  <tr>
                    <td className="py-1 pl-8 text-xs text-gray-600">Higher rate (40%)</td>
                    <td className="text-right py-1 text-xs text-gray-600">
                      {formatCurrency(netCalculation.tax.higherRateTax)}
                    </td>
                    <td></td>
                  </tr>
                )}
                {netCalculation.tax.additionalRateTax > 0 && (
                  <tr>
                    <td className="py-1 pl-8 text-xs text-gray-600">Additional rate (45%)</td>
                    <td className="text-right py-1 text-xs text-gray-600">
                      {formatCurrency(netCalculation.tax.additionalRateTax)}
                    </td>
                    <td></td>
                  </tr>
                )}
                <tr>
                  <td className="py-2 pl-4 text-gray-700">Less: National Insurance</td>
                  <td className="text-right py-2 text-red-600">
                    -{formatCurrency(netCalculation.ni.totalNI)}
                  </td>
                  <td className="text-right py-2 text-red-600">
                    -{formatCurrency(netCalculation.ni.totalNI / 12)}
                  </td>
                </tr>
                {netCalculation.pension && (
                  <tr>
                    <td className="py-2 pl-4 text-gray-700">
                      Less: Pension ({netCalculation.pension.percentage}%)
                    </td>
                    <td className="text-right py-2 text-red-600">
                      -{formatCurrency(netCalculation.pension.employeeContributionAnnual)}
                    </td>
                    <td className="text-right py-2 text-red-600">
                      -{formatCurrency(netCalculation.pension.employeeContributionAnnual / 12)}
                    </td>
                  </tr>
                )}
                <tr className="border-t-2 border-gray-400">
                  <td className="py-2 font-bold">Net Earnings</td>
                  <td className="text-right py-2 font-bold text-green-700">
                    {formatCurrency(netCalculation.netEarnings)}
                  </td>
                  <td className="text-right py-2 font-bold text-green-700">
                    {formatCurrency(netCalculation.monthlyNet)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Accordion>
      </div>
    )
  } catch (err) {
    console.error('Net earnings calculation error:', err)
    return null
  }
}

function NetEarningsDisplay({ useManualNet }: { useManualNet: boolean }) {
  const formState = useFormState()

  return <NetEarningsBreakdown formValues={formState.values} useManualNet={useManualNet} />
}

function PartnerMIFPreview({ entry }: any) {
  const formState = useFormState()
  const workHours = (Number(formState.values.partnerWorkHoursConditionality) || 35) as WorkHoursConditionality
  const age = entry?.data?.partnerAge || 25
  const taxYear = entry?.data?.taxYear || '2025_26'

  if (workHours === 0) return null

  const threshold = calculateUCEarningsThreshold(workHours, age, taxYear)

  return (
    <div className="bg-white border border-gray-300 rounded p-4 text-sm">
      <p className="font-semibold text-gray-900 mb-2">Partner's Minimum Income Floor:</p>
      <p className="text-gray-700">
        Based on {workHours} hours per week, your partner's minimum income floor is approximately £
        {threshold.toFixed(2)} per month.
      </p>
      <p className="text-gray-600 mt-2 text-xs">
        If the MIF applies to your partner and is higher than their actual earnings, it will be used in your UC
        calculation instead of their actual earnings.
      </p>
    </div>
  )
}

export function PartnerEarnings() {
  const { entry, goToNextPage, updateEntryData }: any = useWorkflow()
  const [useManualNet, setUseManualNet] = useState(false)

  const isPartnerSelfEmployed = entry?.data?.partnerEmploymentType === 'self-employed'

  return (
    <Form
      onSubmit={({ values }) => {
        updateEntryData(values)
        goToNextPage()
      }}
      className="contents"
      initialValues={!!entry ? entry?.data : {}}
    >
      <Page.Main>
        <h1 className="text-3xl font-bold">Your partner's earnings</h1>
        <p className="text-gray-600">
          {isPartnerSelfEmployed
            ? "Please tell us about your partner's self-employed earnings."
            : "Please tell us about your partner's earnings and pension contributions."}
        </p>

        <Fields.AmountPeriod
          label={isPartnerSelfEmployed ? "Monthly net self-employed income" : "Gross earnings"}
          name="partnerMonthlyEarnings"
          defaultValue={0}
          descriptionBefore={
            isPartnerSelfEmployed
              ? "Enter your partner's net self-employed income (after business expenses but before personal tax)."
              : "Enter your partner's earnings before tax, National Insurance and pension contributions are deducted."
          }
        />

        {/* Only show pension fields for employed partners */}
        {!isPartnerSelfEmployed && (
          <>
            <Fields.Radio
              label="Pension Contribution Type"
              name="partnerPensionType"
              defaultValue="amount"
              options={[
                { value: 'amount', label: 'Fixed Amount' },
                { value: 'percentage', label: 'Percentage of Gross Earnings' },
              ]}
            />

            <Show when={({ formState }) => formState.values.partnerPensionType === 'amount'}>
              <Fields.AmountPeriod
                label="Pension Contributions (per month)"
                name="partnerPensionAmount"
                defaultValue={0}
              />
            </Show>

            <Show when={({ formState }) => formState.values.partnerPensionType === 'percentage'}>
              <Fields.NumberInput
                label="Pension Percentage"
                name="partnerPensionPercentage"
                defaultValue={3}
                inputClassName="max-w-[140px]"
                descriptionBefore="Percentage of gross earnings. Defaults to 3% if empty."
              />
            </Show>

            {/* Net Earnings Display */}
            <NetEarningsDisplay useManualNet={useManualNet} />

            {/* Manual Override Option */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useManualNet}
                  onChange={(e) => setUseManualNet(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">
                  I want to enter my partner's own net earnings figure (if the calculation doesn't
                  match their payslip)
                </span>
              </label>

              {useManualNet && (
                <Fields.AmountPeriod
                  label="Partner's actual net (take-home) earnings"
                  name="partnerManualNetEarnings"
                  defaultValue={0}
                  descriptionBefore="Enter your partner's actual monthly net (take-home) pay from their payslip."
                />
              )}
            </div>
          </>
        )}

        {/* Minimum Income Floor Section - Only for self-employed partners */}
        <Show
          when={({ formState }) => {
            if (!isPartnerSelfEmployed) return false
            const earnings = Number(formState.values.partnerMonthlyEarnings) || 0
            const age = entry?.data?.partnerAge || 25
            const workHours = (Number(formState.values.partnerWorkHoursConditionality) || 35) as WorkHoursConditionality
            const taxYear = entry?.data?.taxYear || '2025_26'
            return shouldShowMIFQuestion(true, earnings, workHours, age, taxYear)
          }}
        >
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Minimum Income Floor</h3>
              <p className="text-sm text-gray-700 mt-2">
                Your partner might be affected by the minimum income floor. The minimum income floor
                affects people claiming Universal Credit who are self-employed.
              </p>
            </div>

            <Fields.Radio
              label="What are your partner's Universal Credit work-related requirements?"
              name="partnerWorkHoursConditionality"
              defaultValue="35"
              descriptionBefore={
                <>
                  <p className="mb-2">
                    The minimum income floor is based on the number of hours they're expected to work:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>
                      <strong>0 hours:</strong> If they have a child under 1, are a carer, or have
                      recently adopted
                    </li>
                    <li>
                      <strong>16 hours:</strong> If they have limited capability for work, or have a
                      child aged 1-5
                    </li>
                    <li>
                      <strong>35 hours:</strong> If they're subject to all work-related requirements
                      (most people)
                    </li>
                  </ul>
                </>
              }
              options={[
                { value: '0', label: '0 hours - No work requirements' },
                { value: '16', label: '16 hours - Limited work requirements' },
                { value: '35', label: '35 hours - All work requirements' },
              ]}
            />

            <Fields.Radio
              label="Does the Minimum Income Floor apply to your partner?"
              name="partnerMifApplies"
              defaultValue="no"
              descriptionBefore="Select 'Yes' if they've been self-employed for more than 12 months and DWP has told them the MIF applies. Select 'No' if they've been self-employed for less than 12 months or have an exemption."
              options={[
                { value: 'no', label: 'No' },
                { value: 'yes', label: 'Yes' },
              ]}
            />

            {/* Show MIF calculation preview */}
            <PartnerMIFPreview entry={entry} />
          </div>
        </Show>
      </Page.Main>

      <Page.Footer nextButton={<Button type="submit">Next →</Button>} />
    </Form>
  )
}
