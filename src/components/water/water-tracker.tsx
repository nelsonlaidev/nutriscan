'use client'

import type { WaterEntry } from '@/data/water-entries'

import { PlusIcon } from '@phosphor-icons/react/ssr'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { addWaterEntry } from '@/actions/water-entry'
import { Button } from '@/components/ui/button'
import { MAX_WATER_INTAKE } from '@/lib/constants'
import { formatMl } from '@/lib/utils'

import { Card, CardContent } from '../ui/card'

import { WaterDroplet } from './water-droplet'
import { WaterGoalDialog } from './water-goal-dialog'
import { WaterHistory } from './water-history'
import { WeeklyWaterTracker } from './weekly-water-tracker'

const QUICK_ADD_OPTIONS = [100, 200, 300, 500]

type WaterTrackerProps = {
  initialGoal: number
  date: string
  weekData: Array<{ date: string; amount: number }>
  initialEntries: WaterEntry[]
}

export function WaterTracker(props: WaterTrackerProps) {
  const { initialGoal, date, weekData, initialEntries } = props
  const t = useTranslations()
  const [entries, setEntries] = useState(initialEntries)
  const [goal, setGoal] = useState(initialGoal)

  // Derive today's total from entries matching the current date
  const todayEntries = entries.filter((e) => e.localDate === date)
  const amount = todayEntries.reduce((sum, e) => sum + e.amount, 0)

  const percentage = goal > 0 ? (amount / goal) * 100 : 0

  async function addWater(ml: number) {
    // Optimistically add entry
    const optimisticId = crypto.randomUUID()
    const optimisticEntry: WaterEntry = {
      id: optimisticId,
      amount: Math.min(ml, MAX_WATER_INTAKE - amount),
      localDate: date,
      createdAt: new Date()
    }

    setEntries((prev) => [optimisticEntry, ...prev])

    const result = await addWaterEntry({ amount: optimisticEntry.amount })

    const entry = result.data?.entry
    if (result.data?.success && entry) {
      // Replace optimistic entry with real one
      setEntries((prev) =>
        prev.map((e) =>
          e.id === optimisticId ? { ...e, id: entry.id, localDate: entry.localDate, createdAt: entry.createdAt } : e
        )
      )
    }
  }

  function handleEntryUpdate(id: string, newAmount: number) {
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, amount: newAmount } : e)))
  }

  function handleEntryDelete(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className='flex flex-col items-center gap-8'>
      <WeeklyWaterTracker weekData={weekData} goal={goal} todayAmount={amount} date={date} />
      <Card className='w-full' size='sm'>
        <CardContent className='flex flex-col items-center gap-4'>
          <WaterDroplet percentage={percentage} />
          <p className='text-3xl font-semibold'>{formatMl(amount)}</p>
          <WaterGoalDialog currentGoal={goal} onGoalChange={setGoal} />
        </CardContent>
      </Card>

      {/* Quick add buttons */}
      <div className='flex flex-wrap justify-center gap-2'>
        {QUICK_ADD_OPTIONS.map((ml) => (
          <Button
            key={ml}
            variant='outline'
            size='sm'
            onClick={() => {
              void addWater(ml)
            }}
          >
            <PlusIcon size={14} data-icon='inline-start' />
            {t('water.ml', { ml })}
          </Button>
        ))}
      </div>

      {/* Main add button */}
      <Button
        size='lg'
        className='w-full max-w-xs bg-blue-500 hover:bg-blue-600'
        onClick={() => {
          void addWater(250)
        }}
      >
        <PlusIcon size={18} data-icon='inline-start' />
        {t('water.drink-water')}
      </Button>

      {/* Water entry history */}
      <WaterHistory entries={entries} onUpdate={handleEntryUpdate} onDelete={handleEntryDelete} />
    </div>
  )
}
