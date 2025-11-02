import { Form as InformedForm, Debug } from 'informed'

type FormProps = {
  children: React.ReactNode
  onSubmit?: (values: Record<string, unknown>) => void
  className?: string
  initialValues?: Record<string, unknown>
}

export function Form(props: FormProps) {
  const { children, onSubmit, className, initialValues } = props

  return (
    <InformedForm onSubmit={onSubmit} className={className} initialValues={initialValues}>
      {children}
      <Debug valid pristine dirty values errors touched />
    </InformedForm>
  )
}
