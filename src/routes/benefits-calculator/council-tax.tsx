import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/benefits-calculator/council-tax')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="">
      <h1 className="text-3xl font-bold">Council Tax</h1>
    </div>
  )
}
