'use client'

import { DropIcon, MinusIcon, PlusIcon } from '@phosphor-icons/react/ssr'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WATER_GOAL } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function WaterIntake() {
  const [count, setCount] = useState(0)

  function increment() {
    setCount((c) => Math.min(c + 1, WATER_GOAL))
  }

  function decrement() {
    setCount((c) => Math.max(c - 1, 0))
  }

  return (
    <Card size='sm'>
      <CardContent className='space-y-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <DropIcon size={20} />
            <span className='text-sm font-semibold'>Water Intake</span>
          </div>
          <span className='text-sm font-medium text-blue-500'>
            {count} / {WATER_GOAL} glasses
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='flex flex-1 gap-1.5'>
            {Array.from({ length: WATER_GOAL }, (_, i) => (
              <div
                key={i}
                className={cn(
                  'h-7 flex-1 rounded-md transition-colors',
                  i < count ? 'bg-blue-400' : 'bg-blue-100 dark:bg-blue-950'
                )}
              />
            ))}
          </div>
          <div className='flex gap-1'>
            <Button variant='outline' size='icon-sm' onClick={decrement} disabled={count === 0}>
              <MinusIcon size={14} />
            </Button>
            <Button
              variant='default'
              size='icon-sm'
              onClick={increment}
              disabled={count === WATER_GOAL}
              className='bg-blue-500 hover:bg-blue-600'
            >
              <PlusIcon size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
