import { Link } from '@tanstack/react-router'
import { Glyph } from '~/components/Glyph'

import { PAGES } from './pages'

// @ts-ignore-next-line
import classes from './pages.module.css'
import clsx from 'clsx'

export function PagesMenu() {
  return (
    <div className="">
      <div className="text-lg font-bold uppercase tracking-[2px] text-[0.8rem] text-slate-500 mb-1">
        Table of Contents
      </div>

      {PAGES.map((page, index) => {
        return (
          <Link
            to={page.path}
            key={page.path}
            className="flex items-center gap-2 relative py-1.5 pl-3"
            activeProps={{ className: 'active bg-slate-100 rounded-md' }}
            activeOptions={{ exact: true }}
          >
            {/* <Glyph name={page.glyph} className="fill-[var(--primary-color)]" size="1.1em" /> */}
            <span
              className={clsx(
                classes.activeIndicator,
                index === 0 && 'first',
                index === PAGES.length - 1 && 'last'
              )}
            />
            {page.title}
          </Link>
        )
      })}
    </div>
  )
}
