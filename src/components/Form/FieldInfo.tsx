import { useFieldState } from 'informed'

type FieldInfoProps = {
  name: string
}

export function FieldInfo(props: FieldInfoProps) {
  const { name } = props

  const { valid, showError, error } = useFieldState(name)

  if (valid || !showError) return null

  return <div className="text-red-600 mt-3">{error as string}</div>
}
