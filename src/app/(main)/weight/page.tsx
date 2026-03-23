import type { Metadata } from 'next'

import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { BackButton } from '@/components/back-button'
import { MainLayout } from '@/components/main-layout'
import { WeightTracker } from '@/components/weight/weight-tracker'
import { getSession } from '@/lib/auth'
import { getQueryClient, HydrateClient } from '@/lib/query/hydration'
import { orpc } from '@/orpc/client'

export const metadata: Metadata = {
  title: 'Weight Tracker',
}

export default async function Page() {
  const session = await getSession()
  if (!session) redirect('/')

  const t = await getTranslations()

  const queryClient = getQueryClient()

  await Promise.all([
    queryClient.prefetchQuery(orpc.weight.latest.queryOptions()),
    queryClient.prefetchQuery(orpc.weight.list.queryOptions()),
  ])

  return (
    <MainLayout title={t('weight.page-title')} leftTitleButton={<BackButton />}>
      <HydrateClient client={queryClient}>
        <WeightTracker
          startingWeight={session.user.startingWeight}
          goalWeight={session.user.goalWeight}
          fallbackWeight={session.user.currentWeight}
        />
      </HydrateClient>
    </MainLayout>
  )
}
