import { Page } from '~/products/shared/Page'
import { Alert } from '~/components/Alert'
import { useWorkflow } from '../shared/use-workflow'

export function Results() {
  const { entry } = useWorkflow()

  const data: any = entry?.data
  const childAges = data?.childrenInfo?.map?.((child: any) => child.age) || []
  const childDisabilities = data?.childrenInfo?.map?.((child: any) => child.hasDisability) || []
  const childGenders = data?.childrenInfo?.map?.(() => 'male') || []

  return (
    <>
      <Page.Main>
        <h1 className="text-3xl font-bold mb-6">Results</h1>

        <pre>{JSON.stringify({ data: entry?.data }, null, 2)}</pre>
      </Page.Main>
    </>
  )
}
