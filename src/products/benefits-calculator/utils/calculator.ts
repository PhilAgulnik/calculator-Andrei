/* eslint-disable no-unused-vars */
import { getLHARate, convertLHAToMonthly, getAllLHARates, lhaRates2025_26 } from './lhaDataService'
/**
 * Universal Credit Calculator - React Version
 * Simplified calculator that provides basic Universal Credit calculations
 */

export class UniversalCreditCalculator {
  rates: any
  initialized: any

  constructor() {
    this.rates = {
      '2025_26': {
        standardAllowance: {
          single: { under25: 316.98, over25: 400.14 },
          couple: { under25: 497.55, over25: 628.1 },
        },
        childElement: {
          preTwoChildLimit: 339.0, // For children born before 6 April 2017
          postTwoChildLimit: 292.81, // For children born on/after 6 April 2017
        },
        disabledChildElement: {
          lowerRate: 158.76,
          higherRate: 495.87,
        },
        childcareElement: {
          maxPercentage: 85,
          maxAmountOneChild: 1031.88,
          maxAmountTwoOrMore: 1768.94,
        },
        workAllowance: {
          single: { withHousing: 411, withoutHousing: 684 },
          couple: { withHousing: 411, withoutHousing: 684 },
        },
        taperRate: 0.55,
        carerElement: 201.68,
        lcwraElement: 423.27,
        // Capital limits
        capitalLowerLimit: 6000,
        capitalUpperLimit: 16000,
        capitalDeductionRate: 0.04, // £4.35 per £250 over £6,000
        pensionThresholds: {
          lowerEarningsLimit: 6240,
          upperEarningsLimit: 50270,
        },
        // LHA rates (simplified - would need postcode lookup in full implementation)
        lhaRates: {
          shared: 300,
          oneBed: 400,
          twoBed: 500,
          threeBed: 600,
          fourBed: 700,
        },
      },
      '2024_25': {
        standardAllowance: {
          single: { under25: 311.68, over25: 393.45 },
          couple: { under25: 489.23, over25: 617.6 },
        },
        childElement: {
          first: 315.0,
          additional: 269.58,
        },
        childcareElement: {
          maxPercentage: 85,
          maxAmount: 950.92,
        },
        workAllowance: {
          single: { withHousing: 411, withoutHousing: 684 },
          couple: { withHousing: 411, withoutHousing: 684 },
        },
        taperRate: 0.55,
        carerElement: 201.68,
        lcwraElement: 423.27,
        // Capital limits
        capitalLowerLimit: 6000,
        capitalUpperLimit: 16000,
        capitalDeductionRate: 0.04,
        // Pension contribution thresholds (2024/25)
        pensionThresholds: {
          lowerEarningsLimit: 6240, // Annual - compulsory contributions start above this
          upperEarningsLimit: 50270, // Annual - compulsory contributions end at this level
        },
        // LHA rates (simplified)
        lhaRates: {
          shared: 300,
          oneBed: 400,
          twoBed: 500,
          threeBed: 600,
          fourBed: 700,
        },
      },
      '2023_24': {
        standardAllowance: {
          single: { under25: 292.11, over25: 368.74 },
          couple: { under25: 458.51, over25: 578.82 },
        },
        childElement: {
          first: 315.0,
          additional: 269.58,
        },
        childcareElement: {
          maxPercentage: 85,
          maxAmount: 950.92,
        },
        workAllowance: {
          single: { withHousing: 411, withoutHousing: 684 },
          couple: { withHousing: 411, withoutHousing: 684 },
        },
        taperRate: 0.55,
        carerElement: 201.68,
        lcwraElement: 423.27,
        // Capital limits
        capitalLowerLimit: 6000,
        capitalUpperLimit: 16000,
        capitalDeductionRate: 0.04,
        // LHA rates (simplified)
        lhaRates: {
          shared: 300,
          oneBed: 400,
          twoBed: 500,
          threeBed: 600,
          fourBed: 700,
        },
      },
    }
  }

