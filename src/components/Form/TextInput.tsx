import clsx from 'clsx'

import { Field } from './Field'
import { FieldInfo } from './FieldInfo'
import { useFieldContext } from './use-app-form'

type HTMLInputProps = React.InputHTMLAttributes<HTMLInputElement>

export type TextInputProps = {
  ref?: React.RefObject<HTMLInputElement | null> | ((instance: HTMLInputElement | null) => void)
  value: string
  onChange: HTMLInputProps['onChange']
  onBlur: HTMLInputProps['onBlur']
  name: HTMLInputProps['name']
  style?: React.CSSProperties
  className?: string
}

export function TextInput(props: TextInputProps) {
  const { ref, value, onChange, onBlur, name, style, className } = props

  return (
    <input
      ref={ref}
      type="text"
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

type TextInputFieldProps = {
  label?: string
  className?: string
  inputClassName?: string
  before?: React.ReactNode
  after?: React.ReactNode
}

export function TextInputField(props: TextInputFieldProps) {
  const { label, className, inputClassName, before, after } = props

  const field = useFieldContext<string>()

  return (
    <Field label={label} className={className}>
      {before}
      <TextInput
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        name={field.name}
        className={inputClassName}
      />
      {after}
      <FieldInfo field={field} />
    </Field>
  )
}
