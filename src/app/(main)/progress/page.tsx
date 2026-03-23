import type { Metadata } from 'next'

import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { MainLayout } from '@/components/main-layout'
import { BmiCard } from '@/components/progress/bmi-card'
import { CalorieChart } from '@/components/progress/calorie-chart'
import { NutritionChart } from '@/components/progress/nutrition-chart'
import { TimeRangeTabs } from '@/components/progress/time-range-tabs'
import { WaterChart } from '@/components/progress/water-chart'
import { WeightChart } from '@/components/progress/weight-chart'
import { getSession } from '@/lib/auth'
import { getQueryClient, HydrateClient } from '@/lib/query/hydration'
import { getDateRange } from '@/lib/utils'
import { orpc } from '@/orpc/client'

import { progressCache } from './search-params'

export const metadata: Metadata = {
  title: 'Progress',
}

export default async function ProgressPage(props: PageProps<'/progress'>) {
  const { searchParams } = props
  const session = await getSession()
  if (!session) redirect('/')

  const { user } = session
  const t = await getTranslations()

  const { range } = await progressCache.parse(searchParams)

  const dateRange = getDateRange(range)
  const hasDates = dateRange.dates.length > 0
  const dateInput = { startOfDay: dateRange.startOfDay, endOfDay: dateRange.endOfDay, hasDates }

  const queryClient = getQueryClient()

  await Promise.all([
    queryClient.prefetchQuery(orpc.progress.calorieChart.queryOptions({ input: dateInput })),
    queryClient.prefetchQuery(orpc.progress.nutritionChart.queryOptions({ input: dateInput })),
    queryClient.prefetchQuery(orpc.progress.waterChart.queryOptions({ input: dateInput })),
    queryClient.prefetchQuery(orpc.progress.weightByDateRange.queryOptions({ input: dateInput })),
    queryClient.prefetchQuery(orpc.weight.latest.queryOptions()),
  ])

  return (
    <MainLayout title={t('progress.page-title')} className='space-y-6'>
      <HydrateClient client={queryClient}>
        <TimeRangeTabs>
          <div className='space-y-6'>
            <CalorieChart range={range} goal={user.calorieBudget} />
            <NutritionChart range={range} />
            <WaterChart range={range} goal={user.waterGoal} />
            <WeightChart range={range} goal={user.goalWeight} />
          </div>
        </TimeRangeTabs>

        <BmiCard height={user.height} fallbackWeight={user.currentWeight} />
      </HydrateClient>
    </MainLayout>
  )
}
