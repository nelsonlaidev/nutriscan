'use client'

import { DropIcon, MinusIcon, PlusIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { updateWaterIntake } from '@/actions/update-water-intake'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatMl } from '@/lib/utils'

type WaterIntakeProps = {
  initialAmount: number
  goal: number
  date: string
}

export function WaterIntake(props: WaterIntakeProps) {
  const { initialAmount, goal, date } = props
  const [amount, setAmount] = useState(initialAmount)

  const percentage = goal > 0 ? Math.min((amount / goal) * 100, 100) : 0

  const debouncedSave = useDebouncedCallback((value: number) => {
    void updateWaterIntake({ amount: value, date })
  }, 500)

  function increment() {
    setAmount((prev) => {
      const next = Math.min(prev + 250, 10_000)
      debouncedSave(next)
      return next
    })
  }

  function decrement() {
    setAmount((prev) => {
      const next = Math.max(prev - 250, 0)
      debouncedSave(next)
      return next
    })
  }

  return (
    <Link href='/water'>
      <Card size='sm'>
        <CardContent className='space-y-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <DropIcon size={20} />
              <span className='text-sm font-semibold'>Water Intake</span>
            </div>
            <span className='text-sm font-medium text-blue-500'>
              {formatMl(amount)} / {formatMl(goal)}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='relative h-7 flex-1 overflow-hidden rounded-md bg-blue-100 dark:bg-blue-950'>
              <div
                className='h-full rounded-md bg-blue-400 transition-all duration-300'
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className='flex gap-1'>
              <Button
                variant='outline'
                size='icon-sm'
                onClick={(e) => {
                  e.preventDefault()
                  decrement()
                }}
                disabled={amount === 0}
              >
                <MinusIcon size={14} />
              </Button>
              <Button
                variant='default'
                size='icon-sm'
                onClick={(e) => {
                  e.preventDefault()
                  increment()
                }}
                disabled={amount >= 10_000}
                className='bg-blue-500 hover:bg-blue-600'
              >
                <PlusIcon size={14} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
