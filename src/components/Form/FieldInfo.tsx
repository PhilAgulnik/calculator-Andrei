import clsx from 'clsx'
import type { AnyFieldApi } from '@tanstack/react-form'

export function FieldInfo({ field, className }: { field: AnyFieldApi; className?: string }) {
  if (field.state.meta.isValid) return

  return (
    <>
      {field.state.meta.isBlurred &&
        field.state.meta.isDirty &&
        !field.state.meta.isDefaultValue && (
          <em className={clsx('text-red-600 text-sm', className)}>
            {field.state.meta.errors.map((err) => err.message).join(',')}
          </em>
        )}
      {field.state.meta.isValidating ? (
        <span className={clsx('text-blue-600 text-sm', className)}>Validating...</span>
      ) : null}
    </>
  )
}
