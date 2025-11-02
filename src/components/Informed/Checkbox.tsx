import clsx from 'clsx'
import { useField } from 'informed'

import { Field } from './Field'
import { CommonFieldProps } from './Field'

type HTMLInputProps = React.InputHTMLAttributes<HTMLInputElement>

export type CheckboxInputProps = {
  ref?: React.RefObject<HTMLInputElement | null> | ((instance: HTMLInputElement | null) => void)
  value: string
  onChange: HTMLInputProps['onChange']
  onBlur: HTMLInputProps['onBlur']
  name: HTMLInputProps['name']
  className?: string
  label: string
  checked?: boolean
}

export function CheckboxInput(props: CheckboxInputProps) {
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
        type="checkbox"
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

type CheckboxFieldProps = CommonFieldProps & {
  inputClassName?: string
  options: { value: string; label: string }[]
  layout?: 'vertical'
}

export function CheckboxField(props: CheckboxFieldProps) {
  const {
    name,
    label,
    className,
    inputClassName,
    options,
    descriptionBefore,
    descriptionAfter,
    layout,
    required,
  } = props

  const { fieldState, fieldApi, render, ref } = useField({
    name,
    defaultValue: [],
    validate: (value) => {
      if (required && (!value || (value as string[]).length === 0)) {
        return 'This field is required'
      }
      return undefined
    },
  })
  const { value }: any = fieldState

  return render(
    <Field
      as="div"
      name={name}
      label={label}
      className={className}
      descriptionBefore={descriptionBefore}
      descriptionAfter={descriptionAfter}
      required={required}
    >
      <div
        className={clsx(
          layout === 'vertical'
            ? 'grid gap-2'
            : options.length === 2
              ? 'flex gap-2'
              : 'grid gap-2 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]'
        )}
      >
        {options.map((option) => (
          <CheckboxInput
            key={option.value}
            ref={ref}
            value={option.value}
            onChange={(e) => {
              const currentValue = value || []

              if (e.target.checked) {
                fieldApi.setValue([...currentValue, option.value], e)
              } else {
                fieldApi.setValue(
                  currentValue.filter((v: string) => v !== option.value),
                  e
                )
              }
            }}
            onBlur={(e) => {
              fieldApi.setTouched(true, e)
            }}
            name={name}
            className={inputClassName}
            label={option.label}
            checked={value?.includes(option.value)}
          />
        ))}
      </div>
    </Field>
  )
}

type BooleanCheckboxFieldProps = Omit<CheckboxFieldProps, 'options'>

const booleanCheckboxOptions = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' },
]

export function BooleanCheckboxField(props: BooleanCheckboxFieldProps) {
  const { name, label, className, inputClassName, descriptionBefore, descriptionAfter, required } =
    props

  const { fieldState, fieldApi, render, ref } = useField({
    name,
    validate: (value) => {
      if (required && value == null) {
        return 'This field is required'
      }
      return undefined
    },
  })
  const { value }: any = fieldState

  return render(
    <Field
      as="div"
      name={name}
      label={label}
      className={className}
      descriptionBefore={descriptionBefore}
      descriptionAfter={descriptionAfter}
      required={required}
    >
      <div
        className={clsx(
          booleanCheckboxOptions.length === 2
            ? 'flex gap-2'
            : 'grid gap-2 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]'
        )}
      >
        {booleanCheckboxOptions.map((option) => (
          <CheckboxInput
            key={option.value}
            ref={ref}
            value={option.value}
            onChange={(e) =>
              fieldApi.setValue(
                e.target.value === 'true' ? true : e.target.value === 'false' ? false : null,
                e
              )
            }
            onBlur={(e) => {
              fieldApi.setTouched(true, e)
            }}
            name={name}
            className={inputClassName}
            label={option.label}
            checked={value === (option.value === 'true')}
          />
        ))}
      </div>
    </Field>
  )
}
