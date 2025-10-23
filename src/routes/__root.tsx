import { Link, Outlet, createRootRoute } from '@tanstack/react-router'
import { EntitledtoLogo } from '../components/EntitledtoLogo'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Outlet />
    </>
  )
}
