import { CaretRightIcon, PlusIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'

type MealBreakdown = {
  id: string
  name: string
  emoji: string
  items: number
  calories: number
}

type MealListProps = {
  meals: MealBreakdown[]
  date: string
}

const EMOJI_BG: Record<string, string> = {
  breakfast: 'bg-amber-100 dark:bg-amber-950',
  lunch: 'bg-orange-100 dark:bg-orange-950',
  dinner: 'bg-violet-100 dark:bg-violet-950',
  snacks: 'bg-red-100 dark:bg-red-950'
}

export function MealList(props: MealListProps) {
  const { meals, date } = props

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h2 className='text-base font-semibold'>Today&apos;s Meals</h2>
        <Link href='/add' className='inline-flex items-center gap-1 text-sm font-medium text-primary'>
          <PlusIcon size={16} weight='bold' />
          Add Food
        </Link>
      </div>
      <div className='space-y-4'>
        {meals.map((meal) => (
          <Link key={meal.id} href={`/meals/${meal.id}?date=${date}`} className='block'>
            <Card size='sm' className='transition-colors hover:bg-muted/50'>
              <CardContent className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
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
                </div>
                <CaretRightIcon size={20} />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
