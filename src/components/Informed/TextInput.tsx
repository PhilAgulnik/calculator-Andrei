import clsx from 'clsx'
import { useField } from 'informed'

import { Field } from './Field'
import { CommonFieldProps } from './Field'

type HTMLInputProps = React.InputHTMLAttributes<HTMLInputElement>

export type TextInputProps = {
  ref?: React.RefObject<HTMLInputElement | null> | ((instance: HTMLInputElement | null) => void)
  value: string
  onChange: HTMLInputProps['onChange']
  onBlur: HTMLInputProps['onBlur']
  name: HTMLInputProps['name']
  style?: React.CSSProperties
  className?: string
  required?: boolean
}

export function TextInput(props: TextInputProps) {
  const { ref, value, onChange, onBlur, name, style, className, required } = props

  return (
    <input
      ref={ref}
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      style={style}
      required={required}
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

type TextInputFieldProps = CommonFieldProps & {
  inputClassName?: string
}

export function TextInputField(props: TextInputFieldProps) {
  const {
    name,
    label,
    className,
    inputClassName,
    descriptionBefore,
    descriptionAfter,
    required,
    defaultValue,
  } = props

  const { fieldState, fieldApi, render, ref } = useField({
    type: 'text',
    name,
    defaultValue,
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
      <TextInput
        ref={ref}
        name={name}
        className={inputClassName}
        value={!value && value !== 0 ? '' : value}
        onChange={(e) => {
          console.log('e.target.value', e.target.value)
          fieldApi.setValue(e.target.value, e)
        }}
        onBlur={(e) => {
          fieldApi.setTouched(true, e)
        }}
      />
    </Field>
  )
}