  async initialize() {
    // In a real implementation, this might load rates from an API
    console.log('Universal Credit Calculator initialized')
    return true
  }

  calculate(input: any) {
    try {
      const taxYear = input.taxYear || '2025_26'
      const rates = this.rates[taxYear]

      console.log('Calculator received input:', input)
      console.log('Calculator using tax year:', taxYear)
      console.log('Calculator rates:', rates)

      if (!rates) {
        throw new Error(`Tax year ${taxYear} not supported`)
      }

      // Calculate standard allowance
      const standardAllowance = this.calculateStandardAllowance(input, rates)

      // Calculate housing element
      const { amount: housingElement, lhaDetails } = this.calculateHousingElement(input, rates)

      // Calculate child element
      const childElement = this.calculateChildElement(input, rates)

      // Calculate childcare element
      const childcareElement = this.calculateChildcareElement(input, rates)

      // Calculate carer element
      const carerElement = this.calculateCarerElement(input, rates)

      // Calculate LCWRA element
      const lcwraElement = this.calculateLCWRAElement(input, rates)

      // Calculate total elements
      const totalElements =
        standardAllowance +
        housingElement +
        childElement +
        childcareElement +
        carerElement +
        lcwraElement

      // Calculate work allowance and earnings reduction
      const workAllowance = this.calculateWorkAllowance(input, rates)
      const earningsReduction = this.calculateEarningsReduction(input, rates, totalElements)

      // Calculate other deductions
      const capitalDeductionResult = this.calculateCapitalDeduction(input, totalElements, rates)
      const benefitDeduction = this.calculateBenefitDeduction(input)

      // Calculate final amount
      const finalAmount = Math.max(
        0,
        totalElements - earningsReduction - capitalDeductionResult.deduction - benefitDeduction
      )

      return {
        success: true,
        taxYear,
        calculation: {
          standardAllowance,
          housingElement,
          childElement,
          childcareElement,
          carerElement,
          lcwraElement,
          totalElements,
          workAllowance,
          earningsReduction,
          capitalDeduction: capitalDeductionResult.deduction,
          capitalDeductionDetails: capitalDeductionResult,
          benefitDeduction,
          finalAmount,
          lhaDetails,
        },
        warnings: this.generateWarnings(input),
        calculatedAt: new Date().toISOString(),
      }
    } catch (error: any) {
      return {
        success: false,
        errors: [error.message],
        calculatedAt: new Date().toISOString(),
      }
    }
  }

  calculateStandardAllowance(input: any, rates: any) {
    const { circumstances, age, partnerAge } = input
    const standardRates = rates.standardAllowance

    if (circumstances === 'single') {
      return age < 25 ? standardRates.single.under25 : standardRates.single.over25
    } else {
      const maxAge = Math.max(age, partnerAge)
      return maxAge < 25 ? standardRates.couple.under25 : standardRates.couple.over25
    }
  }

