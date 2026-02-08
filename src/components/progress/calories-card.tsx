'use client'

import { ArrowUpRightIcon } from '@phosphor-icons/react'

import { Card, CardContent } from '@/components/ui/card'
import { caloriesData } from '@/lib/mock/progress-data'

export function CaloriesCard() {
  const { average, trend } = caloriesData

  return (
    <Card className='mt-6 w-full overflow-hidden rounded-3xl border-none bg-white shadow-sm'>
      <CardContent className='flex items-baseline justify-between p-6'>
        <div>
          <h3 className='mb-1 text-sm font-medium text-gray-500'>Daily Average Calories</h3>
          <div className='flex items-baseline space-x-2'>
            <span className='text-4xl font-bold text-gray-900'>{average}</span>
            <span className='text-lg text-gray-400'>cal</span>
            <span className='ml-2 flex items-center font-medium text-green-500'>
              <ArrowUpRightIcon className='mr-0.5 size-4' weight='bold' />
              {trend}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
