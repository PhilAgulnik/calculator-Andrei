/**
 * State Pension Age Warning Component
 * Displays prominent warnings when users reach or approach State Pension Age
 */

import { useState } from 'react'
import { Button } from '~/components/Button'
import { Accordion } from '~/components/Accordion'
import { Alert } from '~/components/Alert'
import { determineHouseholdWarning } from '../utils/pensionAgeWarning'
import { PENSION_CREDIT_AMOUNTS } from '../types/pension-age-warning'
import type { StatePensionAgeWarningProps } from '../types/pension-age-warning'

export function StatePensionAgeWarning({
  claimantAge,
  partnerAge,
  circumstances,
  onDismiss,
}: StatePensionAgeWarningProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  const warning = determineHouseholdWarning(claimantAge, partnerAge, circumstances)

  // Don't show anything if no warning or dismissed
  if (warning.level === 'none' || isDismissed) {
    return null
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  // Determine alert styling based on warning level
  const getAlertClass = () => {
    switch (warning.level) {
      case 'critical':
        return 'bg-red-50 border-red-500 border-l-4'
      case 'warning':
        return 'bg-yellow-50 border-yellow-500 border-l-4'
      case 'info':
        return 'bg-blue-50 border-blue-500 border-l-4'
      default:
        return 'bg-gray-50 border-gray-500 border-l-4'
    }
  }

  const getTextClass = () => {
    switch (warning.level) {
      case 'critical':
        return 'text-red-900'
      case 'warning':
        return 'text-yellow-900'
      case 'info':
        return 'text-blue-900'
      default:
        return 'text-gray-900'
    }
  }

  return (
    <div className={`${getAlertClass()} border rounded-lg p-6 mb-6`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`text-xl font-bold ${getTextClass()} mb-2`}>
            {warning.title}
          </h3>
          <p className={`text-base ${getTextClass()}`}>{warning.message}</p>

          {/* Note for mixed-age couples */}
          {warning.level === 'warning' && circumstances === 'couple' && (
            <div className="mt-3 p-3 bg-white/50 rounded border border-gray-300">
              <p className="text-sm italic text-gray-700">
                <strong>Note:</strong> State Pension Age is currently 66 but increasing gradually to 67 from April 2026.
              </p>
            </div>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={handleDismiss}
            className="ml-4 text-gray-500 hover:text-gray-700"
            aria-label="Dismiss warning"
          >
            ✕
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-4">
        {warning.level !== 'warning' && (
          <a
            href="https://www.gov.uk/pension-credit"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded text-sm font-medium"
          >
            {warning.action}
          </a>
        )}
        <Button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 text-sm"
        >
          {showDetails ? 'Hide' : 'Show'} More Information
        </Button>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-300 space-y-4">
          {/* About Pension Credit */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">About Pension Credit</h4>
            <p className="text-sm text-gray-700 mb-3">
              Pension Credit is a benefit for people who have reached State Pension Age. It
              tops up your weekly income to a guaranteed minimum level.
            </p>
            <div className="bg-white rounded p-3 text-sm">
              <p className="font-medium text-gray-900 mb-2">Guaranteed minimum income:</p>
              <ul className="space-y-1 text-gray-700">
                <li>
                  • Single person: <strong>£{PENSION_CREDIT_AMOUNTS.single}/week</strong> (
                  {((PENSION_CREDIT_AMOUNTS.single * 52) / 12).toFixed(2)}/month)
                </li>
                <li>
                  • Couple: <strong>£{PENSION_CREDIT_AMOUNTS.couple}/week</strong> (
                  {((PENSION_CREDIT_AMOUNTS.couple * 52) / 12).toFixed(2)}/month)
                </li>
              </ul>
            </div>
          </div>

          {/* UC vs Pension Credit Comparison */}
          <Accordion title="Universal Credit vs Pension Credit Comparison" open={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2 px-3 font-semibold">Aspect</th>
                    <th className="text-left py-2 px-3 font-semibold">Universal Credit</th>
                    <th className="text-left py-2 px-3 font-semibold">Pension Credit</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3">Eligibility</td>
                    <td className="py-2 px-3">Working age (under State Pension Age)</td>
                    <td className="py-2 px-3">Pension age (State Pension Age or over)</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3">Standard amount</td>
                    <td className="py-2 px-3">Age-based (varies)</td>
                    <td className="py-2 px-3">
                      £{PENSION_CREDIT_AMOUNTS.single}/week (single), £
                      {PENSION_CREDIT_AMOUNTS.couple}/week (couple)
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3">Housing costs</td>
                    <td className="py-2 px-3">Housing element (LHA capped)</td>
                    <td className="py-2 px-3">Housing element (actual rent up to limit)</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3">Savings credit</td>
                    <td className="py-2 px-3">No</td>
                    <td className="py-2 px-3">
                      Yes (for those who reached SPA before 6 April 2016)
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3">Capital limit</td>
                    <td className="py-2 px-3">£16,000</td>
                    <td className="py-2 px-3">£10,000 (ignored for Guarantee Credit)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">Assessment period</td>
                    <td className="py-2 px-3">Monthly</td>
                    <td className="py-2 px-3">Weekly</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Accordion>

          {/* How to Claim */}
          <Accordion title="How to Claim Pension Credit" open={false}>
            <div className="text-sm text-gray-700 space-y-3">
              <p>You can claim Pension Credit by:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong>Online:</strong> Visit{' '}
                  <a
                    href="https://www.gov.uk/pension-credit"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    www.gov.uk/pension-credit
                  </a>
                </li>
                <li>
                  <strong>Phone:</strong> Call the Pension Credit claim line on{' '}
                  <strong>0800 99 1234</strong> (textphone: 0800 169 0133)
                </li>
                <li>
                  <strong>Post:</strong> Download and print a claim form from GOV.UK
                </li>
              </ul>
              <p className="text-xs text-gray-600 mt-3">
                Phone lines are open Monday to Friday, 8am to 6pm
              </p>
            </div>
          </Accordion>

          {/* Mixed-Age Couples Information */}
          {circumstances === 'couple' && warning.level === 'warning' && (
            <Accordion title="About Mixed-Age Couples" open={false}>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  If you're in a couple where one person is under State Pension Age and one
                  is at or over State Pension Age, you're considered a "mixed-age couple".
                </p>
                <p>
                  <strong>For calculator purposes:</strong> To calculate your potential Universal Credit entitlement,
                  you should enter the older partner's age as 65 (one year below the current State Pension Age of 66).
                  This allows the calculator to estimate what your UC would be.
                </p>
                <p>
                  <strong>Important eligibility note:</strong> Mixed-age couples who reached State Pension Age on or after
                  15 May 2019 cannot actually claim Universal Credit and must claim Pension Credit instead. If you were
                  already claiming UC before 15 May 2019, you can continue until both of you reach State Pension Age.
                </p>
                <p className="text-xs text-gray-600 italic">
                  This calculator can still be used to compare potential entitlements for informational purposes.
                </p>
              </div>
            </Accordion>
          )}

          {/* Additional Resources */}
          <div className="bg-white rounded p-3">
            <h5 className="font-semibold text-gray-900 mb-2 text-sm">
              Additional Resources
            </h5>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.gov.uk/pension-credit-calculator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Pension Credit Calculator →
                </a>
              </li>
              <li>
                <a
                  href="https://www.gov.uk/state-pension-age"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Check your State Pension Age →
                </a>
              </li>
              <li>
                <a
                  href="https://www.ageuk.org.uk/information-advice/money-legal/benefits-entitlements/pension-credit/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Age UK: Pension Credit advice →
                </a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
