import { redirect } from 'next/navigation'

import { CalorieSummary } from '@/components/dashboard/calorie-summary'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { DateNavigation } from '@/components/dashboard/date-navigation'
import { MacronutrientCards } from '@/components/dashboard/macronutrient-cards'
import { MealList } from '@/components/dashboard/meal-list'
import { WaterIntake } from '@/components/dashboard/water-intake'
import { WeightPanel } from '@/components/dashboard/weight-panel'
import { computeMealBreakdowns, computeTotals, getFoodEntriesByDate } from '@/data/food-entries'
import { getWaterTotal } from '@/data/water-entries'
import { getLatestWeight } from '@/data/weight-entries'
import { getSession } from '@/lib/auth'

import { dashboardCache } from './search-params'

async function Page(props: PageProps<'/dashboard'>) {
  const { searchParams } = props
  const { date } = await dashboardCache.parse(searchParams)

  const session = await getSession()
  if (!session) redirect('/')

  const [entries, waterAmount, latestWeight] = await Promise.all([
    getFoodEntriesByDate(session.user.id, date),
    getWaterTotal(session.user.id, date),
    getLatestWeight(session.user.id)
  ])
  const totals = computeTotals(entries)
  const meals = computeMealBreakdowns(entries)
  const { waterGoal, calorieBudget, proteinTarget, carbTarget, fatTarget } = session.user
  const macroGoals = { protein: proteinTarget, carbs: carbTarget, fat: fatTarget }

  return (
    <>
      <div className='pb-6'>
        <DashboardHeader />
      </div>

      <div className='flex flex-col gap-6'>
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
      </div>
    </>
  )
}

export default Page
