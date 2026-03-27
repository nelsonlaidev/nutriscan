'use client'

import { format, isToday } from 'date-fns'

import { getDateRange, toZonedDate } from '@/lib/utils'

import { CircularProgress } from '../circular-progress'

type WaterChartData = Array<{
  date: string
  amount: number
}>

type WeeklyWaterTrackerProps = {
  weekData: WaterChartData
  goal: number
  todayAmount: number
}

export function WeeklyWaterTracker(props: WeeklyWaterTrackerProps) {
  const { weekData, goal, todayAmount } = props

  const dateRange = getDateRange('7d')

  return (
    <div className='flex w-full max-w-md items-center justify-between'>
      {dateRange.dates.map((day) => {
        const date = day.value
        const current = isToday(toZonedDate(date))
        const amount = current ? todayAmount : (weekData.find((d) => d.date === date)?.amount ?? 0)

        return (
          <div
            key={date}
            data-active={current}
            className='group flex flex-col items-center gap-1 rounded-xl px-1 py-2 data-active:bg-blue-50 data-active:ring-1 data-active:ring-blue-300 dark:data-active:bg-blue-950/30'
          >
            <span className='text-xs font-medium text-muted-foreground group-data-active:text-blue-500'>
              {day.label}
            </span>
            <CircularProgress value={amount} max={goal} size={48} strokeWidth={4} progressClassName='stroke-blue-500'>
              <span className='text-sm font-medium group-data-active:text-blue-500'>{format(day.value, 'd')}</span>
            </CircularProgress>
          </div>
        )
      })}
    </div>
  )
}
