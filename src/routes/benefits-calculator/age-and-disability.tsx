import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/benefits-calculator/age-and-disability')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="">
      <h1 className="text-3xl font-bold">Age and disability</h1>
    </div>
  )
}
