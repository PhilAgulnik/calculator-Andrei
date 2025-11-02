import clsx from 'clsx'

import { Label } from './Label'
import { useMemo } from 'react'
import { useFieldContext } from './use-app-form'

type FieldProps = {
  children: React.ReactNode
  label?: string
  className?: string
  as?: 'label' | 'div'
  descriptionBefore?: React.ReactNode
  descriptionAfter?: React.ReactNode
}

export type CommonFieldProps = Pick<
  FieldProps,
  'label' | 'className' | 'descriptionBefore' | 'descriptionAfter'
>

export function Field(props: FieldProps) {
  const { as = 'label', children, label, className, descriptionBefore, descriptionAfter } = props

  const field = useFieldContext()
  const isInvalid = !field.state.meta.isValid

  const Component = useMemo(() => {
    return as
  }, [as])

  return (
    <Component
      className={clsx(
        'block pt-4 pb-6 border-b-1 border-divider last:border-b-0 relative',
        isInvalid &&
          'is-invalid pl-5 before:content-[""] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-red-500',
        className
      )}
    >
      {label && <Label>{label}</Label>}
      {descriptionBefore && (
        <div className="mb-3 text-slate-600 [&>p+p]:mt-3">{descriptionBefore}</div>
      )}
      {children}
      {descriptionAfter && (
        <div className="mb-3 text-slate-600 [&>p+p]:mt-3">{descriptionAfter}</div>
      )}

      {/* <pre>{JSON.stringify(field.state, null, 2)}</pre> */}
    </Component>
  )
}
