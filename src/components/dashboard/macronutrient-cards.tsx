'use client'

import type { DayRange } from '@/lib/utils'

import { BowlFoodIcon } from '@phosphor-icons/react/ssr'
import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useFoodTotals } from '@/hooks/queries/food.query'

type MacroGoals = {
  protein: number
  carbs: number
  fat: number
}

type MacronutrientCardsProps = {
  dayRange: DayRange
  goals: MacroGoals
}

export function MacronutrientCards(props: MacronutrientCardsProps) {
  const { dayRange, goals } = props
  const { data: values } = useFoodTotals(dayRange)
  const t = useTranslations()

  const MACROS = [
    {
      key: 'protein',
      label: t('dashboard.protein'),
      className: '**:data-[slot=progress-indicator]:bg-blue-500',
    },
    { key: 'carbs', label: t('dashboard.carbs'), className: '**:data-[slot=progress-indicator]:bg-amber-500' },
    { key: 'fat', label: t('dashboard.fat'), className: '**:data-[slot=progress-indicator]:bg-rose-500' },
  ] as const

  return (
    <Card size='sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <BowlFoodIcon size={20} />
          {t('dashboard.macronutrients')}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {MACROS.map((macro) => {
          const value = Math.round(values[macro.key])
          const goal = goals[macro.key]
          const percentage = Math.min(Math.round((value / goal) * 100), 100)

          return (
            <div key={macro.key} className='space-y-1'>
              <div className='flex items-center justify-between text-sm'>
                <span className='font-medium'>{macro.label}</span>
                <span className='text-muted-foreground'>{t('dashboard.grams-of-goal', { value, goal })}</span>
              </div>
              <Progress value={percentage} className={macro.className} />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
