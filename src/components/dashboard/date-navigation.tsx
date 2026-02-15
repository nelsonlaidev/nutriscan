'use client'

import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react'
import { useAtom } from 'jotai'

import { Button } from '@/components/ui/button'
import { selectedDateAtom } from '@/lib/atoms'

function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function getLabel(date: Date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)

  const diff = today.getTime() - d.getTime()
  const days = Math.round(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return date.toLocaleDateString('en-US', { weekday: 'long' })
}

export function DateNavigation() {
  const [date, setDate] = useAtom(selectedDateAtom)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const currentDate = new Date(date)
  currentDate.setHours(0, 0, 0, 0)

  const isToday = currentDate.getTime() === today.getTime()

  function goBack() {
    setDate((prev) => {
      const d = new Date(prev)
      d.setDate(d.getDate() - 1)
      return d
    })
  }

  function goForward() {
    if (isToday) return
    setDate((prev) => {
      const d = new Date(prev)
      d.setDate(d.getDate() + 1)
      return d
    })
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
        <p className='text-sm font-semibold'>{getLabel(date)}</p>
        <p className='text-xs text-primary-foreground/80'>{formatDate(date)}</p>
      </div>
      <Button
        variant='ghost'
        size='icon-sm'
        onClick={goForward}
        disabled={isToday}
        className='text-primary-foreground hover:bg-primary-foreground/20 disabled:opacity-30'
      >
        <CaretRightIcon size={20} weight='bold' />
      </Button>
    </div>
  )
}
