import clsx from 'clsx'

import { Label } from './Label'
import { useMemo } from 'react'

type FieldProps = {
  children: React.ReactNode
  label?: string
  className?: string
  as?: 'label' | 'div'
}

export function Field(props: FieldProps) {
  const { as = 'label', children, label, className } = props

  const Component = useMemo(() => {
    return as
  }, [as])

  return (
    <Component
      className={clsx('block pt-4 pb-7 border-b-1 border-divider last:border-b-0', className)}
    >
      {label && <Label>{label}</Label>}
      {children}
    </Component>
  )
}
