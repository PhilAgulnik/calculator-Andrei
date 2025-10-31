import clsx from 'clsx'

export type ProgressProps = {
  percentage: number
  className?: string
}

export function ProgressBar(props: ProgressProps) {
  const { percentage, className } = props

  return (
    <div className={clsx('w-full h-1.5 bg-slate-200 rounded-full', className)}>
      <div className="h-full bg-green-600 rounded-full" style={{ width: `${percentage}%` }} />
    </div>
  )
}
