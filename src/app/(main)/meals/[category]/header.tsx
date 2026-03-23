'use client'

import type { ListFoodByCategoryInput } from '@/orpc/client'

import { useTranslations } from 'next-intl'

import { useFoodEntriesByCategory } from '@/hooks/queries/food.query'

type HeaderProps = {
  input: ListFoodByCategoryInput
}

export function Header(props: HeaderProps) {
  const { input } = props

  const t = useTranslations()
  const { data: entries } = useFoodEntriesByCategory(input)

  const totalCalories = Math.round(entries.reduce((sum, e) => sum + e.calories, 0))

  return (
    <div className='flex items-center justify-between'>
      <div className='font-semibold'>{t('meals.total')}</div>
      <div className='font-medium'>{totalCalories} kcal</div>
    </div>
  )
}
