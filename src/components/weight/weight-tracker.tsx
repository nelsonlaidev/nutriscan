'use client'

import type { WeightEntry } from '@/data/weight-entries'

import { ScalesIcon } from '@phosphor-icons/react/ssr'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Progress } from '../ui/progress'

import { WeightEntryDialog } from './weight-entry-dialog'
import { WeightHistory } from './weight-history'

type WeightTrackerProps = {
  currentWeight: number
  startingWeight: number
  goalWeight: number
  initialEntries: WeightEntry[]
}

export function WeightTracker(props: WeightTrackerProps) {
  const { startingWeight, goalWeight, initialEntries } = props
  const t = useTranslations()
  const [entries, setEntries] = useState(initialEntries)

  const { currentWeight: fallbackWeight } = props
  const latestEntry = entries[0]
  const currentWeight = latestEntry ? latestEntry.weight : fallbackWeight

  const totalChange = Math.abs(startingWeight - goalWeight)
  const currentProgress = Math.abs(startingWeight - currentWeight)
  const percentage = totalChange > 0 ? Math.min((currentProgress / totalChange) * 100, 100) : 0

  function handleEntryAdded(entry: { id: string; weight: number; createdAt: Date }) {
    setEntries((prev) => [entry, ...prev])
  }

  function handleEntryUpdate(id: string, weight: number) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, weight } : e)))
  }

  function handleEntryDelete(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className='flex flex-col gap-6'>
      <Card size='sm'>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <ScalesIcon size={20} />
              {t('weight.current')}
            </div>
            <span className='text-2xl font-bold text-emerald-500'>{currentWeight.toFixed(1)} kg</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <Progress
            value={percentage}
            className='**:data-[slot=progress-indicator]:rounded-md **:data-[slot=progress-indicator]:bg-emerald-400 *:data-[slot=progress-track]:h-7 *:data-[slot=progress-track]:rounded-md *:data-[slot=progress-track]:bg-emerald-100 dark:*:data-[slot=progress-track]:bg-emerald-950'
          />
          <div className='flex justify-between text-xs text-muted-foreground'>
            <span>{t('weight.starting-value', { weight: startingWeight.toFixed(1) })}</span>
            <span>{t('weight.goal-value', { weight: goalWeight.toFixed(1) })}</span>
          </div>
          <WeightEntryDialog onEntryAdded={handleEntryAdded} />
        </CardContent>
      </Card>

      <WeightHistory entries={entries} onUpdate={handleEntryUpdate} onDelete={handleEntryDelete} />
    </div>
  )
}
