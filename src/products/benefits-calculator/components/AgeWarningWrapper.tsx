/**
 * Wrapper component to display State Pension Age Warning reactively
 * Uses useFormState hook to access current form values as user types
 */

import { useFormState } from 'informed'
import { StatePensionAgeWarning } from './StatePensionAgeWarning'

interface AgeWarningWrapperProps {
  circumstances: 'single' | 'couple'
}

export function AgeWarningWrapper({ circumstances }: AgeWarningWrapperProps) {
  const formState = useFormState()

  const age = formState.values.age as number | undefined
  const partnerAge = formState.values.partnerAge as number | undefined

  // Don't show until we have the required ages
  if (circumstances === 'single' && !age) {
    return null
  }

  if (circumstances === 'couple' && (!age || !partnerAge)) {
    return null
  }

  return (
    <div className="my-6">
      <StatePensionAgeWarning
        claimantAge={age || 0}
        partnerAge={partnerAge}
        circumstances={circumstances}
      />
    </div>
  )
}
