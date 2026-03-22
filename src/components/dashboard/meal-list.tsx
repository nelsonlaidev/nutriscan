'use client'

import type { DayRange } from '@/lib/utils'

import { CaretRightIcon, PlusIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { Card, CardContent } from '@/components/ui/card'
import { useFoodMeals } from '@/hooks/queries/food.query'
import { MEAL_EMOJI } from '@/lib/constants'
import { cn } from '@/lib/utils'

type MealListProps = {
  dayRange: DayRange
  date: string
}

const EMOJI_BG: Record<string, string> = {
  breakfast: 'bg-amber-100 dark:bg-amber-950',
  lunch: 'bg-orange-100 dark:bg-orange-950',
  dinner: 'bg-violet-100 dark:bg-violet-950',
  snacks: 'bg-red-100 dark:bg-red-950',
}

export function MealList(props: MealListProps) {
  const { dayRange, date } = props
  const { data: meals } = useFoodMeals(dayRange)
  const t = useTranslations()

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between'>
        <h2 className='font-semibold'>{t('dashboard.todays-meals')}</h2>
        <Link href='/add' className='inline-flex items-center gap-1 text-sm font-medium text-primary'>
          <PlusIcon size={16} weight='bold' />
          {t('dashboard.add-food')}
        </Link>
      </div>
      <div className='space-y-4'>
        {meals.map((meal) => (
          <Link key={meal.category} href={`/meals/${meal.category}?date=${date}`} className='block'>
            <Card size='sm'>
              <CardContent className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div
                    className={cn(
                      'flex size-10 items-center justify-center rounded-xl text-lg',
                      EMOJI_BG[meal.category],
                    )}
                  >
                    {MEAL_EMOJI[meal.category]}
                  </div>
                  <div>
                    <p className='text-sm font-semibold'>{t(`meals.${meal.category}`)}</p>
                    <p className='text-xs text-muted-foreground'>
                      {t('dashboard.items-calories', { count: meal.items, calories: meal.calories })}
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
