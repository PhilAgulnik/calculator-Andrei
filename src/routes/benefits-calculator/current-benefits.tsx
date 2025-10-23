import { createFileRoute } from '@tanstack/react-router'
import { useAppForm } from '~/components/Form/use-app-form'

export const Route = createFileRoute('/benefits-calculator/current-benefits')({
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
      <h1 className="text-3xl font-bold">Current benefits</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="mt-5"
      >
        <form.AppField
          name="has_partner"
          children={(field) => <field.BooleanRadioField label="Do you get Universal Credit?" />}
        />

        <form.AppField
          name="number_of_children"
          children={(field) => (
            <field.BooleanRadioField label="Do you get income-related Employment and Support Allowance (ESA)?" />
          )}
        />

        {/* <form.AppForm>
          <form.FormDebug />
        </form.AppForm> */}
      </form>
    </div>
  )
}
