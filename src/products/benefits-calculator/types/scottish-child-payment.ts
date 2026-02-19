/**
 * Scottish Child Payment (SCP) Types and Rate Constants
 *
 * SCP is available in Scotland for families receiving Universal Credit (> £0)
 * with children under 16. Paid every 4 weeks.
 */

/** SCP weekly rates per child by tax year */
export const SCP_RATES: Record<string, number> = {
  '2023_24': 25.0,
  '2024_25': 26.7,
  '2025_26': 27.15,
  '2026_27': 28.2,
}

export interface ScottishChildPaymentChild {
  age: number
  eligible: boolean
  reason: string
}

export interface ScottishChildPaymentResult {
  isScotland: boolean
  eligible: boolean
  reason: string
  eligibleChildCount: number
  totalChildCount: number
  weeklyRate: number
  weeklyAmount: number
  fourWeeklyAmount: number
  monthlyEquivalent: number
  yearlyAmount: number
  taxYear: string
  children: ScottishChildPaymentChild[]
  ucAmount: number
  /** Net monthly earnings threshold at which UC (and thus SCP) would become payable */
  earningsThresholdForUC: number | null
}
