import clsx from 'clsx'

export type LabelProps = {
  children: React.ReactNode
  className?: string
}

export function Label(props: LabelProps) {
  const { children, className } = props

  return (
    <div className={clsx('flex-grow opacity-90 text-2xl font-semibold pb-2', className)}>
      {children}
    </div>
  )
}
