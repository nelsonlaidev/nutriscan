'use client'

import { ScalesIcon } from '@phosphor-icons/react/ssr'
import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLatestWeight, useWeightEntries } from '@/hooks/queries/weight.query'

import { Progress } from '../ui/progress'
import { WeightEntryDialog } from './weight-entry-dialog'
import { WeightHistory } from './weight-history'

type WeightTrackerProps = {
  startingWeight: number
  goalWeight: number
  fallbackWeight: number
}

export function WeightTracker(props: WeightTrackerProps) {
  const { startingWeight, goalWeight, fallbackWeight } = props
  const t = useTranslations()

  const { data: entries } = useWeightEntries()
  const { data: latestWeight } = useLatestWeight()

  const currentWeight = latestWeight?.weight ?? entries[0]?.weight ?? fallbackWeight

  const totalChange = Math.abs(startingWeight - goalWeight)
  const currentProgress = Math.abs(startingWeight - currentWeight)
  const percentage = totalChange > 0 ? Math.min((currentProgress / totalChange) * 100, 100) : 0

  return (
    <div className='flex flex-col gap-6'>
      <Card size='sm'>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <ScalesIcon size={20} />
              {t('weight.current')}
            </div>
            <span data-testid='current-weight' className='text-2xl font-bold text-emerald-500'>
              {currentWeight.toFixed(1)} kg
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='flex flex-col gap-3'>
          <Progress
            value={percentage}
            className='**:data-[slot=progress-indicator]:rounded-md **:data-[slot=progress-indicator]:bg-emerald-400 *:data-[slot=progress-track]:h-7 *:data-[slot=progress-track]:rounded-md *:data-[slot=progress-track]:bg-emerald-100 dark:*:data-[slot=progress-track]:bg-emerald-950'
          />
          <div className='flex justify-between text-xs text-muted-foreground'>
            <span>{t('weight.starting-value', { weight: startingWeight.toFixed(1) })}</span>
            <span>{t('weight.goal-value', { weight: goalWeight.toFixed(1) })}</span>
          </div>
          <WeightEntryDialog />
        </CardContent>
      </Card>

      <WeightHistory entries={entries} />
    </div>
  )
}
