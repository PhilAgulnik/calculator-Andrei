import { useEffect, useState } from 'react'
import clsx from 'clsx'

import { Glyph } from './Glyph'

type AccordionProps = {
  children: React.ReactNode
  title: string
  open: boolean
  className?: string
  onToggle?: (isOpen: boolean) => void
}

export function Accordion(props: AccordionProps) {
  const { children, title, open, onToggle, className } = props

  const [isOpen, setIsOpen] = useState(open)

  useEffect(() => {
    if (!onToggle) return
    onToggle(isOpen)
  }, [isOpen, onToggle])

  return (
    <div className={className}>
      <button
        className="flex items-center gap-1 border-none bg-transparent p-0 cursor-pointer text-primary font-[500]"
        onClick={() => {
          setIsOpen((c) => !c)
        }}
      >
        <Glyph
          name="chevronRight"
          className={clsx(
            'transition-transform duration-100 w-5 h-5 fill-primary',
            isOpen ? 'rotate-90' : 'rotate-0'
          )}
        />
        {title}
      </button>

      <div className={clsx(isOpen ? 'block' : 'hidden')}>{children}</div>
    </div>
  )
}
