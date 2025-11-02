import { Page } from '~/products/shared/Page'

import { useWorkflow } from '../shared/use-workflow'
import { Form, Fields, Show } from '~/components/Informed'
import { Button } from '~/components/Button'

export function HousingCosts() {
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
          <h1 className="text-3xl font-bold">Housing costs</h1>

          <p className="mt-4">
            You may qualify for help with your rent through Housing Benefit / Universal Credit
            housing costs element.
          </p>
          <p className="mt-3">
            Whether you are claiming Housing Benefit or Universal Credit, please enter your eligible
            rent as defined under Housing Benefit rent rules and Universal Credit rent rules.
          </p>

          <Fields.AmountPeriod required label="How much is your eligible rent?" name="Rent" />

          <Fields.BooleanRadio
            label="Is help with housing costs paid directly to your landlord by the DWP?"
            name="UCAPA"
            defaultValue={false}
            descriptionBefore="If you have or have had trouble paying your rent you may have an Alternative Payment Arrangement. This means you receive a Universal Credit amount for you and your household but help with housing costs is paid directly to your landlord. If this applies to you please say yes to this question. If you are starting a new Universal Credit claim you should normally answer no."
          />

          <Fields.NumberInput
            label="Number of rent-free weeks"
            name="NumberOfRentFreeWeeks"
            defaultValue={0}
            inputClassName="max-w-[140px]"
            descriptionBefore="If you have rent free weeks please read the help text accessed via the i icon next to this question. Please enter a valid value from 0 to 52."
          />

          <Fields.BooleanRadio
            label="Do you live in a Sanctuary Scheme amended property?"
            name="SanctuarySchemeBedroomTaxExemption"
            defaultValue={false}
          />

          <Show
            when={({ formState }) => formState.values.SanctuarySchemeBedroomTaxExemption === false}
          >
            <Fields.NumberInput
              label="How many bedrooms do you currently have?"
              name="BedroomsCount"
              defaultValue={1}
              inputClassName="max-w-[140px]"
              descriptionBefore="Please tell us how many bedrooms you have as determined by your landlord. For joint tenants, enter the number of bedrooms you have access to. Benefits to help with housing costs may not be based on your full eligible rent if you are thought to have more bedrooms than you need. Please enter a valid value from 0 to 6."
            />

            <Fields.BooleanRadio
              label="Would you like more information on when an extra bedroom may be included?"
              name="HasMoreInfoAboutDisabledChilrdren"
              defaultValue={false}
              descriptionBefore="In some circumstances you may qualify for an extra bedroom when working out how many bedrooms you need. Select 'Yes' to find out more or add an extra bedroom to your entitlement."
            />
          </Show>

          {/* 
          <Fields.BooleanRadio
            label="Should we include an extra bedroom in your calculation?"
            name="IncludeExtraBedroom"
            defaultValue={false}
            descriptionBefore={
              <>
                <p>
                  The number of bedrooms a household needs can be increased in certain
                  circumstances. Special rules affect the following groups:
                </p>
                <ul>
                  <li>
                    A disabled adult, child or non-dependant who needs overnight care from a
                    non-resident carer or group of carers
                  </li>
                  <li>
                    An adult couple who are unable to share a room because of a disability or a
                    disabled child who would be expected to share a bedroom but cannot share because
                    of a disability
                  </li>
                  <li>
                    Foster carers between placements if they have fostered a child, or became a
                    foster parent, within the last 12 months.
                  </li>
                  <li>Households with adult children in the armed forces who are away from home</li>
                </ul>
                <p>
                  If you qualify under any of these exemptions please say 'yes' to the question
                  below and we will include an extra bedroom in your calculation. The rules in this
                  area are complicated and you may need to take advice on your individual situation.
                </p>
              </>
            }
          /> */}
        </Page.Main>

        <Page.Footer nextButton={<Button type="submit">Next →</Button>} />
      </Form>
    </>
  )
}
