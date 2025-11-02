import { APP_BASE_PATH } from '../../constants'

export function EntitledtoLogo({ className }: { className?: string }) {
  return <img src={`${APP_BASE_PATH}logo.svg`} alt="Entitledto Logo" className={className} />
}
