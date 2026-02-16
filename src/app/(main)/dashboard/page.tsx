import { redirect } from 'next/navigation'

import { CalorieSummary } from '@/components/dashboard/calorie-summary'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { DateNavigation } from '@/components/dashboard/date-navigation'
import { MacronutrientCards } from '@/components/dashboard/macronutrient-cards'
import { MealList } from '@/components/dashboard/meal-list'
import { WaterIntake } from '@/components/dashboard/water-intake'
import { computeMealBreakdowns, computeTotals, getFoodEntriesByDate } from '@/data/food-entries'
import { getWaterIntake } from '@/data/water-intake'
import { getSession } from '@/lib/auth'

import { dashboardCache } from './search-params'

async function Page(props: PageProps<'/dashboard'>) {
  const { searchParams } = props
  const { date } = await dashboardCache.parse(searchParams)

  const session = await getSession()
  if (!session) redirect('/')

  const [entries, waterAmount] = await Promise.all([
    getFoodEntriesByDate(session.user.id, date),
    getWaterIntake(session.user.id, date)
  ])
  const totals = computeTotals(entries)
  const meals = computeMealBreakdowns(entries)
  const { waterGoal } = session.user

  return (
    <div className='flex flex-col'>
      <div className='pb-6'>
        <DashboardHeader />
      </div>

      <div className='flex flex-col gap-5'>
        <DateNavigation />
        <CalorieSummary calories={totals.calories} />
        <MacronutrientCards values={totals} />
        <WaterIntake initialAmount={waterAmount} goal={waterGoal} date={date} />
        <MealList meals={meals} />
      </div>
    </div>
  )
}

export default Page
