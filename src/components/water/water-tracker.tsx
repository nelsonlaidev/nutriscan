'use client'

import { PlusIcon } from '@phosphor-icons/react/ssr'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { updateWaterIntake } from '@/actions/update-water-intake'
import { Button } from '@/components/ui/button'
import { MAX_WATER_INTAKE } from '@/lib/constants'

import { Card, CardContent } from '../ui/card'

import { WaterAmountDialog } from './water-amount-dialog'
import { WaterDroplet } from './water-droplet'
import { WaterGoalDialog } from './water-goal-dialog'
import { WeeklyWaterTracker } from './weekly-water-tracker'

const QUICK_ADD_OPTIONS = [100, 200, 300, 500]

type WaterTrackerProps = {
  initialAmount: number
  initialGoal: number
  date: string
  weekData: Array<{ date: string; amount: number }>
}

export function WaterTracker(props: WaterTrackerProps) {
  const { initialAmount, initialGoal, date, weekData } = props
  const [amount, setAmount] = useState(initialAmount)
  const [goal, setGoal] = useState(initialGoal)

  const percentage = goal > 0 ? (amount / goal) * 100 : 0

  const debouncedSave = useDebouncedCallback((value: number) => {
    void updateWaterIntake({ amount: value, date })
  }, 500)

  function addWater(ml: number) {
    setAmount((prev) => {
      const next = Math.min(prev + ml, MAX_WATER_INTAKE)
      debouncedSave(next)
      return next
    })
  }

  return (
    <div className='flex flex-col items-center gap-8'>
      <WeeklyWaterTracker weekData={weekData} goal={goal} todayAmount={amount} date={date} />
      <Card className='w-full' size='sm'>
        <CardContent className='flex flex-col items-center gap-4'>
          <WaterDroplet percentage={percentage} />
          <WaterAmountDialog amount={amount} date={date} onAmountChange={setAmount} />
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
              addWater(ml)
            }}
          >
            <PlusIcon size={14} data-icon='inline-start' />
            {ml} mL
          </Button>
        ))}
      </div>

      {/* Main add button */}
      <Button
        size='lg'
        className='w-full max-w-xs bg-blue-500 hover:bg-blue-600'
        onClick={() => {
          addWater(250)
        }}
      >
        <PlusIcon size={18} data-icon='inline-start' />
        Drink Water (+250 mL)
      </Button>
    </div>
  )
}
