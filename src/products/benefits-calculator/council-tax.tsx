import { z } from 'zod'

import { Page } from '~/products/shared/Page'

import { useWorkflow } from '../shared/use-workflow'
import { Alert } from '~/components/Alert'
import { Form, Fields, Show } from '~/components/Informed'
import { Button } from '~/components/Button'

const COUNCIL_TAX_BAND_OPTIONS = [
  { label: "Don't Know", value: 'DontKnow' },
  { label: 'no CT liability', value: 'X' },
  { label: 'A', value: 'A' },
  { label: 'B', value: 'B' },
  { label: 'C', value: 'C' },
  { label: 'D', value: 'D' },
  { label: 'E', value: 'E' },
  { label: 'F', value: 'F' },
  { label: 'G', value: 'G' },
  { label: 'H', value: 'H' },
]

const DISCOUNTS_OPTIONS = [
  { label: 'none', value: '0' },
  { label: '25%', value: '25' },
  { label: '50%', value: '50' },
  { label: '100%', value: '100' },
]

const PAYMENT_PERIOD_OPTIONS = [
  { label: 'Weekly', value: '2' },
  { label: '4 weeks', value: '3' },
  { label: 'Monthly', value: '1' },
  { label: 'Yearly', value: '0' },
]

const schema = z.object({
  CouncilTaxBand: z.string().min(1, 'Please select a council tax band'),
  EligibleDisabilityReduction: z.boolean(),
  DiscountsApplicable: z.string(),
  CouncilTaxLiabilitySelector: z.string(),
  AmountIsCorrect: z.boolean(),
  CouncilTax: z.string(),
  CouncilTaxPeriod: z.string(),
})

export function CouncilTax() {
  const { goToNextPage } = useWorkflow()

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
          <h1 className="text-3xl font-bold">Council Tax</h1>

          <div className="font-bold mb-4">
            <h2 className="text-xl mb-2">Local authority</h2>
            <strong>East Lothian</strong>
          </div>

          <Alert type="info">
            In the Council Tax Reduction scheme, only the Council Tax rate is eligible for support,
            not the water and sewerage payments, so don't include these charges here. We will provide
            information about Scotland's Water Charges Reduction Scheme on the results page if you
            qualify.
          </Alert>

          <Fields.Select
            required
            label="Council Tax band for property"
            name="CouncilTaxBand"
            defaultValue=""
            options={COUNCIL_TAX_BAND_OPTIONS}
            descriptionBefore="If you are unsure you can select 'don't know' and we'll look it up for you. If you are exempt or disregarded from paying Council Tax you can select 'no CT liability' from the options here."
          />

          <Fields.BooleanRadio
            label="Eligible for disability-related reduction?"
            name="EligibleDisabilityReduction"
            defaultValue={false}
            descriptionBefore="Please select 'yes' if you have already successfully applied for a reduction because you have an extra room or adaptations needed for a disabled person."
          />

          <Fields.Select
            label="Discounts applicable"
            name="DiscountsApplicable"
            defaultValue="25"
            options={DISCOUNTS_OPTIONS}
            descriptionBefore="If you are the only adult in the household you normally qualify for a 25% discount. If no adults count for Council Tax purposes a 50% discount could apply. If you qualify as severely mentally impaired you can select the appropriate discount rate here."
          />

          <Fields.Select
            label="Council Tax liability"
            name="CouncilTaxLiabilitySelector"
            defaultValue="0"
            options={PAYMENT_PERIOD_OPTIONS}
            descriptionBefore={
              <>
                <p>
                  Based on the information provided we believe this is your Council Tax liability
                  after any discounts and reductions but before Council Tax Support is taken off.
                </p>

                <p className="text-2xl">
                  <span>£</span>
                  <span>0.00</span>
                </p>
              </>
            }
          />

          <Fields.BooleanRadio
            label="Is the amount shown for your Council Tax liability correct?"
            name="AmountIsCorrect"
            defaultValue={true}
            descriptionBefore="If you are a joint tenant please enter your proportion of the Council Tax here. If your Council Tax liability is different to the amount shown above select 'no' and enter the correct amount."
          />

          <Fields.NumberInput
            label="Council Tax liability (AFTER any discounts eg, disability, single person)"
            name="CouncilTax"
            defaultValue="0"
            inputClassName="max-w-[140px]"
            descriptionBefore="Please tell us your Council Tax liability after any discounts and reductions but before Council Tax Support is taken off."
          />

          <Fields.Select
            label="Payment period"
            name="CouncilTaxPeriod"
            defaultValue="0"
            options={PAYMENT_PERIOD_OPTIONS}
          />
        </Page.Main>

        <Page.Footer nextButton={<Button type="submit">Next →</Button>} />
      </Form>
    </>
  )
}
