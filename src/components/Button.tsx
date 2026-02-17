import clsx from 'clsx'

export type ButtonProps = {
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
}

export function Button(props: ButtonProps) {
  const { children, className, type = 'button', onClick, disabled } = props

  return (
    <button
      type={type}
      className={clsx(
        'px-4 py-2 bg-primary text-white rounded-md font-medium whitespace-nowrap cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
