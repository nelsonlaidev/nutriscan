import type { Metadata } from 'next'
import type { Meal } from '@/lib/constants'
import type { GetFoodByIdInput } from '@/orpc/client'

import { notFound, redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { BackButton } from '@/components/back-button'
import { MainLayout } from '@/components/main-layout'
import { getSession } from '@/lib/auth'
import { MEALS_SET } from '@/lib/constants'
import { getQueryClient, HydrateClient } from '@/lib/query/hydration'
import { orpc } from '@/orpc/client'

import { Detail } from './detail'

export function generateMetadata(): Metadata {
  return { title: 'Food Detail' }
}

export default async function Page(props: PageProps<'/meals/[category]/[entryId]'>) {
  const { category, entryId } = await props.params

  if (!MEALS_SET.has(category)) {
    notFound()
  }

  const session = await getSession()
  if (!session) redirect('/')

  const input: GetFoodByIdInput = { id: entryId, category: category as Meal }

  const queryClient = getQueryClient()

  try {
    await queryClient.fetchQuery(orpc.food.getById.queryOptions({ input }))
  } catch {
    notFound()
  }

  const t = await getTranslations()

  return (
    <MainLayout title={t('meals.detail-title')} leftTitleButton={<BackButton />}>
      <HydrateClient client={queryClient}>
        <Detail input={input} />
      </HydrateClient>
    </MainLayout>
  )
}
