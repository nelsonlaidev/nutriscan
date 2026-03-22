import type { Metadata } from 'next'

import { redirect } from 'next/navigation'

import { CalorieSummary } from '@/components/dashboard/calorie-summary'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { DateNavigation } from '@/components/dashboard/date-navigation'
import { MacronutrientCards } from '@/components/dashboard/macronutrient-cards'
import { MealList } from '@/components/dashboard/meal-list'
import { WaterIntake } from '@/components/dashboard/water-intake'
import { WeightPanel } from '@/components/dashboard/weight-panel'
import { MainLayout } from '@/components/main-layout'
import { getSession } from '@/lib/auth'
import { getQueryClient, HydrateClient } from '@/lib/query/hydration'
import { getDayRange } from '@/lib/utils'
import { orpc } from '@/orpc/client'

import { dashboardCache } from './search-params'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function Page(props: PageProps<'/dashboard'>) {
  const { searchParams } = props
  const { date } = await dashboardCache.parse(searchParams)

  const session = await getSession()
  if (!session) redirect('/')

  const dayRange = getDayRange(date)

  const queryClient = getQueryClient()

  await Promise.all([
    queryClient.prefetchQuery(orpc.food.totals.queryOptions({ input: dayRange })),
    queryClient.prefetchQuery(orpc.food.meals.queryOptions({ input: dayRange })),
    queryClient.prefetchQuery(orpc.water.total.queryOptions({ input: dayRange })),
    queryClient.prefetchQuery(orpc.weight.latest.queryOptions()),
  ])

  const { waterGoal, calorieBudget, proteinTarget, carbTarget, fatTarget } = session.user
  const macroGoals = { protein: proteinTarget, carbs: carbTarget, fat: fatTarget }

  return (
    <MainLayout className='space-y-6'>
      <HydrateClient client={queryClient}>
        <DashboardHeader user={session.user} />
        <DateNavigation />
        <CalorieSummary dayRange={dayRange} goal={calorieBudget} />
        <MacronutrientCards dayRange={dayRange} goals={macroGoals} />
        <WaterIntake dayRange={dayRange} goal={waterGoal} />
        <WeightPanel
          fallbackWeight={session.user.currentWeight}
          startingWeight={session.user.startingWeight}
          goalWeight={session.user.goalWeight}
        />
        <MealList dayRange={dayRange} date={date} />
      </HydrateClient>
    </MainLayout>
  )
}