  calculateHousingElement(input: any, rates: any) {
    const {
      rent = 0,
      serviceCharges = 0,
      tenantType,
      bedrooms,
      brma,
      age = 25,
      partnerAge = 25,
      circumstances = 'single',
      children = 0,
      childAges = [],
      childGenders = [],
    } = input

    if (tenantType === 'private') {
      // Calculate bedroom entitlement
      const bedroomEntitlement = this.calculateBedroomEntitlement({
        circumstances,
        children,
        childAges,
        childGenders,
        age,
        partnerAge,
      })

      // Determine LHA weekly rate and convert to monthly if BRMA provided
      let lhaWeekly = null
      let lhaMonthly = null
      if (brma) {
        lhaWeekly = getLHARate(brma, bedroomEntitlement)
        lhaMonthly = convertLHAToMonthly(lhaWeekly)
      }

      // Fallback to simplified internal rates if BRMA not selected
      if (!lhaMonthly) {
        let fallback: any = rates.lhaRates.oneBed // default monthly
        if ((bedroomEntitlement as any) === 'shared' || bedroomEntitlement === 0)
          fallback = rates.lhaRates.shared
        else if (bedroomEntitlement === 2) fallback = rates.lhaRates.twoBed
        else if (bedroomEntitlement === 3) fallback = rates.lhaRates.threeBed
        else if (bedroomEntitlement >= 4) fallback = rates.lhaRates.fourBed
        lhaMonthly = fallback
      }

      const eligibleRent = Math.min(rent + serviceCharges, lhaMonthly)

      // Get all LHA rates for the BRMA
      let allRates = {}
      if (brma) {
        // Use the new function to get all rates for the BRMA
        allRates = getAllLHARates(brma)
      } else {
        // Fallback rates
        allRates = {
          sharedRate: rates.lhaRates.shared,
          oneBedRate: rates.lhaRates.oneBed,
          twoBedRate: rates.lhaRates.twoBed,
          threeBedRate: rates.lhaRates.threeBed,
          fourBedRate: rates.lhaRates.fourBed,
        }
      }

      return {
        amount: eligibleRent,
        lhaDetails: {
          brma: brma || 'Not selected',
          bedroomEntitlement,
          lhaWeekly: lhaWeekly || null,
          lhaMonthly,
          actualRent: rent + serviceCharges,
          eligibleRent,
          shortfall: Math.max(0, rent + serviceCharges - lhaMonthly),
          ...allRates,
        },
      }
    } else {
      // Social housing - simplified calculation
      return { amount: parseFloat(rent) + parseFloat(serviceCharges), lhaDetails: null }
    }
  }

  calculateBedroomEntitlement(input: any) {
    const { circumstances, children, childAges, childGenders } = input

    // Basic entitlement: 1 bedroom for each adult couple or single person
    let bedrooms = circumstances === 'couple' ? 1 : 1

    if (children === 0) {
      return bedrooms
    }

    // For children, we need to consider gender for bedroom sharing rules
    if (children === 1) {
      // One child gets their own bedroom
      return bedrooms + 1
    }

    // For 2+ children, we need to check if they can share based on gender and age
    const childrenInfo = []
    for (let i = 0; i < children; i++) {
      childrenInfo.push({
        age: childAges[i] || 0,
        gender: childGenders[i] || 'unknown',
      })
    }

    // Sort children by age (youngest first)
    childrenInfo.sort((a, b) => a.age - b.age)

    // Group children who can share bedrooms
    const bedroomGroups = []
    const usedChildren = new Set()

    for (let i = 0; i < childrenInfo.length; i++) {
      if (usedChildren.has(i)) continue

      const currentChild = childrenInfo[i]
      const group = [currentChild]
      usedChildren.add(i)

      // Look for children who can share with this child
      for (let j = i + 1; j < childrenInfo.length; j++) {
        if (usedChildren.has(j)) continue

        const otherChild = childrenInfo[j]

        // Children can share if:
        // 1. They are the same gender, OR
        // 2. They are both under 10 years old
        if (
          currentChild.gender === otherChild.gender ||
          (currentChild.age < 10 && otherChild.age < 10)
        ) {
          group.push(otherChild)
          usedChildren.add(j)
        }
      }

      bedroomGroups.push(group)
    }

    return bedrooms + bedroomGroups.length
  }

