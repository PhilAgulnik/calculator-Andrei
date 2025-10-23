import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/benefits-calculator/results')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="">
      <h1 className="text-3xl font-bold">Results</h1>
    </div>
  )
}
