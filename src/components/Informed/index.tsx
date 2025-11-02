import { TextInputField } from './TextInput'
import { NumberInputField } from './NumberInput'
import { CheckboxField } from './Checkbox'
import { RadioField } from './Radio'
import { BooleanRadioField } from './Radio'
import { SelectField } from './Select'

export { Form } from './Form'
export { Relevant as Show } from 'informed'

export const Fields = {
  TextInput: TextInputField,
  NumberInput: NumberInputField,
  Checkbox: CheckboxField,
  Radio: RadioField,
  BooleanRadio: BooleanRadioField,
  Select: SelectField,
}
