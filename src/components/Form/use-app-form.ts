import { createFormHookContexts, createFormHook } from '@tanstack/react-form'

import { TextInputField } from './TextInput'
import { SubmitButton } from './SubmitButton'
import { FormDebug } from './FormDebug'
import { BooleanRadioField, RadioField } from './Radio'
import { SelectField } from './Select'
import { NumberInputField } from './NumberInput'

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextInputField,
    RadioField,
    SelectField,
    BooleanRadioField,
    NumberInputField,
  },
  formComponents: {
    SubmitButton,
    FormDebug,
  },
  fieldContext,
  formContext,
})
