import { useEffect, useState } from 'react'

import { Alert } from '~/components/Alert'
import { formatCurrency } from '~/utils/functions'
import { Page } from '~/products/shared/Page'
import { Button } from '~/components/Button'

import { childBenefitCalculator } from './utils/childBenefitCalculator'
import { getPensionAgeWarningType } from './utils/pensionAgeCalculator'
import { UniversalCreditCalculator } from './utils/calculator'
import { calculateNetEarnings } from './utils/netEarningsCalculator'
import { useWorkflow } from '../shared/use-workflow'

import { DEFAULT_VALUES } from './constants'
import { Accordion } from '~/components/Accordion'
import { BetterOffCalculator } from './components/BetterOffCalculator'
import { SavedScenarios } from './components/SavedScenarios'
import { SaveScenarioDialog } from './components/SaveScenarioDialog'
import { PDFExportButton } from './components/PDFExportButton'
import { CarerModule } from './components/CarerModule'
import { NetEarningsModule } from './components/NetEarningsModule'
import { StatePensionAgeWarning } from './components/StatePensionAgeWarning'
import { ChildBenefitChargeCalculator } from './components/ChildBenefitChargeCalculator'
import { addScenario, generateScenarioName, generateScenarioId } from './utils/scenarioStorage'
import type { SavedScenario } from './types/saved-scenarios'
import type { CarerAssessment } from './types/carer-module'
import type { NetEarningsCalculation } from './types/net-earnings'
import type { ChildBenefitChargeCalculation } from './types/child-benefit-charge'

