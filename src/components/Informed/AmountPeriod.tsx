import { useField } from 'informed'

import { Field } from './Field'
import { CommonFieldProps } from './Field'
import { SelectInput } from './Select'
import { NumberInput } from './NumberInput'
import { FieldInfo } from './FieldInfo'

type AmountPeriodFieldProps = CommonFieldProps & {
  amountName?: string
  periodName?: string
  defaultAmount?: number
  defaultPeriod?: string
  periodOptions?: { label: string; value: string }[]
}

const PERIOD_OPTIONS = [
  { label: 'Per Week', value: 'per_week' },
  { label: 'Per Month', value: 'per_month' },
  { label: 'Per Year', value: 'per_year' },
]

export function AmountPeriodField(props: AmountPeriodFieldProps) {
  const {
    name,
    label,
    className,
    descriptionBefore,
    descriptionAfter,
    required,
    defaultValue,
    defaultAmount,
    defaultPeriod = 'per_month',
    periodOptions = PERIOD_OPTIONS,
  } = props

  const amountName = props.amountName || name
  const periodName = props.periodName || `${name}Period`

  const amountField = useField({
    type: 'text',
    name: amountName,
    defaultValue: defaultAmount || defaultValue,
    validate: (value) => {
      if (required && !value) {
        return 'Please enter a valid amount'
      }
      return undefined
    },
  })

  const periodField = useField({
    type: 'text',
    name: periodName,
    defaultValue: defaultPeriod,
    validate: (value) => {
      if (required && !value) {
        return 'Please select a valid period'
      }
      return undefined
    },
  })

  const { value: amountValue }: any = amountField.fieldState
  const { value: periodValue }: any = periodField.fieldState

  return (
    <Field
      isInvalid={!amountField.fieldState.valid || !periodField.fieldState.valid}
      name={name}
      label={label}
      className={className}
      descriptionBefore={descriptionBefore}
      descriptionAfter={descriptionAfter}
      required={required}
    >
      <div className="flex items-center gap-2 flex-start">
        {amountField.render(
          <NumberInput
            ref={amountField.ref}
            name={name}
            value={!amountValue && amountValue !== 0 ? '' : amountValue}
            onChange={(e) => {
              amountField.fieldApi.setValue(e.target.value, e)
            }}
            onBlur={(e) => {
              amountField.fieldApi.setTouched(true, e)
            }}
            className="flex-[0_1_140px] !w-auto min-w-0"
          />
        )}

        {periodField.render(
          <SelectInput
            ref={periodField.ref}
            name={periodName}
            value={periodValue}
            options={periodOptions}
            onChange={(e) => {
              periodField.fieldApi.setValue(e.target.value, e)
            }}
            onBlur={(e) => {
              periodField.fieldApi.setTouched(true, e)
            }}
          />
        )}
      </div>

      <FieldInfo name={amountName} />
      <FieldInfo name={periodName} />
    </Field>
  )
}
