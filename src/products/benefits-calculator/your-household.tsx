import { Page } from '~/products/shared/Page'

import { useWorkflow } from '../shared/use-workflow'
import { Alert } from '~/components/Alert'
import { Form, Fields, Show } from '~/components/Informed'
import { Button } from '~/components/Button'

export function YourHousehold() {
  const { entry, goToNextPage, updateEntryData } = useWorkflow()

  return (
    <>
      <Form
        onSubmit={({ values }) => {
          updateEntryData(values)
          goToNextPage()
        }}
        className="contents"
        initialValues={!!entry ? entry?.data : {}}
      >
        <Page.Main>
          <h1 className="text-3xl font-bold">Your household</h1>
          <Fields.BooleanRadio
            required
            label="Do you have a partner who normally lives with you? "
            name="HasPartner"
            descriptionBefore="Say yes if you are married or live with someone as a couple, including civil partners or people you live with as if you are civil partners. Please click on the help icon above for guidance on which member of a couple should be entered as 'you' and which should be the 'partner' for this calculation."
            descriptionAfter={
              <Show when={({ formState }) => formState.values.HasPartner === true}>
                <Alert type="info">
                  If you are currently getting a legacy benefit, please click on the help icon above
                  to find out who should be entered as 'you' and who should be the 'partner' for
                  this calculation, as it can make a difference. For Universal Credit it doesn't
                  matter.
                </Alert>
              </Show>
            }
          />

          <Fields.NumberInput
            required
            label="How many children are in your household?"
            name="HouseholdChildrenNumber"
            inputClassName="max-w-[140px]"
            descriptionBefore="Include any children under 19 who you or your partner get Child Benefit for (itdoes not matter if they are your biological children or not). If they are age 19please see our help guide for more information on when to include them. If youshare custody, you should only include children if you receive Child Benefit forthem. If you are pregnant or adopting and include the expected child we willcalculate your benefits assuming the child is born/adopted. Do not include anexpected child if you want to find out your current entitlements. Please enter avalid value from 0 to 10."
          />

          <Fields.BooleanRadio
            label="Does anyone else live in your home?"
            name="HasUC_NumNonDeps"
            descriptionBefore="For instance, a grown up child, elderly parent, joint tenant, sub-tenant or lodger."
          />

          <Fields.NumberInput
            label="How many other adults live with you?"
            name="LodgersNumber"
            inputClassName="max-w-[140px]"
            descriptionBefore="Please enter a valid value from 1 to 10."
          />

          <Fields.BooleanRadio
            label="Are you a British or Irish citizen living in the UK?"
            name="ImmigrationControl"
          />

          <Fields.BooleanRadio
            label="Are you in hospital/residential care, a prisoner, on strike, living abroad or a full-time student?"
            name="ResCare"
          />
        </Page.Main>

        <Page.Footer nextButton={<Button type="submit">Next →</Button>} />
      </Form>
    </>
  )
}