  calculateChildElement(input: any, rates: any) {
    const { children, childAges, childDisabilities } = input
    if (children === 0) return 0

    // Two-child limit cutoff date: 6 April 2017
    const twoChildLimitDate = new Date('2017-04-06')

    let totalChildElement = 0

    // If we have specific child ages/birth dates, use them
    if (childAges && childAges.length > 0) {
      for (let i = 0; i < Math.min(children, childAges.length); i++) {
        const childAge = childAges[i]

        // Calculate approximate birth date from age
        const today = new Date()
        const approximateBirthDate = new Date(
          today.getFullYear() - childAge,
          today.getMonth(),
          today.getDate()
        )

        // Children born before 6 April 2017 get the higher rate
        if (approximateBirthDate < twoChildLimitDate) {
          totalChildElement += rates.childElement.preTwoChildLimit
        } else {
          totalChildElement += rates.childElement.postTwoChildLimit
        }
      }
    } else {
      // Fallback: If no specific ages provided, assume mixed ages
      // For 1 child: assume they could be pre-2017 (higher rate) for backward compatibility
      // For multiple children: assume eldest is pre-2017, others post-2017

      if (children === 1) {
        // Single child - use higher rate for backward compatibility with existing calculations
        totalChildElement = rates.childElement.preTwoChildLimit
      } else {
        // Multiple children - assume first is pre-2017, rest are post-2017
        totalChildElement = rates.childElement.preTwoChildLimit // First child
        totalChildElement += (children - 1) * rates.childElement.postTwoChildLimit // Additional children
      }
    }

    // Add disabled child element
    if (childDisabilities && childDisabilities.length > 0 && rates.disabledChildElement) {
      for (let i = 0; i < childDisabilities.length; i++) {
        const disability = childDisabilities[i]
        if (disability === 'lower') {
          totalChildElement += rates.disabledChildElement.lowerRate
        } else if (disability === 'higher') {
          totalChildElement += rates.disabledChildElement.higherRate
        }
      }
    }

    return totalChildElement
  }

  calculateChildcareElement(input: any, rates: any) {
    const { childcareCosts, children } = input
    if (children === 0 || childcareCosts === 0) return 0

    const maxAmount =
      children === 1
        ? rates.childcareElement.maxAmountOneChild
        : rates.childcareElement.maxAmountTwoOrMore
    const percentage = rates.childcareElement.maxPercentage / 100

    return Math.min(childcareCosts * percentage, maxAmount)
  }

  calculateCarerElement(input: any, rates: any) {
    const {
      isCarer,
      isPartnerCarer,
      circumstances,
      includeCarerElement,
      partnerIncludeCarerElement,
    } = input

    let carerElement = 0

    // Check if client is a carer and wants carer element included
    if (isCarer === 'yes' && includeCarerElement === 'yes') {
      carerElement += rates.carerElement
    }

    // Check if partner is a carer and wants carer element included
    if (
      circumstances === 'couple' &&
      isPartnerCarer === 'yes' &&
      partnerIncludeCarerElement === 'yes'
    ) {
      carerElement += rates.carerElement
    }

    return carerElement
  }

  calculateLCWRAElement(input: any, rates: any) {
    const { hasLCWRA, partnerHasLCWRA, circumstances } = input

    console.log('LCWRA Debug:', {
      hasLCWRA,
      partnerHasLCWRA,
      circumstances,
      rates: rates.lcwraElement,
    })

    let lcwraElement = 0

    // Check if main person has LCWRA
    if (hasLCWRA === 'yes') {
      lcwraElement += rates.lcwraElement
      console.log('Main person LCWRA added:', rates.lcwraElement)
    }

    // Check if partner has LCWRA (for couples)
    if (circumstances === 'couple' && partnerHasLCWRA === 'yes') {
      lcwraElement += rates.lcwraElement
      console.log('Partner LCWRA added:', rates.lcwraElement)
    }

    console.log('Total LCWRA element:', lcwraElement)
    return lcwraElement
  }

  calculatePensionContribution(
    monthlyEarnings: any,
    pensionType: any,
    pensionAmount: any,
    pensionPercentage: any,
    rates: any
  ) {
    if (!monthlyEarnings || monthlyEarnings <= 0) {
      return 0
    }

    const annualEarnings = monthlyEarnings * 12
    const lowerLimit = rates.pensionThresholds.lowerEarningsLimit
    const upperLimit = rates.pensionThresholds.upperEarningsLimit

    // If annual earnings are below the lower threshold, no compulsory contributions
    if (annualEarnings <= lowerLimit) {
      return 0
    }

    // Calculate pensionable earnings (between lower and upper limits)
    const pensionableEarnings = Math.min(annualEarnings, upperLimit) - lowerLimit
    const monthlyPensionableEarnings = pensionableEarnings / 12

    if (pensionType === 'amount') {
      return pensionAmount || 0
    } else if (pensionType === 'percentage') {
      // Apply percentage to pensionable earnings only
      return (monthlyPensionableEarnings * (pensionPercentage || 0)) / 100
    }

    return 0
  }

