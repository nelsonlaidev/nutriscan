'use client'

import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react/ssr'
import { addDays, format, isToday, isYesterday, parse, subDays } from 'date-fns'
import { useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'
import { useMemo, useRef } from 'react'

import { dashboardParsers } from '@/app/(main)/dashboard/search-params'
import { Button } from '@/components/ui/button'
import { toZonedDate } from '@/lib/utils'

export function DateNavigation() {
  const t = useTranslations()
  const [date, setDate] = useQueryState('date', { ...dashboardParsers.date, shallow: false })
  const today = useMemo(() => toZonedDate(new Date()), [])
  const currentDate = parse(date, 'yyyy-MM-dd', today)
  const dateInputRef = useRef<HTMLInputElement>(null)

  const isTodayDate = isToday(currentDate)

  function getLabel(d: Date) {
    if (isToday(d)) return t('dashboard.today')
    if (isYesterday(d)) return t('dashboard.yesterday')
    return format(d, 'EEEE')
  }

  function goBack() {
    void setDate(format(subDays(currentDate, 1), 'yyyy-MM-dd'))
  }

  function goForward() {
    if (isTodayDate) return
    void setDate(format(addDays(currentDate, 1), 'yyyy-MM-dd'))
  }

  function openDatePicker() {
    dateInputRef.current?.showPicker()
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value) {
      void setDate(e.target.value)
    }
  }

  return (
    <div className='flex items-center justify-between px-1'>
      <Button variant='ghost' size='icon-sm' onClick={goBack}>
        <CaretLeftIcon size={20} weight='bold' />
      </Button>
      <button type='button' className='cursor-pointer text-center' onClick={openDatePicker}>
        <p className='text-sm font-semibold'>{getLabel(currentDate)}</p>
        <p className='text-xs'>{format(currentDate, 'MMM d, yyyy')}</p>
        <input
          ref={dateInputRef}
          type='date'
          value={date}
          max={format(today, 'yyyy-MM-dd')}
          onChange={handleDateChange}
          className='invisible absolute size-0'
          tabIndex={-1}
        />
      </button>
      <Button variant='ghost' size='icon-sm' onClick={goForward} disabled={isTodayDate}>
        <CaretRightIcon size={20} weight='bold' />
      </Button>
    </div>
  )
}
