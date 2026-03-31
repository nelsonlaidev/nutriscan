'use client'

import type { LearnOverviewOutput } from '@/orpc/client'

import { BrainIcon, FireIcon, TrophyIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { useLearnOverview } from '@/hooks/queries/learn.query'
import { cn } from '@/lib/utils'

import { buttonVariants } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

function findContinueLesson(data: LearnOverviewOutput) {
  const lessons = data.units.flatMap((unit) => unit.lessons)
  const nextLesson = lessons.find((lesson) => lesson.id === data.nextLessonId)
  if (nextLesson) return nextLesson
  return lessons.find((lesson) => lesson.status === 'completed') ?? lessons[0]
}

export function LearnProgressCard() {
  const t = useTranslations()
  const { data } = useLearnOverview()
  const continueLesson = findContinueLesson(data)

  return (
    <Card size='sm' data-testid='learn-progress-card'>
      <CardHeader>
        <CardTitle>{t('learn.dashboard.title')}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-3 gap-3'>
          <div className='rounded-2xl bg-background/80 p-3 shadow-xs ring-1 ring-foreground/8'>
            <div className='flex items-center gap-1 text-xs font-medium text-muted-foreground'>
              <TrophyIcon size={14} />
              {t('learn.metrics.xp')}
            </div>
            <p className='mt-2 text-xl font-semibold tabular-nums'>{data.totalXp}</p>
          </div>
          <div className='rounded-2xl bg-background/80 p-3 shadow-xs ring-1 ring-foreground/8'>
            <div className='flex items-center gap-1 text-xs font-medium text-muted-foreground'>
              <FireIcon size={14} />
              {t('learn.metrics.streak')}
            </div>
            <p className='mt-2 text-xl font-semibold tabular-nums'>
              {t('learn.streak-days', { count: data.streak.current })}
            </p>
          </div>
          <div className='rounded-2xl bg-background/80 p-3 shadow-xs ring-1 ring-foreground/8'>
            <div className='flex items-center gap-1 text-xs font-medium text-muted-foreground'>
              <BrainIcon size={14} />
              {t('learn.metrics.completed')}
            </div>
            <p className='mt-2 text-xl font-semibold tabular-nums'>
              {data.completedLessons}/{data.totalLessons}
            </p>
          </div>
        </div>

        <div className='flex flex-col gap-2 sm:flex-row'>
          <Link
            href={continueLesson ? `/learn/${continueLesson.id}` : '/learn'}
            className={cn(buttonVariants({ className: 'sm:flex sm:flex-1' }))}
          >
            {continueLesson ? t('learn.dashboard.continue-lesson') : t('learn.dashboard.open')}
          </Link>
          <Link href='/learn' className={cn(buttonVariants({ variant: 'outline', className: 'sm:flex sm:flex-1' }))}>
            {t('learn.dashboard.explore-path')}
          </Link>
        </div>

        {continueLesson ? (
          <p className='text-sm text-muted-foreground'>
            {t('learn.dashboard.next-up')}{' '}
            <span className='font-medium text-foreground'>{t(continueLesson.titleKey)}</span>
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}
