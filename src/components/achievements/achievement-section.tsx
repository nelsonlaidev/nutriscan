'use client'

import { useLocale, useTranslations } from 'next-intl'

import { Progress } from '@/components/ui/progress'
import { useAchievementList, useAchievementsOverview } from '@/hooks/queries/achievements.query'
import { getAchievementDescription, getAchievementProgressText, getAchievementTitle } from '@/lib/achievements/catalog'

import { AchievementIcon } from './achievement-icon'

const CATEGORIES = ['meals', 'water', 'weight'] as const

function formatUnlockedDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function AchievementSection() {
  const t = useTranslations()
  const locale = useLocale()
  const { data: cards } = useAchievementList()
  const { data: overview } = useAchievementsOverview()

  return (
    <section id='achievements' data-testid='achievement-section' className='scroll-mt-6 space-y-4'>
      <div className='space-y-1'>
        <h2 className='text-base font-semibold tracking-tight text-foreground'>{t('achievements.title')}</h2>
        <p className='text-sm text-muted-foreground'>{t('achievements.profile-subtitle')}</p>
      </div>

      <div className='grid grid-cols-3 gap-3'>
        <div className='rounded-lg bg-muted/50 p-3 text-center'>
          <p className='text-xs text-muted-foreground'>{t('achievements.summary.unlocked')}</p>
          <p className='text-lg font-semibold'>
            {overview.unlockedCount}/{overview.totalCount}
          </p>
        </div>
        <div className='rounded-lg bg-muted/50 p-3 text-center'>
          <p className='text-xs text-muted-foreground'>{t('achievements.summary.meal-streak')}</p>
          <p className='text-lg font-semibold'>
            {t('achievements.streak-days', { count: overview.streaks.mealLogging.current })}
          </p>
        </div>
        <div className='rounded-lg bg-muted/50 p-3 text-center'>
          <p className='text-xs text-muted-foreground'>{t('achievements.summary.water-streak')}</p>
          <p className='text-lg font-semibold'>
            {t('achievements.streak-days', { count: overview.streaks.waterLogging.current })}
          </p>
        </div>
      </div>

      {CATEGORIES.map((category) => {
        const categoryCards = cards.filter((card) => card.category === category)

        return (
          <div key={category} className='space-y-3'>
            <h3 className='text-sm font-semibold text-foreground/85'>{t(`achievements.categories.${category}`)}</h3>
            <div className='grid gap-3'>
              {categoryCards.map((card) => {
                const percentage = Math.min((card.current / card.target) * 100, 100)
                const title = getAchievementTitle(card.id, t)
                const description = getAchievementDescription(card.id, t)
                const progressText = getAchievementProgressText(card.id, card.current, t)

                return (
                  <div
                    key={card.id}
                    data-testid={`achievement-card-${card.id}`}
                    data-status={card.status}
                    className='rounded-2xl border border-border/70 bg-card p-4'
                  >
                    <div className='flex items-start gap-3'>
                      <div
                        data-status={card.status}
                        className='flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground data-[status=unlocked]:bg-amber-100 data-[status=unlocked]:text-amber-700 dark:data-[status=unlocked]:bg-amber-950/60 dark:data-[status=unlocked]:text-amber-200'
                      >
                        <AchievementIcon icon={card.icon} />
                      </div>
                      <div className='min-w-0 flex-1 space-y-2'>
                        <div className='space-y-1'>
                          <div className='flex items-center justify-between gap-3'>
                            <p className='font-medium'>{title}</p>
                            {card.status === 'unlocked' && (
                              <span className='rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/60 dark:text-amber-200'>
                                {t('achievements.status-unlocked')}
                              </span>
                            )}
                          </div>
                          <p className='text-sm text-muted-foreground'>{description}</p>
                        </div>

                        {card.status === 'unlocked' && card.unlockedAt ? (
                          <p className='text-xs text-muted-foreground'>
                            {t('achievements.unlocked-on', {
                              date: formatUnlockedDate(card.unlockedAt, locale),
                            })}
                          </p>
                        ) : (
                          <div className='space-y-2'>
                            <div className='flex items-center justify-between gap-3 text-xs text-muted-foreground'>
                              <span>{progressText}</span>
                              <span>
                                {Math.min(card.current, card.target)}/{card.target}
                              </span>
                            </div>
                            <Progress
                              value={percentage}
                              className='**:data-[slot=progress-indicator]:rounded-md **:data-[slot=progress-indicator]:bg-amber-400 *:data-[slot=progress-track]:h-2 *:data-[slot=progress-track]:rounded-full'
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </section>
  )
}
