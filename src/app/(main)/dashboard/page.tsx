'use client'

import CalorieSummary from '@/components/dashboard/calorie-summary'
import DateNavigation from '@/components/dashboard/date-navigation'
import MacronutrientCards from '@/components/dashboard/macronutrient-cards'
import MealList from '@/components/dashboard/meal-list'
import WaterIntake from '@/components/dashboard/water-intake'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSession } from '@/lib/session'
import { getInitials } from '@/lib/utils'

function Page() {
  const { user } = useSession()

  return (
    <div className='-m-6 flex flex-col'>
      {/* Primary gradient header */}
      <div className='bg-gradient-to-br from-primary to-primary/85 px-6 pt-6 pb-20'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-lg font-bold text-primary-foreground'>NutriScan</h1>
            <p className='text-xs text-primary-foreground/70'>Your daily nutrition</p>
          </div>
          <Avatar size='sm'>
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Content area overlapping the header */}
      <div className='-mt-14 flex flex-col gap-5 px-4 pb-24'>
        <DateNavigation />
        <CalorieSummary />
        <MacronutrientCards />
        <WaterIntake />
        <MealList />
      </div>
    </div>
  )
}

export default Page
