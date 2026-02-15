import { redirect } from 'next/navigation'

import { CalorieSummary } from '@/components/dashboard/calorie-summary'
import { DateNavigation } from '@/components/dashboard/date-navigation'
import { MacronutrientCards } from '@/components/dashboard/macronutrient-cards'
import { MealList } from '@/components/dashboard/meal-list'
import { WaterIntake } from '@/components/dashboard/water-intake'
import { UserAvatar } from '@/components/user-avatar'
import { computeMealBreakdowns, computeTotals, getFoodEntriesByDate } from '@/data/food-entries'
import { getSession } from '@/lib/auth'

import { dashboardCache } from './search-params'

async function Page(props: PageProps<'/dashboard'>) {
  const { searchParams } = props
  const { date } = await dashboardCache.parse(searchParams)

  const session = await getSession()
  if (!session) redirect('/')

  const entries = await getFoodEntriesByDate(session.user.id, date)
  const totals = computeTotals(entries)
  const meals = computeMealBreakdowns(entries)

  return (
    <div className='flex flex-col'>
      <div className='p-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-lg font-semibold'>NutriScan</h1>
            <p className='text-xs'>Your daily nutrition</p>
          </div>
          <UserAvatar />
        </div>
      </div>

      <div className='flex flex-col gap-5 px-4 pb-24'>
        <DateNavigation />
        <CalorieSummary calories={totals.calories} />
        <MacronutrientCards protein={totals.protein} carbs={totals.carbs} fat={totals.fat} fiber={totals.fiber} />
        <WaterIntake />
        <MealList meals={meals} />
      </div>
    </div>
  )
}

export default Page
