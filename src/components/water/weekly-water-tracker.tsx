'use client'

import { eachDayOfInterval, endOfWeek, format, isToday, startOfWeek } from 'date-fns'

import { cn } from '@/lib/utils'

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

function CircularProgress({
  percentage,
  size = 48,
  strokeWidth = 4
}: {
  percentage: number
  size?: number
  strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100)
  const offset = circumference - (clampedPercentage / 100) * circumference

  return (
    <svg width={size} height={size} className='-rotate-90'>
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill='none'
        stroke='currentColor'
        strokeWidth={strokeWidth}
        className='text-muted-foreground/20'
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill='none'
        stroke='currentColor'
        strokeWidth={strokeWidth}
        strokeLinecap='round'
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className='text-blue-500 transition-all duration-300'
      />
    </svg>
  )
}

export function WeeklyWaterTracker(props: WeeklyWaterTrackerProps) {
  const { weekData, goal, todayAmount, date } = props

  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const dataMap = new Map(weekData.map((d) => [d.date, d.amount]))
  dataMap.set(date, todayAmount)

  return (
    <div className='grid grid-cols-7 gap-1'>
      {days.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd')
        const amount = dataMap.get(dateStr) ?? 0
        const percentage = goal > 0 ? (amount / goal) * 100 : 0
        const current = isToday(day)

        return (
          <div
            key={dateStr}
            className={cn(
              'flex flex-col items-center gap-1 rounded-xl px-1 py-2',
              current && 'bg-blue-50 ring-1 ring-blue-300 dark:bg-blue-950/30'
            )}
          >
            <span className={cn('text-xs font-medium text-muted-foreground', current && 'text-blue-500')}>
              {format(day, 'EEE')}
            </span>
            <div className='relative flex items-center justify-center'>
              <CircularProgress percentage={percentage} />
              <span className={cn('absolute text-sm font-medium', current && 'text-blue-500')}>{format(day, 'd')}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
