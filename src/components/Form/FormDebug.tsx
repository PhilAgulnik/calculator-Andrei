import { useFormContext } from './use-app-form'

export function FormDebug() {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.values}>
      {(state) => (
        <div>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      )}
    </form.Subscribe>
  )
}
