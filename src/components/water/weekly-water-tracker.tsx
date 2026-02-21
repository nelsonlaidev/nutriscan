'use client'

import { eachDayOfInterval, endOfWeek, format, isToday, startOfWeek } from 'date-fns'
import { useTranslations } from 'next-intl'

import { CircularProgress } from '../circular-progress'

type DayData = {
  date: string
  amount: number
}

type WeeklyWaterTrackerProps = {
  weekData: DayData[]
  goal: number
  todayAmount: number
  date: string
}

export function WeeklyWaterTracker(props: WeeklyWaterTrackerProps) {
  const { weekData, goal, todayAmount, date } = props
  const t = useTranslations()

  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const dataMap = new Map(weekData.map((d) => [d.date, d.amount]))
  dataMap.set(date, todayAmount)

  return (
    <div className='flex w-full max-w-md items-center justify-between'>
      {days.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd')
        const amount = dataMap.get(dateStr) ?? 0
        const current = isToday(day)

        return (
          <div
            key={dateStr}
            data-active={current}
            className='group flex flex-col items-center gap-1 rounded-xl px-1 py-2 data-active:bg-blue-50 data-active:ring-1 data-active:ring-blue-300 dark:data-active:bg-blue-950/30'
          >
            <span className='text-xs font-medium text-muted-foreground group-data-active:text-blue-500'>
              {format(day, t('water.day-format'))}
            </span>
            <CircularProgress value={amount} max={goal} size={48} strokeWidth={4} progressClassName='stroke-blue-500'>
              <span className='text-sm font-medium group-data-active:text-blue-500'>{format(day, 'd')}</span>
            </CircularProgress>
          </div>
        )
      })}
    </div>
  )
}
