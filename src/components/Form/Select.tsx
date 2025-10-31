import clsx from 'clsx'

import { Field } from './Field'
import { FieldInfo } from './FieldInfo'
import { useFieldContext } from './use-app-form'

type HTMLSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

export type SelectInputProps = {
  ref?: React.RefObject<HTMLSelectElement | null> | ((instance: HTMLSelectElement | null) => void)
  value: string
  onChange: HTMLSelectProps['onChange']
  onBlur: HTMLSelectProps['onBlur']
  name: HTMLSelectProps['name']
  className?: string
  options: { value: string; label: string }[]
}

export function SelectInput(props: SelectInputProps) {
  const { ref, value, onChange, onBlur, name, className, options } = props

  return (
    <select
      ref={ref}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={clsx(
        'max-w-fit px-3 py-2 border-2 rounded-md',
        'focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-primary',
        'h-input-height',
        'bg-white border-slate-400',
        className
      )}
    >
      <option value="">Please select…</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

type SelectFieldProps = {
  label?: string
  className?: string
  inputClassName?: string
  options: { value: string; label: string }[]
  descriptionBefore?: React.ReactNode
  descriptionAfter?: React.ReactNode
}

export function SelectField(props: SelectFieldProps) {
  const { label, className, inputClassName, options, descriptionBefore, descriptionAfter } = props

  const field = useFieldContext<string>()

  return (
    <Field
      label={label}
      className={className}
      descriptionBefore={descriptionBefore}
      descriptionAfter={descriptionAfter}
    >
      <SelectInput
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        name={field.name}
        className={inputClassName}
        options={options}
      />

      <FieldInfo field={field} />
    </Field>
  )
}
