import React from 'react'
import { createLink, LinkComponent } from '@tanstack/react-router'
import clsx from 'clsx'

interface BasicLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string
  disabled?: boolean
  children: React.ReactNode
}

const BasicLinkComponent = React.forwardRef<HTMLAnchorElement, BasicLinkProps>((props, ref) => {
  const { disabled = false, children, ...rest } = props

  return (
    <a
      ref={ref}
      {...rest}
      href={disabled ? undefined : props.href}
      className={clsx(
        'px-4 py-2 bg-primary text-white rounded-md font-medium whitespace-nowrap cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        props.className
      )}
    >
      {children}
    </a>
  )
})

const CreatedLinkComponent = createLink(BasicLinkComponent)

export const LinkButton: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent {...props} />
}
