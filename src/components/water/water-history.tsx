'use client'

import { format, isToday, isYesterday, parseISO } from 'date-fns'
import { useTranslations } from 'next-intl'

import { toZonedDate } from '@/lib/utils'

import { WaterEntryItem } from './water-entry-item'

type WaterEntry = {
  id: string
  amount: number
  createdAt: Date
}

type WaterHistoryProps = {
  entries: WaterEntry[]
}

export function WaterHistory(props: WaterHistoryProps) {
  const { entries } = props
  const t = useTranslations()

  function formatDateHeader(dateStr: string) {
    const date = toZonedDate(parseISO(dateStr))
    const formatted = format(date, 'd MMM yyyy')

    if (isToday(date)) return t('water.today-date', { date: formatted })
    if (isYesterday(date)) return t('water.yesterday-date', { date: formatted })
    return formatted
  }

  if (entries.length === 0) return null

  // Group entries by date
  const grouped = new Map<string, WaterEntry[]>()
  for (const entry of entries) {
    const dateKey = format(toZonedDate(entry.createdAt), 'yyyy-MM-dd')
    const existing = grouped.get(dateKey)
    if (existing) {
      existing.push(entry)
    } else {
      grouped.set(dateKey, [entry])
    }
  }

  return (
    <div className='flex w-full flex-col gap-4'>
      {[...grouped.entries()].map(([date, dateEntries]) => (
        <div key={date} className='space-y-2'>
          <h3 className='text-xs font-medium tracking-wide text-muted-foreground uppercase'>
            {formatDateHeader(date)}
          </h3>
          <div className='divide-y'>
            {dateEntries.map((entry) => (
              <WaterEntryItem key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
