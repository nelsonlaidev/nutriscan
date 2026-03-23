'use client'

import { useTranslations } from 'next-intl'
import { useQueryState } from 'nuqs'

import { progressParsers, timeRanges } from '@/app/(main)/progress/search-params'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function TimeRangeTabs({ children }: { children: React.ReactNode }) {
  const t = useTranslations()
  const [range, setRange] = useQueryState('range', { ...progressParsers.range, shallow: false })

  // i18n-check t('progress.weekly')
  // i18n-check t('progress.monthly')
  // i18n-check t('progress.yearly')
  return (
    <Tabs
      value={range}
      onValueChange={(value) => {
        void setRange(value as (typeof timeRanges)[number])
      }}
    >
      <TabsList className='w-full'>
        {timeRanges.map((r) => (
          <TabsTrigger key={r} value={r} className='flex-1'>
            {t(`progress.${r}`)}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  )
}
