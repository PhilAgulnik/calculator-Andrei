import clsx from 'clsx'
import { useField } from 'informed'

import { Field } from './Field'
import { CommonFieldProps } from './Field'

type HTMLSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

export type SelectInputProps = {
  ref?: React.RefObject<HTMLSelectElement | null> | ((instance: HTMLSelectElement | null) => void)
  value: string
  onChange: HTMLSelectProps['onChange']
  onBlur: HTMLSelectProps['onBlur']
  name: HTMLSelectProps['name']
  className?: string
  options: { value: string; label: string }[]
  required?: boolean
}

export function SelectInput(props: SelectInputProps) {
  const { ref, value, onChange, onBlur, name, className, options, required } = props

  return (
    <select
      ref={ref}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      required={required}
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

type SelectFieldProps = CommonFieldProps & {
  inputClassName?: string
  options: { value: string; label: string }[]
}

export function SelectField(props: SelectFieldProps) {
  const { name, label, className, inputClassName, options, descriptionBefore, descriptionAfter, required } =
    props

  const { fieldState, fieldApi, render, ref } = useField({
    name,
    validate: (value) => {
      if (required && !value) {
        return 'This field is required'
      }
      return undefined
    },
  })
  const { value }: any = fieldState

  return render(
    <Field
      name={name}
      label={label}
      className={className}
      descriptionBefore={descriptionBefore}
      descriptionAfter={descriptionAfter}
      required={required}
    >
      <SelectInput
        ref={ref}
        value={!value && value !== 0 ? '' : value}
        onChange={(e) => fieldApi.setValue(e.target.value, e)}
        onBlur={(e) => {
          fieldApi.setTouched(true, e)
        }}
        name={name}
        className={inputClassName}
        options={options}
      />
    </Field>
  )
}
