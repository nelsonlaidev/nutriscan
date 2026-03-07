import type { MealCategory } from '@/types'
import type { Metadata } from 'next'

import { CaretRightIcon } from '@phosphor-icons/react/ssr'
import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { BackButton } from '@/components/back-button'
import { MainLayout } from '@/components/main-layout'
import { Card, CardContent } from '@/components/ui/card'
import { getFoodEntriesByCategory } from '@/data/food'
import { getSession } from '@/lib/auth'
import { MEAL_EMOJI } from '@/lib/constants'
import { getDayRange } from '@/lib/utils'

import { categoryCache } from './search-params'

const VALID_CATEGORIES = new Set<MealCategory>(['breakfast', 'lunch', 'dinner', 'snacks'])

const CATEGORY_TITLES: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snacks: 'Snacks'
}

export async function generateMetadata(props: PageProps<'/meals/[category]'>): Promise<Metadata> {
  const { category } = await props.params
  return {
    title: CATEGORY_TITLES[category] ?? 'Meal'
  }
}

export default async function Page(props: PageProps<'/meals/[category]'>) {
  const { params, searchParams } = props
  const { category } = await params
  const { date } = await categoryCache.parse(searchParams)

  if (!VALID_CATEGORIES.has(category as MealCategory)) {
    notFound()
  }

  const mealCategory = category as MealCategory

  const session = await getSession()
  if (!session) redirect('/')

  const t = await getTranslations()
  const dayRange = getDayRange(date)
  const entries = await getFoodEntriesByCategory(session.user.id, dayRange, mealCategory)
  const totalCalories = Math.round(entries.reduce((sum, e) => sum + e.calories, 0))

  const mealName = t(`meals.${mealCategory}`)

  return (
    <MainLayout title={mealName} leftTitleButton={<BackButton />}>
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div className='font-semibold'>{t('meals.total')}</div>
          <div className='font-medium'>{totalCalories} kcal</div>
        </div>

        {entries.length === 0 ? (
          <p className='py-8 text-center text-sm text-muted-foreground'>{t('meals.no-items')}</p>
        ) : (
          <div className='space-y-4'>
            {entries.map((entry) => (
              <Card key={entry.id} size='sm'>
                <CardContent className='flex items-center gap-3'>
                  {entry.imageUrl ? (
                    <Image
                      src={entry.imageUrl}
                      alt={entry.foodName}
                      width={40}
                      height={40}
                      className='size-10 rounded-lg object-cover'
                    />
                  ) : (
                    <div className='flex size-10 items-center justify-center rounded-lg bg-muted text-lg'>
                      {MEAL_EMOJI[mealCategory]}
                    </div>
                  )}
                  <div className='flex-1'>
                    <p className='text-sm font-semibold'>{entry.foodName}</p>
                    <p className='text-xs text-muted-foreground'>
                      {entry.servingSize} &middot; {Math.round(entry.calories)} kcal
                    </p>
                  </div>
                  <CaretRightIcon size={16} className='text-muted-foreground' />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