  // Static method for UI to calculate pension contributions with thresholds
  static calculateUIPensionContribution(
    monthlyEarnings: any,
    pensionType: any,
    pensionAmount: any,
    pensionPercentage: any,
    taxYear: any = '2025_26'
  ) {
    // Create temporary calculator instance to access rates
    const tempCalculator = new UniversalCreditCalculator()
    const rates = tempCalculator.rates[taxYear] || tempCalculator.rates['2025_26']

    return tempCalculator.calculatePensionContribution(
      monthlyEarnings,
      pensionType,
      pensionAmount,
      pensionPercentage,
      rates
    )
  }

  // Static method for UI to calculate proper net earnings (tax, NI, pension)
  static calculateUINetEarnings(
    monthlyEarnings: any,
    pensionType: any,
    pensionAmount: any,
    pensionPercentage: any,
    taxYear: any = '2025_26'
  ) {
    // Create temporary calculator instance to access rates
    const tempCalculator = new UniversalCreditCalculator()
    const rates = tempCalculator.rates[taxYear] || tempCalculator.rates['2025_26']

    return tempCalculator.calculateProperNetEarnings(
      monthlyEarnings,
      pensionType,
      pensionAmount,
      pensionPercentage,
      rates
    )
  }

  // Calculate proper net earnings including tax, NI, and pension (matches NetEarningsModule)
  calculateProperNetEarnings(
    monthlyEarnings: any,
    pensionType: any,
    pensionAmount: any,
    _pensionPercentage: any,
    rates: any
  ) {
    // Tax calculation (matches NetEarningsModule logic)
    const personalAllowanceYear = 12570
    const basicBandYear = 37700
    const grossYear = monthlyEarnings * 12
    const taxableYear = Math.max(0, grossYear - personalAllowanceYear)
    const basicTaxYear = Math.min(taxableYear, basicBandYear) * 0.2
    const higherTaxYear = Math.max(0, taxableYear - basicBandYear) * 0.4
    const taxMonthly = (basicTaxYear + higherTaxYear) / 12

    // National Insurance calculation
    const niMonthlyThreshold = 1048
    const niRate = 0.08
    const niMonthly = Math.max(0, monthlyEarnings - niMonthlyThreshold) * niRate

    // Pension contribution with thresholds - match NetEarningsModule logic
    let pensionMonthly
    if (pensionType === 'amount' && pensionAmount > 0) {
      pensionMonthly = pensionAmount
    } else {
      // Default to 3% for employed people (matches NetEarningsModule)
      pensionMonthly = this.calculatePensionContribution(monthlyEarnings, 'percentage', 0, 3, rates)
    }

    // Net earnings
    const netEarnings = Math.max(0, monthlyEarnings - taxMonthly - niMonthly - pensionMonthly)

    console.log('calculateProperNetEarnings debug:', {
      monthlyEarnings,
      taxMonthly,
      niMonthly,
      pensionMonthly,
      netEarnings,
    })

    return netEarnings
  }

  calculateWorkAllowance(input: any, rates: any) {
    const {
      children,
      hasLCWRA,
      partnerHasLCWRA,
      circumstances,
      claimsDisabilityBenefits,
      partnerClaimsDisabilityBenefits,
      housingStatus,
      rent,
      serviceCharges,
    } = input

    // Work allowance only applies if:
    // 1. Have children, OR
    // 2. Main person has LCWRA or claims qualifying disability benefits, OR
    // 3. Partner has LCWRA or claims qualifying disability benefits
    const hasChildren = children > 0
    const mainPersonDisabled = hasLCWRA === 'yes' || claimsDisabilityBenefits === 'yes'
    const partnerDisabled =
      circumstances === 'couple' &&
      (partnerHasLCWRA === 'yes' || partnerClaimsDisabilityBenefits === 'yes')

    const eligibleForWorkAllowance = hasChildren || mainPersonDisabled || partnerDisabled

    if (!eligibleForWorkAllowance) {
      return 0
    }

    // Determine if has housing costs
    const hasHousingCosts = housingStatus === 'renting' && (rent > 0 || serviceCharges > 0)

    // Return appropriate work allowance
    if (hasHousingCosts) {
      return rates.workAllowance[circumstances].withHousing
    } else {
      return rates.workAllowance[circumstances].withoutHousing
    }
  }

