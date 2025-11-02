import clsx from 'clsx'

import { Label } from './Label'
import { useMemo } from 'react'
import { FieldInfo } from './FieldInfo'

type FieldProps = {
  name: string
  children: React.ReactNode
  label?: string
  className?: string
  as?: 'label' | 'div'
  descriptionBefore?: React.ReactNode
  descriptionAfter?: React.ReactNode
  required?: boolean
  defaultValue?: any
}

export type CommonFieldProps = Pick<
  FieldProps,
  | 'name'
  | 'label'
  | 'className'
  | 'descriptionBefore'
  | 'descriptionAfter'
  | 'required'
  | 'defaultValue'
>

export function Field(props: FieldProps) {
  const {
    name,
    as = 'label',
    children,
    label,
    className,
    descriptionBefore,
    descriptionAfter,
    required,
  } = props

  const isInvalid = false

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
      {label && <Label required={required}>{label}</Label>}
      {descriptionBefore && (
        <div className="mb-3 text-slate-600 [&>p+p]:mt-3">{descriptionBefore}</div>
      )}
      {children}
      {descriptionAfter && (
        <div className="mt-3 text-slate-600 [&>p+p]:mt-3">{descriptionAfter}</div>
      )}

      <FieldInfo name={name} />
    </Component>
  )
}
