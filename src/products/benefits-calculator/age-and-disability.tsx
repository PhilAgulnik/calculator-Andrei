import { Page } from '~/products/shared/Page'

import { useWorkflow } from '../shared/use-workflow'
import { Form, Fields, Show } from '~/components/Form'
import { Button } from '~/components/Button'

const WORK_STATUS_OPTIONS = [
  { value: 'NotEmployed', label: 'Not employed' },
  {
    value: 'NotEmployedButWorkedRecently',
    label: 'Not employed but worked in the last 2 years',
  },
  { value: 'Employed', label: 'Employed' },
  { value: 'EmployedOnStatutoryLeave', label: 'Employed - on statutory leave' },
  { value: 'SelfEmployed', label: 'Self-employed' },
]

const DISBENS_OPTIONS = [
  { value: 'NotClaimed', label: 'No' },
  { value: 'CurrentlyClaiming', label: 'Yes' },
]

export function AgeAndDisability() {
  const { entry, goToNextPage, updateEntryData }: any = useWorkflow()

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
          <h1 className="text-3xl font-bold">Age and disability status</h1>

          <Fields.NumberInput
            label="Your Age"
            name="age"
            defaultValue={25}
            inputClassName="max-w-[140px]"
            descriptionBefore="Please enter current age. Enter a valid value from 16 to 120."
          />

          {entry.data?.circumstances === 'couple' && (
            <Fields.NumberInput
              label="Partner's Age"
              name="partnerAge"
              defaultValue={25}
              inputClassName="max-w-[140px]"
              descriptionBefore="Please enter your partner's current age. Enter a valid value from 16 to 120."
            />
          )}

          <h2 className="text-2xl font-bold mt-8">Employment and disability</h2>

          <Fields.Radio
            label="Which best describes your employment status?"
            name="employmentType"
            defaultValue="not_working"
            options={[
              { value: 'not_working', label: 'Not Working' },
              { value: 'employed', label: 'Employed' },
              { value: 'self-employed', label: 'Self-employed' },
            ]}
            descriptionBefore={
              <>
                <p>
                  If you are both employed and self-employed, select 'Self-employed' if more than
                  half your income is from self-employment. Otherwise select 'Employed'.
                </p>

                <p>
                  If you are not employed but have worked in the last 2 years we will ask for more
                  information to see if you could get help based on your national insurance
                  contributions.
                </p>
              </>
            }
          />

          <Show
            when={({ formState }) =>
              formState.values.employmentType === 'employed' ||
              formState.values.employmentType === 'self-employed'
            }
          >
            <Fields.AmountPeriod
              label="Monthly gross earnings"
              name="monthlyEarnings"
              defaultValue={0}
            />
          </Show>

          <Show when={({ formState }) => formState.values.employmentType === 'employed'}>
            <Fields.Radio
              label="Pension Contribution Type"
              name="pensionType"
              defaultValue="amount"
              options={[
                { value: 'amount', label: 'Fixed Amount' },
                { value: 'percentage', label: 'Percentage of Gross Earnings' },
              ]}
            />
          </Show>

          <Show
            when={({ formState }) =>
              formState.values.employmentType === 'employed' &&
              formState.values.pensionType === 'amount'
            }
          >
            <Fields.AmountPeriod
              label="Pension Contributions (per month)"
              name="pensionAmount"
              defaultValue={0}
            />
          </Show>

          <Show
            when={({ formState }) =>
              formState.values.employmentType === 'employed' &&
              formState.values.pensionType === 'percentage'
            }
          >
            <Fields.NumberInput
              label="Pension Percentage"
              name="pensionPercentage"
              defaultValue={3}
              inputClassName="max-w-[140px]"
              descriptionBefore="Percentage of gross earnings. Defaults to 3% if empty."
            />
          </Show>

          <Fields.Radio
            label="Are you sick or disabled?"
            name="isDisabled"
            defaultValue="no"
            options={[
              { value: 'no', label: 'No' },
              { value: 'yes', label: 'Yes' },
            ]}
          />

          <Show when={({ formState }) => formState.values.isDisabled === 'yes'}>
            <Fields.Radio
              label="Do you claim disability benefits?"
              name="claimsDisabilityBenefits"
              descriptionBefore="Common disability benefits are Attendance Allowance, Pension Age Disability Payment, Disability Living Allowance (DLA), Personal Independence Payment (PIP), Adult Disability Payment, Employment and Support Allowance (ESA), Universal Credit limited capability for work element (LCW/RA) and Statutory Sick Pay (SSP)."
              defaultValue="no"
              options={[
                { value: 'no', label: 'No' },
                { value: 'yes', label: 'Yes' },
              ]}
            />
          </Show>

          <Show
            when={({ formState }) =>
              formState.values.isDisabled === 'yes' &&
              formState.values.claimsDisabilityBenefits === 'yes'
            }
          >
            <Fields.Radio
              label="What disability benefit do you claim?"
              name="disabilityBenefitType"
              defaultValue=""
              options={[
                { value: 'pip', label: 'Personal Independence Payment (PIP)' },
                { value: 'dla', label: 'Disability Living Allowance (DLA)' },
                { value: 'aa', label: 'Attendance Allowance (AA)' },
                { value: 'other', label: 'Other' },
              ]}
            />
          </Show>

          <Show
            when={({ formState }) =>
              formState.values.claimsDisabilityBenefits === 'yes' &&
              formState.values.disabilityBenefitType === 'pip'
            }
          >
            <Fields.Radio
              label="PIP Daily Living Component Rate"
              name="pipDailyLivingRate"
              defaultValue="none"
              options={[
                { value: 'none', label: 'No award' },
                { value: 'standard', label: 'Standard Rate (£72.65)' },
                { value: 'enhanced', label: 'Enhanced Rate (£108.55)' },
              ]}
            />
          </Show>

          <Show
            when={({ formState }) =>
              formState.values.claimsDisabilityBenefits === 'yes' &&
              formState.values.disabilityBenefitType === 'pip'
            }
          >
            <Fields.Radio
              label="PIP Mobility Component Rate"
              name="pipMobilityRate"
              defaultValue="none"
              options={[
                { value: 'none', label: 'No award' },
                { value: 'standard', label: 'Standard Rate (£28.70)' },
                { value: 'enhanced', label: 'Enhanced Rate (£75.75)' },
              ]}
            />
          </Show>

          <Show
            when={({ formState }) =>
              formState.values.claimsDisabilityBenefits === 'yes' &&
              formState.values.disabilityBenefitType === 'dla'
            }
          >
            <Fields.Radio
              label="DLA Care Component Rate"
              name="dlaCareRate"
              defaultValue="none"
              options={[
                { value: 'none', label: 'No award' },
                { value: 'lowest', label: 'Lowest Rate (£28.70)' },
                { value: 'middle', label: 'Middle Rate (£72.65)' },
                { value: 'highest', label: 'Highest Rate (£108.55)' },
              ]}
            />
          </Show>

          <Show
            when={({ formState }) =>
              formState.values.claimsDisabilityBenefits === 'yes' &&
              formState.values.disabilityBenefitType === 'dla'
            }
          >
            <Fields.Radio
              label="DLA Mobility Component Rate"
              name="dlaMobilityRate"
              defaultValue="none"
              options={[
                { value: 'none', label: 'No award' },
                { value: 'lowest', label: 'Lowest Rate (£28.70)' },
                { value: 'highest', label: 'Highest Rate (£75.75)' },
              ]}
            />
          </Show>

          <Show
            when={({ formState }) =>
              formState.values.claimsDisabilityBenefits === 'yes' &&
              formState.values.disabilityBenefitType === 'aa'
            }
          >
            <Fields.Radio
              label="Attendance Allowance Rate"
              name="aaRate"
              defaultValue="none"
              options={[
                { value: 'none', label: 'No award' },
                { value: 'lower', label: 'Lower Rate (£72.65)' },
                { value: 'higher', label: 'Higher Rate (£108.55)' },
              ]}
            />
          </Show>

          <Show when={({ formState }) => formState.values.isDisabled === 'yes'}>
            <Fields.Radio
              label="Do you qualify for Limited Capability for Work and Work-Related Activity (LCWRA)?"
              name="hasLCWRA"
              defaultValue="no"
              options={[
                { value: 'no', label: 'No' },
                { value: 'yes', label: 'Yes' },
                { value: 'waiting', label: 'Waiting for assessment' },
              ]}
            />
          </Show>

          <Fields.Radio
            label="Do you care for someone who is sick or disabled?"
            name="isCarer"
            defaultValue="no"
            options={[
              { value: 'no', label: 'No' },
              { value: 'yes', label: 'Yes' },
            ]}
          />

          {entry.data?.circumstances === 'couple' && (
            <>
              <h2 className="text-2xl font-bold mt-8">Employment and disability – partner</h2>

              <Fields.Radio
                label="Is your partner sick or disabled?"
                name="partnerIsDisabled"
                defaultValue="no"
                options={[
                  { value: 'no', label: 'No' },
                  { value: 'yes', label: 'Yes' },
                ]}
              />

              <Show when={({ formState }) => formState.values.partnerIsDisabled === 'yes'}>
                <Fields.Radio
                  label="Does your partner claim disability benefits?"
                  name="partnerClaimsDisabilityBenefits"
                  defaultValue="no"
                  options={[
                    { value: 'no', label: 'No' },
                    { value: 'yes', label: 'Yes' },
                  ]}
                />
              </Show>

              <Show
                when={({ formState }) =>
                  formState.values.partnerIsDisabled === 'yes' &&
                  formState.values.partnerClaimsDisabilityBenefits === 'yes'
                }
              >
                <Fields.Radio
                  label="What disability benefit does your partner claim?"
                  name="partnerDisabilityBenefitType"
                  defaultValue=""
                  options={[
                    { value: 'pip', label: 'Personal Independence Payment (PIP)' },
                    { value: 'dla', label: 'Disability Living Allowance (DLA)' },
                    { value: 'aa', label: 'Attendance Allowance (AA)' },
                    { value: 'other', label: 'Other' },
                  ]}
                />
              </Show>

              <Show
                when={({ formState }) =>
                  formState.values.partnerClaimsDisabilityBenefits === 'yes' &&
                  formState.values.partnerDisabilityBenefitType === 'pip'
                }
              >
                <Fields.Radio
                  label="Partner's PIP Daily Living Component Rate"
                  name="partnerPipDailyLivingRate"
                  defaultValue="none"
                  options={[
                    { value: 'none', label: 'No award' },
                    { value: 'standard', label: 'Standard Rate (£72.65)' },
                    { value: 'enhanced', label: 'Enhanced Rate (£108.55)' },
                  ]}
                />
              </Show>

              <Show
                when={({ formState }) =>
                  formState.values.partnerClaimsDisabilityBenefits === 'yes' &&
                  formState.values.partnerDisabilityBenefitType === 'pip'
                }
              >
                <Fields.Radio
                  label="Partner's PIP Mobility Component Rate"
                  name="partnerPipMobilityRate"
                  defaultValue="none"
                  options={[
                    { value: 'none', label: 'No award' },
                    { value: 'standard', label: 'Standard Rate (£28.70)' },
                    { value: 'enhanced', label: 'Enhanced Rate (£75.75)' },
                  ]}
                />
              </Show>

              <Show
                when={({ formState }) =>
                  formState.values.partnerClaimsDisabilityBenefits === 'yes' &&
                  formState.values.partnerDisabilityBenefitType === 'dla'
                }
              >
                <Fields.Radio
                  label="Partner's DLA Care Component Rate"
                  name="partnerDlaCareRate"
                  defaultValue="none"
                  options={[
                    { value: 'none', label: 'No award' },
                    { value: 'lowest', label: 'Lowest Rate (£28.70)' },
                    { value: 'middle', label: 'Middle Rate (£72.65)' },
                    { value: 'highest', label: 'Highest Rate (£108.55)' },
                  ]}
                />
              </Show>

              <Show
                when={({ formState }) =>
                  formState.values.partnerClaimsDisabilityBenefits === 'yes' &&
                  formState.values.partnerDisabilityBenefitType === 'dla'
                }
              >
                <Fields.Radio
                  label="Partner's DLA Mobility Component Rate"
                  name="partnerDlaMobilityRate"
                  defaultValue="none"
                  options={[
                    { value: 'none', label: 'No award' },
                    { value: 'lowest', label: 'Lowest Rate (£28.70)' },
                    { value: 'highest', label: 'Highest Rate (£75.75)' },
                  ]}
                />
              </Show>

              <Show
                when={({ formState }) =>
                  formState.values.partnerClaimsDisabilityBenefits === 'yes' &&
                  formState.values.partnerDisabilityBenefitType === 'aa'
                }
              >
                <Fields.Radio
                  label="Partner's Attendance Allowance Rate"
                  name="partnerAaRate"
                  defaultValue="none"
                  options={[
                    { value: 'none', label: 'No award' },
                    { value: 'lower', label: 'Lower Rate (£72.65)' },
                    { value: 'higher', label: 'Higher Rate (£108.55)' },
                  ]}
                />
              </Show>

              <Show when={({ formState }) => formState.values.partnerIsDisabled === 'yes'}>
                <Fields.Radio
                  label="Does your partner qualify for Limited Capability for Work and Work-Related Activity (LCWRA)?"
                  name="partnerHasLCWRA"
                  defaultValue="no"
                  options={[
                    { value: 'no', label: 'No' },
                    { value: 'yes', label: 'Yes' },
                    { value: 'waiting', label: 'Waiting for assessment' },
                  ]}
                />
              </Show>

              <Fields.Radio
                label="Does your partner care for someone who is sick or disabled?"
                name="isPartnerCarer"
                defaultValue="no"
                options={[
                  { value: 'no', label: 'No' },
                  { value: 'yes', label: 'Yes' },
                ]}
              />
            </>
          )}
        </Page.Main>

        <Page.Footer nextButton={<Button type="submit">Next →</Button>} />
      </Form>
    </>
  )
}
