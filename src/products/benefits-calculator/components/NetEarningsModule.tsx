/**
 * Net Earnings Module Component
 * Calculates net (take-home) earnings from gross pay including tax, NI, pension, and student loans
 */

import { useState, useEffect } from 'react'
import { Button } from '~/components/Button'
import type { GrossEarnings, NetEarningsCalculation } from '../types/net-earnings'
import {
  calculateNetEarnings,
  validateEarningsInput,
} from '../utils/netEarningsCalculator'

export interface NetEarningsModuleProps {
  initialGross?: GrossEarnings
  enableManualOverride?: boolean
  onCalculationComplete: (result: NetEarningsCalculation) => void
}

export function NetEarningsModule({
  initialGross,
  enableManualOverride = true,
  onCalculationComplete,
}: NetEarningsModuleProps) {
  // Gross earnings state
  const [amount, setAmount] = useState(initialGross?.amount?.toString() || '')
  const [period, setPeriod] = useState<'hour' | 'week' | 'month' | 'year'>(
    initialGross?.period || 'year'
  )
  const [hours, setHours] = useState(initialGross?.hours?.toString() || '37.5')

  // Deductions state
  const [pensionEnabled, setPensionEnabled] = useState(false)
  const [pensionPercentage, setPensionPercentage] = useState('5')
  const [studentLoanEnabled, setStudentLoanEnabled] = useState(false)
  const [studentLoanPlan, setStudentLoanPlan] = useState<
    'plan1' | 'plan2' | 'plan4' | 'plan5' | 'postgraduate'
  >('plan2')

  // Manual override state
  const [manualOverride, setManualOverride] = useState(false)
  const [manualNetAmount, setManualNetAmount] = useState('')

  // Results state
  const [calculation, setCalculation] = useState<NetEarningsCalculation | null>(null)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate net earnings whenever inputs change
  useEffect(() => {
    if (manualOverride) {
      // Skip calculation if manual override is enabled
      return
    }

    const amountNum = parseFloat(amount) || 0
    const hoursNum = parseFloat(hours) || 37.5

    // Validate input
    const validationError = validateEarningsInput(amountNum, period)
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)

    if (amountNum === 0) {
      setCalculation(null)
      return
    }

    try {
      const grossEarnings: GrossEarnings = {
        amount: amountNum,
        period,
        hours: period === 'hour' ? hoursNum : undefined,
      }

      const result = calculateNetEarnings(grossEarnings, {
        pension: pensionEnabled
          ? {
              enabled: true,
              percentage: parseFloat(pensionPercentage) || 0,
            }
          : undefined,
        studentLoan: studentLoanEnabled
          ? {
              enabled: true,
              plan: studentLoanPlan,
            }
          : undefined,
      })

      setCalculation(result)
      onCalculationComplete(result)
    } catch (err) {
      console.error('Net earnings calculation error:', err)
      setError('Failed to calculate net earnings. Please check your inputs.')
    }
  }, [
    amount,
    period,
    hours,
    pensionEnabled,
    pensionPercentage,
    studentLoanEnabled,
    studentLoanPlan,
    manualOverride,
    onCalculationComplete,
  ])

  const formatCurrency = (value: number) => {
    return `£${value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Net Earnings Calculator</h3>
        <p className="text-sm text-gray-600">
          Calculate your take-home pay after tax, National Insurance, pension, and student
          loan deductions.
        </p>
      </div>

      {/* Gross Earnings Input */}
      <div className="space-y-4 bg-gray-50 border border-gray-200 rounded p-4">
        <h4 className="font-semibold text-gray-900">Gross Earnings</h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-600">£</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={manualOverride}
                min="0"
                step="0.01"
                className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded text-base"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Period</label>
            <select
              value={period}
              onChange={(e) =>
                setPeriod(e.target.value as 'hour' | 'week' | 'month' | 'year')
              }
              disabled={manualOverride}
              className="w-full px-3 py-2 border border-gray-300 rounded text-base"
            >
              <option value="hour">per hour</option>
              <option value="week">per week</option>
              <option value="month">per month</option>
              <option value="year">per year</option>
            </select>
          </div>
        </div>

        {period === 'hour' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Hours per week (default: 37.5)
            </label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              disabled={manualOverride}
              min="0"
              max="168"
              step="0.5"
              className="w-full px-4 py-2 border border-gray-300 rounded text-base"
              placeholder="37.5"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      {/* Deductions Configuration */}
      <div className="space-y-4 bg-gray-50 border border-gray-200 rounded p-4">
        <h4 className="font-semibold text-gray-900">Deductions</h4>

        {/* Pension */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={pensionEnabled}
              onChange={(e) => setPensionEnabled(e.target.checked)}
              disabled={manualOverride}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">
              Pension contribution (% of gross)
            </span>
          </label>
          {pensionEnabled && (
            <div className="ml-6">
              <input
                type="number"
                value={pensionPercentage}
                onChange={(e) => setPensionPercentage(e.target.value)}
                disabled={manualOverride}
                min="0"
                max="100"
                step="0.5"
                className="w-32 px-3 py-1 border border-gray-300 rounded text-sm"
                placeholder="5"
              />
              <span className="ml-2 text-sm text-gray-600">%</span>
              <p className="text-xs text-gray-500 mt-1">
                Common: 5% (auto-enrolment minimum)
              </p>
            </div>
          )}
        </div>

        {/* Student Loan */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={studentLoanEnabled}
              onChange={(e) => setStudentLoanEnabled(e.target.checked)}
              disabled={manualOverride}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium text-gray-700">Student loan repayment</span>
          </label>
          {studentLoanEnabled && (
            <div className="ml-6">
              <select
                value={studentLoanPlan}
                onChange={(e) =>
                  setStudentLoanPlan(
                    e.target.value as
                      | 'plan1'
                      | 'plan2'
                      | 'plan4'
                      | 'plan5'
                      | 'postgraduate'
                  )
                }
                disabled={manualOverride}
                className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
              >
                <option value="plan1">Plan 1 (Before Sept 2012)</option>
                <option value="plan2">Plan 2 (Sept 2012 - July 2023)</option>
                <option value="plan4">Plan 4 (Scotland)</option>
                <option value="plan5">Plan 5 (After Aug 2023)</option>
                <option value="postgraduate">Postgraduate Loan</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Manual Override */}
      {enableManualOverride && (
        <div className="space-y-2 bg-yellow-50 border border-yellow-300 rounded p-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={manualOverride}
              onChange={(e) => setManualOverride(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-semibold text-gray-900">
              Manual override (use if calculation doesn't match your payslip)
            </span>
          </label>
          {manualOverride && (
            <div className="ml-6 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter your actual monthly net (take-home) pay
              </label>
              <div className="relative w-64">
                <span className="absolute left-3 top-2 text-gray-600">£</span>
                <input
                  type="number"
                  value={manualNetAmount}
                  onChange={(e) => setManualNetAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded text-base"
                  placeholder="0.00"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      {calculation && !manualOverride && (
        <div className="bg-green-50 border border-green-300 rounded-lg p-6 space-y-4">
          <h4 className="text-lg font-bold text-gray-900">Net Earnings</h4>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Monthly</p>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(calculation.monthlyNet)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Weekly</p>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(calculation.weeklyNet)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Take-home %</p>
              <p className="text-2xl font-bold text-green-700">
                {calculation.takeHomePercentage.toFixed(1)}%
              </p>
            </div>
          </div>

          <Button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="text-blue-600 hover:text-blue-700 text-sm underline bg-transparent p-0"
          >
            {showBreakdown ? 'Hide' : 'Show'} Detailed Breakdown
          </Button>

          {showBreakdown && (
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
                      {formatCurrency(calculation.tax.grossAnnual)}
                    </td>
                    <td className="text-right py-2">
                      {formatCurrency(calculation.tax.grossAnnual / 12)}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 pl-4 text-gray-700">Less: Income Tax</td>
                    <td className="text-right py-2 text-red-600">
                      -{formatCurrency(calculation.tax.totalTax)}
                    </td>
                    <td className="text-right py-2 text-red-600">
                      -{formatCurrency(calculation.tax.totalTax / 12)}
                    </td>
                  </tr>
                  {calculation.tax.basicRateTax > 0 && (
                    <tr>
                      <td className="py-1 pl-8 text-xs text-gray-600">Basic rate (20%)</td>
                      <td className="text-right py-1 text-xs text-gray-600">
                        {formatCurrency(calculation.tax.basicRateTax)}
                      </td>
                      <td></td>
                    </tr>
                  )}
                  {calculation.tax.higherRateTax > 0 && (
                    <tr>
                      <td className="py-1 pl-8 text-xs text-gray-600">Higher rate (40%)</td>
                      <td className="text-right py-1 text-xs text-gray-600">
                        {formatCurrency(calculation.tax.higherRateTax)}
                      </td>
                      <td></td>
                    </tr>
                  )}
                  {calculation.tax.additionalRateTax > 0 && (
                    <tr>
                      <td className="py-1 pl-8 text-xs text-gray-600">
                        Additional rate (45%)
                      </td>
                      <td className="text-right py-1 text-xs text-gray-600">
                        {formatCurrency(calculation.tax.additionalRateTax)}
                      </td>
                      <td></td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2 pl-4 text-gray-700">Less: National Insurance</td>
                    <td className="text-right py-2 text-red-600">
                      -{formatCurrency(calculation.ni.totalNI)}
                    </td>
                    <td className="text-right py-2 text-red-600">
                      -{formatCurrency(calculation.ni.totalNI / 12)}
                    </td>
                  </tr>
                  {calculation.pension && (
                    <tr>
                      <td className="py-2 pl-4 text-gray-700">
                        Less: Pension ({calculation.pension.percentage}%)
                      </td>
                      <td className="text-right py-2 text-red-600">
                        -{formatCurrency(calculation.pension.employeeContributionAnnual)}
                      </td>
                      <td className="text-right py-2 text-red-600">
                        -{formatCurrency(calculation.pension.employeeContributionAnnual / 12)}
                      </td>
                    </tr>
                  )}
                  {calculation.studentLoan && calculation.studentLoan.repaymentAnnual > 0 && (
                    <tr>
                      <td className="py-2 pl-4 text-gray-700">
                        Less: Student Loan ({calculation.studentLoan.plan})
                      </td>
                      <td className="text-right py-2 text-red-600">
                        -{formatCurrency(calculation.studentLoan.repaymentAnnual)}
                      </td>
                      <td className="text-right py-2 text-red-600">
                        -{formatCurrency(calculation.studentLoan.repaymentAnnual / 12)}
                      </td>
                    </tr>
                  )}
                  <tr className="border-t-2 border-gray-400">
                    <td className="py-2 font-bold">Net Earnings</td>
                    <td className="text-right py-2 font-bold text-green-700">
                      {formatCurrency(calculation.netEarnings)}
                    </td>
                    <td className="text-right py-2 font-bold text-green-700">
                      {formatCurrency(calculation.monthlyNet)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {manualOverride && manualNetAmount && (
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
          <p className="text-sm text-gray-700">
            <strong>Manual Override Active:</strong> Using your specified net monthly amount
            of <strong>{formatCurrency(parseFloat(manualNetAmount))}</strong>
          </p>
        </div>
      )}
    </div>
  )
}
