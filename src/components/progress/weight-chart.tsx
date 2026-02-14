'use client'

import { FlagIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Card, CardContent } from '@/components/ui/card'
import { weightHistory } from '@/lib/mock/progress-data'
import { cn } from '@/lib/utils'

const TimeRanges = ['90D', '6M', '1Y', 'ALL']

export function WeightChart() {
  const [activeRange, setActiveRange] = useState('6M')

  // In a real app, filtering logic would go here based on activeRange
  const data = weightHistory

  return (
    <Card className='mt-6 w-full overflow-hidden rounded-3xl border-none bg-white shadow-sm'>
      <CardContent className='p-6'>
        <div className='mb-6 flex items-center justify-between'>
          <h3 className='text-xl font-semibold text-gray-900'>Weight Progress</h3>
          <div className='flex items-center space-x-2 rounded-full bg-gray-50 px-3 py-1'>
            <FlagIcon className='size-4 text-gray-400' weight='fill' />
            <span className='text-sm font-medium text-gray-600'>80% of goal</span>
          </div>
        </div>

        <div className='h-50 w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={data}>
              <CartesianGrid vertical={false} strokeDasharray='3 3' stroke='#E5E7EB' />
              <XAxis
                dataKey='date'
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                tickMargin={10}
              />
              <YAxis
                domain={['dataMin - 5', 'dataMax + 5']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                tickMargin={10}
                width={30}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload[0]) {
                    return (
                      <div className='rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-xl'>
                        {/* fix later */}
                        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                        <div className='mb-1 font-bold'>{payload[0].value} lbs</div>
                        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */}
                        <div className='text-gray-400'>{payload[0].payload.date}, 2025</div>
                        <div className='absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 transform bg-gray-900'></div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type='monotone'
                dataKey='weight'
                stroke='#10B981' // Green color
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className='mt-6 flex justify-between rounded-xl bg-gray-50 p-1'>
          {TimeRanges.map((range) => (
            <button
              type='button'
              key={range}
              onClick={() => {
                setActiveRange(range)
              }}
              className={cn(
                'flex-1 rounded-lg py-1.5 text-sm font-medium transition-all',
                activeRange === range ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              {range}
            </button>
          ))}
        </div>

        <div className='mt-4 rounded-xl bg-green-50 px-4 py-3 text-center text-xs font-medium text-green-600'>
          Great job! Consistency is key, and you're mastering it!
        </div>
      </CardContent>
    </Card>
  )
}
