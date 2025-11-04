import { useEffect, useState } from 'react'

import { Alert } from '~/components/Alert'
import { formatCurrency } from '~/utils/functions'
import { Page } from '~/products/shared/Page'

import { childBenefitCalculator } from './utils/childBenefitCalculator'
import { getPensionAgeWarningType } from './utils/pensionAgeCalculator'
import { UniversalCreditCalculator } from './utils/calculator'
import { useWorkflow } from '../shared/use-workflow'

import { DEFAULT_VALUES } from './constants'

export function Results() {
  const { entry } = useWorkflow()
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showChildBenefitWeekly, setShowChildBenefitWeekly] = useState(false)
  const [showLhaPanel, setShowLhaPanel] = useState(false)

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
  const taxYear = results.taxYear || '2025_26'

  // Calculate Child Benefit
  const childBenefitResults = childBenefitCalculator.calculateChildBenefit(data, taxYear)

  return (
    <Page.Main>
      <h1 className="text-3xl font-bold mb-6">Calculation Results</h1>

      {/* Calculation Breakdown */}
      <div className="bg-white border border-slate-300 rounded-lg overflow-hidden">
        <div className="bg-blue-50 border-b border-blue-200 p-6">
          <h2 className="text-2xl font-semibold mb-2">Your Universal Credit Entitlement</h2>
          <p className="text-4xl font-bold text-slate-800">
            £{calc.finalAmount.toFixed(2)} <span className="text-lg">per month</span>
          </p>
          <p className="text-slate-600 mt-2">
            Tax Year: {results.taxYear?.replace('_', '/') || '2025/26'}
          </p>
        </div>

        <div className="space-y-3 p-6">
          <h2 className="text-2xl font-semibold mb-4">Breakdown</h2>

          <div className="grid">
            <div className="flex justify-between py-2 border-t border-slate-200">
              <span>Standard Allowance</span>
              <span className="font-medium">£{calc.standardAllowance.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-2 border-t border-slate-200">
              <span>Housing Element</span>
              <span className="font-medium">£{calc.housingElement.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-2 border-t border-slate-200">
              <span>Child Element</span>
              <span className="font-medium">£{calc.childElement.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-2 border-t border-slate-200">
              <span>Childcare Element</span>
              <span className="font-medium">£{calc.childcareElement.toFixed(2)}</span>
            </div>

            {calc.carerElement > 0 && (
              <div className="flex justify-between py-2 border-t border-slate-200">
                <span>Carer Element</span>
                <span className="font-medium">£{calc.carerElement.toFixed(2)}</span>
              </div>
            )}
            {calc.lcwraElement > 0 && (
              <div className="flex justify-between py-2 border-t border-slate-200">
                <span>LCWRA Element</span>
                <span className="font-medium">£{calc.lcwraElement.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-t border-slate-200 font-[600]">
              <span>Total Elements</span>
              <span>£{calc.totalElements.toFixed(2)}</span>
            </div>
          </div>

          {/* Deductions */}
          <div className="pt-5 mt-5">
            <h3 className="text-xl font-semibold mb-2">Deductions</h3>

            <div className="grid">
              <div className="flex justify-between py-2 border-t border-slate-200">
                <span>
                  Earnings Reduction
                  {calc.workAllowance > 0 && (
                    <span className="text-sm text-gray-600 ml-2">
                      (after work allowance of -{formatCurrency(calc.workAllowance.toFixed(2))})
                    </span>
                  )}
                </span>
                <span className="font-medium text-red-600">
                  -{formatCurrency(calc.earningsReduction.toFixed(2))}
                </span>
              </div>

              <div className="flex justify-between py-2 border-t border-slate-200">
                <span>Other Deductions</span>
                <span className="font-medium text-red-600">
                  -{formatCurrency(calc.capitalDeduction + calc.benefitDeduction)}
                </span>
              </div>
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

      {/* Tariff Income Details */}
      {calc.capitalDeductionDetails && calc.capitalDeductionDetails.tariffIncome > 0 && (
        <div className="bg-white border border-slate-300 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-medium">Tariff Income from Savings</span>
            <span className="font-medium text-red-600">
              -{formatCurrency(calc.capitalDeductionDetails.tariffIncome)}
            </span>
          </div>
          {calc.capitalDeductionDetails.explanation && (
            <p className="text-sm text-gray-600 mt-2">{calc.capitalDeductionDetails.explanation}</p>
          )}
        </div>
      )}

      {/* Capital Deduction Details (other cases) */}
      {calc.capitalDeductionDetails &&
        calc.capitalDeductionDetails.explanation &&
        calc.capitalDeductionDetails.tariffIncome === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">{calc.capitalDeductionDetails.explanation}</p>
          </div>
        )}

      {/* Child Benefit Section */}
      {data && data.children > 0 && (
        <div className="bg-white border border-slate-300 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Child Benefit</h3>
            <button
              type="button"
              onClick={() => setShowChildBenefitWeekly(!showChildBenefitWeekly)}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              {showChildBenefitWeekly ? 'Hide' : 'See'} weekly amount
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Child Benefit (Monthly)</span>
              <span className="font-medium">
                {formatCurrency(childBenefitResults.monthlyAmount)}
              </span>
            </div>
            {showChildBenefitWeekly && (
              <>
                <div className="flex justify-between">
                  <span>Child Benefit (Weekly)</span>
                  <span className="font-medium">
                    {formatCurrency(childBenefitResults.weeklyAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Child Benefit (Yearly)</span>
                  <span className="font-medium">
                    {formatCurrency(childBenefitResults.yearlyAmount)}
                  </span>
                </div>
                {childBenefitResults.breakdown && childBenefitResults.breakdown.length > 0 && (
                  <div className="border-t pt-3 mt-3 space-y-1">
                    {childBenefitResults.breakdown.map((child: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{child.description}</span>
                        <span>{formatCurrency(child.rate)} per week</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          <div className="mt-4 pt-4 border-t text-sm text-gray-600">
            <p>
              <strong>Note:</strong> Child Benefit is not means-tested but may be subject to the
              High Income Child Benefit Charge if you or your partner earn over £60,000 per year.
            </p>
            <p className="mt-2">
              Rates based on official government rates from{' '}
              <a
                href="https://www.gov.uk/government/publications/rates-and-allowances-tax-credits-child-benefit-and-guardians-allowance/tax-credits-child-benefit-and-guardians-allowance"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                GOV.UK
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Local Housing Allowance Panel for Private Tenants */}
      {data && data.tenantType === 'private' && calc.lhaDetails && (
        <div className="bg-white border border-slate-300 rounded-lg overflow-hidden mb-6">
          <div
            className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100"
            onClick={() => setShowLhaPanel(!showLhaPanel)}
          >
            <h3 className="font-semibold">Local Housing Allowance</h3>
            <button type="button" className="text-xl font-bold text-gray-600">
              {showLhaPanel ? '−' : '+'}
            </button>
          </div>
          {showLhaPanel && (
            <div className="p-6 space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Broad Rental Market Area:</span>
                <span>{calc.lhaDetails.brma || 'Not selected'}</span>
              </div>
              <div
                className={`flex justify-between ${
                  calc.lhaDetails.bedroomEntitlement === 'shared' ? 'bg-blue-50 p-2 rounded' : ''
                }`}
              >
                <span className="font-medium">Shared room LHA rate:</span>
                <span>{formatCurrency(calc.lhaDetails.sharedRate || 0)}</span>
              </div>
              <div
                className={`flex justify-between ${
                  calc.lhaDetails.bedroomEntitlement === 1 ? 'bg-blue-50 p-2 rounded' : ''
                }`}
              >
                <span className="font-medium">1 bedroom LHA rate:</span>
                <span>{formatCurrency(calc.lhaDetails.oneBedRate || 0)}</span>
              </div>
              <div
                className={`flex justify-between ${
                  calc.lhaDetails.bedroomEntitlement === 2 ? 'bg-blue-50 p-2 rounded' : ''
                }`}
              >
                <span className="font-medium">2 bedroom LHA rate:</span>
                <span>{formatCurrency(calc.lhaDetails.twoBedRate || 0)}</span>
              </div>
              <div
                className={`flex justify-between ${
                  calc.lhaDetails.bedroomEntitlement === 3 ? 'bg-blue-50 p-2 rounded' : ''
                }`}
              >
                <span className="font-medium">3 bedroom LHA rate:</span>
                <span>{formatCurrency(calc.lhaDetails.threeBedRate || 0)}</span>
              </div>
              <div
                className={`flex justify-between ${
                  calc.lhaDetails.bedroomEntitlement === 4 ? 'bg-blue-50 p-2 rounded' : ''
                }`}
              >
                <span className="font-medium">4 bedroom LHA rate:</span>
                <span>{formatCurrency(calc.lhaDetails.fourBedRate || 0)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="font-medium">Your bedroom entitlement:</span>
                  <span>{calc.lhaDetails.bedroomEntitlement}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-medium">Relevant LHA rate:</span>
                  <span>{formatCurrency(calc.lhaDetails.lhaMonthly || 0)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="font-medium">Current rent amount:</span>
                  <span>{formatCurrency(calc.lhaDetails.actualRent || 0)} / Monthly</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Earnings Breakdown with Pension Contributions */}
      {(data.employmentType === 'employed' ||
        (data.circumstances === 'couple' && data.partnerEmploymentType === 'employed')) && (
        <div className="bg-white border border-slate-300 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Earnings Breakdown</h3>
          <div className="space-y-3">
            {/* Main person earnings */}
            {data.employmentType === 'employed' &&
              convertToMonthly(data.monthlyEarnings, data.monthlyEarningsPeriod) > 0 && (
                <>
                  <div className="flex justify-between">
                    <span>Your Gross Earnings</span>
                    <span className="font-medium">
                      {formatCurrency(
                        convertToMonthly(data.monthlyEarnings, data.monthlyEarningsPeriod)
                      )}
                    </span>
                  </div>
                  {data.pensionType === 'amount' &&
                    convertToMonthly(data.pensionAmount, data.pensionAmountPeriod) > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Your Pension Contribution (Fixed)</span>
                        <span className="font-medium">
                          -
                          {formatCurrency(
                            convertToMonthly(data.pensionAmount, data.pensionAmountPeriod)
                          )}
                        </span>
                      </div>
                    )}
                  {data.pensionType === 'percentage' && data.pensionPercentage > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Your Pension Contribution ({data.pensionPercentage}%)</span>
                      <span className="font-medium">
                        -
                        {formatCurrency(
                          UniversalCreditCalculator.calculateUIPensionContribution(
                            convertToMonthly(data.monthlyEarnings, data.monthlyEarningsPeriod),
                            'percentage',
                            0,
                            data.pensionPercentage,
                            taxYear
                          )
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Your Net Earnings</span>
                    <span className="font-medium">
                      {formatCurrency(
                        UniversalCreditCalculator.calculateUINetEarnings(
                          convertToMonthly(data.monthlyEarnings, data.monthlyEarningsPeriod),
                          data.pensionType,
                          convertToMonthly(data.pensionAmount, data.pensionAmountPeriod),
                          data.pensionPercentage,
                          taxYear
                        )
                      )}
                    </span>
                  </div>
                </>
              )}

            {/* Partner earnings */}
            {data.circumstances === 'couple' &&
              data.partnerEmploymentType === 'employed' &&
              convertToMonthly(data.partnerMonthlyEarnings, data.partnerMonthlyEarningsPeriod) >
                0 && (
                <>
                  <div className="flex justify-between border-t pt-3 mt-3">
                    <span>Partner's Gross Earnings</span>
                    <span className="font-medium">
                      {formatCurrency(
                        convertToMonthly(
                          data.partnerMonthlyEarnings,
                          data.partnerMonthlyEarningsPeriod
                        )
                      )}
                    </span>
                  </div>
                  {data.partnerPensionType === 'amount' &&
                    convertToMonthly(data.partnerPensionAmount, data.partnerPensionAmountPeriod) >
                      0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Partner's Pension Contribution (Fixed)</span>
                        <span className="font-medium">
                          -
                          {formatCurrency(
                            convertToMonthly(
                              data.partnerPensionAmount,
                              data.partnerPensionAmountPeriod
                            )
                          )}
                        </span>
                      </div>
                    )}
                  {data.partnerPensionType === 'percentage' &&
                    data.partnerPensionPercentage > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>
                          Partner's Pension Contribution ({data.partnerPensionPercentage}%)
                        </span>
                        <span className="font-medium">
                          -
                          {formatCurrency(
                            UniversalCreditCalculator.calculateUIPensionContribution(
                              convertToMonthly(
                                data.partnerMonthlyEarnings,
                                data.partnerMonthlyEarningsPeriod
                              ),
                              'percentage',
                              0,
                              data.partnerPensionPercentage,
                              taxYear
                            )
                          )}
                        </span>
                      </div>
                    )}
                  <div className="flex justify-between">
                    <span>Partner's Net Earnings</span>
                    <span className="font-medium">
                      {formatCurrency(
                        UniversalCreditCalculator.calculateUINetEarnings(
                          convertToMonthly(
                            data.partnerMonthlyEarnings,
                            data.partnerMonthlyEarningsPeriod
                          ),
                          data.partnerPensionType,
                          convertToMonthly(
                            data.partnerPensionAmount,
                            data.partnerPensionAmountPeriod
                          ),
                          data.partnerPensionPercentage,
                          taxYear
                        )
                      )}
                    </span>
                  </div>
                </>
              )}

            {/* Total household earnings */}
            {((data.employmentType === 'employed' &&
              convertToMonthly(data.monthlyEarnings, data.monthlyEarningsPeriod) > 0) ||
              (data.circumstances === 'couple' &&
                data.partnerEmploymentType === 'employed' &&
                convertToMonthly(data.partnerMonthlyEarnings, data.partnerMonthlyEarningsPeriod) >
                  0)) && (
              <div className="flex justify-between border-t pt-3 mt-3 font-semibold">
                <span>Total Net Earnings (after pension)</span>
                <span>
                  {formatCurrency(
                    (data.employmentType === 'employed'
                      ? UniversalCreditCalculator.calculateUINetEarnings(
                          convertToMonthly(data.monthlyEarnings, data.monthlyEarningsPeriod),
                          data.pensionType,
                          convertToMonthly(data.pensionAmount, data.pensionAmountPeriod),
                          data.pensionPercentage,
                          taxYear
                        )
                      : 0) +
                      (data.circumstances === 'couple' && data.partnerEmploymentType === 'employed'
                        ? UniversalCreditCalculator.calculateUINetEarnings(
                            convertToMonthly(
                              data.partnerMonthlyEarnings,
                              data.partnerMonthlyEarningsPeriod
                            ),
                            data.partnerPensionType,
                            convertToMonthly(
                              data.partnerPensionAmount,
                              data.partnerPensionAmountPeriod
                            ),
                            data.partnerPensionPercentage,
                            taxYear
                          )
                        : 0)
                  )}
                </span>
              </div>
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
