/**
 * Child Benefit Calculator
 * Calculates Child Benefit amounts based on current UK rates
 *
 * Rates sourced from: https://www.gov.uk/government/publications/rates-and-allowances-tax-credits-child-benefit-and-guardians-allowance/tax-credits-child-benefit-and-guardians-allowance
 */

export class ChildBenefitCalculator {
  rates: any
  
  constructor() {
    this.rates = {
      '2025_26': {
        eldestChild: 26.05, // per week - Official GOV.UK rate
        additionalChildren: 17.25, // per week - Official GOV.UK rate
      },
      '2024_25': {
        eldestChild: 25.6, // per week - Official GOV.UK rate
        additionalChildren: 16.95, // per week - Official GOV.UK rate
      },
      '2023_24': {
        eldestChild: 24.0, // per week - Official GOV.UK rate
        additionalChildren: 15.9, // per week - Official GOV.UK rate
      },
    }
  }

  /**
   * Calculate Child Benefit amount
   * @param {Object} formData - Form data containing children information
   * @param {string} taxYear - Tax year for rates (e.g., '2024_25')
   * @returns {Object} Child Benefit calculation results
   */
  calculateChildBenefit(formData: any, taxYear = '2024_25') {
    const children = parseInt(formData.children) || 0

    if (children === 0) {
      return {
        weeklyAmount: 0,
        monthlyAmount: 0,
        yearlyAmount: 0,
        breakdown: [],
        totalChildren: 0,
        highIncomeChargeMessage: null,
      }
    }

    const rates = this.rates[taxYear] || this.rates['2024_25']
    const breakdown = []
    let totalWeekly = 0

    // First child gets the eldest child rate
    if (children >= 1) {
      breakdown.push({
        child: 1,
        rate: rates.eldestChild,
        description: 'Eldest child',
      })
      totalWeekly += rates.eldestChild
    }

    // Additional children get the additional children rate
    for (let i = 2; i <= children; i++) {
      breakdown.push({
        child: i,
        rate: rates.additionalChildren,
        description: 'Additional child',
      })
      totalWeekly += rates.additionalChildren
    }

    // Convert to monthly and yearly amounts
    const monthlyAmount = totalWeekly * 4.33 // Average weeks per month
    const yearlyAmount = totalWeekly * 52

    // Calculate high income charge message based on earnings
    const highIncomeChargeMessage = this.getHighIncomeChargeMessage(formData)

    return {
      weeklyAmount: totalWeekly,
      monthlyAmount: monthlyAmount,
      yearlyAmount: yearlyAmount,
      breakdown: breakdown,
      totalChildren: children,
      taxYear: taxYear,
      highIncomeChargeMessage: highIncomeChargeMessage,
    }
  }

  /**
   * Get high income charge message based on earnings
   * @param {Object} formData - Form data containing earnings information
   * @returns {Object|null} High income charge message or null
   */
  getHighIncomeChargeMessage(formData: any) {
    const yearlyEarnings = this.calculateYearlyEarnings(formData)

    if (yearlyEarnings < 60000) {
      return null // No charge applies
    }

    if (yearlyEarnings >= 60000 && yearlyEarnings < 80000) {
      return {
        type: 'partial_charge',
        message:
          'You will be subject to the Child Benefit high income tax charge. The calculator does not take sufficient information to work out the exact value of the charge, but on incomes between £60,000 and £80,000 the charge will be less than the value of your Child Benefit. To find out more see {Child Benefit charge}.',
        earningsRange: '£60,000 - £79,999',
      }
    }

    if (yearlyEarnings >= 80000) {
      return {
        type: 'full_charge',
        message:
          'You will be subject to the Child Benefit high income tax charge. This charge will be the same value as your Child Benefit. You may choose to stop receiving Child Benefit but if you claim it and repay the relevant tax you will also get credits towards your state pension. To find out more about your options see {Child Benefit charge}.',
        earningsRange: '£80,000 or over',
      }
    }

    return null
  }

  /**
   * Calculate yearly earnings from form data
   * @param {Object} formData - Form data containing earnings information
   * @returns {number} Yearly earnings amount
   */
  calculateYearlyEarnings(formData: any) {
    let monthlyEarnings = 0

    // Check if employed
    if (formData.employmentType === 'employed' || !formData.employmentType) {
      const earnings = parseFloat(formData.monthlyEarnings) || 0
      const period = formData.monthlyEarningsPeriod || 'per_month'
      monthlyEarnings = this.convertToMonthly(earnings, period)
    }

    // Check if self-employed
    if (formData.employmentType === 'self-employed') {
      const businessIncome =
        (parseFloat(formData.businessIncomeBank) || 0) +
        (parseFloat(formData.businessIncomeCash) || 0)
      const businessIncomePeriod = formData.businessIncomeBankPeriod || 'per_month'
      const businessExpenses = this.calculateTotalBusinessExpenses(formData)
      const businessExpensesPeriod = 'per_month' // Assuming monthly for expenses

      const monthlyBusinessIncome = this.convertToMonthly(businessIncome, businessIncomePeriod)
      const monthlyBusinessExpenses = this.convertToMonthly(
        businessExpenses,
        businessExpensesPeriod
      )

      monthlyEarnings = Math.max(0, monthlyBusinessIncome - monthlyBusinessExpenses)
    }

    // Convert to yearly
    return monthlyEarnings * 12
  }

  /**
   * Calculate total business expenses from form data
   * @param {Object} formData - Form data containing business expense information
   * @returns {number} Total monthly business expenses
   */
  calculateTotalBusinessExpenses(formData: any) {
    const expenses = [
      'businessExpensesRent',
      'businessExpensesRates',
      'businessExpensesUtilities',
      'businessExpensesInsurance',
      'businessExpensesTelephone',
      'businessExpensesMarketing',
      'businessExpensesVehicle',
      'businessExpensesEquipment',
      'businessExpensesPostage',
      'businessExpensesTransport',
      'businessExpensesProfessional',
      'businessTax',
      'businessNIC',
      'businessPension',
    ]

    let totalExpenses = 0

    expenses.forEach((expense) => {
      const amount = parseFloat(formData[expense]) || 0
      const period = formData[expense + 'Period'] || 'per_month'
      totalExpenses += this.convertToMonthly(amount, period)
    })

    return totalExpenses
  }

  /**
   * Convert amount to monthly based on period
   * @param {number} amount - Amount to convert
   * @param {string} period - Period (weekly, fortnightly, monthly, yearly)
   * @returns {number} Monthly amount
   */
  convertToMonthly(amount: any, period: any) {
    switch (period) {
      case 'weekly':
      case 'per_week':
        return amount * 4.33 // Average weeks per month
      case 'fortnightly':
      case 'per_fortnight':
        return amount * 2.17 // Average fortnights per month
      case 'monthly':
      case 'per_month':
        return amount
      case 'yearly':
      case 'per_year':
        return amount / 12
      default:
        return amount
    }
  }

  /**
   * Get Child Benefit rates for a specific tax year
   * @param {string} taxYear - Tax year (e.g., '2024_25')
   * @returns {Object} Rates for the tax year
   */
  getRates(taxYear: any) {
    return this.rates[taxYear] || this.rates['2024_25']
  }

  /**
   * Get all available tax years
   * @returns {Array} Array of available tax years
   */
  getAvailableTaxYears() {
    return Object.keys(this.rates)
  }
}

// Export a singleton instance
export const childBenefitCalculator = new ChildBenefitCalculator()
