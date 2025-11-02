import { z } from 'zod'

import { Alert } from '~/components/Alert'
import { Button } from '~/components/Button'
import { Form, Fields, Show } from '~/components/Informed'
import { Page } from '~/products/shared/Page'
import { useAppForm } from '~/components/Form/use-app-form'

import { useWorkflow } from '../shared/use-workflow'

const HOUSING_STATUS_OPTIONS = [
  {
    label: 'Council or housing association tenant',
    value: 'CouncilTenant',
  },
  { label: 'Tenant - private sector', value: 'TenantPrivateSector' },
  { label: 'Mortgage or owned outright', value: 'MortgageOrOwned' },
  { label: 'Shared ownership', value: 'SharedOwnership' },
  { label: 'Boarder or lodger', value: 'BoarderOrLodger' },
  { label: 'Supported accommodation', value: 'SupportedAccommodation' },
  { label: 'Temporary accommodation', value: 'TemporaryAccommodation' },
  {
    label: 'Living rent-free with friends/family',
    value: 'LivingWithParents',
  },
  { label: 'Homeless', value: 'Homeless' },
]

const CALC_YEARS_OPTIONS = [
  { label: '2023/24', value: '2023_24' },
  { label: '2024/25', value: '2024_25' },
  { label: '2025/26', value: '2025_26' },
]

const schema = z.object({
  NationalHousingStatus: z.enum(
    HOUSING_STATUS_OPTIONS.map((option) => option.value),
    'Please select a housing status'
  ),
  CalcYears: z.enum(
    CALC_YEARS_OPTIONS.map((option) => option.value),
    'Please select a tax year'
  ),
  Postcode: z.string().min(1, 'Please enter a valid postcode'),
})

export function WhereYouLive() {
  const { goToNextPage } = useWorkflow()

  const form = useAppForm({
    defaultValues: {
      Postcode: '',
      NationalHousingStatus: '',
      CalcYears: '2024_25',
    },
    onSubmit: async ({ value, meta }) => {
      console.log('onSubmit', { value, meta })
      goToNextPage()
    },
    validators: {
      onSubmit: schema,
    },
  })

  return (
    <>
      <Form
        onSubmit={(values) => {
          console.log('onSubmit', { values })
          goToNextPage()
        }}
        className="contents"
      >
        <Page.Main>
          <h1 className="text-3xl font-bold">What are you entitled to?</h1>
          <p className="text-xl text-slate-600 mt-1.5">
            Welcome to entitledto's free benefits calculator.
          </p>
          <p className="mt-3">
            To find out what you might be able to claim enter your details and you'll receive an
            estimate of your entitlement to benefits. If you work for an organisation helping people
            with benefits please see our tools for organisations.
          </p>
          <p className="mt-3 mb-4">
            Before you start, collect together information about your income, savings, pensions and
            existing benefits for you and your partner, if you have one. See how to use the
            calculator for more tips.
          </p>

          <Fields.Radio
            required
            label="Which best describes your current housing status?"
            name="NationalHousingStatus"
            options={HOUSING_STATUS_OPTIONS}
            descriptionAfter={
              <>
                <Show
                  when={({ formState }) =>
                    formState.values.NationalHousingStatus === 'SupportedAccommodation'
                  }
                >
                  <Alert type="info">
                    If your landlord provides you with support services, supervision or care then
                    your home may be classified as supported accommodation. Various exemptions from
                    welfare reforms, such as the benefit cap, apply to people living in supported
                    accommodation. If you are in doubt about your housing status please read our
                    information on supported exempt accommodation and/or check with your landlord.
                  </Alert>
                </Show>

                <Show
                  when={({ formState }) =>
                    formState.values.NationalHousingStatus === 'TemporaryAccommodation'
                  }
                >
                  <Alert type="info">
                    This is the correct option if your council has placed you in temporary
                    accommodation while they find alternative accommodation for you. Please enter
                    the postcode of where you are staying at the moment.
                  </Alert>
                </Show>

                <Show
                  when={({ formState }) =>
                    formState.values.NationalHousingStatus === 'BoarderOrLodger'
                  }
                >
                  <Alert type="info">
                    Select this option if you pay rent to someone who also lives in the
                    accommodation and you are not related to them or staying there as a friend.
                  </Alert>
                </Show>

                <Show
                  when={({ formState }) =>
                    formState.values.NationalHousingStatus === 'LivingWithParents'
                  }
                >
                  <Alert type="info">
                    Select this option if you live with a relative or friend on an informal basis,
                    without a contract to pay rent. You may have an informal arrangement to pay
                    money to stay there, but you do not have a formal contract to pay rent or
                    invoices for rent paid.
                  </Alert>
                </Show>

                <Show
                  when={({ formState }) => formState.values.NationalHousingStatus === 'Homeless'}
                >
                  <Alert type="info">
                    You count as homeless if you have no regular place to stay. You may be staying
                    in different places or on the street. If you don’t have a regular postcode
                    please instead select the Local Authority area where you stay most often.
                  </Alert>
                </Show>

                <Show
                  when={({ formState }) =>
                    formState.values.NationalHousingStatus === 'InPrisonOrInHospital'
                  }
                >
                  <Alert type="info">
                    You have told us you are in prison or in hospital at the moment, but we want to
                    work out the benefits you will be entitled to when you are back in the
                    community. If you have nowhere to live back in the community you are most likely
                    to look for accommodation in the private rented sector. Accordingly, we will ask
                    you about the rent and Council Tax you expect to pay and will assume that you
                    are renting privately.
                  </Alert>
                </Show>
              </>
            }
          />

          <Fields.Select
            label="Work out my entitlements for year"
            name="CalcYears"
            options={CALC_YEARS_OPTIONS}
          />

          <Fields.TextInput
            required
            label="What is your postcode?"
            name="Postcode"
            inputClassName="max-w-[150px]"
          />
        </Page.Main>

        <Page.Footer nextButton={<Button type="submit">Next →</Button>} />
      </Form>
    </>
  )
}
