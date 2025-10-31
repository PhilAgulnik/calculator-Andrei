import { createFileRoute } from '@tanstack/react-router'
import { useAppForm } from '~/components/Form/use-app-form'

export const Route = createFileRoute('/benefits-calculator/your-household')({
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
      <h1 className="text-3xl font-bold">Your household</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="mt-5"
      >
        <form.AppField
          name="HasPartner"
          children={(field) => (
            <field.BooleanRadioField
              label="Do you have a partner who normally lives with you? "
              before={
                <p className="mb-3">
                  Say yes if you are married or live with someone as a couple, including civil
                  partners or people you live with as if you are civil partners. Please click on the
                  help icon above for guidance on which member of a couple should be entered as
                  'you' and which should be the 'partner' for this calculation.
                </p>
              }
            />
          )}
        />

        <form.AppField
          name="HouseholdChildrenNumber"
          children={(field) => (
            <field.NumberInputField
              label="How many children are in your household?"
              inputClassName="max-w-[140px]"
              before={
                <p className="mb-3">
                  Include any children under 19 who you or your partner get Child Benefit for (it
                  does not matter if they are your biological children or not). If they are age 19
                  please see our help guide for more information on when to include them. If you
                  share custody, you should only include children if you receive Child Benefit for
                  them. If you are pregnant or adopting and include the expected child we will
                  calculate your benefits assuming the child is born/adopted. Do not include an
                  expected child if you want to find out your current entitlements. Please enter a
                  valid value from 0 to 10.
                </p>
              }
            />
          )}
        />

        <form.AppField
          name="HasUC_NumNonDeps"
          defaultValue={false}
          children={(field) => (
            <field.BooleanRadioField
              label="Does anyone else live in your home?"
              before={
                <p className="mb-3">
                  For instance, a grown up child, elderly parent, joint tenant, sub-tenant or
                  lodger.
                </p>
              }
            />
          )}
        />

        <form.AppField
          name="ImmigrationControl"
          defaultValue={true}
          children={(field) => (
            <field.BooleanRadioField label="Are you a British or Irish citizen living in the UK?" />
          )}
        />

        <form.AppField
          name="ResCare"
          defaultValue={false}
          children={(field) => (
            <field.BooleanRadioField label="Are you in hospital/residential care, a prisoner, on strike, living abroad or a full-time student?" />
          )}
        />

        {/* <form.AppForm>
          <form.FormDebug />
        </form.AppForm> */}
      </form>
    </div>
  )
}
