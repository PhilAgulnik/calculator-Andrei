import { Page } from '~/products/shared/Page'

import { useWorkflow } from '../shared/use-workflow'
import { Alert } from '~/components/Alert'
import { Accordion } from '~/components/Accordion'
import { Form, Fields, Show } from '~/components/Form'
import { Button } from '~/components/Button'

export function YourHousehold() {
  const { entry, goToNextPage, updateEntryData } = useWorkflow()

  return (
    <>
      <Form
        onSubmit={({ values }: any) => {
          updateEntryData(values)
          goToNextPage(values)
        }}
        className="contents"
        initialValues={!!entry ? entry?.data : {}}
      >
        <Page.Main>
          <h1 className="text-3xl font-bold">Your household</h1>
          <Fields.Radio
            required
            label="Personal Circumstances"
            name="circumstances"
            options={[
              { value: 'single', label: 'Single' },
              { value: 'couple', label: 'Couple' },
            ]}
            defaultValue="single"
            descriptionBefore="Say 'couple' if you are married or live with someone as a couple, including civil partners or people you live with as if you are civil partners. Please click on the help icon above for guidance on which member of a couple should be entered as 'you' and which should be the 'partner' for this calculation."
            descriptionAfter={
              <Show when={({ formState }) => formState.values.circumstances === 'couple'}>
                <Alert type="info">
                  If you are currently getting a legacy benefit, please click on the help icon above
                  to find out who should be entered as 'you' and who should be the 'partner' for
                  this calculation, as it can make a difference. For Universal Credit it doesn't
                  matter.
                </Alert>
              </Show>
            }
          />

          <Fields.BooleanRadio
            label="Do you have children?"
            name="hasChildren"
            defaultValue={false}
          />

          <Show when={({ formState }) => formState.values.hasChildren === true}>
            <Fields.NumberInput
              label="How many children are in your household?"
              name="children"
              defaultValue={0}
              inputClassName="max-w-[140px]"
              descriptionBefore="Include any children under 19 who you or your partner get Child Benefit for (itdoes not matter if they are your biological children or not). If they are age 19please see our help guide for more information on when to include them. If youshare custody, you should only include children if you receive Child Benefit forthem. If you are pregnant or adopting and include the expected child we willcalculate your benefits assuming the child is born/adopted. Do not include anexpected child if you want to find out your current entitlements. Please enter avalid value from 0 to 10."
            />
          </Show>

          <Fields.BooleanRadio
            label="Does anyone else live in your home?"
            name="hasUCNumNonDeps"
            descriptionBefore="For instance, a grown up child, elderly parent, joint tenant, sub-tenant or lodger."
          />

          <Show when={({ formState }) => formState.values.hasUCNumNonDeps === true}>
            <Fields.NumberInput
              label="How many other adults live with you?"
              name="lodgersNumber"
              inputClassName="max-w-[140px]"
              descriptionBefore="Please enter a valid value from 1 to 10."
            />
          </Show>

          <Fields.BooleanRadio
            label="Are you a British or Irish citizen living in the UK?"
            name="immigrationControl"
          />

          <Fields.BooleanRadio
            label="Are you in hospital/residential care, a prisoner, on strike or living abroad?"
            name="resCare"
          />

          <Fields.BooleanRadio
            label="Are you a full-time student?"
            name="isFullTimeStudent"
            defaultValue={false}
            descriptionBefore="A full-time student is someone undertaking a full-time course of advanced education, or any other full-time course where a student loan or grant is available."
          />

          <Show when={({ formState }) => formState.values.isFullTimeStudent === true}>
            <Alert type="info" className="!items-start">
              <div className="space-y-3 text-sm">
                <p className="font-semibold text-base">Full-time students and Universal Credit</p>
                <p>
                  Full-time students are generally not eligible for Universal Credit. However,
                  there are important exceptions. You will be asked about these on the next page.
                </p>
                <Accordion title="What counts as a full-time student?" open={false}>
                  <div className="mt-3 space-y-4">
                    <div>
                      <p className="font-medium mb-1">Definition (Regulation 12)</p>
                      <p className="mb-2">You are "receiving education" if you are undertaking:</p>
                      <ul className="list-disc ml-5 space-y-1">
                        <li>A full-time course of advanced education, OR</li>
                        <li>Any other full-time course of study or training where a student loan or grant is available</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium mb-1">Advanced education includes:</p>
                      <ul className="list-disc ml-5 space-y-1">
                        <li>Postgraduate courses and degrees</li>
                        <li>First degree courses</li>
                        <li>Higher National Diplomas (HND)</li>
                        <li>Diplomas of higher education</li>
                        <li>Any course above A-level or Scottish Higher standard</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-medium mb-1">Exceptions that allow students to claim UC (Regulation 14):</p>
                      <ul className="list-disc ml-5 space-y-1">
                        <li>Under 21 in non-advanced education without parental support</li>
                        <li>Receiving PIP, DLA or AA with documented limited capability for work</li>
                        <li>Responsible for a child or qualifying young person</li>
                        <li>Single foster parent with a child placed with you</li>
                        <li>Both members of a couple are students, and the partner cares for a child</li>
                        <li>Reached state pension age with a younger partner</li>
                      </ul>
                    </div>

                    <div className="border-t border-blue-200 pt-3 space-y-2">
                      <p>
                        Under Regulation 13, the course period includes vacation periods within the course
                        (e.g. Christmas and Easter breaks), but not the summer vacation after the course ends.
                      </p>
                      <p>
                        If you qualify, your student income (loans and grants) will be taken into account
                        when calculating your UC. You will be asked for details on the next page.
                      </p>
                    </div>
                  </div>
                </Accordion>
              </div>
            </Alert>
          </Show>

          <Show when={({ formState }) => formState.values.HasPartner === true}>
            <Fields.NumberInput
              required
              label="Partner's Age"
              name="partnerAge"
              defaultValue={25}
              inputClassName="max-w-[140px]"
              descriptionBefore="Please enter your partner's current age. Enter a valid value from 16 to 120."
            />
          </Show>
        </Page.Main>

        <Page.Footer nextButton={<Button type="submit">Next →</Button>} />
      </Form>
    </>
  )
}
