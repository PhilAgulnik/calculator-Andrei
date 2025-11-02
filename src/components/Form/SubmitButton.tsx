import clsx from 'clsx'
import { useFormContext } from './use-app-form'

type SubmitButtonProps = {
  children: React.ReactNode
  className?: string
}

export function SubmitButton(props: SubmitButtonProps) {
  const { children, className } = props

  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state}>
      {(state) => (
        <>
          <button
            type="submit"
            disabled={state.isSubmitting || !state.isValid}
            className={clsx(
              'px-4 py-2 bg-primary text-white rounded-md font-medium whitespace-nowrap cursor-pointer',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              className
            )}
          >
            {children}
          </button>
        </>
      )}
    </form.Subscribe>
  )
}
