'use client'

import type { TimeRange } from '@/lib/constants'

import { useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'

import { progressParsers } from '@/app/(main)/progress/search-params'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TIME_RANGES } from '@/lib/constants'

export function TimeRangeTabs({ children }: { children: React.ReactNode }) {
  const t = useTranslations()
  const [range, setRange] = useQueryState('range', { ...progressParsers.range, shallow: false })

  return (
    <Tabs
      value={range}
      onValueChange={(value) => {
        void setRange(value as TimeRange)
      }}
    >
      <TabsList className='w-full'>
        {TIME_RANGES.map((r) => (
          <TabsTrigger key={r} value={r} className='flex-1'>
            {t(`progress.${r}`)}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  )
}
