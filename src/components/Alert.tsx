import clsx from 'clsx'
import { Glyph } from './Glyph'

type AlertProps = {
  children: React.ReactNode
  type?: 'info' | 'warning' | 'error'
  className?: string
}

export function Alert(props: AlertProps) {
  const { children, type = 'info', className } = props

  return (
    <div
      className={clsx(
        'flex items-center bg-blue-100 border border-solid border-blue-300 p-3 rounded-md',
        {
          'bg-blue-100 border-blue-200': type === 'info',
          'bg-orange-50 border-orange-200': type === 'warning',
          'bg-red-100 border-red-200': type === 'error',
        },
        className
      )}
      role="alert"
    >
      <Glyph
        name={type}
        className={clsx('w-7 h-7 mr-2 flex-[0_0_auto]', {
          'fill-blue-500': type === 'info',
          'fill-orange-500': type === 'warning',
          'fill-red-500': type === 'error',
        })}
      />
      {children}
    </div>
  )
}
