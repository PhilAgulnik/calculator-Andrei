/**
 * Child Benefit High Income Charge Calculator Component
 * Calculates the HICBC for families with adjusted net income over £60,000
 */

import { useState, useEffect } from 'react'
import { Button } from '~/components/Button'
import { Accordion } from '~/components/Accordion'
import {
  calculateChildBenefitCharge,
  generateScenarioComparisons,
  validateIncome,
  formatChargePercentage,
  ADJUSTED_NET_INCOME_EXPLANATION,
} from '../utils/childBenefitChargeCalculator'
import {
  CHILD_BENEFIT_RATES,
  HICBC_THRESHOLDS,
} from '../types/child-benefit-charge'
import type {
  ChildBenefitChargeProps,
  ChildBenefitChargeCalculation,
} from '../types/child-benefit-charge'

export function ChildBenefitChargeCalculator({
  numberOfChildren,
  claimantIncome: initialClaimantIncome,
  partnerIncome: initialPartnerIncome,
  onCalculationComplete,
}: ChildBenefitChargeProps) {
  // State for income inputs
  const [claimantIncome, setClaimantIncome] = useState(
    initialClaimantIncome?.toString() || ''
  )
  const [partnerIncome, setPartnerIncome] = useState(
    initialPartnerIncome?.toString() || ''
  )
  const [showPartnerIncome, setShowPartnerIncome] = useState(!!initialPartnerIncome)

  // State for calculation and UI
  const [calculation, setCalculation] = useState<ChildBenefitChargeCalculation | null>(
    null
  )
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  const [errors, setErrors] = useState<{ claimant?: string; partner?: string }>({})

  // Calculate HICBC whenever inputs change
  useEffect(() => {
    const claimantNum = parseFloat(claimantIncome) || 0
    const partnerNum = showPartnerIncome ? parseFloat(partnerIncome) || 0 : 0

    // Validate inputs
    const claimantError = validateIncome(claimantNum)
    const partnerError = showPartnerIncome ? validateIncome(partnerNum) : null

    if (claimantError || partnerError) {
      setErrors({
        claimant: claimantError || undefined,
        partner: partnerError || undefined,
      })
      return
    }

    setErrors({})

    // Skip calculation if no income entered
    if (claimantNum === 0 && partnerNum === 0) {
      setCalculation(null)
      return
    }

    try {
      const result = calculateChildBenefitCharge({
        claimantIncome: claimantNum,
        partnerIncome: showPartnerIncome ? partnerNum : undefined,
        numberOfChildren,
        firstChildRate: CHILD_BENEFIT_RATES.firstChild,
        additionalChildRate: CHILD_BENEFIT_RATES.additionalChild,
      })

      setCalculation(result)
      onCalculationComplete?.(result)
    } catch (err) {
      console.error('HICBC calculation error:', err)
    }
  }, [
    claimantIncome,
    partnerIncome,
    showPartnerIncome,
    numberOfChildren,
    onCalculationComplete,
  ])

  const formatCurrency = (value: number) => {
    return `£${value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const getChargeWarningClass = () => {
    if (!calculation || !calculation.isSubjectToCharge) return ''

    if (calculation.shouldOptOut) {
      return 'bg-red-50 border-red-500 border-l-4' // Full clawback
    } else if (calculation.chargePercentage > 50) {
      return 'bg-orange-50 border-orange-500 border-l-4' // High charge
    } else {
      return 'bg-yellow-50 border-yellow-500 border-l-4' // Moderate charge
    }
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Child Benefit High Income Charge Calculator
        </h3>
        <p className="text-sm text-gray-600">
          If you or your partner have an adjusted net income over £60,000, you may need to
          pay a tax charge that reduces or eliminates your Child Benefit.
        </p>
      </div>

      {/* Income Inputs */}
      <div className="space-y-4 bg-gray-50 border border-gray-200 rounded p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">Adjusted Net Income</h4>
          <Accordion title="What is adjusted net income?" open={false}>
            <div className="text-sm text-gray-700 whitespace-pre-line">
              {ADJUSTED_NET_INCOME_EXPLANATION}
            </div>
          </Accordion>
        </div>

        {/* Claimant Income */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Your adjusted net income (annual)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-600">£</span>
            <input
              type="number"
              value={claimantIncome}
              onChange={(e) => setClaimantIncome(e.target.value)}
              min="0"
              step="1000"
              className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded text-base"
              placeholder="0"
            />
          </div>
          {errors.claimant && (
            <p className="text-sm text-red-600">{errors.claimant}</p>
          )}
        </div>

        {/* Partner Income Toggle */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPartnerIncome}
              onChange={(e) => setShowPartnerIncome(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">
              Include partner's income
            </span>
          </label>

          {showPartnerIncome && (
            <div className="ml-6 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Partner's adjusted net income (annual)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-600">£</span>
                <input
                  type="number"
                  value={partnerIncome}
                  onChange={(e) => setPartnerIncome(e.target.value)}
                  min="0"
                  step="1000"
                  className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded text-base"
                  placeholder="0"
                />
              </div>
              {errors.partner && (
                <p className="text-sm text-red-600">{errors.partner}</p>
              )}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 italic">
          The charge is based on the HIGHER income if you have a partner.
        </p>
      </div>

      {/* Child Benefit Summary */}
      <div className="bg-blue-50 border border-blue-300 rounded p-4">
        <h4 className="font-semibold text-gray-900 mb-2">
          Your Child Benefit Entitlement
        </h4>
        <p className="text-sm text-gray-700">
          For {numberOfChildren} {numberOfChildren === 1 ? 'child' : 'children'}:
        </p>
        <p className="text-lg font-bold text-blue-900 mt-1">
          £
          {(
            CHILD_BENEFIT_RATES.firstChild * 52 +
            (numberOfChildren > 1
              ? CHILD_BENEFIT_RATES.additionalChild * 52 * (numberOfChildren - 1)
              : 0)
          ).toFixed(2)}{' '}
          per year
        </p>
        <p className="text-sm text-gray-600">
          (£{CHILD_BENEFIT_RATES.firstChild}/week for first child
          {numberOfChildren > 1 &&
            `, £${CHILD_BENEFIT_RATES.additionalChild}/week for ${numberOfChildren - 1} additional ${numberOfChildren - 1 === 1 ? 'child' : 'children'}`}
          )
        </p>
      </div>

      {/* Results */}
      {calculation && calculation.isSubjectToCharge && (
        <div className={`${getChargeWarningClass()} rounded-lg p-6 space-y-4`}>
          <h4 className="text-lg font-bold text-gray-900">
            High Income Child Benefit Charge
          </h4>

          {/* Charge Summary */}
          <div className="bg-white rounded p-4 space-y-3">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm text-gray-700">Higher income:</span>
              <span className="font-bold text-gray-900">
                {formatCurrency(calculation.higherIncome)}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm text-gray-700">Income over £60,000:</span>
              <span className="font-bold text-gray-900">
                {formatCurrency(calculation.incomeOverThreshold)}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm text-gray-700">Charge percentage:</span>
              <span className="font-bold text-red-700">
                {formatChargePercentage(calculation.chargePercentage)}
              </span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-sm text-gray-700">Annual charge:</span>
              <span className="text-xl font-bold text-red-700">
                {formatCurrency(calculation.annualCharge)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-900">Net benefit:</span>
              <span className="text-xl font-bold text-green-700">
                {formatCurrency(calculation.netBenefit)}
              </span>
            </div>
          </div>

          {/* Monthly breakdown */}
          <div className="text-sm text-gray-700 bg-white rounded p-3">
            <p>
              <strong>Monthly:</strong> You'll receive{' '}
              {formatCurrency(calculation.totalChildBenefit / 12)} in Child Benefit, but
              owe {formatCurrency(calculation.monthlyCharge)} in tax charge.
            </p>
            <p className="mt-1">
              <strong>Net monthly benefit:</strong>{' '}
              {formatCurrency(calculation.netBenefitMonthly)}
            </p>
          </div>

          {/* Warning if should opt out */}
          {calculation.shouldOptOut && (
            <div className="bg-red-100 border border-red-400 rounded p-3">
              <p className="text-sm font-bold text-red-900">
                Your charge equals or exceeds your Child Benefit!
              </p>
              <p className="text-sm text-red-800 mt-1">
                Consider opting out of Child Benefit payments or using the
                "register-only" option to preserve National Insurance credits.
              </p>
            </div>
          )}

          {/* Show breakdown button */}
          <Button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="text-blue-600 hover:text-blue-700 text-sm underline bg-transparent p-0"
          >
            {showBreakdown ? 'Hide' : 'Show'} Detailed Breakdown
          </Button>

          {/* Detailed Breakdown */}
          {showBreakdown && (
            <div className="bg-white border border-gray-300 rounded p-4 text-sm space-y-3">
              <h5 className="font-semibold text-gray-900">How the charge is calculated:</h5>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>
                  Your Child Benefit entitlement: {formatCurrency(calculation.totalChildBenefit)}{' '}
                  per year
                </li>
                <li>
                  Higher income (yours or partner's): {formatCurrency(calculation.higherIncome)}
                </li>
                <li>
                  Amount over £{HICBC_THRESHOLDS.startThreshold.toLocaleString()}:{' '}
                  {formatCurrency(calculation.incomeOverThreshold)}
                </li>
                <li>
                  Charge rate: 1% per £{HICBC_THRESHOLDS.chargeRate} over threshold ={' '}
                  {formatChargePercentage(calculation.chargePercentage)}
                </li>
                <li>
                  Annual charge: {formatCurrency(calculation.totalChildBenefit)} ×{' '}
                  {formatChargePercentage(calculation.chargePercentage)} ={' '}
                  {formatCurrency(calculation.annualCharge)}
                </li>
                <li>
                  Net benefit: {formatCurrency(calculation.totalChildBenefit)} -{' '}
                  {formatCurrency(calculation.annualCharge)} ={' '}
                  {formatCurrency(calculation.netBenefit)}
                </li>
              </ol>

              <div className="bg-blue-50 border border-blue-300 rounded p-3 mt-3">
                <p className="text-xs text-gray-700">
                  <strong>Effective marginal rate:</strong> The charge adds approximately{' '}
                  {calculation.effectiveRate.toFixed(1)}% to your marginal tax rate for income
                  between £60,000 and £80,000.
                </p>
              </div>
            </div>
          )}

          {/* Comparison table button */}
          <Button
            onClick={() => setShowComparison(!showComparison)}
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium"
          >
            {showComparison ? 'Hide' : 'Show'} Your Options
          </Button>

          {/* Scenario Comparison */}
          {showComparison && (
            <div className="bg-white border border-gray-300 rounded p-4">
              <h5 className="font-semibold text-gray-900 mb-3">Compare Your Options:</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-gray-300">
                      <th className="text-left py-2 px-3 font-semibold">Option</th>
                      <th className="text-right py-2 px-3 font-semibold">CB Received</th>
                      <th className="text-right py-2 px-3 font-semibold">Charge Owed</th>
                      <th className="text-right py-2 px-3 font-semibold">Net Amount</th>
                      <th className="text-center py-2 px-3 font-semibold">NI Credits</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    {generateScenarioComparisons(calculation).map((scenario) => (
                      <tr key={scenario.scenario} className="border-b border-gray-200">
                        <td className="py-3 px-3">
                          <div>
                            <p className="font-medium">
                              {scenario.scenario === 'keep'
                                ? '1. Keep Child Benefit'
                                : scenario.scenario === 'optOut'
                                  ? '2. Opt Out Completely'
                                  : '3. Register Only'}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {scenario.description}
                            </p>
                          </div>
                        </td>
                        <td className="text-right py-3 px-3">
                          {formatCurrency(scenario.childBenefitReceived)}
                        </td>
                        <td className="text-right py-3 px-3 text-red-700">
                          {scenario.chargeOwed > 0 ? formatCurrency(scenario.chargeOwed) : '-'}
                        </td>
                        <td className="text-right py-3 px-3 font-bold">
                          {scenario.netAmount > 0
                            ? formatCurrency(scenario.netAmount)
                            : '-'}
                        </td>
                        <td className="text-center py-3 px-3">
                          {scenario.niCreditsPreserved ? '✓' : '✗'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 bg-blue-50 border border-blue-300 rounded p-3">
                <p className="text-sm text-gray-700">
                  <strong>Recommended:</strong>{' '}
                  {calculation.shouldOptOut
                    ? 'Option 3 (Register Only) - You avoid the charge while preserving NI credits for a non-working parent.'
                    : 'Option 1 (Keep Child Benefit) - You still benefit financially even after paying the charge.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No charge message */}
      {calculation && !calculation.isSubjectToCharge && (
        <div className="bg-green-50 border-l-4 border-green-500 rounded p-4">
          <h4 className="font-bold text-green-900 mb-2">No Charge Applies</h4>
          <p className="text-sm text-green-800">
            Your adjusted net income is below £60,000. You can claim Child Benefit without
            any charge.
          </p>
          <p className="text-sm text-green-700 mt-2">
            Annual Child Benefit: <strong>{formatCurrency(calculation.totalChildBenefit)}</strong>
          </p>
        </div>
      )}

      {/* Additional Resources */}
      <Accordion title="Additional Resources & Help" open={false}>
        <div className="text-sm text-gray-700 space-y-3">
          <div>
            <h5 className="font-semibold text-gray-900 mb-2">Official Guidance</h5>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.gov.uk/child-benefit-tax-charge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  GOV.UK: Child Benefit tax charge →
                </a>
              </li>
              <li>
                <a
                  href="https://www.gov.uk/child-benefit-tax-calculator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  HMRC Child Benefit tax calculator →
                </a>
              </li>
              <li>
                <a
                  href="https://www.gov.uk/child-benefit/stop-child-benefit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  How to opt out of Child Benefit →
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-gray-900 mb-2">How to Pay the Charge</h5>
            <p className="text-gray-700">
              If you owe the High Income Child Benefit Charge, you must:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2 mt-2 text-gray-700">
              <li>Register for Self Assessment (if not already registered)</li>
              <li>Report the charge on your Self Assessment tax return</li>
              <li>
                Pay the charge by 31 January following the end of the tax year (or arrange
                to adjust your tax code)
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-gray-900 mb-2">
              National Insurance Credits
            </h5>
            <p className="text-gray-700">
              Even if you opt out of receiving Child Benefit payments, you can still
              register to protect the National Insurance record of a non-working parent.
              This ensures they don't lose years toward their State Pension.
            </p>
          </div>
        </div>
      </Accordion>
    </div>
  )
}
