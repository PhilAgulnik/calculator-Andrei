import clsx from 'clsx'

export type LabelProps = {
  children: React.ReactNode
  className?: string
  required?: boolean
}

export function Label(props: LabelProps) {
  const { children, className, required } = props

  return (
    <div className={clsx('flex-grow opacity-90 text-2xl font-semibold pb-2', className)}>
      {children}
      {required && <span className="text-red-500">*</span>}
    </div>
  )
}
