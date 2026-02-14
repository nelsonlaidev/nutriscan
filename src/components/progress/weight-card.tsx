'use client'

import { ArrowRightIcon } from '@phosphor-icons/react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { currentWeight } from '@/lib/mock/progress-data'

export function WeightCard() {
  const { current, goal, start } = currentWeight
  // Calculate percentage toward goal (assuming weight loss)
  // Total to lose: start - goal
  // Lost so far: start - current
  const totalToLose = start - goal
  const lostSoFar = start - current
  const percentage = Math.min(100, Math.max(0, Math.round((lostSoFar / totalToLose) * 100)))

  return (
    <Card className='w-full overflow-hidden rounded-3xl border-none bg-white shadow-sm'>
      <CardContent className='flex flex-col items-center justify-center space-y-4 p-6 text-center'>
        <div className='space-y-1'>
          <h3 className='text-sm font-medium text-gray-500'>Your Weight</h3>
          <div className='flex items-baseline justify-center space-x-1'>
            <span className='text-4xl font-bold text-gray-900'>{current}</span>
            <span className='font-medium text-gray-500'>lbs</span>
          </div>
        </div>

        {/* Custom Progress Bar */}
        <div className='w-full space-y-2'>
          <div className='h-2 w-full overflow-hidden rounded-full bg-gray-100'>
            <div className='h-full rounded-full bg-gray-900' style={{ width: `${percentage}%` }} />
          </div>
          <div className='flex justify-center text-xs font-medium text-gray-500'>Goal {goal} lbs</div>
        </div>

        <Button
          className='mt-4 flex w-full cursor-pointer items-center justify-between rounded-full bg-gray-900 p-6 text-white hover:bg-gray-800'
          onClick={() => {
            // testing
            // eslint-disable-next-line no-alert
            alert('Log Weight logic would go here')
          }}
        >
          <span className='font-medium'>Log Weight</span>
          <ArrowRightIcon className='size-4' weight='bold' />
        </Button>
      </CardContent>
    </Card>
  )
}
