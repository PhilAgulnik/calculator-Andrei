import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/benefits-calculator/net-income')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="">
      <h1 className="text-3xl font-bold">Net income</h1>
    </div>
  )
}
