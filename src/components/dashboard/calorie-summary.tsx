'use client'

import type { DayRange } from '@/lib/utils'

import { useTranslations } from 'next-intl'

import { Card, CardContent } from '@/components/ui/card'
import { useFoodTotals } from '@/hooks/queries/food.query'

import { CircularProgress } from '../circular-progress'

type CalorieSummaryProps = {
  dayRange: DayRange
  goal: number
}

export function CalorieSummary(props: CalorieSummaryProps) {
  const { dayRange, goal } = props
  const { data: totals } = useFoodTotals(dayRange)
  const { calories } = totals
  const remaining = goal - calories
  const t = useTranslations()

  return (
    <Card size='sm'>
      <CardContent className='flex items-center gap-6'>
        <CircularProgress value={calories} max={goal} size={100} strokeWidth={8}>
          <span className='text-xl font-semibold'>{Math.round(calories)}</span>
          <span className='text-xs text-muted-foreground'>{t('dashboard.kcal')}</span>
          <span className='text-xs text-muted-foreground'>{t('dashboard.of-goal', { goal })}</span>
        </CircularProgress>
        <div className='grid flex-1 grid-cols-2 gap-y-3'>
          <div>
            <p className='text-xs text-muted-foreground'>{t('dashboard.eaten')}</p>
            <p className='text-lg font-semibold'>{Math.round(calories)}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>{t('dashboard.remaining')}</p>
            <p className='text-lg font-semibold text-primary'>{Math.round(remaining)}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>{t('dashboard.goal')}</p>
            <p className='text-lg font-semibold'>{goal}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
