import { useWorkflow } from './use-workflow'

import { LinkButton } from '~/components/LinkButton'
import { ProgressBar } from '~/components/ProgressBar'

export function Footer() {
  const { basePath, nextPage, previousPage, progressPercentage } = useWorkflow()

  if (!basePath) return null

  return (
    <footer className="min-h-app-header-height flex flex-nowrap items-center justify-between gap-2 mq600:gap-5 px-4 py-3 mq600:px-7 sticky z-1 bottom-0 bg-main-bg border-t-1 border-divider">
      <LinkButton
        disabled={!previousPage}
        to={previousPage?.slug ? `${basePath}/$slug` : basePath}
        params={{ slug: previousPage?.slug ?? '' }}
      >
        ← Previous
      </LinkButton>

      <div className="flex-1 px-5 flex items-center">
        <div className="text-center text-slate-500 whitespace-nowrap mq500:mr-4 mq500:mb-0 flex-1">
          {progressPercentage}% complete
        </div>
        <ProgressBar percentage={progressPercentage} className="hidden mq500:block" />
      </div>

      <LinkButton
        disabled={!nextPage}
        to={`${basePath}/$slug`}
        params={{ slug: nextPage?.slug ?? '' }}
      >
        Next →
      </LinkButton>
    </footer>
  )
}
