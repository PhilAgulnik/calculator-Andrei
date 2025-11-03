import { AmountPeriodField } from './AmountPeriod'
import { BooleanRadioField } from './Radio'
import { CheckboxField } from './Checkbox'
import { NumberInputField } from './NumberInput'
import { RadioField } from './Radio'
import { SelectField } from './Select'
import { TextInputField } from './TextInput'

export { Form } from './Form'
export { Relevant as Show, ArrayField } from 'informed'

export const Fields = {
  AmountPeriod: AmountPeriodField,
  BooleanRadio: BooleanRadioField,
  Checkbox: CheckboxField,
  NumberInput: NumberInputField,
  Radio: RadioField,
  Select: SelectField,
  TextInput: TextInputField,
}
