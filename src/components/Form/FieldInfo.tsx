import clsx from 'clsx'
import type { AnyFieldApi } from '@tanstack/react-form'

export function FieldInfo({ field, className }: { field: AnyFieldApi; className?: string }) {
  if (field.state.meta.isValid) return

  return (
    <div className={clsx('text-red-600 mt-3', className)}>
      {field.state.meta.errors.map((err) => err.message).join(',')}
    </div>
  )
}
