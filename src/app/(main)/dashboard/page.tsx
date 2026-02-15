'use client'

import { useAtomValue } from 'jotai'

import { CalorieSummary } from '@/components/dashboard/calorie-summary'
import { DateNavigation } from '@/components/dashboard/date-navigation'
import { MacronutrientCards } from '@/components/dashboard/macronutrient-cards'
import { MealList } from '@/components/dashboard/meal-list'
import { WaterIntake } from '@/components/dashboard/water-intake'
import { UserAvatar } from '@/components/user-avatar'
import { selectedDateAtom } from '@/lib/atoms'
import { computeMealBreakdowns, computeTotals, useFoodEntries } from '@/queries/food-entries'

function Page() {
  const selectedDate = useAtomValue(selectedDateAtom)
  const { data: entries = [] } = useFoodEntries(selectedDate)

  const totals = computeTotals(entries)
  const meals = computeMealBreakdowns(entries)

  return (
    <div className='-m-6 flex flex-col'>
      {/* Primary header */}
      <div className='bg-primary px-6 pt-6 pb-20'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-lg font-bold text-primary-foreground'>NutriScan</h1>
            <p className='text-xs text-primary-foreground/70'>Your daily nutrition</p>
          </div>
          <UserAvatar />
        </div>
      </div>

      {/* Content area overlapping the header */}
      <div className='-mt-14 flex flex-col gap-5 px-4 pb-24'>
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
