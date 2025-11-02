import { REPO_NAME } from '../../constants'

export function EntitledtoLogo({ className }: { className?: string }) {
  return <img src={`${REPO_NAME}logo.svg`} alt="Entitledto Logo" className={className} />
}
