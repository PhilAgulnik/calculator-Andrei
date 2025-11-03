import { useEffect, useState } from 'react'
import { Page } from '~/products/shared/Page'
import { Alert } from '~/components/Alert'
import { useWorkflow } from '../shared/use-workflow'
import { UniversalCreditCalculator } from './utils/calculator'
import { getPensionAgeWarningType } from './utils/pensionAgeCalculator'

import { DEFAULT_VALUES } from './constants'

export function Results() {
  const { entry } = useWorkflow()
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const data: any = entry?.data || {}

  // Helper function to convert amounts to monthly
  const convertToMonthly = (amount: any, period: any) => {
    if (!amount || amount === 0) return 0

    switch (period) {
      case 'per_week':
      case 'weekly':
        return amount * 4.33 // 52 weeks / 12 months
      case 'per_month':
      case 'monthly':
        return amount
      case 'per_year':
      case 'yearly':
        return amount / 12
      default:
        return amount
    }
  }

  useEffect(() => {
    const calculate = async () => {
      setLoading(true)
      setError(null)

      try {
        // Check pension age warning
        const warningType = getPensionAgeWarningType(data)
        if (warningType) {
          setError(
            'You are over state pension age. Universal Credit calculations are not applicable.'
          )
          setLoading(false)
          return
        }

        // Extract child information
        const childAges = data?.childrenInfo?.map?.((child: any) => child.age) || []
        const childDisabilities =
          data?.childrenInfo?.map?.((child: any) =>
            child.hasDisability === 'lower'
              ? 'lower'
              : child.hasDisability === 'higher'
                ? 'higher'
                : null
          ) || []
        const childGenders = data?.childrenInfo?.map?.((child: any) => child.gender || 'male') || []

        // Convert period-based amounts to monthly amounts for calculation
        const calculationInput: any = {
          ...DEFAULT_VALUES,
          ...data,
          // Convert amounts to monthly
          rent: convertToMonthly(data.rent, data.rentPeriod),
          serviceCharges: convertToMonthly(data.serviceCharges, data.serviceChargesPeriod),
          monthlyEarnings: convertToMonthly(data.monthlyEarnings, data.monthlyEarningsPeriod),
          pensionAmount: convertToMonthly(data.pensionAmount, data.pensionAmountPeriod),
          partnerMonthlyEarnings: convertToMonthly(
            data.partnerMonthlyEarnings,
            data.partnerMonthlyEarningsPeriod
          ),
          partnerPensionAmount: convertToMonthly(
            data.partnerPensionAmount,
            data.partnerPensionAmountPeriod
          ),
          childcareCosts: convertToMonthly(data.childcareCosts, data.childcareCostsPeriod),
          savings: convertToMonthly(data.savings, data.savingsPeriod),
          // Add missing fields that the calculator expects
          age: data.age || 25,
          partnerAge: data.partnerAge || 25,
          children: data.children || 0,
          childAges: childAges,
          childDisabilities: childDisabilities,
          childGenders: childGenders,
          otherBenefits:
            data.hasOtherBenefits === 'yes'
              ? data.otherBenefitsList?.reduce(
                  (sum: any, benefit: any) => sum + (benefit.amount || 0),
                  0
                ) || 0
              : 0,
          otherBenefitsPeriod: 'per_month',
          taxYear: data.taxYear || '2025_26',
        }

        // Initialize calculator if needed
        const calculator = new UniversalCreditCalculator()
        if (!calculator.initialized) {
          await calculator.initialize()
        }

        // Perform calculation
        const calculationResult = calculator.calculate(calculationInput)

        if (calculationResult.success) {
          setResults(calculationResult)
        } else {
          setError(
            'Calculation failed: ' + (calculationResult.errors?.join(', ') || 'Unknown error')
          )
        }
      } catch (err: any) {
        setError('Error calculating benefits: ' + (err.message || 'Unknown error'))
        console.error('Calculation error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (data) {
      calculate()
    }
  }, [data])

  if (loading) {
    return (
      <Page.Main>
        <h1 className="text-3xl font-bold mb-6">Results</h1>
        <div className="text-center py-8">
          <p>Calculating your benefits...</p>
        </div>
      </Page.Main>
    )
  }

  if (error) {
    return (
      <Page.Main>
        <h1 className="text-3xl font-bold mb-6">Results</h1>
        <Alert type="error" className="mb-6">
          {error}
        </Alert>
      </Page.Main>
    )
  }

  if (!results || !results.calculation) {
    return (
      <Page.Main>
        <h1 className="text-3xl font-bold mb-6">Results</h1>
        <Alert type="warning" className="mb-6">
          No calculation results available. Please complete the form first.
        </Alert>
      </Page.Main>
    )
  }

  const calc = results.calculation

  return (
    <Page.Main>
      <h1 className="text-3xl font-bold mb-6">Your Universal Credit Calculation</h1>

      {/* Final Result */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Universal Credit Entitlement</h2>
        <p className="text-4xl font-bold text-blue-700">
          £{calc.finalAmount.toFixed(2)} <span className="text-lg">per month</span>
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Tax Year: {results.taxYear?.replace('_', '/') || '2025/26'}
        </p>
      </div>

      {/* Calculation Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Calculation Breakdown</h2>

        <div className="space-y-3">
          {/* Elements */}
          <div>
            <h3 className="font-semibold mb-2">Elements</h3>
            <div className="space-y-2 pl-4">
              {calc.standardAllowance > 0 && (
                <div className="flex justify-between">
                  <span>Standard Allowance</span>
                  <span className="font-medium">£{calc.standardAllowance.toFixed(2)}</span>
                </div>
              )}
              {calc.housingElement > 0 && (
                <div className="flex justify-between">
                  <span>Housing Element</span>
                  <span className="font-medium">£{calc.housingElement.toFixed(2)}</span>
                </div>
              )}
              {calc.childElement > 0 && (
                <div className="flex justify-between">
                  <span>Child Element</span>
                  <span className="font-medium">£{calc.childElement.toFixed(2)}</span>
                </div>
              )}
              {calc.childcareElement > 0 && (
                <div className="flex justify-between">
                  <span>Childcare Element</span>
                  <span className="font-medium">£{calc.childcareElement.toFixed(2)}</span>
                </div>
              )}
              {calc.carerElement > 0 && (
                <div className="flex justify-between">
                  <span>Carer Element</span>
                  <span className="font-medium">£{calc.carerElement.toFixed(2)}</span>
                </div>
              )}
              {calc.lcwraElement > 0 && (
                <div className="flex justify-between">
                  <span>LCWRA Element</span>
                  <span className="font-medium">£{calc.lcwraElement.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 mt-2 font-semibold">
                <span>Total Elements</span>
                <span>£{calc.totalElements.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold mb-2">Deductions</h3>
            <div className="space-y-2 pl-4">
              {calc.earningsReduction > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>
                    Earnings Reduction
                    {calc.workAllowance > 0 && (
                      <span className="text-sm text-gray-600 ml-2">
                        (after work allowance of £{calc.workAllowance.toFixed(2)})
                      </span>
                    )}
                  </span>
                  <span className="font-medium">-£{calc.earningsReduction.toFixed(2)}</span>
                </div>
              )}
              {calc.capitalDeduction > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Capital Deduction</span>
                  <span className="font-medium">-£{calc.capitalDeduction.toFixed(2)}</span>
                </div>
              )}
              {calc.benefitDeduction > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Benefit Deduction</span>
                  <span className="font-medium">-£{calc.benefitDeduction.toFixed(2)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Final Amount */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between text-xl font-bold">
              <span>Final Universal Credit</span>
              <span className="text-blue-700">£{calc.finalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Capital Deduction Details */}
      {calc.capitalDeductionDetails && calc.capitalDeductionDetails.explanation && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">{calc.capitalDeductionDetails.explanation}</p>
        </div>
      )}

      {/* LHA Details */}
      {calc.lhaDetails && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Local Housing Allowance Details</h3>
          <div className="text-sm space-y-1">
            <p>
              <strong>BRMA:</strong> {calc.lhaDetails.brma || 'Not selected'}
            </p>
            <p>
              <strong>Bedroom Entitlement:</strong> {calc.lhaDetails.bedroomEntitlement}
            </p>
            {calc.lhaDetails.lhaMonthly && (
              <p>
                <strong>LHA Rate:</strong> £{calc.lhaMonthly.toFixed(2)} per month
              </p>
            )}
            {calc.lhaDetails.actualRent && (
              <p>
                <strong>Actual Rent:</strong> £{calc.lhaDetails.actualRent.toFixed(2)} per month
              </p>
            )}
            {calc.lhaDetails.shortfall > 0 && (
              <p className="text-red-600">
                <strong>Shortfall:</strong> £{calc.lhaDetails.shortfall.toFixed(2)} per month
              </p>
            )}
          </div>
        </div>
      )}

      {/* Warnings */}
      {results.warnings && results.warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2 text-yellow-800">Warnings</h3>
          <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
            {results.warnings.map((warning: any, index: number) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </Page.Main>
  )
}
