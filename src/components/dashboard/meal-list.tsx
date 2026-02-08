import { PlusIcon } from '@phosphor-icons/react'
import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'
import { MEAL_CATEGORIES } from '@/lib/mock-data'

const EMOJI_BG: Record<string, string> = {
  breakfast: 'bg-amber-100 dark:bg-amber-950',
  lunch: 'bg-orange-100 dark:bg-orange-950',
  dinner: 'bg-violet-100 dark:bg-violet-950',
  snacks: 'bg-red-100 dark:bg-red-950'
}

function MealList() {
  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h2 className='text-base font-semibold'>Today&apos;s Meals</h2>
        <Link href='/add' className='inline-flex items-center gap-1 text-sm font-medium text-primary'>
          <PlusIcon size={16} weight='bold' />
          Add Food
        </Link>
      </div>
      <div className='space-y-2'>
        {MEAL_CATEGORIES.map((meal) => (
          <Card key={meal.id} size='sm'>
            <CardContent className='flex items-center gap-3 p-3'>
              <div
                className={`flex size-10 items-center justify-center rounded-xl text-lg ${EMOJI_BG[meal.id] ?? 'bg-muted'}`}
              >
                {meal.emoji}
              </div>
              <div>
                <p className='text-sm font-semibold'>{meal.name}</p>
                <p className='text-xs text-muted-foreground'>
                  {meal.items} items &middot; {meal.calories} kcal
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default MealList
