import clsx from 'clsx'

import { Label } from './Label'
import { useMemo } from 'react'

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

  const Component = useMemo(() => {
    return as
  }, [as])

  return (
    <Component
      className={clsx('block pt-4 pb-7 border-b-1 border-divider last:border-b-0', className)}
    >
      {label && <Label>{label}</Label>}
      {descriptionBefore && (
        <div className="mb-3 text-slate-600 [&>p+p]:mt-3">{descriptionBefore}</div>
      )}
      {children}
      {descriptionAfter && (
        <div className="mb-3 text-slate-600 [&>p+p]:mt-3">{descriptionAfter}</div>
      )}
    </Component>
  )
}
