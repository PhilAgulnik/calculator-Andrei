import clsx from 'clsx'

import { Field } from './Field'
import { FieldInfo } from './FieldInfo'
import { useFieldContext } from './use-app-form'

type HTMLInputProps = React.InputHTMLAttributes<HTMLInputElement>

export type NumberInputProps = {
  ref?: React.RefObject<HTMLInputElement | null> | ((instance: HTMLInputElement | null) => void)
  value: number
  onChange: HTMLInputProps['onChange']
  onBlur: HTMLInputProps['onBlur']
  name: HTMLInputProps['name']
  style?: React.CSSProperties
  className?: string
}

export function NumberInput(props: NumberInputProps) {
  const { ref, value, onChange, onBlur, name, style, className } = props

  return (
    <input
      ref={ref}
      type="number"
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      style={style}
      className={clsx(
        'w-full px-3 py-2 border-2 border-slate-400 rounded-md shadow-sm bg-white',
        'focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-primary',
        'placeholder-gray-400',
        'h-input-height',
        className
      )}
    />
  )
}

type NumberInputFieldProps = {
  label?: string
  className?: string
  inputClassName?: string
  before?: React.ReactNode
  after?: React.ReactNode
}

export function NumberInputField(props: NumberInputFieldProps) {
  const { label, className, inputClassName, before, after } = props

  const field = useFieldContext<number>()

  return (
    <Field label={label} className={className}>
      {before}
      <NumberInput
        value={field.state.value}
        onChange={(e) => field.handleChange(Number(e.target.value))}
        onBlur={field.handleBlur}
        name={field.name}
        className={inputClassName}
      />
      {after}
      <FieldInfo field={field} />
    </Field>
  )
}
