'use client'

import type { WaterEntry } from '@/data/water-entries'

import { format, isToday, isYesterday, parseISO } from 'date-fns'
import { useTranslations } from 'next-intl'

import { WaterEntryItem } from './water-entry-item'

type WaterHistoryProps = {
  entries: WaterEntry[]
  onUpdate: (id: string, amount: number) => void
  onDelete: (id: string) => void
}

export function WaterHistory(props: WaterHistoryProps) {
  const { entries, onUpdate, onDelete } = props
  const t = useTranslations()

  function formatDateHeader(dateStr: string) {
    const date = parseISO(dateStr)
    const formatted = format(date, 'd MMM yyyy')

    if (isToday(date)) return t('water.today-date', { date: formatted })
    if (isYesterday(date)) return t('water.yesterday-date', { date: formatted })
    return formatted
  }

  if (entries.length === 0) return null

  // Group entries by date
  const grouped = new Map<string, WaterEntry[]>()
  for (const entry of entries) {
    const existing = grouped.get(entry.date)
    if (existing) {
      existing.push(entry)
    } else {
      grouped.set(entry.date, [entry])
    }
  }

  return (
    <div className='flex w-full flex-col gap-4'>
      {[...grouped.entries()].map(([date, dateEntries]) => (
        <div key={date}>
          <h3 className='mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase'>
            {formatDateHeader(date)}
          </h3>
          <div className='divide-y'>
            {dateEntries.map((entry) => (
              <WaterEntryItem key={entry.id} entry={entry} onUpdate={onUpdate} onDelete={onDelete} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
