'use client'

import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react/ssr'
import { addDays, differenceInDays, format, isToday, isYesterday, parse, startOfDay, subDays } from 'date-fns'
import { useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'

import { dashboardParsers } from '@/app/(main)/dashboard/search-params'
import { Button } from '@/components/ui/button'

export function DateNavigation() {
  const t = useTranslations()
  const [date, setDate] = useQueryState('date', { ...dashboardParsers.date, shallow: false })
  const currentDate = parse(date, 'yyyy-MM-dd', new Date())

  const isTodayDate = isToday(currentDate)
  const isOldestDate = differenceInDays(startOfDay(new Date()), currentDate) >= 6

  function getLabel(d: Date) {
    if (isToday(d)) return t('dashboard.today')
    if (isYesterday(d)) return t('dashboard.yesterday')
    return format(d, 'EEEE')
  }

  function goBack() {
    if (isOldestDate) return
    void setDate(format(subDays(currentDate, 1), 'yyyy-MM-dd'))
  }

  function goForward() {
    if (isTodayDate) return
    void setDate(format(addDays(currentDate, 1), 'yyyy-MM-dd'))
  }

  return (
    <div className='flex items-center justify-between rounded-2xl px-4 py-3'>
      <Button variant='ghost' size='icon-sm' onClick={goBack} disabled={isOldestDate} className='disabled:opacity-30'>
        <CaretLeftIcon size={20} weight='bold' />
      </Button>
      <div className='text-center'>
        <p className='text-sm font-semibold'>{getLabel(currentDate)}</p>
        <p className='text-xs'>{format(currentDate, 'MMM d, yyyy')}</p>
      </div>
      <Button variant='ghost' size='icon-sm' onClick={goForward} disabled={isTodayDate} className='disabled:opacity-30'>
        <CaretRightIcon size={20} weight='bold' />
      </Button>
    </div>
  )
}