  calculateEarningsReduction(input: any, rates: any, _totalElements: any) {
    const {
      monthlyEarnings,
      partnerMonthlyEarnings,
      circumstances,
      employmentType,
      partnerEmploymentType,
      netMonthlyEarningsCalculated,
      netMonthlyEarningsOverride,
      partnerNetMonthlyEarningsCalculated,
      partnerNetMonthlyEarningsOverride,
    } = input

    // Calculate net earnings properly (after tax, NI, and pension)
    let netEarnings = 0

    // Main person net earnings
    if (employmentType === 'employed' && monthlyEarnings > 0) {
      // Use override if provided, otherwise use calculated net earnings
      let mainPersonNet
      if (netMonthlyEarningsOverride !== undefined && netMonthlyEarningsOverride !== '') {
        console.log('Using override net earnings:', netMonthlyEarningsOverride)
        mainPersonNet = parseFloat(netMonthlyEarningsOverride) || 0
      } else if (
        netMonthlyEarningsCalculated !== undefined &&
        netMonthlyEarningsCalculated !== null
      ) {
        console.log('Using calculated net earnings:', netMonthlyEarningsCalculated)
        mainPersonNet = netMonthlyEarningsCalculated
      } else {
        console.log('Calculating proper net earnings for:', monthlyEarnings)
        // If no net earnings available, calculate proper net earnings (tax, NI, pension)
        mainPersonNet = this.calculateProperNetEarnings(
          monthlyEarnings,
          input.pensionType,
          input.pensionAmount,
          input.pensionPercentage,
          rates
        )
      }
      console.log('Final mainPersonNet:', mainPersonNet)
      netEarnings += mainPersonNet
    } else if (employmentType === 'self-employed' && monthlyEarnings > 0) {
      // For self-employed, use gross earnings as no automatic deductions
      netEarnings += monthlyEarnings
    }

    // Partner net earnings
    if (
      circumstances === 'couple' &&
      partnerEmploymentType === 'employed' &&
      partnerMonthlyEarnings > 0
    ) {
      // Use override if provided, otherwise use calculated net earnings
      let partnerNet
      if (
        partnerNetMonthlyEarningsOverride !== undefined &&
        partnerNetMonthlyEarningsOverride !== ''
      ) {
        partnerNet = parseFloat(partnerNetMonthlyEarningsOverride) || 0
      } else if (
        partnerNetMonthlyEarningsCalculated !== undefined &&
        partnerNetMonthlyEarningsCalculated !== null
      ) {
        partnerNet = partnerNetMonthlyEarningsCalculated
      } else {
        // If no net earnings available, calculate proper net earnings (tax, NI, pension)
        partnerNet = this.calculateProperNetEarnings(
          partnerMonthlyEarnings,
          input.partnerPensionType,
          input.partnerPensionAmount,
          input.partnerPensionPercentage,
          rates
        )
      }
      netEarnings += partnerNet
    } else if (
      circumstances === 'couple' &&
      partnerEmploymentType === 'self-employed' &&
      partnerMonthlyEarnings > 0
    ) {
      // For self-employed, use gross earnings as no automatic deductions
      netEarnings += partnerMonthlyEarnings
    }

    // Calculate work allowance based on eligibility
    const workAllowance = this.calculateWorkAllowance(input, rates)
    const taperRate = rates.taperRate

    console.log('Earnings Reduction Debug:', {
      employmentType,
      monthlyEarnings,
      netMonthlyEarningsCalculated,
      netMonthlyEarningsOverride,
      finalNetEarnings: netEarnings,
      workAllowance,
      taperRate,
      excessEarnings: netEarnings > workAllowance ? netEarnings - workAllowance : 0,
    })

    if (netEarnings <= workAllowance) {
      console.log('No earnings reduction - netEarnings <= workAllowance')
      return 0
    }

    const excessEarnings = netEarnings - workAllowance
    const reduction = excessEarnings * taperRate
    console.log('Earnings reduction calculated:', reduction)
    return reduction
  }

