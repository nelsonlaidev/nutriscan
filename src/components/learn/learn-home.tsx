'use client'

import type { LearnOverviewOutput } from '@/orpc/client'
import type { TranslationKey } from '@/types'

import { BrainIcon, FireIcon, LockIcon, MedalIcon, SparkleIcon, TrophyIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { useLearnOverview } from '@/hooks/queries/learn.query'
import { cn } from '@/lib/utils'

import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { buttonVariants } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

function findContinueLesson(data: LearnOverviewOutput) {
  const lessons = data.units.flatMap((unit) => unit.lessons)
  return (
    lessons.find((lesson) => lesson.id === data.nextLessonId) ??
    lessons.find((lesson) => lesson.status === 'completed') ??
    lessons[0]
  )
}

function getLessonStatusClasses(status: string) {
  switch (status) {
    case 'mastered': {
      return 'border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200'
    }
    case 'completed': {
      return 'border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-200'
    }
    case 'available': {
      return 'border-border bg-background text-foreground hover:border-amber-300 hover:bg-amber-50/60 dark:hover:border-amber-800 dark:hover:bg-amber-950/30'
    }
    default: {
      return 'border-border/60 bg-muted/30 text-muted-foreground'
    }
  }
}

export function LearnHome() {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const { data } = useLearnOverview()
  const continueLesson = findContinueLesson(data)
  const reviewLessons = data.units.flatMap((unit) => unit.lessons).filter((lesson) => lesson.status === 'completed')
  const lockedLessonId = searchParams.get('locked')
  const lockedLesson = data.units.flatMap((unit) => unit.lessons).find((lesson) => lesson.id === lockedLessonId)

  return (
    <div className='space-y-6' data-testid='learn-home'>
      {lockedLesson ? (
        <Alert className='border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50'>
          <LockIcon />
          <AlertTitle>{t('learn.locked.title')}</AlertTitle>
          <AlertDescription>{t('learn.locked.description', { lesson: t(lockedLesson.titleKey) })}</AlertDescription>
        </Alert>
      ) : null}

      <Card
        size='sm'
        className='border-amber-200/70 bg-linear-to-br from-amber-500/15 via-background to-orange-500/12 ring-amber-200/70 dark:border-amber-900/50 dark:ring-amber-900/50'
      >
        <CardContent className='space-y-6'>
          <div className='flex items-start justify-between gap-4'>
            <div className='space-y-2'>
              <span className='inline-flex rounded-full bg-amber-500/12 px-2.5 py-1 text-xs font-semibold tracking-[0.14em] text-amber-700 uppercase dark:text-amber-300'>
                {t('learn.badge')}
              </span>
              <div className='space-y-2'>
                <h1 className='text-2xl font-semibold tracking-tight'>{t('learn.home.title')}</h1>
                <p className='max-w-lg text-sm text-muted-foreground'>{t('learn.home.subtitle')}</p>
              </div>
            </div>
            <div className='rounded-3xl bg-amber-500/12 p-3 text-amber-700 dark:text-amber-300'>
              <BrainIcon size={30} weight='fill' />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
            <div className='rounded-2xl bg-background/85 p-4 shadow-xs ring-1 ring-foreground/8'>
              <div className='flex items-center gap-2 text-xs font-medium text-muted-foreground'>
                <TrophyIcon size={14} />
                {t('learn.metrics.xp')}
              </div>
              <p className='mt-2 text-2xl font-semibold tabular-nums'>{data.totalXp}</p>
            </div>
            <div className='rounded-2xl bg-background/85 p-4 shadow-xs ring-1 ring-foreground/8'>
              <div className='flex items-center gap-2 text-xs font-medium text-muted-foreground'>
                <FireIcon size={14} />
                {t('learn.metrics.streak')}
              </div>
              <p className='mt-2 text-2xl font-semibold tabular-nums'>{data.streak.current}</p>
            </div>
            <div className='rounded-2xl bg-background/85 p-4 shadow-xs ring-1 ring-foreground/8'>
              <div className='flex items-center gap-2 text-xs font-medium text-muted-foreground'>
                <SparkleIcon size={14} />
                {t('learn.metrics.completed')}
              </div>
              <p className='mt-2 text-2xl font-semibold tabular-nums'>
                {data.completedLessons}/{data.totalLessons}
              </p>
            </div>
            <div className='rounded-2xl bg-background/85 p-4 shadow-xs ring-1 ring-foreground/8'>
              <div className='flex items-center gap-2 text-xs font-medium text-muted-foreground'>
                <MedalIcon size={14} />
                {t('learn.metrics.mastered')}
              </div>
              <p className='mt-2 text-2xl font-semibold tabular-nums'>{data.masteredLessons}</p>
            </div>
          </div>

          <div className='flex flex-col gap-2 sm:flex-row'>
            <Link
              href={continueLesson ? `/learn/${continueLesson.id}` : '/learn'}
              className={cn(buttonVariants({ className: 'sm:flex sm:flex-1' }))}
            >
              {continueLesson ? t('learn.home.continue-lesson') : t('learn.home.start')}
            </Link>
            <Link
              href='#learn-path'
              className={cn(buttonVariants({ variant: 'outline', className: 'sm:flex sm:flex-1' }))}
            >
              {t('learn.home.jump-to-path')}
            </Link>
          </div>
        </CardContent>
      </Card>

      <section id='learn-path' className='space-y-4'>
        <div className='space-y-1'>
          <h2 className='text-base font-semibold tracking-tight'>{t('learn.path.title')}</h2>
          <p className='text-sm text-muted-foreground'>{t('learn.path.subtitle')}</p>
        </div>

        <div className='space-y-4'>
          {data.units.map((unit) => (
            <Card key={unit.id} size='sm'>
              <CardHeader>
                <CardTitle>{t(unit.titleKey)}</CardTitle>
                <CardDescription>{t(unit.descriptionKey)}</CardDescription>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                  <span>
                    {t('learn.path.unit-progress', { completed: unit.completedCount, total: unit.lessonCount })}
                  </span>
                  <span>&middot;</span>
                  <span>{t('learn.path.mastered-count', { count: unit.masteredCount })}</span>
                </div>
                <div className='grid gap-3'>
                  {unit.lessons.map((lesson) => {
                    const href = lesson.status === 'locked' ? '/learn' : `/learn/${lesson.id}`

                    return (
                      <Link
                        key={lesson.id}
                        href={href}
                        data-testid={`lesson-node-${lesson.id}`}
                        data-status={lesson.status}
                        className={cn(
                          'rounded-2xl border p-4 transition-colors',
                          getLessonStatusClasses(lesson.status),
                        )}
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <div className='space-y-1'>
                            <div className='flex items-center gap-2'>
                              <p className='font-medium'>{t(lesson.titleKey)}</p>
                              <span className='rounded-full bg-background/80 px-2 py-0.5 text-[11px] font-medium ring-1 ring-current/10'>
                                {t(`learn.status.${lesson.status}` as TranslationKey)}
                              </span>
                            </div>
                            <p className='text-sm text-current/80'>{t(lesson.descriptionKey)}</p>
                          </div>
                          {lesson.status === 'locked' ? <LockIcon size={18} className='shrink-0' /> : null}
                        </div>
                        <div className='mt-3 flex items-center gap-2 text-xs text-current/75'>
                          <span>{t('learn.path.score', { score: lesson.bestScore, total: lesson.questionCount })}</span>
                          <span>&middot;</span>
                          <span>{t('learn.path.attempts', { count: lesson.attemptCount })}</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className='space-y-4'>
        <div className='space-y-1'>
          <h2 className='text-base font-semibold tracking-tight'>{t('learn.review.title')}</h2>
          <p className='text-sm text-muted-foreground'>{t('learn.review.subtitle')}</p>
        </div>

        {reviewLessons.length === 0 ? (
          <Card size='sm'>
            <CardContent>
              <p className='text-sm text-muted-foreground'>{t('learn.review.empty')}</p>
            </CardContent>
          </Card>
        ) : (
          <div className='grid gap-3'>
            {reviewLessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/learn/${lesson.id}`}
                className='rounded-2xl border border-orange-200/80 bg-orange-50/80 p-4 transition-colors hover:bg-orange-100/70 dark:border-orange-900/50 dark:bg-orange-950/30 dark:hover:bg-orange-950/50'
              >
                <div className='flex items-center justify-between gap-3'>
                  <div>
                    <p className='font-medium text-orange-900 dark:text-orange-100'>{t(lesson.titleKey)}</p>
                    <p className='text-sm text-orange-800/80 dark:text-orange-200/80'>
                      {t('learn.review.lesson-ready')}
                    </p>
                  </div>
                  <span className='rounded-full bg-background/80 px-2 py-0.5 text-xs font-medium text-orange-700 ring-1 ring-orange-200 dark:bg-background/20 dark:text-orange-100 dark:ring-orange-800'>
                    {t('learn.status.completed')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
