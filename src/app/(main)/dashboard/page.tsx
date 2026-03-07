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
import { getFoodEntries } from '@/data/food'
import { getWaterTotal } from '@/data/water'
import { getLatestWeight } from '@/data/weight'
import { getSession } from '@/lib/auth'
import { computeMealBreakdowns, computeTotals, getDayRange } from '@/lib/utils'

import { dashboardCache } from './search-params'

export const metadata: Metadata = {
  title: 'Dashboard'
}

export default async function Page(props: PageProps<'/dashboard'>) {
  const { searchParams } = props
  const { date } = await dashboardCache.parse(searchParams)

  const session = await getSession()
  if (!session) redirect('/')

  const dayRange = getDayRange(date)

  const [entries, waterAmount, latestWeight] = await Promise.all([
    getFoodEntries(session.user.id, dayRange),
    getWaterTotal(session.user.id, dayRange),
    getLatestWeight(session.user.id)
  ])

  const totals = computeTotals(entries)
  const meals = computeMealBreakdowns(entries)

  const { waterGoal, calorieBudget, proteinTarget, carbTarget, fatTarget } = session.user
  const macroGoals = { protein: proteinTarget, carbs: carbTarget, fat: fatTarget }

  return (
    <MainLayout className='space-y-6'>
      <DashboardHeader />
      <DateNavigation />
      <CalorieSummary calories={totals.calories} goal={calorieBudget} />
      <MacronutrientCards values={totals} goals={macroGoals} />
      <WaterIntake amount={waterAmount} goal={waterGoal} />
      <WeightPanel
        currentWeight={latestWeight?.weight ?? session.user.currentWeight}
        startingWeight={session.user.startingWeight}
        goalWeight={session.user.goalWeight}
      />
      <MealList meals={meals} date={date} />
    </MainLayout>
  )
}
