/**
 * Carer Module Component
 * Comprehensive carer eligibility assessment for UC Carer Element and Carer's Allowance
 */

import { useState, useEffect } from 'react'
import { Button } from '~/components/Button'
import { Accordion } from '~/components/Accordion'
import type { CarerAssessment, PersonCaredFor } from '../types/carer-module'
import {
  CARER_ELIGIBILITY_RULES,
  UC_CARER_ELEMENT_MONTHLY,
  CARERS_ALLOWANCE_WEEKLY,
} from '../types/carer-module'
import {
  assessCarerEligibility,
  validateHours,
  validateEarnings,
  monthlyToWeeklyEarnings,
  weeklyToMonthlyEarnings,
} from '../utils/carerEligibility'

export interface CarerModuleProps {
  personType: 'claimant' | 'partner'
  currentEarnings?: number
  onCarerStatusChange: (assessment: CarerAssessment) => void
  initialData?: Partial<CarerAssessment>
}

export function CarerModule({
  personType,
  currentEarnings = 0,
  onCarerStatusChange,
  initialData,
}: CarerModuleProps) {
  const [isCarer, setIsCarer] = useState(initialData?.isCarer || false)
  const [hoursPerWeek, setHoursPerWeek] = useState(
    initialData?.hoursPerWeek?.toString() || ''
  )
  const [personCaredFor, setPersonCaredFor] = useState<PersonCaredFor>(
    initialData?.personBeingCaredFor || {
      relationship: 'prefer-not-to-say',
      receivesBenefit: false,
    }
  )
  const [earningsInput, setEarningsInput] = useState(currentEarnings.toString())
  const [earningsFrequency, setEarningsFrequency] = useState<'weekly' | 'monthly'>(
    'monthly'
  )
  const [showResults, setShowResults] = useState(false)
  const [showGuidance, setShowGuidance] = useState(false)

  // Calculate eligibility whenever relevant data changes
  useEffect(() => {
    if (isCarer) {
      const hours = parseFloat(hoursPerWeek) || 0
      const earnings = parseFloat(earningsInput) || 0
      const weeklyEarnings =
        earningsFrequency === 'monthly'
          ? monthlyToWeeklyEarnings(earnings)
          : earnings

      const assessment: CarerAssessment = {
        isCarer,
        hoursPerWeek: hours,
        personBeingCaredFor: personCaredFor,
        eligibleForCarerElement: false,
        eligibleForCarersAllowance: false,
        weeklyEarnings,
      }

      const result = assessCarerEligibility(assessment)
      assessment.eligibleForCarerElement = result.eligibleForUCCarerElement
      assessment.eligibleForCarersAllowance = result.eligibleForCarersAllowance
      assessment.reasonsNotEligible = result.issues

      onCarerStatusChange(assessment)
    } else {
      onCarerStatusChange({
        isCarer: false,
        hoursPerWeek: 0,
        personBeingCaredFor: { relationship: 'prefer-not-to-say', receivesBenefit: false },
        eligibleForCarerElement: false,
        eligibleForCarersAllowance: false,
        weeklyEarnings: 0,
      })
    }
  }, [
    isCarer,
    hoursPerWeek,
    personCaredFor,
    earningsInput,
    earningsFrequency,
    onCarerStatusChange,
  ])

  const handleAssess = () => {
    setShowResults(true)
  }

  const hours = parseFloat(hoursPerWeek) || 0
  const earnings = parseFloat(earningsInput) || 0
  const weeklyEarnings =
    earningsFrequency === 'monthly' ? monthlyToWeeklyEarnings(earnings) : earnings

  const assessment: CarerAssessment = {
    isCarer,
    hoursPerWeek: hours,
    personBeingCaredFor: personCaredFor,
    eligibleForCarerElement: false,
    eligibleForCarersAllowance: false,
    weeklyEarnings,
  }

  const eligibilityResult = assessCarerEligibility(assessment)
  const hoursError = hours > 0 ? validateHours(hours) : null
  const earningsError = earnings > 0 ? validateEarnings(earnings) : null

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Carer Assessment - {personType === 'claimant' ? 'You' : 'Your Partner'}
        </h3>
        <p className="text-sm text-gray-600">
          Answer these questions to check eligibility for the UC Carer Element and Carer's
          Allowance.
        </p>
      </div>

      {/* Question 1: Are you a carer? */}
      <div className="space-y-3">
        <label className="block text-base font-semibold text-gray-900">
          {personType === 'claimant'
            ? 'Do you provide care for someone?'
            : 'Does your partner provide care for someone?'}
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={isCarer}
              onChange={() => setIsCarer(true)}
              className="w-4 h-4"
            />
            <span className="text-gray-700">Yes</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={!isCarer}
              onChange={() => setIsCarer(false)}
              className="w-4 h-4"
            />
            <span className="text-gray-700">No</span>
          </label>
        </div>
      </div>

      {isCarer && (
        <>
          {/* Question 2: Hours of care */}
          <div className="space-y-2">
            <label className="block text-base font-semibold text-gray-900">
              How many hours of care do you provide per week?
            </label>
            <p className="text-sm text-gray-600">
              You need to provide at least {CARER_ELIGIBILITY_RULES.minHoursPerWeek} hours
              per week to qualify
            </p>
            <input
              type="number"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
              min="0"
              max="168"
              className="w-full px-4 py-2 border border-gray-300 rounded text-base"
              placeholder="e.g., 40"
            />
            {hoursError && <p className="text-sm text-red-600">{hoursError}</p>}
          </div>

          {/* Question 3: Person being cared for */}
          <div className="space-y-4 bg-gray-50 border border-gray-200 rounded p-4">
            <h4 className="font-semibold text-gray-900">
              About the person you care for
            </h4>

            {/* Relationship */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Relationship
              </label>
              <select
                value={personCaredFor.relationship}
                onChange={(e) =>
                  setPersonCaredFor({
                    ...personCaredFor,
                    relationship: e.target.value as PersonCaredFor['relationship'],
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              >
                <option value="prefer-not-to-say">Prefer not to say</option>
                <option value="partner">Partner</option>
                <option value="parent">Parent</option>
                <option value="child">Child</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Do they receive a qualifying benefit? */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Do they receive a qualifying disability benefit?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={personCaredFor.receivesBenefit}
                    onChange={() =>
                      setPersonCaredFor({ ...personCaredFor, receivesBenefit: true })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!personCaredFor.receivesBenefit}
                    onChange={() =>
                      setPersonCaredFor({
                        ...personCaredFor,
                        receivesBenefit: false,
                        benefitType: undefined,
                        benefitRate: undefined,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>

            {/* Benefit type */}
            {personCaredFor.receivesBenefit && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Which benefit do they receive?
                  </label>
                  <select
                    value={personCaredFor.benefitType || ''}
                    onChange={(e) =>
                      setPersonCaredFor({
                        ...personCaredFor,
                        benefitType: e.target.value as PersonCaredFor['benefitType'],
                        benefitRate: undefined,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  >
                    <option value="">Select a benefit...</option>
                    {CARER_ELIGIBILITY_RULES.qualifyingBenefits.map((benefit) => (
                      <option key={benefit.id} value={benefit.id}>
                        {benefit.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Benefit rate (if applicable) */}
                {personCaredFor.benefitType && (
                  <>
                    {CARER_ELIGIBILITY_RULES.qualifyingBenefits
                      .find((b) => b.id === personCaredFor.benefitType)
                      ?.rates && (
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          What rate do they receive?
                        </label>
                        <select
                          value={personCaredFor.benefitRate || ''}
                          onChange={(e) =>
                            setPersonCaredFor({
                              ...personCaredFor,
                              benefitRate: e.target.value as PersonCaredFor['benefitRate'],
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        >
                          <option value="">Select rate...</option>
                          {CARER_ELIGIBILITY_RULES.qualifyingBenefits
                            .find((b) => b.id === personCaredFor.benefitType)
                            ?.rates?.map((rate) => (
                              <option key={rate.id} value={rate.id}>
                                {rate.label}
                              </option>
                            ))}
                        </select>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* Question 4: Earnings */}
          <div className="space-y-2">
            <label className="block text-base font-semibold text-gray-900">
              What are your current earnings?
            </label>
            <p className="text-sm text-gray-600">
              Earnings above £{CARER_ELIGIBILITY_RULES.maxEarningsPerWeekForCA}/week will
              make you ineligible for Carer's Allowance (but not the UC Carer Element)
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2 text-gray-600">£</span>
                <input
                  type="number"
                  value={earningsInput}
                  onChange={(e) => setEarningsInput(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded text-base"
                  placeholder="0.00"
                />
              </div>
              <select
                value={earningsFrequency}
                onChange={(e) =>
                  setEarningsFrequency(e.target.value as 'weekly' | 'monthly')
                }
                className="px-3 py-2 border border-gray-300 rounded text-base"
              >
                <option value="weekly">per week</option>
                <option value="monthly">per month</option>
              </select>
            </div>
            {earningsError && <p className="text-sm text-red-600">{earningsError}</p>}
            {earningsFrequency === 'monthly' && earnings > 0 && (
              <p className="text-xs text-gray-500">
                ≈ £{weeklyEarnings.toFixed(2)} per week
              </p>
            )}
          </div>

          {/* Assess Button */}
          <div className="pt-2">
            <Button
              onClick={handleAssess}
              className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 w-full"
            >
              Assess Eligibility
            </Button>
          </div>

          {/* Results Section */}
          {showResults && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
              <h4 className="text-lg font-bold text-gray-900">Eligibility Results</h4>

              {/* UC Carer Element */}
              <div
                className={`p-4 rounded border-2 ${
                  eligibilityResult.eligibleForUCCarerElement
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-gray-900">
                    UC Carer Element
                  </h5>
                  <span className="text-2xl">
                    {eligibilityResult.eligibleForUCCarerElement ? '✅' : '❌'}
                  </span>
                </div>
                {eligibilityResult.eligibleForUCCarerElement ? (
                  <p className="text-sm text-gray-700">
                    You are eligible for the UC Carer Element of{' '}
                    <strong>£{UC_CARER_ELEMENT_MONTHLY.toFixed(2)}/month</strong>.
                    This will be automatically included in your UC payment.
                  </p>
                ) : (
                  <p className="text-sm text-gray-700">
                    You do not meet the eligibility criteria for the UC Carer Element.
                  </p>
                )}
              </div>

              {/* Carer's Allowance */}
              <div
                className={`p-4 rounded border-2 ${
                  eligibilityResult.eligibleForCarersAllowance
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-gray-900">Carer's Allowance</h5>
                  <span className="text-2xl">
                    {eligibilityResult.eligibleForCarersAllowance ? '✅' : '❌'}
                  </span>
                </div>
                {eligibilityResult.eligibleForCarersAllowance ? (
                  <p className="text-sm text-gray-700">
                    You are eligible for Carer's Allowance of{' '}
                    <strong>£{CARERS_ALLOWANCE_WEEKLY.toFixed(2)}/week</strong>. Note
                    that this will be deducted from your UC payment pound-for-pound, but
                    may qualify you for other benefits.
                  </p>
                ) : (
                  <p className="text-sm text-gray-700">
                    You do not meet the eligibility criteria for Carer's Allowance.
                  </p>
                )}
              </div>

              {/* Issues */}
              {eligibilityResult.issues.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-300 rounded p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">
                    ⚠️ Eligibility Issues
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {eligibilityResult.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendation */}
              <div className="bg-white border border-gray-300 rounded p-4">
                <h5 className="font-semibold text-gray-900 mb-2">📋 Recommendation</h5>
                <p className="text-sm text-gray-700">{eligibilityResult.recommendation}</p>
              </div>
            </div>
          )}

          {/* Guidance Section */}
          <div className="border-t border-gray-200 pt-4">
            <Button
              onClick={() => setShowGuidance(!showGuidance)}
              className="text-blue-600 hover:text-blue-700 text-sm underline bg-transparent p-0"
            >
              {showGuidance ? 'Hide' : 'Show'} Guidance & FAQs
            </Button>
          </div>

          {showGuidance && (
            <div className="bg-gray-50 border border-gray-200 rounded p-4 space-y-3">
              <Accordion title="What is the UC Carer Element?" open={false}>
                <p className="text-sm text-gray-700">
                  The UC Carer Element is an extra amount added to your Universal Credit if
                  you care for someone for at least 35 hours per week. The person you care
                  for must receive a qualifying disability benefit. The amount is £
                  {UC_CARER_ELEMENT_MONTHLY.toFixed(2)} per month.
                </p>
              </Accordion>

              <Accordion title="What is Carer's Allowance?" open={false}>
                <p className="text-sm text-gray-700">
                  Carer's Allowance is a separate benefit paid to carers who spend at least
                  35 hours per week caring for someone receiving a qualifying disability
                  benefit. It pays £{CARERS_ALLOWANCE_WEEKLY.toFixed(2)} per week. However,
                  if you receive UC, the CA amount is deducted from your UC payment
                  pound-for-pound. Despite this, claiming CA may qualify you for other
                  benefits like Council Tax discounts.
                </p>
              </Accordion>

              <Accordion title="Which should I claim?" open={false}>
                <p className="text-sm text-gray-700 space-y-2">
                  <span className="block">
                    <strong>UC Carer Element:</strong> Simpler, automatically included in
                    UC, no separate claim needed.
                  </span>
                  <span className="block">
                    <strong>Carer's Allowance:</strong> May qualify you for additional
                    benefits (e.g., Council Tax discount, Pension Credit Carer Addition).
                    Worth claiming even though it's deducted from UC.
                  </span>
                  <span className="block">
                    If you're eligible for both, many advisers recommend claiming Carer's
                    Allowance for the potential additional benefits.
                  </span>
                </p>
              </Accordion>

              <Accordion title="What are qualifying benefits?" open={false}>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>The person you care for must receive one of these benefits:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Personal Independence Payment (PIP) - Daily Living Component</li>
                    <li>Attendance Allowance</li>
                    <li>Disability Living Allowance (DLA) - Middle or highest care rate</li>
                    <li>Constant Attendance Allowance</li>
                    <li>Armed Forces Independence Payment</li>
                  </ul>
                </div>
              </Accordion>

              <Accordion title="Can I work while caring?" open={false}>
                <p className="text-sm text-gray-700">
                  Yes, you can work while caring. For the UC Carer Element, there's no
                  earnings limit (though your earnings will affect your overall UC through
                  the taper). For Carer's Allowance, you can earn up to £
                  {CARER_ELIGIBILITY_RULES.maxEarningsPerWeekForCA}/week after tax,
                  National Insurance, and allowable expenses.
                </p>
              </Accordion>

              <div className="border-t border-gray-300 pt-3 mt-3">
                <h5 className="font-semibold text-gray-900 mb-2">External Resources</h5>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a
                      href="https://www.gov.uk/carers-allowance"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Gov.uk: Carer's Allowance →
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.gov.uk/universal-credit/what-youll-get"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Gov.uk: Universal Credit (includes Carer Element) →
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.carersuk.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Carers UK: Support and advice for carers →
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