  calculateCapitalDeduction(input: any, totalElements: any, rates: any) {
    const { savings } = input

    if (savings <= rates.capitalLowerLimit) {
      return {
        deduction: 0,
        tariffIncome: 0,
        explanation: 'No deduction - savings below £6,000 limit',
      }
    } else if (savings <= rates.capitalUpperLimit) {
      // Calculate tariff income: for every £250 (or part of £250) over £6,000, £4.35 is treated as monthly income
      const excessOver6000 = savings - rates.capitalLowerLimit
      const tariffUnits = Math.ceil(excessOver6000 / 250) // Round up to nearest £250
      const tariffIncome = tariffUnits * 4.35

      return {
        deduction: tariffIncome,
        tariffIncome: tariffIncome,
        explanation: `Tariff income: £${excessOver6000.toFixed(2)} over £6,000 limit = ${tariffUnits} units × £4.35 = £${tariffIncome.toFixed(2)} per month (£${(tariffIncome / 4.35).toFixed(2)} per week)`,
      }
    } else {
      return {
        deduction: totalElements,
        tariffIncome: 0,
        explanation: 'No Universal Credit entitlement - savings over £16,000 limit',
      }
    }
  }

  calculateBenefitDeduction(input: any) {
    const { otherBenefits, otherBenefitsPeriod } = input

    // Convert to monthly if needed
    let monthlyBenefits = otherBenefits
    switch (otherBenefitsPeriod) {
      case 'weekly':
        monthlyBenefits = otherBenefits * 4.33
        break
      case 'fortnightly':
        monthlyBenefits = otherBenefits * 2.17
        break
      case 'yearly':
        monthlyBenefits = otherBenefits / 12
        break
      default:
        monthlyBenefits = otherBenefits
    }

    return monthlyBenefits
  }

  generateWarnings(input: any) {
    const warnings = []

    if (input.monthlyEarnings > 5000) {
      warnings.push('High earnings may result in no Universal Credit entitlement')
    }

    if (input.savings > 15000) {
      warnings.push('High savings may affect Universal Credit entitlement')
    }

    if (input.rent > 2000) {
      warnings.push('High rent amount - verify this is correct')
    }

    return warnings
  }

  exportCalculation() {
    return {
      calculator: 'Universal Credit Calculator React',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      rates: this.rates,
    }
  }

