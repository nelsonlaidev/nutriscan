import type { Metadata } from 'next'

import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { BackButton } from '@/components/back-button'
import { MainLayout } from '@/components/main-layout'
import { WaterTracker } from '@/components/water/water-tracker'
import { getSession } from '@/lib/auth'
import { getQueryClient, HydrateClient } from '@/lib/query/hydration'
import { getDateRange, getDayRange } from '@/lib/utils'
import { orpc } from '@/orpc/client'

export const metadata: Metadata = {
  title: 'Water Tracker',
}

export default async function Page() {
  const session = await getSession()
  if (!session) redirect('/')

  const t = await getTranslations()

  const queryClient = getQueryClient()
  const dateRange = getDateRange('7d')
  const dayRange = getDayRange()

  await Promise.all([
    queryClient.prefetchQuery(orpc.water.list.queryOptions({ input: dayRange })),
    queryClient.prefetchQuery(
      orpc.progress.waterChart.queryOptions({
        input: {
          startOfDay: dateRange.startOfDay,
          endOfDay: dateRange.endOfDay,
          hasDates: dateRange.dates.length > 0,
        },
      }),
    ),
  ])

  return (
    <MainLayout title={t('water.page-title')} leftTitleButton={<BackButton />}>
      <HydrateClient client={queryClient}>
        <WaterTracker initialGoal={session.user.waterGoal} />
      </HydrateClient>
    </MainLayout>
  )
}
