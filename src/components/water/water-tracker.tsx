'use client'

import { PlusIcon } from '@phosphor-icons/react/ssr'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { useWaterChartData } from '@/hooks/queries/progress.query'
import { useAddWaterEntry, useWaterEntries } from '@/hooks/queries/water.query'
import { formatMl, getDateRange, getDayRange } from '@/lib/utils'

import { Card, CardContent } from '../ui/card'
import { WaterDroplet } from './water-droplet'
import { WaterGoalDialog } from './water-goal-dialog'
import { WaterHistory } from './water-history'
import { WeeklyWaterTracker } from './weekly-water-tracker'

const QUICK_ADD_OPTIONS = [100, 200, 300, 500]

type WaterTrackerProps = {
  initialGoal: number
}

export function WaterTracker(props: WaterTrackerProps) {
  const { initialGoal } = props
  const t = useTranslations()

  const dayRange = getDayRange()
  const dateRange = getDateRange('weekly')

  const { data: entries } = useWaterEntries(dayRange)
  const { mutate: addWater, isPending } = useAddWaterEntry(dayRange)

  const { data: weekData } = useWaterChartData({
    startOfDay: dateRange.startOfDay,
    endOfDay: dateRange.endOfDay,
    hasDates: dateRange.dates.length > 0,
  })

  const [goal, setGoal] = useState(initialGoal)

  const amount = entries.reduce((sum, e) => sum + e.amount, 0)
  const percentage = goal > 0 ? (amount / goal) * 100 : 0

  return (
    <div className='flex flex-col items-center gap-8'>
      <WeeklyWaterTracker weekData={weekData} goal={goal} todayAmount={amount} />
      <Card className='w-full' size='sm'>
        <CardContent className='flex flex-col items-center gap-4'>
          <WaterDroplet percentage={percentage} />
          <p className='text-3xl font-semibold'>{formatMl(amount)}</p>
          <WaterGoalDialog currentGoal={goal} onGoalChange={setGoal} />
        </CardContent>
      </Card>

      <div className='flex flex-wrap justify-center gap-2'>
        {QUICK_ADD_OPTIONS.map((ml) => (
          <Button
            key={ml}
            variant='outline'
            size='sm'
            onClick={() => {
              if (isPending) return
              addWater({ amount: ml })
            }}
          >
            <PlusIcon size={14} data-icon='inline-start' />
            {t('water.ml', { ml })}
          </Button>
        ))}
      </div>

      <Button
        size='lg'
        className='w-full max-w-xs bg-blue-500 hover:bg-blue-600'
        onClick={() => {
          if (isPending) return
          addWater({ amount: 250 })
        }}
      >
        <PlusIcon size={18} data-icon='inline-start' />
        {t('water.drink-water')}
      </Button>

      <WaterHistory entries={entries} />
    </div>
  )
}
