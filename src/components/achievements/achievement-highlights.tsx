'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

import { useAchievementsOverview } from '@/hooks/queries/achievements.query'
import { ACHIEVEMENT_CATALOG_BY_ID, getAchievementTitle } from '@/lib/achievements/catalog'

import { buttonVariants } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { AchievementIcon } from './achievement-icon'

function formatUnlockedDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function AchievementHighlights() {
  const t = useTranslations()
  const locale = useLocale()
  const { data: overview } = useAchievementsOverview()

  return (
    <Card size='sm' data-testid='achievement-highlights'>
      <CardHeader>
        <CardTitle>{t('achievements.title')}</CardTitle>
        <CardDescription>{t('achievements.dashboard-subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-3 gap-3'>
          <div className='rounded-xl bg-amber-50 p-3 text-center text-amber-700 dark:bg-amber-950/40 dark:text-amber-200'>
            <p className='text-2xl font-semibold'>
              {overview.unlockedCount}/{overview.totalCount}
            </p>
            <p className='text-xs font-medium'>{t('achievements.summary.badges')}</p>
          </div>
          <div className='rounded-xl bg-orange-50 p-3 text-center text-orange-700 dark:bg-orange-950/40 dark:text-orange-200'>
            <p className='text-2xl font-semibold'>{overview.streaks.mealLogging.current}</p>
            <p className='text-xs font-medium'>{t('achievements.summary.meal-streak')}</p>
          </div>
          <div className='rounded-xl bg-sky-50 p-3 text-center text-sky-700 dark:bg-sky-950/40 dark:text-sky-200'>
            <p className='text-2xl font-semibold'>{overview.streaks.waterLogging.current}</p>
            <p className='text-xs font-medium'>{t('achievements.summary.water-streak')}</p>
          </div>
        </div>

        <div className='space-y-3'>
          <div className='flex items-center justify-between gap-3'>
            <h3 className='text-sm font-medium text-muted-foreground'>{t('achievements.recent-unlocks')}</h3>
            <Link
              href='/profile#achievements'
              className={buttonVariants({ variant: 'outline', size: 'xs', className: 'rounded-full' })}
            >
              {t('achievements.view-all')}
            </Link>
          </div>

          {overview.recentUnlocks.length === 0 ? (
            <p className='text-sm text-muted-foreground'>{t('achievements.no-unlocks')}</p>
          ) : (
            <div className='space-y-2'>
              {overview.recentUnlocks.map((unlock) => (
                <div
                  key={unlock.id}
                  data-testid='recent-achievement-item'
                  className='flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 px-3 py-2'
                >
                  <div className='flex min-w-0 items-center gap-3'>
                    <div className='flex size-9 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-200'>
                      <AchievementIcon icon={ACHIEVEMENT_CATALOG_BY_ID[unlock.id].icon} />
                    </div>
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium'>{getAchievementTitle(unlock.id, t)}</p>
                      <p className='text-xs text-muted-foreground'>{t(`achievements.categories.${unlock.category}`)}</p>
                    </div>
                  </div>
                  <p className='shrink-0 text-xs text-muted-foreground'>
                    {formatUnlockedDate(unlock.unlockedAt, locale)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
