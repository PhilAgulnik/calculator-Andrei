/**
 * Comprehensive Benefit Calculator
 * Handles both Universal Credit and Child Benefit calculations
 */

import { UniversalCreditCalculator } from './calculator'
import { childBenefitCalculator } from './childBenefitCalculator'

export class BenefitCalculator {
  private ucCalculator: any
  private childBenefitCalculator: any

  constructor() {
    this.ucCalculator = new UniversalCreditCalculator()
    this.childBenefitCalculator = childBenefitCalculator
  }

  /**
   * Calculate all benefits for the given form data
   * @param {Object} formData - Form data from the calculator form
   * @returns {Object} Complete benefit calculation results
   */
  calculateAllBenefits(formData: any) {
    const taxYear = formData.taxYear || '2024_25'

    // Calculate Universal Credit
    const ucResults = this.ucCalculator.calculate(formData)

    // Calculate Child Benefit
    const childBenefitResults = this.childBenefitCalculator.calculateChildBenefit(formData, taxYear)

    // Extract UC amounts (convert monthly to weekly/yearly)
    const ucMonthlyAmount = ucResults.calculation.finalAmount
    const ucWeeklyAmount = ucMonthlyAmount / 4.33 // Average weeks per month
    const ucYearlyAmount = ucWeeklyAmount * 52

    // Calculate total benefits
    const totalWeeklyBenefits = ucWeeklyAmount + childBenefitResults.weeklyAmount
    const totalMonthlyBenefits = ucMonthlyAmount + childBenefitResults.monthlyAmount
    const totalYearlyBenefits = ucYearlyAmount + childBenefitResults.yearlyAmount

    return {
      taxYear: taxYear,
      universalCredit: {
        ...ucResults,
        weeklyAmount: ucWeeklyAmount,
        monthlyAmount: ucMonthlyAmount,
        yearlyAmount: ucYearlyAmount,
        type: 'Universal Credit',
      },
      childBenefit: {
        ...childBenefitResults,
        type: 'Child Benefit',
      },
      totals: {
        weekly: totalWeeklyBenefits,
        monthly: totalMonthlyBenefits,
        yearly: totalYearlyBenefits,
      },
      summary: {
        hasChildren: formData.children > 0,
        isEligibleForChildBenefit: formData.children > 0,
        isEligibleForUC: ucMonthlyAmount > 0,
        totalBenefits: totalMonthlyBenefits,
      },
    }
  }

  /**
   * Get calculation breakdown for display
   * @param {Object} formData - Form data from the calculator form
   * @returns {Object} Formatted results for display
   */
  getCalculationBreakdown(formData: any) {
    const results = this.calculateAllBenefits(formData)

    // Format UC breakdown from the calculation details
    const ucBreakdown = []
    if (results.universalCredit.calculation) {
      const calc = results.universalCredit.calculation
      if (calc.standardAllowance > 0)
        ucBreakdown.push({ label: 'Standard Allowance', amount: calc.standardAllowance })
      if (calc.housingElement > 0)
        ucBreakdown.push({ label: 'Housing Element', amount: calc.housingElement })
      if (calc.childElement > 0)
        ucBreakdown.push({ label: 'Child Element', amount: calc.childElement })
      if (calc.childcareElement > 0)
        ucBreakdown.push({ label: 'Childcare Element', amount: calc.childcareElement })
      if (calc.carerElement > 0)
        ucBreakdown.push({ label: 'Carer Element', amount: calc.carerElement })
      if (calc.lcwraElement > 0)
        ucBreakdown.push({ label: 'LCWRA Element', amount: calc.lcwraElement })
      if (calc.earningsReduction > 0) {
        const label =
          calc.workAllowance > 0
            ? `Earnings Reduction after work allowance of £${calc.workAllowance.toFixed(2)}`
            : 'Earnings Reduction'
        ucBreakdown.push({ label, amount: -calc.earningsReduction })
      }
      if (calc.capitalDeduction > 0)
        ucBreakdown.push({ label: 'Capital Deduction', amount: -calc.capitalDeduction })
      if (calc.benefitDeduction > 0)
        ucBreakdown.push({ label: 'Benefit Deduction', amount: -calc.benefitDeduction })
    }

    return {
      taxYear: results.taxYear,
      benefits: [
        {
          name: 'Universal Credit',
          amount: results.universalCredit.monthlyAmount,
          weekly: results.universalCredit.weeklyAmount,
          monthly: results.universalCredit.monthlyAmount,
          yearly: results.universalCredit.yearlyAmount,
          breakdown: ucBreakdown,
          type: 'means-tested',
        },
        {
          name: 'Child Benefit',
          amount: results.childBenefit.monthlyAmount,
          weekly: results.childBenefit.weeklyAmount,
          monthly: results.childBenefit.monthlyAmount,
          yearly: results.childBenefit.yearlyAmount,
          breakdown: results.childBenefit.breakdown || [],
          type: 'non-means-tested',
          showWhen: results.summary.hasChildren,
          highIncomeChargeMessage: results.childBenefit.highIncomeChargeMessage,
        },
      ],
      totals: results.totals,
      summary: results.summary,
    }
  }
}

// Export a singleton instance
export const benefitCalculator = new BenefitCalculator()
