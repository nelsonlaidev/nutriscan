'use client'

import { ArrowRightIcon, FireIcon, MedalIcon, TrophyIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { useLearnOverview } from '@/hooks/queries/learn.query'
import { cn } from '@/lib/utils'

import { buttonVariants } from '../ui/button'

export function LearningSection() {
  const t = useTranslations()
  const { data } = useLearnOverview()
  const reviewLessons = data.units.flatMap((unit) => unit.lessons).filter((lesson) => lesson.status === 'completed')

  return (
    <section className='space-y-4' data-testid='learning-section'>
      <div className='space-y-1'>
        <h2 className='text-base font-semibold tracking-tight text-foreground'>{t('learn.profile.title')}</h2>
        <p className='text-sm text-muted-foreground'>{t('learn.profile.subtitle')}</p>
      </div>

      <div className='grid grid-cols-3 gap-3'>
        <div className='rounded-xl bg-amber-50 p-3 text-amber-700 dark:bg-amber-950/40 dark:text-amber-200'>
          <div className='flex items-center gap-2 text-xs font-medium'>
            <TrophyIcon size={14} />
            {t('learn.metrics.xp')}
          </div>
          <p className='mt-2 text-lg font-semibold tabular-nums'>{data.totalXp}</p>
        </div>
        <div className='rounded-xl bg-orange-50 p-3 text-orange-700 dark:bg-orange-950/40 dark:text-orange-200'>
          <div className='flex items-center gap-2 text-xs font-medium'>
            <FireIcon size={14} />
            {t('learn.metrics.streak')}
          </div>
          <p className='mt-2 text-lg font-semibold tabular-nums'>{data.streak.current}</p>
        </div>
        <div className='rounded-xl bg-amber-50 p-3 text-amber-700 dark:bg-amber-950/40 dark:text-amber-200'>
          <div className='flex items-center gap-2 text-xs font-medium'>
            <MedalIcon size={14} />
            {t('learn.metrics.mastered')}
          </div>
          <p className='mt-2 text-lg font-semibold tabular-nums'>
            {data.masteredLessons}/{data.totalLessons}
          </p>
        </div>
      </div>

      {reviewLessons.length > 0 ? (
        <div className='space-y-2'>
          <h3 className='text-sm font-medium text-muted-foreground'>{t('learn.profile.review-title')}</h3>
          <div className='space-y-2'>
            {reviewLessons.slice(0, 3).map((lesson) => (
              <Link
                key={lesson.id}
                href={`/learn/${lesson.id}`}
                className='flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 transition-colors hover:bg-muted/50'
              >
                <div>
                  <p className='text-sm font-medium'>{t(lesson.titleKey)}</p>
                  <p className='text-xs text-muted-foreground'>{t('learn.review.lesson-ready')}</p>
                </div>
                <ArrowRightIcon size={18} className='text-muted-foreground' />
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <Link href='/learn' className={cn(buttonVariants({ variant: 'outline', className: 'w-full' }))}>
        {t('learn.profile.open-path')}
      </Link>
    </section>
  )
}