export function Results() {
  const workflow = useWorkflow()
  const entry = workflow.entry
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showChildBenefitWeekly, setShowChildBenefitWeekly] = useState(false)
  const [showLhaPanel, setShowLhaPanel] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showSavedScenarios, setShowSavedScenarios] = useState(false)
  const [refreshScenarios, setRefreshScenarios] = useState(0)
  const [showCarerAssessment, setShowCarerAssessment] = useState(false)
  const [carerAssessment, setCarerAssessment] = useState<CarerAssessment | null>(null)
  const [partnerCarerAssessment, setPartnerCarerAssessment] = useState<CarerAssessment | null>(null)
  const [showNetEarnings, setShowNetEarnings] = useState(false)
  const [netEarningsResult, setNetEarningsResult] = useState<NetEarningsCalculation | null>(null)
  const [childBenefitChargeResult, setChildBenefitChargeResult] = useState<ChildBenefitChargeCalculation | null>(null)

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

  // Helper function to calculate adjusted net income for HICBC
  // Adjusted net income = gross earnings - pension contributions
  const calculateAdjustedNetIncome = (
    earnings: number,
    earningsPeriod: string,
    pensionType: string,
    pensionAmount: number,
    pensionAmountPeriod: string,
    pensionPercentage: number
  ): number => {
    if (!earnings || earnings === 0) return 0

    // Convert gross earnings to annual
    const monthlyGross = convertToMonthly(earnings, earningsPeriod)
    const annualGross = monthlyGross * 12

    // Calculate annual pension contributions
    let annualPension = 0
    if (pensionType === 'amount' && pensionAmount) {
      const monthlyPension = convertToMonthly(pensionAmount, pensionAmountPeriod)
      annualPension = monthlyPension * 12
    } else if (pensionType === 'percentage' && pensionPercentage) {
      annualPension = annualGross * (pensionPercentage / 100)
    }

    // Return adjusted net income (cannot be negative)
    return Math.max(0, annualGross - annualPension)
  }

  useEffect(() => {
    const calculate = async () => {
      setLoading(true)
      setError(null)

      try {
        // Check pension age warning - only block if BOTH are over pension age
        // Mixed-age couples ('mixed') should still see calculations
        const warningType = getPensionAgeWarningType(data)
        if (warningType === 'over') {
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

  // Handle saving scenario
  const handleSaveScenario = (name: string, description?: string, tags?: string[]) => {
    if (!results || !data) return

    const scenario: SavedScenario = {
      id: generateScenarioId(),
      name,
      description,
      taxYear: data.taxYear || '2025_26',
      savedAt: new Date().toISOString(),
      tags,
      formData: data,
      results: results,
    }

    const success = addScenario(scenario)
    if (success) {
      setShowSaveDialog(false)
      setRefreshScenarios((prev) => prev + 1)
      alert('Scenario saved successfully!')
    } else {
      alert('Failed to save scenario. Please try again.')
    }
  }

  // Handle loading scenario
  const handleLoadScenario = (scenario: SavedScenario) => {
    workflow.updateEntryData(scenario.formData)
    // Results will be recalculated automatically via useEffect
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Generate suggested scenario name
  const getSuggestedScenarioName = (): string => {
    const circumstances = data.circumstances === 'single' ? 'Single' : 'Couple'
    const children = data.children > 0 ? `, ${data.children} child${data.children > 1 ? 'ren' : ''}` : ''
    return `${circumstances}${children} - ${formatCurrency(results?.calculation?.finalAmount || 0)}`
  }

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

  // Calculate adjusted net income for High Income Child Benefit Charge
  const claimantAdjustedIncome = calculateAdjustedNetIncome(
    data.monthlyEarnings || 0,
    data.monthlyEarningsPeriod || 'per_month',
    data.pensionType || 'amount',
    data.pensionAmount || 0,
    data.pensionAmountPeriod || 'per_month',
    data.pensionPercentage || 0
  )

  const partnerAdjustedIncome = data.circumstances === 'couple'
    ? calculateAdjustedNetIncome(
        data.partnerMonthlyEarnings || 0,
        data.partnerMonthlyEarningsPeriod || 'per_month',
        data.partnerPensionType || 'amount',
        data.partnerPensionAmount || 0,
        data.partnerPensionAmountPeriod || 'per_month',
        data.partnerPensionPercentage || 0
      )
    : 0

  // Determine if household is affected by HICBC (income over £60,000)
  const higherIncome = Math.max(claimantAdjustedIncome, partnerAdjustedIncome)
  const isAffectedByHICBC = higherIncome > 60000

  return (
    <Page.Main>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Calculation Results</h1>
        <a
          href="/calculator-Andrei/admin"
          className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1"
        >
          <span>⚙️</span>
          Admin
        </a>
      </div>

      {/* State Pension Age Warning */}
      <StatePensionAgeWarning
        claimantAge={data.age || 0}
        partnerAge={data.partnerAge}
        circumstances={data.circumstances || 'single'}
      />

      <div className="grid gap-6">
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

              <div className="flex justify-between py-2 border-t border-slate-200">
                <span>
                  {calc.workAllowance > 0
                    ? `Earnings Reduction after work allowance of ${formatCurrency(calc.workAllowance)}`
                    : 'Earnings Reduction'}
                </span>
                <span className="font-medium text-red-600">
                  -{formatCurrency(calc.earningsReduction.toFixed(2))}
                </span>
              </div>

              {/* Show Minimum Income Floor details if applicable */}
              {calc.mifDetails && calc.mifDetails.combined.mifApplies && (
                <div className="border-t border-slate-200 py-2">
                  <div className="flex justify-between">
                    <span>Minimum Income Floor Applied</span>
                    <span className="font-medium text-blue-600">
                      {formatCurrency(calc.mifDetails.combined.ucEarningsThreshold)} assumed earnings
                    </span>
                  </div>
                  <div className="mt-2 space-y-2">
                    <Accordion
                      title="See Minimum Income Floor Details"
                      open={false}
                    >
                      <div className="bg-gray-50 border border-gray-200 rounded p-4 text-sm space-y-3">
                        <p className="text-gray-700">
                          The Minimum Income Floor (MIF) assumes a minimum level of earnings based on work hour
                          requirements and the National Minimum Wage.
                        </p>

                        {calc.mifDetails.person1 && calc.mifDetails.person1.mifApplies && (
                          <div className="bg-white p-3 rounded border border-gray-300">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              {data.circumstances === 'couple' ? 'Main Claimant' : 'Your MIF'}
                            </h4>
                            <div className="grid gap-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Work hours conditionality:</span>
                                <span className="font-medium">{calc.mifDetails.person1.workHours} hours/week</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Minimum wage rate:</span>
                                <span className="font-medium">£{calc.mifDetails.person1.minimumWage.toFixed(2)}/hour</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">MIF (monthly):</span>
                                <span className="font-medium">£{calc.mifDetails.person1.ucEarningsThreshold.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Actual self-employed earnings:</span>
                                <span className="font-medium">£{calc.mifDetails.person1.actualEarnings.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between border-t border-gray-300 pt-1 mt-1">
                                <span className="text-gray-900 font-semibold">Income used in UC calculation:</span>
                                <span className="font-semibold text-blue-600">
                                  £{calc.mifDetails.person1.incomeUsedForUC.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {calc.mifDetails.person2 && calc.mifDetails.person2.mifApplies && (
                          <div className="bg-white p-3 rounded border border-gray-300">
                            <h4 className="font-semibold text-gray-900 mb-2">Partner's MIF</h4>
                            <div className="grid gap-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Work hours conditionality:</span>
                                <span className="font-medium">{calc.mifDetails.person2.workHours} hours/week</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Minimum wage rate:</span>
                                <span className="font-medium">£{calc.mifDetails.person2.minimumWage.toFixed(2)}/hour</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">MIF (monthly):</span>
                                <span className="font-medium">£{calc.mifDetails.person2.ucEarningsThreshold.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Actual self-employed earnings:</span>
                                <span className="font-medium">£{calc.mifDetails.person2.actualEarnings.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between border-t border-gray-300 pt-1 mt-1">
                                <span className="text-gray-900 font-semibold">Income used in UC calculation:</span>
                                <span className="font-semibold text-blue-600">
                                  £{calc.mifDetails.person2.incomeUsedForUC.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {data.circumstances === 'couple' && (
                          <div className="bg-blue-50 p-3 rounded border border-blue-300">
                            <h4 className="font-semibold text-gray-900 mb-2">Combined Total</h4>
                            <div className="grid gap-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-700">Combined MIF:</span>
                                <span className="font-medium">£{calc.mifDetails.combined.ucEarningsThreshold.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-700">Combined actual earnings:</span>
                                <span className="font-medium">£{calc.mifDetails.combined.actualEarnings.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between border-t border-blue-400 pt-1 mt-1">
                                <span className="text-gray-900 font-semibold">Combined income used:</span>
                                <span className="font-semibold text-blue-700">
                                  £{calc.mifDetails.combined.incomeUsedForUC.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        <p className="text-xs text-gray-600 italic">
                          The MIF only applies to self-employed people who have been trading for more than
                          12 months. If your actual earnings are higher than the MIF, your actual earnings
                          are used in the calculation instead.
                        </p>
                      </div>
                    </Accordion>
                  </div>
                </div>
              )}

              <div className="flex justify-between py-2 border-t border-slate-200">
                <span>Other Deductions</span>
                <span className="font-medium text-red-600">
                  -{formatCurrency(calc.capitalDeduction + calc.benefitDeduction)}
                </span>
              </div>

              {/* Show tariff income details if applicable */}
              {calc.capitalDeductionDetails && calc.capitalDeductionDetails.tariffIncome > 0 && (
                <div className="border-t border-slate-200 py-2">
                  <div className="flex justify-between">
                    <span>Tariff Income from Savings</span>
                    <span className="font-medium text-red-600">
                      -{formatCurrency(calc.capitalDeductionDetails.tariffIncome)}
                    </span>
                  </div>
                  {calc.capitalDeductionDetails.explanation && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        {calc.capitalDeductionDetails.explanation}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between py-2 border-t-2 border-slate-300 text-xl font-bold">
                <span>Final Universal Credit</span>
                <span className="text-blue-700">£{calc.finalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Child Benefit Section */}
        {data && data.children > 0 && (
          <div className="bg-white border border-slate-300 rounded-lg overflow-hidden">
            <div className="bg-blue-50 border-b border-blue-200 p-6">
              <h2 className="text-2xl font-semibold mb-2">Child Benefit</h2>
              <p className="text-4xl font-bold text-slate-800">
                £{childBenefitResults.monthlyAmount.toFixed(2)}{' '}
                <span className="text-lg">per month</span>
              </p>
            </div>

            <div className="p-6">
              <Accordion
                open={showChildBenefitWeekly}
                onToggle={setShowChildBenefitWeekly}
                title={`${showChildBenefitWeekly ? 'Hide' : 'See'} weekly amount`}
              >
                <div className="space-y-2 mt-4">
                  <div className="flex justify-between py-2 border-t border-slate-200">
                    <span>Child Benefit (Monthly)</span>
                    <span className="font-medium">
                      {formatCurrency(childBenefitResults.monthlyAmount)}
                    </span>
                  </div>

                  {showChildBenefitWeekly && (
                    <>
                      <div className="flex justify-between py-2 border-t border-slate-200">
                        <span>Child Benefit (Weekly)</span>
                        <span className="font-medium">
                          {formatCurrency(childBenefitResults.weeklyAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-t border-slate-200">
                        <span>Child Benefit (Yearly)</span>
                        <span className="font-medium">
                          {formatCurrency(childBenefitResults.yearlyAmount)}
                        </span>
                      </div>
                      {childBenefitResults.breakdown &&
                        childBenefitResults.breakdown.length > 0 && (
                          <>
                            {childBenefitResults.breakdown.map((child: any, index: number) => (
                              <div
                                key={index}
                                className="flex justify-between py-2 border-t border-slate-200 text-sm"
                              >
                                <span className="text-gray-600">{child.description}</span>
                                <span>{formatCurrency(child.rate)} per week</span>
                              </div>
                            ))}
                          </>
                        )}
                    </>
                  )}
                </div>
              </Accordion>

              {/* High Income Child Benefit Charge Calculator */}
              {isAffectedByHICBC && (
                <div className="mt-6 pt-6 border-t border-slate-300">
                  <ChildBenefitChargeCalculator
                    numberOfChildren={data.children}
                    claimantIncome={claimantAdjustedIncome}
                    partnerIncome={partnerAdjustedIncome}
                    onCalculationComplete={(result) => {
                      setChildBenefitChargeResult(result)
                    }}
                  />
                </div>
              )}

              <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                <p className="mt-2">
                  Child Benefit rates based on official government rates from{' '}
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
        {(() => {
          const hasMainEarnings = convertToMonthly(data.monthlyEarnings, data.monthlyEarningsPeriod || 'per_month') > 0
          const hasPartnerEarnings = data.circumstances === 'couple' &&
            convertToMonthly(data.partnerMonthlyEarnings, data.partnerMonthlyEarningsPeriod || 'per_month') > 0

          if (!hasMainEarnings && !hasPartnerEarnings) return null

          // Calculate net earnings using the proper function
          let mainNetCalc = null
          if (hasMainEarnings) {
            const pensionType = data.pensionType || 'amount'
            const pensionPercentage = pensionType === 'percentage'
              ? (data.pensionPercentage || 3)
              : (data.pensionAmount && data.monthlyEarnings)
                ? (convertToMonthly(data.pensionAmount, data.pensionAmountPeriod || 'per_month') / convertToMonthly(data.monthlyEarnings, data.monthlyEarningsPeriod || 'per_month')) * 100
                : 0

            mainNetCalc = calculateNetEarnings(
              {
                amount: data.monthlyEarnings || 0,
                period: data.monthlyEarningsPeriod || 'per_month',
              },
              {
                pension: pensionPercentage > 0 ? {
                  enabled: true,
                  percentage: pensionPercentage,
                } : undefined,
              }
            )
          }

          return (
            <div className="bg-white border border-slate-300 rounded-lg overflow-hidden p-6">
              <h3 className="text-xl font-semibold mb-4">Earnings Breakdown</h3>
              <div className="grid">
                {/* Main person earnings */}
                {hasMainEarnings && mainNetCalc && (
                  <>
                    <div className="flex justify-between py-2 border-t border-slate-200">
                      <span>Your Gross Earnings</span>
                      <span className="font-medium">
                        {formatCurrency(mainNetCalc.tax.grossAnnual / 12)}
                      </span>
                    </div>
                    {mainNetCalc.tax.totalTax > 0 && (
                      <div className="flex justify-between py-2 border-t border-slate-200">
                        <span className="pl-4">Less: Income Tax</span>
                        <span className="font-medium text-red-600">
                          -{formatCurrency(mainNetCalc.tax.totalTax / 12)}
                        </span>
                      </div>
                    )}
                    {mainNetCalc.ni.totalNI > 0 && (
                      <div className="flex justify-between py-2 border-t border-slate-200">
                        <span className="pl-4">Less: National Insurance</span>
                        <span className="font-medium text-red-600">
                          -{formatCurrency(mainNetCalc.ni.totalNI / 12)}
                        </span>
                      </div>
                    )}
                    {mainNetCalc.pension && mainNetCalc.pension.employeeContributionAnnual > 0 && (
                      <div className="flex justify-between py-2 border-t border-slate-200">
                        <span className="pl-4">Less: Pension ({mainNetCalc.pension.percentage}%)</span>
                        <span className="font-medium text-red-600">
                          -{formatCurrency(mainNetCalc.pension.employeeContributionAnnual / 12)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-t-2 border-slate-300 font-semibold">
                      <span>Your Net Earnings</span>
                      <span className="text-green-700">
                        {formatCurrency(mainNetCalc.monthlyNet)}
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
                    <div className="flex justify-between py-2 border-t border-slate-200">
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
                        <div className="flex justify-between py-2 border-t border-slate-200">
                          <span>Partner's Pension Contribution (Fixed)</span>
                          <span className="font-medium text-red-600">
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
                        <div className="flex justify-between py-2 border-t border-slate-200">
                          <span>
                            Partner's Pension Contribution ({data.partnerPensionPercentage}%)
                          </span>
                          <span className="font-medium text-red-600">
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
                    <div className="flex justify-between py-2 border-t border-slate-200">
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
                <div className="flex justify-between py-2 border-t border-slate-200 font-[600]">
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
                        (data.circumstances === 'couple' &&
                        data.partnerEmploymentType === 'employed'
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
        )
      })()}

        {/* Capital Deduction Details (other cases) */}
        {calc.capitalDeductionDetails &&
          calc.capitalDeductionDetails.explanation &&
          calc.capitalDeductionDetails.tariffIncome === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">{calc.capitalDeductionDetails.explanation}</p>
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

        {/* Better-Off Calculator */}
        {calc && (
          <BetterOffCalculator
            currentUCAmount={calc.finalAmount}
            hasHousingCosts={
              data.housingStatus === 'renting' && (data.rent > 0 || data.serviceCharges > 0)
            }
            hasChildren={data.children > 0}
            hasLCWRA={data.hasLCWRA === 'yes' || data.partnerHasLCWRA === 'yes'}
            onCalculationComplete={(result) => {
              console.log('Better-Off Calculation:', result)
            }}
          />
        )}

        {/* Carer Assessment Section */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-blue-600">Carer Eligibility Assessment</h2>
              <p className="text-sm text-gray-600 mt-1">
                Get detailed guidance on UC Carer Element and Carer's Allowance eligibility
              </p>
            </div>
            <Button
              onClick={() => setShowCarerAssessment(!showCarerAssessment)}
              className="bg-purple-600 text-white hover:bg-purple-700 px-6 py-2"
            >
              {showCarerAssessment ? 'Hide' : 'Show'} Assessment
            </Button>
          </div>

          {showCarerAssessment && (
            <div className="space-y-6">
              {/* Claimant Carer Module */}
              <CarerModule
                personType="claimant"
                currentEarnings={convertToMonthly(data.earnings || 0, data.earningsFrequency)}
                onCarerStatusChange={(assessment) => {
                  setCarerAssessment(assessment)
                  console.log('Claimant Carer Assessment:', assessment)
                }}
              />

              {/* Partner Carer Module (if couple) */}
              {data.circumstances === 'couple' && (
                <CarerModule
                  personType="partner"
                  currentEarnings={convertToMonthly(
                    data.partnerEarnings || 0,
                    data.partnerEarningsFrequency
                  )}
                  onCarerStatusChange={(assessment) => {
                    setPartnerCarerAssessment(assessment)
                    console.log('Partner Carer Assessment:', assessment)
                  }}
                />
              )}

              {/* Summary of carer eligibility */}
              {(carerAssessment?.isCarer || partnerCarerAssessment?.isCarer) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Carer Eligibility Summary
                  </h3>
                  {carerAssessment?.isCarer && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900">Claimant:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 ml-2">
                        <li>
                          UC Carer Element:{' '}
                          {carerAssessment.eligibleForCarerElement ? (
                            <span className="text-green-600 font-semibold">
                              ✅ Eligible (£201.68/month)
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold">❌ Not Eligible</span>
                          )}
                        </li>
                        <li>
                          Carer's Allowance:{' '}
                          {carerAssessment.eligibleForCarersAllowance ? (
                            <span className="text-green-600 font-semibold">
                              ✅ Eligible (£81.90/week)
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold">❌ Not Eligible</span>
                          )}
                        </li>
                      </ul>
                    </div>
                  )}
                  {partnerCarerAssessment?.isCarer && (
                    <div>
                      <h4 className="font-semibold text-gray-900">Partner:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 ml-2">
                        <li>
                          UC Carer Element:{' '}
                          {partnerCarerAssessment.eligibleForCarerElement ? (
                            <span className="text-green-600 font-semibold">
                              ✅ Eligible (£201.68/month)
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold">❌ Not Eligible</span>
                          )}
                        </li>
                        <li>
                          Carer's Allowance:{' '}
                          {partnerCarerAssessment.eligibleForCarersAllowance ? (
                            <span className="text-green-600 font-semibold">
                              ✅ Eligible (£81.90/week)
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold">❌ Not Eligible</span>
                          )}
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Net Earnings Calculator Section */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-blue-600">Net Earnings Calculator</h2>
              <p className="text-sm text-gray-600 mt-1">
                Calculate your take-home pay after tax, NI, pension, and student loan deductions
              </p>
            </div>
            <Button
              onClick={() => setShowNetEarnings(!showNetEarnings)}
              className="bg-green-600 text-white hover:bg-green-700 px-6 py-2"
            >
              {showNetEarnings ? 'Hide' : 'Show'} Calculator
            </Button>
          </div>

          {showNetEarnings && (
            <div className="space-y-4">
              <NetEarningsModule
                initialGross={
                  data.earnings
                    ? {
                        amount: data.earnings,
                        period: data.earningsFrequency === 'weekly' ? 'week' : 'month',
                      }
                    : undefined
                }
                enableManualOverride={true}
                onCalculationComplete={(result) => {
                  setNetEarningsResult(result)
                  console.log('Net Earnings Calculation:', result)
                }}
              />

              {netEarningsResult && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    💡 How This Affects Your UC
                  </h3>
                  <p className="text-sm text-gray-700">
                    Your net monthly earnings of{' '}
                    <strong>£{netEarningsResult.monthlyNet.toFixed(2)}</strong> will be used
                    in the Universal Credit taper calculation. For every £1 you earn above
                    your work allowance, your UC will be reduced by 55p (the taper rate).
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Save Scenario Section */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-blue-600">Save & Compare Scenarios</h2>
            <div className="flex gap-3">
              {results && (
                <PDFExportButton
                  scenario={{
                    id: String(entry?.id || generateScenarioId()),
                    name: generateScenarioName(),
                    taxYear: data.taxYear || '2024_2025',
                    savedAt: new Date().toISOString(),
                    formData: data,
                    results: results,
                  }}
                  className="bg-red-600 text-white hover:bg-red-700 px-6 py-2"
                />
              )}
              <Button
                onClick={() => setShowSaveDialog(true)}
                className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2"
              >
                Save This Scenario
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Save your calculation to compare with other scenarios or export to PDF for your records.
          </p>

          {/* Toggle Saved Scenarios */}
          <div className="mb-4">
            <Button
              onClick={() => setShowSavedScenarios(!showSavedScenarios)}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {showSavedScenarios ? 'Hide' : 'Show'} Saved Scenarios
            </Button>
          </div>

          {/* Saved Scenarios List */}
          {showSavedScenarios && (
            <SavedScenarios
              onLoadScenario={handleLoadScenario}
              currentScenarioId={entry?.id?.toString()}
            />
          )}
        </div>

        {/* Save Scenario Dialog */}
        {showSaveDialog && (
          <SaveScenarioDialog
            onSave={handleSaveScenario}
            onCancel={() => setShowSaveDialog(false)}
            suggestedName={getSuggestedScenarioName()}
          />
        )}
      </div>
    </Page.Main>
  )
}
