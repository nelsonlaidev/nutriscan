import type { Metadata } from 'next'
import type { MealCategory } from '@/types'

import { format } from 'date-fns'
import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { BackButton } from '@/components/back-button'
import { MainLayout } from '@/components/main-layout'
import { Card, CardContent } from '@/components/ui/card'
import { getFoodEntryById } from '@/data/food'
import { getSession } from '@/lib/auth'
import { MEAL_EMOJI } from '@/lib/constants'

import { DeleteFoodEntryButton } from './delete-button'

const VALID_CATEGORIES = new Set<MealCategory>(['breakfast', 'lunch', 'dinner', 'snacks'])

export function generateMetadata(): Metadata {
  return { title: 'Food Detail' }
}

export default async function Page(props: PageProps<'/meals/[category]/[entryId]'>) {
  const { category, entryId } = await props.params

  if (!VALID_CATEGORIES.has(category as MealCategory)) {
    notFound()
  }

  const session = await getSession()
  if (!session) redirect('/')

  const entry = await getFoodEntryById(entryId, session.user.id)
  if (!entry) notFound()

  if (entry.mealCategory !== category) {
    notFound()
  }

  const t = await getTranslations()
  const mealCategory = category as MealCategory

  const sourceLabels: Record<string, string> = {
    'ai-scan': t('meals.source-ai-scan'),
    manual: t('meals.source-manual'),
    barcode: t('meals.source-barcode'),
  }

  return (
    <MainLayout title={t('meals.detail-title')} leftTitleButton={<BackButton />}>
      <div className='space-y-6'>
        {/* Food image */}
        {entry.imageUrl ? (
          <div className='overflow-hidden rounded-2xl'>
            <Image
              src={entry.imageUrl}
              alt={entry.foodName}
              width={400}
              height={300}
              className='h-48 w-full object-cover'
            />
          </div>
        ) : (
          <div className='flex h-48 items-center justify-center rounded-2xl bg-muted text-5xl'>
            {MEAL_EMOJI[mealCategory]}
          </div>
        )}

        {/* Food name + serving */}
        <div>
          <h2 className='text-xl font-semibold'>{entry.foodName}</h2>
          <p className='text-sm text-muted-foreground'>{entry.servingSize}</p>
        </div>

        {/* Calories */}
        <Card size='sm'>
          <CardContent className='flex items-center justify-between'>
            <span className='font-medium'>{t('meals.calories')}</span>
            <span className='text-xl font-bold'>{Math.round(entry.calories)} kcal</span>
          </CardContent>
        </Card>

        {/* Macros */}
        <div className='grid grid-cols-3 gap-3'>
          <Card size='sm'>
            <CardContent className='text-center'>
              <p className='text-xs text-muted-foreground'>{t('meals.protein')}</p>
              <p className='text-lg font-semibold'>{Math.round(entry.protein)}g</p>
            </CardContent>
          </Card>
          <Card size='sm'>
            <CardContent className='text-center'>
              <p className='text-xs text-muted-foreground'>{t('meals.carbs')}</p>
              <p className='text-lg font-semibold'>{Math.round(entry.carbs)}g</p>
            </CardContent>
          </Card>
          <Card size='sm'>
            <CardContent className='text-center'>
              <p className='text-xs text-muted-foreground'>{t('meals.fat')}</p>
              <p className='text-lg font-semibold'>{Math.round(entry.fat)}g</p>
            </CardContent>
          </Card>
        </div>

        {/* Metadata */}
        <Card size='sm'>
          <CardContent className='space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>{t('meals.source')}</span>
              <span className='text-sm font-medium'>{sourceLabels[entry.source] ?? entry.source}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>{t('meals.meal-category')}</span>
              <span className='text-sm font-medium'>{t(`meals.${mealCategory}`)}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>{t('meals.time-logged')}</span>
              <span className='text-sm font-medium'>{format(entry.createdAt, 'MMM d, yyyy h:mm a')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Delete button */}
        <DeleteFoodEntryButton entryId={entry.id} category={category} />
      </div>
    </MainLayout>
  )
}
