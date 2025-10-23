import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/benefits-calculator/housing-costs')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="">
      <h1 className="text-3xl font-bold">Housing costs</h1>
    </div>
  )
}
