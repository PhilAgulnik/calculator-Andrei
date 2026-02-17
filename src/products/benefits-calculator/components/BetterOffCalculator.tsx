import { useState } from 'react'
import { formatCurrency } from '~/utils/functions'
import { Button } from '~/components/Button'
import { calculateNetEarnings } from '../utils/netEarningsCalculator'
import type {
  BetterOffCalculatorProps,
  WorkData,
  CostsData,
  BetterOffCalculation,
  CostCategoryKey,
  CostCategoryMeta,
  CostPeriod,
} from '../types/better-off-calculator'
import type { NetEarningsCalculation } from '../types/net-earnings'

/**
 * Cost categories metadata for display
 */
const COST_CATEGORIES: CostCategoryMeta[] = [
  {
    key: 'childcare',
    label: 'Childcare',
    description: 'Cost of childcare while you work',
  },
  {
    key: 'schoolMeals',
    label: 'School meals',
    description: 'Cost of school meals (if no longer eligible for free school meals)',
  },
  {
    key: 'prescriptions',
    label: 'Prescriptions',
    description: 'Prescription costs (if no longer eligible for free prescriptions)',
  },
  {
    key: 'workClothing',
    label: 'Work clothing',
    description: 'Cost of work clothes and uniforms',
  },
  {
    key: 'workTravel',
    label: 'Work travel',
    description: 'Cost of travel to and from work',
  },
  {
    key: 'otherWorkCosts',
    label: 'Other work-related costs',
    description: 'Any other costs related to working',
  },
  {
    key: 'energySavings',
    label: 'Energy savings',
    description: 'Savings on energy bills when not at home',
    isSaving: true,
  },
  {
    key: 'otherSavings',
    label: 'Other savings',
    description: 'Any other savings from working',
    isSaving: true,
  },
]

/**
 * Better-Off Calculator Component
 *
 * Allows users to compare their current UC entitlement with a scenario where they work.
 * Shows net benefit of taking employment including work costs.
 */
