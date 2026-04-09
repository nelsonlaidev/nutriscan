'use client'

import type { GetFoodByIdInput } from '@/orpc/client'

import { format } from 'date-fns'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Card, CardContent } from '@/components/ui/card'
import { useFoodEntryById } from '@/hooks/queries/food.query'
import { MEAL_EMOJI } from '@/lib/constants'

import { DeleteFoodEntryButton } from './delete-button'

type DetailProps = {
  input: GetFoodByIdInput
}

export function Detail(props: DetailProps) {
  const { input } = props

  const t = useTranslations()

  const sourceLabels: Record<string, string> = {
    'ai-scan': t('meals.source-ai-scan'),
    manual: t('meals.source-manual'),
    barcode: t('meals.source-barcode'),
    'saved-meal': t('meals.source-saved-meal'),
    repeat: t('meals.source-repeat'),
  }

  const { data: entry } = useFoodEntryById(input)

  return (
    <div className='space-y-6'>
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
          {MEAL_EMOJI[entry.mealCategory]}
        </div>
      )}

      <div>
        <h2 className='text-xl font-semibold'>{entry.foodName}</h2>
        <p className='text-sm text-muted-foreground'>{entry.servingSize}</p>
      </div>

      <Card size='sm'>
        <CardContent className='flex items-center justify-between'>
          <span className='font-medium'>{t('meals.calories')}</span>
          <span className='text-xl font-bold'>{Math.round(entry.calories)} kcal</span>
        </CardContent>
      </Card>

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

      <Card size='sm'>
        <CardContent className='space-y-3'>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-muted-foreground'>{t('meals.source')}</span>
            <span className='text-sm font-medium'>{sourceLabels[entry.source] ?? entry.source}</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-muted-foreground'>{t('meals.meal-category')}</span>
            <span className='text-sm font-medium'>{t(`meals.${entry.mealCategory}`)}</span>
          </div>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-muted-foreground'>{t('meals.time-logged')}</span>
            <span className='text-sm font-medium'>{format(entry.createdAt, 'MMM d, yyyy h:mm a')}</span>
          </div>
        </CardContent>
      </Card>

      <DeleteFoodEntryButton entryId={entry.id} category={entry.mealCategory} />
    </div>
  )
}
