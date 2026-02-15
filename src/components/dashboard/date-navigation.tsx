'use client'

import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react/ssr'
import { addDays, format, isToday, isYesterday, parse, subDays } from 'date-fns'
import { useQueryState } from 'nuqs'

import { dashboardParsers } from '@/app/(main)/dashboard/search-params'
import { Button } from '@/components/ui/button'

function getLabel(date: Date) {
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'EEEE')
}

export function DateNavigation() {
  const [date, setDate] = useQueryState('date', dashboardParsers.date)
  const currentDate = parse(date, 'yyyy-MM-dd', new Date())

  const isTodayDate = isToday(currentDate)

  function goBack() {
    void setDate(format(subDays(currentDate, 1), 'yyyy-MM-dd'))
  }

  function goForward() {
    if (isTodayDate) return
    void setDate(format(addDays(currentDate, 1), 'yyyy-MM-dd'))
  }

  return (
    <div className='flex items-center justify-between rounded-2xl bg-primary/80 px-4 py-3 text-primary-foreground'>
      <Button
        variant='ghost'
        size='icon-sm'
        onClick={goBack}
        className='text-primary-foreground hover:bg-primary-foreground/20'
      >
        <CaretLeftIcon size={20} weight='bold' />
      </Button>
      <div className='text-center'>
        <p className='text-sm font-semibold'>{getLabel(currentDate)}</p>
        <p className='text-xs text-primary-foreground/80'>{format(currentDate, 'MMM d, yyyy')}</p>
      </div>
      <Button
        variant='ghost'
        size='icon-sm'
        onClick={goForward}
        disabled={isTodayDate}
        className='text-primary-foreground hover:bg-primary-foreground/20 disabled:opacity-30'
      >
        <CaretRightIcon size={20} weight='bold' />
      </Button>
    </div>
  )
}
