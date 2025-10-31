import { createFileRoute } from '@tanstack/react-router'
import { useAppForm } from '~/components/Form/use-app-form'

export const Route = createFileRoute('/benefits-calculator/age-and-disability')({
  component: RouteComponent,
})

function RouteComponent() {
  const form = useAppForm({
    defaultValues: {},
    onSubmit: async ({ value }) => {
      console.log('onSubmit', value)
    },
  })

  return (
    <div className="">
      <h1 className="text-3xl font-bold">Age and disability status</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="mt-5"
      >
        <form.AppField
          name="Age"
          children={(field) => (
            <field.NumberInputField
              label="Age"
              inputClassName="max-w-[140px]"
              descriptionBefore="Please enter current age. Enter a valid value from 16 to 120."
            />
          )}
        />

        {/* 
        <form.AppField
          name="DOB_Day"
          children={(field) => (
            <field.NumberInputField
              label="Date of birth"
              inputClassName="max-w-[140px]"
              descriptionBefore="For example, 31 3 2010"
            />
          )}
        />

        <form.AppField
          name="Gender"
          children={(field) => (
            <field.RadioField
              label="Sex"
              options={[
                { value: 'Female', label: 'Female' },
                { value: 'Male', label: 'Male' },
              ]}
            />
          )}
        /> */}

        <form.AppField
          name="ClientWorkStatus"
          children={(field) => (
            <field.RadioField
              label="Which best describes your employment status?"
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
              options={[
                { value: 'NotEmployed', label: 'Not employed' },
                {
                  value: 'NotEmployedButWorkedRecently',
                  label: 'Not employed but worked in the last 2 years',
                },
                { value: 'Employed', label: 'Employed' },
                { value: 'EmployedOnStatutoryLeave', label: 'Employed - on statutory leave' },
                { value: 'SelfEmployed', label: 'Self-employed' },
              ]}
            />
          )}
        />

        <form.AppField
          name="WeekWorkHoursAmount"
          children={(field) => (
            <field.NumberInputField
              label="How many hours a week do you work?"
              inputClassName="max-w-[140px]"
              descriptionBefore="Please enter a valid value from 0 to 168."
            />
          )}
        />

        <form.AppField
          name="ClientDisbens"
          children={(field) => (
            <field.RadioField
              label="Do you receive a disability or sickness benefit?"
              descriptionBefore="Common disability benefits are Attendance Allowance, Pension Age Disability Payment, Disability Living Allowance (DLA), Personal Independence Payment (PIP), Adult Disability Payment, Employment and Support Allowance (ESA), Universal Credit limited capability for work element (LCW/RA) and Statutory Sick Pay (SSP)."
              options={[
                { value: 'NotClaimed', label: 'No' },
                { value: 'CurrentlyClaiming', label: 'Yes' },
              ]}
            />
          )}
        />

        <form.AppField
          name="ClientDisabledNotClaiming"
          defaultValue={false}
          children={(field) => (
            <field.BooleanRadioField
              label="Are you ill or disabled but not claiming one of the disability benefits listed below?"
              descriptionBefore="Answer 'yes' if you have have a health condition that affects your daily living or mobility and would like to find out more about Personal Independence Payment, Adult Disability Payment or Attendance Allowance."
            />
          )}
        />

        <form.AppField
          name="ClientCareForDisabled"
          defaultValue={false}
          children={(field) => (
            <field.BooleanRadioField label="Do you care for someone who is sick or disabled?" />
          )}
        />
      </form>
    </div>
  )
}
