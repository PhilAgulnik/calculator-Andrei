import { Link, useParams } from '@tanstack/react-router'
import { useWorkflow } from './use-workflow'

export function PagesMenu() {
  const { basePath, visiblePages } = useWorkflow()

  const params = useParams({ strict: false })
  const id = params?.id || ''

  if (!basePath || !visiblePages) return null

  return (
    <div className="">
      <div className="text-lg font-bold uppercase tracking-[2px] text-[0.8rem] text-slate-500 mb-1">
        Table of Contents
      </div>

      {visiblePages.map((page) => {
        return (
          <Link
            to={page.slug ? `${basePath}/$id/$slug` : `${basePath}/$id`}
            params={{ id, slug: page.slug }}
            key={page.slug}
            className="flex items-center gap-2 relative py-1.5 pl-3"
            activeProps={{ className: 'active bg-slate-100 rounded-md' }}
            activeOptions={{ exact: true }}
          >
            <span className="w-2 h-2 rounded-full bg-white border border-slate-500/30 after:content-[''] after:absolute after:top-0 after:left-4 after:w-px after:bottom-0 after:bg-slate-500/30 after:-z-[1]" />
            {page.title}
          </Link>
        )
      })}
    </div>
  )
}