export function BetterOffCalculator({
  currentUCAmount,
  hasHousingCosts,
  hasChildren = false,
  hasLCWRA = false,
  onCalculationComplete,
}: BetterOffCalculatorProps) {
  // State for work details
  const [workData, setWorkData] = useState<WorkData>({
    employmentType: 'employee',
    hoursPerWeek: 30,
    hourlyWage: 12.21,
    calculationPeriod: 'monthly',
  })

  // State for costs (8 categories, each with 4 time period options)
  const [costsData, setCostsData] = useState<CostsData>({
    childcare: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
    schoolMeals: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
    prescriptions: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
    workClothing: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
    workTravel: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
    otherWorkCosts: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
    energySavings: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
    otherSavings: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
  })

  // UI state
  const [calculation, setCalculation] = useState<BetterOffCalculation | null>(null)
  const [netEarningsDetails, setNetEarningsDetails] = useState<NetEarningsCalculation | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [showCostsSection, setShowCostsSection] = useState(false)
  const [showNextSteps, setShowNextSteps] = useState(false)
  const [showCostsResults, setShowCostsResults] = useState(false)

  /**
   * Convert amount from any period to monthly
   */
  const convertToMonthly = (amount: number, period: CostPeriod): number => {
    switch (period) {
      case 'perWeek':
        return amount * 4.33
      case 'per4Weeks':
        return (amount * 12) / 52
      case 'perMonth':
        return amount
      case 'perYear':
        return amount / 12
      default:
        return 0
    }
  }

  /**
   * Calculate monthly costs from all cost categories
   */
  const calculateMonthlyCosts = (): number => {
    let total = 0
    const costCategories: CostCategoryKey[] = [
      'childcare',
      'schoolMeals',
      'prescriptions',
      'workClothing',
      'workTravel',
      'otherWorkCosts',
    ]

    for (const key of costCategories) {
      const category = costsData[key]
      // Find the first non-zero period and convert it to monthly
      if (category.perMonth > 0) {
        total += category.perMonth
      } else if (category.perWeek > 0) {
        total += convertToMonthly(category.perWeek, 'perWeek')
      } else if (category.per4Weeks > 0) {
        total += convertToMonthly(category.per4Weeks, 'per4Weeks')
      } else if (category.perYear > 0) {
        total += convertToMonthly(category.perYear, 'perYear')
      }
    }

    return total
  }

  /**
   * Calculate monthly savings from all savings categories
   */
  const calculateMonthlySavings = (): number => {
    let total = 0
    const savingsCategories: CostCategoryKey[] = ['energySavings', 'otherSavings']

    for (const key of savingsCategories) {
      const category = costsData[key]
      // Find the first non-zero period and convert it to monthly
      if (category.perMonth > 0) {
        total += category.perMonth
      } else if (category.perWeek > 0) {
        total += convertToMonthly(category.perWeek, 'perWeek')
      } else if (category.per4Weeks > 0) {
        total += convertToMonthly(category.per4Weeks, 'per4Weeks')
      } else if (category.perYear > 0) {
        total += convertToMonthly(category.perYear, 'perYear')
      }
    }

    return total
  }

  /**
   * Main calculation function
   */
  const calculateBetterOff = () => {
    const { hoursPerWeek, hourlyWage, calculationPeriod } = workData

    // Calculate net earnings using proper tax/NI calculation
    const netEarningsCalc = calculateNetEarnings(
      {
        amount: hourlyWage,
        period: 'hour',
        hours: hoursPerWeek,
      },
      {
        pension: undefined, // No pension deduction in Better Off calculator
      }
    )

    // Get gross and net from the calculation
    const monthlyGross = netEarningsCalc.tax.grossAnnual / 12
    const monthlyNet = netEarningsCalc.monthlyNet

    // Debug logging
    console.log('Better Off Calculation:', {
      hourlyWage,
      hoursPerWeek,
      grossAnnual: netEarningsCalc.tax.grossAnnual,
      monthlyGross,
      monthlyNet,
      netEarningsCalc,
    })

    // Store the detailed calculation for the breakdown
    setNetEarningsDetails(netEarningsCalc)

    // Determine work allowance
    // Work allowance only applies if has children OR has LCWRA
    let workAllowance = 0
    if (hasChildren || hasLCWRA) {
      workAllowance = hasHousingCosts ? 411 : 684
    }

    // Calculate UC reduction due to earnings
    const excessEarnings = Math.max(0, monthlyNet - workAllowance)
    const ucReduction = excessEarnings * 0.55 // 55% taper rate
    const newUCAmount = Math.max(0, currentUCAmount - ucReduction)

    // Calculate income comparison
    const totalIncomeInWork = monthlyNet + newUCAmount
    const currentTotalIncome = currentUCAmount

    // Calculate work costs
    const monthlyWorkCosts = calculateMonthlyCosts()
    const monthlyWorkSavings = calculateMonthlySavings()
    const netWorkCosts = monthlyWorkCosts - monthlyWorkSavings

    // Calculate final better-off amount
    const betterOffAmount = totalIncomeInWork - currentTotalIncome - netWorkCosts

    // Create result object
    const result: BetterOffCalculation = {
      grossEarnings: {
        current: 0,
        inWork: monthlyGross,
        impact: monthlyGross,
      },
      netEarnings: {
        current: 0,
        inWork: monthlyNet,
        impact: monthlyNet,
      },
      universalCredit: {
        current: currentUCAmount,
        inWork: newUCAmount,
        impact: newUCAmount - currentUCAmount,
      },
      totalIncome: {
        current: currentTotalIncome,
        inWork: totalIncomeInWork,
        impact: totalIncomeInWork - currentTotalIncome,
      },
      workCosts: {
        total: monthlyWorkCosts,
        savings: monthlyWorkSavings,
        net: netWorkCosts,
      },
      betterOffAmount,
      calculationPeriod,
    }

    setCalculation(result)
    setShowResults(true)

    // Callback if provided
    if (onCalculationComplete) {
      onCalculationComplete(result)
    }
  }

  /**
   * Calculate better off with costs - triggered from costs section
   */
  const calculateBetterOffWithCosts = () => {
    calculateBetterOff()
    setShowCostsResults(true)
  }

  /**
   * Handle work data change
   */
  const handleWorkDataChange = (field: keyof WorkData, value: any) => {
    setWorkData((prev) => ({ ...prev, [field]: value }))
  }

  /**
   * Handle cost data change
   */
  const handleCostChange = (
    category: CostCategoryKey,
    period: CostPeriod,
    value: number
  ) => {
    setCostsData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [period]: value,
      },
    }))
  }

  /**
   * Reset calculator
   */
  const resetCalculator = () => {
    setCalculation(null)
    setNetEarningsDetails(null)
    setShowResults(false)
    setShowCostsSection(false)
    setShowCostsResults(false)
    setWorkData({
      employmentType: 'employee',
      hoursPerWeek: 30,
      hourlyWage: 12.21,
      calculationPeriod: 'monthly',
    })
    setCostsData({
      childcare: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
      schoolMeals: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
      prescriptions: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
      workClothing: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
      workTravel: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
      otherWorkCosts: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
      energySavings: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
      otherSavings: { perWeek: 0, per4Weeks: 0, perMonth: 0, perYear: 0 },
    })
  }

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-blue-600">Better Off Calculator</h2>
          <Button
            onClick={() => setShowNextSteps(!showNextSteps)}
            className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm px-3 py-1 min-h-[32px]"
          >
            {showNextSteps ? 'Hide' : 'Next Steps on BOC functionality'}
          </Button>
        </div>
        <div className="bg-gray-50 p-4 rounded border-l-4 border-cyan-600">
          <p className="text-sm text-gray-700">
            Calculate whether you would be better off financially by working. This tool compares
            your current Universal Credit amount with what you would receive if you work, taking
            into account the costs of working.
          </p>
        </div>

        {/* Next Steps Panel */}
        {showNextSteps && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4">
            <h3 className="font-semibold text-blue-900 mb-3">Optional Enhancements:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span className="line-through">Replace simplified 80% net earnings with proper PAYE tax/NI calculation</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Add input validation (minimum wage, max hours, etc.)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Add localStorage persistence for work scenarios</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Integrate with saved scenarios feature (Phase 2)</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Work Details Input Section */}
      <div className="bg-white p-6 shadow-md border border-gray-300 mb-6">
        <h3 className="text-lg font-semibold mb-4">Work Details</h3>

        {/* Employment Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Employment type</label>
          <select
            value={workData.employmentType}
            onChange={(e) =>
              handleWorkDataChange('employmentType', e.target.value as 'employee' | 'self-employed')
            }
            className="w-full px-4 py-3 border-2 border-black text-lg min-h-[44px]"
          >
            <option value="employee">Employee</option>
            <option value="self-employed">Self-employed</option>
          </select>
        </div>

        {/* Hours Worked */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Hours worked <span className="text-gray-500">per week</span>
          </label>
          <input
            type="number"
            min="0"
            max="168"
            step="0.1"
            value={workData.hoursPerWeek}
            onChange={(e) => handleWorkDataChange('hoursPerWeek', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 border-2 border-black text-lg min-h-[44px]"
          />
        </div>

        {/* Hourly Wage */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Wage rate <span className="text-gray-500">per hour</span>
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-gray-500 font-medium z-10">£</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={workData.hourlyWage}
              onChange={(e) => handleWorkDataChange('hourlyWage', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 pl-8 border-2 border-black text-lg min-h-[44px]"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex gap-4">
          <Button onClick={calculateBetterOff} className="bg-green-700 hover:bg-green-800">
            Calculate
          </Button>
          {showResults && (
            <Button onClick={resetCalculator} className="bg-white text-gray-700 border-2 border-gray-300">
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Results Section */}
      {showResults && calculation && (
        <div className="mt-6">
          {/* Summary Statement */}
          <div
            className={`flex items-start gap-4 p-6 rounded-lg mb-6 ${
              calculation.betterOffAmount >= 0
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center text-2xl font-bold">
              {calculation.betterOffAmount >= 0 ? '✓' : '!'}
            </div>
            <div>
              <p className="text-lg">
                You would be{' '}
                <span className="font-bold text-xl">
                  {formatCurrency(Math.abs(calculation.betterOffAmount))} per month{' '}
                  {calculation.betterOffAmount >= 0 ? 'better off' : 'worse off'}
                </span>{' '}
                if you work {workData.hoursPerWeek} hours per week at{' '}
                {formatCurrency(workData.hourlyWage)} per hour.
              </p>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Income Breakdown</h3>
            <div className="bg-white shadow-sm rounded overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Income Type
                    </th>
                    <th className="text-right p-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Current
                    </th>
                    <th className="text-right p-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      In Work
                    </th>
                    <th className="text-right p-3 text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Impact
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 text-sm">Gross earnings</td>
                    <td className="p-3 text-sm text-right font-mono">
                      {formatCurrency(calculation.grossEarnings.current)}
                    </td>
                    <td className="p-3 text-sm text-right font-mono">
                      {formatCurrency(calculation.grossEarnings.inWork)}
                    </td>
                    <td
                      className={`p-3 text-sm text-right font-mono font-semibold ${
                        calculation.grossEarnings.impact > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {calculation.grossEarnings.impact > 0 ? '+' : ''}
                      {formatCurrency(calculation.grossEarnings.impact)}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 text-sm">Net earnings (after tax/NI)</td>
                    <td className="p-3 text-sm text-right font-mono">
                      {formatCurrency(calculation.netEarnings.current)}
                    </td>
                    <td className="p-3 text-sm text-right font-mono">
                      {formatCurrency(calculation.netEarnings.inWork)}
                    </td>
                    <td
                      className={`p-3 text-sm text-right font-mono font-semibold ${
                        calculation.netEarnings.impact > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {calculation.netEarnings.impact > 0 ? '+' : ''}
                      {formatCurrency(calculation.netEarnings.impact)}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-3 text-sm">Universal Credit</td>
                    <td className="p-3 text-sm text-right font-mono">
                      {formatCurrency(calculation.universalCredit.current)}
                    </td>
                    <td className="p-3 text-sm text-right font-mono">
                      {formatCurrency(calculation.universalCredit.inWork)}
                    </td>
                    <td
                      className={`p-3 text-sm text-right font-mono font-semibold ${
                        calculation.universalCredit.impact >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {calculation.universalCredit.impact > 0 ? '+' : ''}
                      {formatCurrency(calculation.universalCredit.impact)}
                    </td>
                  </tr>
                  <tr className="bg-gray-50 font-semibold">
                    <td className="p-3 text-sm">Total Income</td>
                    <td className="p-3 text-sm text-right font-mono">
                      {formatCurrency(calculation.totalIncome.current)}
                    </td>
                    <td className="p-3 text-sm text-right font-mono">
                      {formatCurrency(calculation.totalIncome.inWork)}
                    </td>
                    <td
                      className={`p-3 text-sm text-right font-mono font-semibold ${
                        calculation.totalIncome.impact > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {calculation.totalIncome.impact > 0 ? '+' : ''}
                      {formatCurrency(calculation.totalIncome.impact)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Costs Section Toggle */}
          <div className="mb-6">
            <Button
              onClick={() => setShowCostsSection(!showCostsSection)}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              {showCostsSection ? 'Hide costs of work' : 'Calculate costs of work'}
            </Button>
          </div>
        </div>
      )}

      {/* Costs Input Section */}
      {showCostsSection && (
        <div className="mt-6 bg-white p-6 shadow-md border border-gray-300">
          <h3 className="text-lg font-semibold mb-4">Work Costs & Savings</h3>

          <div className="bg-gray-50 p-4 rounded border-l-4 border-cyan-600 mb-4">
            <p className="text-sm text-gray-700">
              Enter any costs related to working (such as childcare or travel) and any savings
              you might make (such as lower energy bills). This will give you a more accurate
              picture of whether you would be better off financially.
            </p>
          </div>

          <div className="space-y-4">
            {COST_CATEGORIES.map((meta) => (
              <CostInput
                key={meta.key}
                meta={meta}
                data={costsData[meta.key]}
                onChange={(period, value) => handleCostChange(meta.key, period, value)}
              />
            ))}
          </div>

          <div className="pt-4">
            <Button onClick={calculateBetterOffWithCosts} className="bg-green-700 hover:bg-green-800">
              💾 Take costs from better off amount
            </Button>
          </div>

          {/* Updated Results with Costs */}
          {showCostsResults && calculation && (
            <div className="mt-6 bg-white border border-gray-300 rounded p-6">
              <h4 className="text-lg font-semibold text-blue-600 mb-4">
                Updated Better Off Calculation (including costs)
              </h4>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center pb-2">
                  <span className="text-sm text-gray-700">Total work-related costs:</span>
                  <span className="text-sm font-mono font-medium">
                    {formatCurrency(calculation.workCosts.total)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-sm text-gray-700">Total work-related savings:</span>
                  <span className="text-sm font-mono font-medium">
                    {formatCurrency(calculation.workCosts.savings)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t-2 border-gray-300">
                  <span className="text-sm font-semibold text-blue-600">Net work-related costs:</span>
                  <span className="text-sm font-mono font-semibold text-blue-600">
                    {formatCurrency(calculation.workCosts.net)}
                  </span>
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-600 rounded p-4 text-center">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Final Better Off Amount:</h5>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(calculation.betterOffAmount)} per month
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Cost Input Component
 * Individual cost/saving input with amount and period selector
 */
interface CostInputProps {
  meta: CostCategoryMeta
  data: { perWeek: number; per4Weeks: number; perMonth: number; perYear: number }
  onChange: (period: CostPeriod, value: number) => void
}

function CostInput({ meta, data, onChange }: CostInputProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<CostPeriod>('perWeek')

  // Get the value for the currently selected period
  const currentValue = data[selectedPeriod]

  const handleValueChange = (newValue: number) => {
    onChange(selectedPeriod, newValue)
  }

  const handlePeriodChange = (newPeriod: CostPeriod) => {
    setSelectedPeriod(newPeriod)
  }

  return (
    <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded">
      <div className="flex-1">
        <label className="block text-sm font-medium">{meta.label}</label>
        <p className="text-xs text-gray-500">{meta.description}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            £
          </span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={currentValue}
            onChange={(e) => handleValueChange(parseFloat(e.target.value) || 0)}
            className="w-24 px-3 py-2 pl-6 border border-gray-300 rounded text-right text-sm"
          />
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => handlePeriodChange(e.target.value as CostPeriod)}
          className="px-3 py-2 border border-gray-300 rounded text-sm min-w-[120px]"
        >
          <option value="perWeek">per week</option>
          <option value="per4Weeks">per 4 weeks</option>
          <option value="perMonth">per month</option>
          <option value="perYear">per year</option>
        </select>
      </div>
    </div>
  )
}
