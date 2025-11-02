import { useFormContext } from './use-app-form'

export function FormDebug() {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state}>
      {(state) => (
        <div className="bg-slate-300 text-[0.85rem] p-4 rounded-md overflow-x-auto">
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      )}
    </form.Subscribe>
  )
}