  // New method for testing comparison
  exportCalculationForTesting(input: any, results: any) {
    return {
      metadata: {
        calculator: 'Universal Credit Calculator React',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        taxYear: input.taxYear,
      },
      input: {
        // Personal Details
        taxYear: input.taxYear,
        circumstances: input.circumstances,
        age: input.age,
        partnerAge: input.partnerAge,
        children: input.children,
        childAges: input.childAges || [],
        childDisabilities: input.childDisabilities || [],
        childGenders: input.childGenders || [],

        // Housing
        housingStatus: input.housingStatus,
        tenantType: input.tenantType,
        rent: input.rent,
        serviceCharges: input.serviceCharges,
        bedrooms: input.bedrooms,
        area: input.area,
        nonDependants: input.nonDependants,

        // Employment and Disability - Main Person
        employmentType: input.employmentType,
        monthlyEarnings: input.monthlyEarnings,
        childcareCosts: input.childcareCosts,
        isDisabled: input.isDisabled,
        claimsDisabilityBenefits: input.claimsDisabilityBenefits,
        disabilityBenefitType: input.disabilityBenefitType,
        pipDailyLivingRate: input.pipDailyLivingRate,
        pipMobilityRate: input.pipMobilityRate,
        dlaCareRate: input.dlaCareRate,
        dlaMobilityRate: input.dlaMobilityRate,
        aaRate: input.aaRate,
        hasLCWRA: input.hasLCWRA,

        // Employment and Disability - Partner
        partnerEmploymentType: input.partnerEmploymentType,
        partnerMonthlyEarnings: input.partnerMonthlyEarnings,
        partnerIsDisabled: input.partnerIsDisabled,
        partnerClaimsDisabilityBenefits: input.partnerClaimsDisabilityBenefits,
        partnerDisabilityBenefitType: input.partnerDisabilityBenefitType,
        partnerPipDailyLivingRate: input.partnerPipDailyLivingRate,
        partnerPipMobilityRate: input.partnerPipMobilityRate,
        partnerDlaCareRate: input.partnerDlaCareRate,
        partnerDlaMobilityRate: input.partnerDlaMobilityRate,
        partnerAaRate: input.partnerAaRate,
        partnerHasLCWRA: input.partnerHasLCWRA,

        // Self-employed fields
        businessIncomeBank: input.businessIncomeBank,
        businessIncomeCash: input.businessIncomeCash,
        businessExpensesRent: input.businessExpensesRent,
        businessExpensesRates: input.businessExpensesRates,
        businessExpensesUtilities: input.businessExpensesUtilities,
        businessExpensesInsurance: input.businessExpensesInsurance,
        businessExpensesTelephone: input.businessExpensesTelephone,
        businessExpensesMarketing: input.businessExpensesMarketing,
        businessExpensesVehicle: input.businessExpensesVehicle,
        businessExpensesEquipment: input.businessExpensesEquipment,
        businessExpensesPostage: input.businessExpensesPostage,
        businessExpensesTransport: input.businessExpensesTransport,
        businessExpensesProfessional: input.businessExpensesProfessional,
        businessTax: input.businessTax,
        businessNIC: input.businessNIC,
        businessPension: input.businessPension,
        businessCarMiles: input.businessCarMiles,
        businessHomeHours: input.businessHomeHours,

        // Carer details
        isCarer: input.isCarer,
        isPartnerCarer: input.isPartnerCarer,
        currentlyReceivingCarersAllowance: input.currentlyReceivingCarersAllowance,
        partnerCurrentlyReceivingCarersAllowance: input.partnerCurrentlyReceivingCarersAllowance,
        caringHours: input.caringHours,
        partnerCaringHours: input.partnerCaringHours,
        personReceivesBenefits: input.personReceivesBenefits,
        partnerPersonReceivesBenefits: input.partnerPersonReceivesBenefits,
        includeCarersAllowance: input.includeCarersAllowance,
        partnerIncludeCarersAllowance: input.partnerIncludeCarersAllowance,
        includeCarerElement: input.includeCarerElement,
        partnerIncludeCarerElement: input.partnerIncludeCarerElement,

        // Other
        savings: input.savings,
        otherBenefits: input.otherBenefits,
        otherBenefitsPeriod: input.otherBenefitsPeriod,
      },
      output: {
        standardAllowance: results.calculation.standardAllowance,
        housingElement: results.calculation.housingElement,
        childElement: results.calculation.childElement,
        childcareElement: results.calculation.childcareElement,
        carerElement: results.calculation.carerElement,
        totalElements: results.calculation.totalElements,
        earningsReduction: results.calculation.earningsReduction,
        capitalDeduction: results.calculation.capitalDeduction,
        benefitDeduction: results.calculation.benefitDeduction,
        finalAmount: results.calculation.finalAmount,
        warnings: results.warnings || [],
        lhaDetails: results.calculation.lhaDetails || null,
      },
      calculationDetails: {
        workAllowance: results.calculation.workAllowance || 0,
        taperRate: results.calculation.taperRate || 0.55,
        lhaRate: results.calculation.lhaRate || 0,
      },
    }
  }
}
