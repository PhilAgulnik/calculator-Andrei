import clsx from 'clsx'

import { Field } from './Field'
import { FieldInfo } from './FieldInfo'
import { useFieldContext } from './use-app-form'

type HTMLInputProps = React.InputHTMLAttributes<HTMLInputElement>

export type RadioInputProps = {
  ref?: React.RefObject<HTMLInputElement | null> | ((instance: HTMLInputElement | null) => void)
  value: string
  onChange: HTMLInputProps['onChange']
  onBlur: HTMLInputProps['onBlur']
  name: HTMLInputProps['name']
  className?: string
  label: string
  checked?: boolean
}

export function RadioInput(props: RadioInputProps) {
  const { ref, value, onChange, onBlur, name, className, label, checked } = props

  return (
    <label
      className={clsx(
        'flex items-center flex-nowrap gap-2 px-4 py-2 border-2 rounded-md',
        'focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-primary',
        'h-[50px]',
        checked ? 'bg-white !border-primary' : 'border-transparent bg-slate-500/20',
        className
      )}
    >
      <input
        ref={ref}
        type="radio"
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="w-5 h-5"
        checked={checked}
      />
      {label}
    </label>
  )
}

type RadioFieldProps = {
  before?: React.ReactNode
  after?: React.ReactNode
  label?: string
  className?: string
  inputClassName?: string
  options: { value: string; label: string }[]
}

export function RadioField(props: RadioFieldProps) {
  const { label, className, inputClassName, options, before, after } = props

  const field = useFieldContext<string>()

  return (
    <Field as="div" label={label} className={className}>
      {before}
      <div className={clsx('grid gap-2 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]')}>
        {options.map((option) => (
          <RadioInput
            key={option.value}
            value={option.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            name={field.name}
            className={inputClassName}
            label={option.label}
            checked={field.state.value === option.value}
          />
        ))}
      </div>
      {after}

      <FieldInfo field={field} />
    </Field>
  )
}

type BooleanRadioFieldProps = Omit<RadioFieldProps, 'options'>

const booleanRadioOptions = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
]

export function BooleanRadioField(props: BooleanRadioFieldProps) {
  const { label, className, inputClassName, before, after } = props

  const field = useFieldContext<boolean | null>()

  return (
    <Field as="div" label={label} className={className}>
      {before}

      <div className={clsx('flex gap-2')}>
        {booleanRadioOptions.map((option) => (
          <RadioInput
            key={option.value.toString()}
            value={option.value.toString()}
            onChange={(e) =>
              field.handleChange(
                e.target.value === 'true' ? true : e.target.value === 'false' ? false : null
              )
            }
            onBlur={field.handleBlur}
            name={field.name}
            className={inputClassName}
            label={option.label}
            checked={field.state.value === option.value}
          />
        ))}
      </div>

      {after}

      <FieldInfo field={field} />
    </Field>
  )
}
