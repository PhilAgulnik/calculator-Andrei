import { createFormHookContexts, createFormHook } from '@tanstack/react-form'

import { TextInputField } from './TextInput'
import { SubmitButton } from './SubmitButton'
import { FormDebug } from './FormDebug'
import { BooleanRadioField, RadioField } from './Radio'
import { SelectField } from './Select'
import { NumberInputField } from './NumberInput'
import { CheckboxField } from './Checkbox'

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextInputField,
    RadioField,
    SelectField,
    BooleanRadioField,
    NumberInputField,
    CheckboxField,
  },
  formComponents: {
    SubmitButton,
    FormDebug,
  },
  fieldContext,
  formContext,
})
