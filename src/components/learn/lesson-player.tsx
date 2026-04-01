'use client'

import type { ReactNode } from 'react'
import type { LearnAnswerInput } from '@/lib/learn/types'
import type { GetLearnLessonInput, SubmitLearnAttemptOutput } from '@/orpc/client'

import { CheckCircleIcon, HeartIcon, LightningIcon, TrophyIcon, XCircleIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { BackButton } from '@/components/back-button'
import { useCheckLearnAnswer, useLearnLesson, useSubmitLearnAttempt } from '@/hooks/queries/learn.query'
import { cn } from '@/lib/utils'

import { Button, buttonVariants } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import { Spinner } from '../ui/spinner'

type LessonPlayerProps = {
  lessonId: GetLearnLessonInput['lessonId']
}

type FeedbackState = {
  correct: boolean
  heartsRemaining: number
  completed: boolean
  selectedChoiceIds: string[]
}

function getChoiceClassName(input: {
  isSelected: boolean
  isCorrect: boolean | null
  isWrongSelection: boolean | null
  feedbackVisible: boolean
}) {
  const { isSelected, isCorrect, isWrongSelection, feedbackVisible } = input

  return cn(
    'min-h-14 rounded-2xl border p-4 text-left text-sm font-medium transition-all',
    isSelected &&
      'border-orange-300 bg-orange-50 text-orange-900 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-100',
    !isSelected &&
      !feedbackVisible &&
      'border-border bg-card hover:border-orange-300 hover:bg-orange-50/40 dark:hover:border-orange-800 dark:hover:bg-orange-950/20',
    feedbackVisible && 'cursor-default',
    isCorrect &&
      'border-green-300 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950/40 dark:text-green-100',
    isWrongSelection &&
      'border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-100',
  )
}

type LessonResultScreenProps = {
  lessonId: GetLearnLessonInput['lessonId']
  result: SubmitLearnAttemptOutput
}

function LessonResultScreen(props: LessonResultScreenProps) {
  const { lessonId, result } = props
  const t = useTranslations()
  const nextHref =
    result.nextLessonId && result.nextLessonId !== lessonId ? `/learn/${result.nextLessonId}` : `/learn/${lessonId}`

  return (
    <div className='space-y-6 px-4 py-6' data-testid='learn-result'>
      <div className='flex items-center justify-between gap-3'>
        <BackButton />
        <span className='rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground'>
          {t(`learn.status.${result.status}`)}
        </span>
      </div>

      <Card className='overflow-hidden border-amber-200/70 bg-linear-to-br from-amber-500/15 via-background to-orange-500/12 dark:border-amber-900/50'>
        <CardContent className='space-y-6 pt-6'>
          <div className='space-y-2 text-center'>
            <p className='text-sm font-medium tracking-[0.14em] text-amber-700 uppercase dark:text-amber-300'>
              {result.passed ? t('learn.result.passed-badge') : t('learn.result.retry-badge')}
            </p>
            <h1 className='text-3xl font-semibold tracking-tight'>
              {result.passed ? t('learn.result.title-pass') : t('learn.result.title-fail')}
            </h1>
            <p className='text-sm text-muted-foreground'>{t('learn.result.subtitle')}</p>
          </div>

          <div className='grid grid-cols-3 gap-3'>
            <div className='rounded-2xl bg-background/85 p-4 shadow-xs ring-1 ring-foreground/8'>
              <div className='flex items-center gap-2 text-xs font-medium text-muted-foreground'>
                <TrophyIcon size={14} />
                {t('learn.metrics.score')}
              </div>
              <p className='mt-2 text-2xl font-semibold tabular-nums'>
                {result.score}/{result.totalQuestions}
              </p>
            </div>
            <div className='rounded-2xl bg-background/85 p-4 shadow-xs ring-1 ring-foreground/8'>
              <div className='flex items-center gap-2 text-xs font-medium text-muted-foreground'>
                <LightningIcon size={14} />
                {t('learn.metrics.xp')}
              </div>
              <p className='mt-2 text-2xl font-semibold tabular-nums'>+{result.xpEarned}</p>
            </div>
            <div className='rounded-2xl bg-background/85 p-4 shadow-xs ring-1 ring-foreground/8'>
              <div className='flex items-center gap-2 text-xs font-medium text-muted-foreground'>
                <HeartIcon size={14} />
                {t('learn.metrics.hearts-left')}
              </div>
              <p className='mt-2 text-2xl font-semibold tabular-nums'>{result.heartsRemaining}</p>
            </div>
          </div>

          {result.newlyUnlockedLessonIds.length > 0 ? (
            <div className='rounded-2xl border border-amber-200/70 bg-amber-50/80 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100'>
              {t('learn.result.unlocked-lessons', { count: result.newlyUnlockedLessonIds.length })}
            </div>
          ) : null}

          <div className='flex flex-col gap-2'>
            <Link href={nextHref} className={cn(buttonVariants())}>
              {result.nextLessonId && result.nextLessonId !== lessonId
                ? t('learn.result.next-lesson')
                : t('learn.result.retry-lesson')}
            </Link>
            <Link href='/learn' className={cn(buttonVariants({ variant: 'outline' }))}>
              {t('learn.result.back-to-path')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function LessonPlayer(props: LessonPlayerProps) {
  const { lessonId } = props
  const t = useTranslations()
  const { data: lesson } = useLearnLesson({ lessonId })
  const checkAnswer = useCheckLearnAnswer()
  const submitAttempt = useSubmitLearnAttempt()
  const answersRef = useRef<LearnAnswerInput[]>([])

  const [questionIndex, setQuestionIndex] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
  const [heartsRemaining, setHeartsRemaining] = useState<number>(lesson.hearts)
  const [selectedChoiceIds, setSelectedChoiceIds] = useState<string[]>([])
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)
  const [result, setResult] = useState<SubmitLearnAttemptOutput | null>(null)

  const currentQuestion = lesson.questions[questionIndex]
  const isSubmitting = checkAnswer.isPending || submitAttempt.isPending

  function toggleChoice(choiceId: string) {
    if (feedback || !currentQuestion) return

    if (currentQuestion.type === 'single-choice') {
      setSelectedChoiceIds([choiceId])
      return
    }

    setSelectedChoiceIds((previous) =>
      previous.includes(choiceId) ? previous.filter((value) => value !== choiceId) : [...previous, choiceId],
    )
  }

  async function handleCheck() {
    if (!currentQuestion || selectedChoiceIds.length === 0 || feedback) return

    try {
      const nextFeedback = await checkAnswer.mutateAsync({
        lessonId: lesson.id,
        questionId: currentQuestion.id,
        choiceIds: selectedChoiceIds,
      })

      const nextHeartsRemaining = nextFeedback.correct ? heartsRemaining : Math.max(heartsRemaining - 1, 0)
      const nextAnswers = [
        ...answersRef.current,
        {
          questionId: currentQuestion.id as LearnAnswerInput['questionId'],
          choiceIds: selectedChoiceIds,
        },
      ]

      answersRef.current = nextAnswers
      setHeartsRemaining(nextHeartsRemaining)
      setFeedback({
        correct: nextFeedback.correct,
        heartsRemaining: nextHeartsRemaining,
        completed: nextHeartsRemaining === 0 || questionIndex === lesson.questions.length - 1,
        selectedChoiceIds,
      })
    } catch {
      toast.error(t('learn.lesson.submit-error'))
    }
  }

  async function finishLesson() {
    try {
      const nextResult = await submitAttempt.mutateAsync({
        lessonId: lesson.id,
        answers: answersRef.current,
      })

      setResult(nextResult)
    } catch {
      toast.error(t('learn.lesson.submit-error'))
    }
  }

  async function handleContinue() {
    if (!currentQuestion || !feedback) return

    const isLastQuestion = questionIndex === lesson.questions.length - 1
    const shouldFinish = isLastQuestion || feedback.completed

    if (shouldFinish) {
      await finishLesson()
      return
    }

    setQuestionIndex((previous) => previous + 1)
    setSelectedChoiceIds([])
    setFeedback(null)
  }

  if (result) {
    return <LessonResultScreen lessonId={lesson.id} result={result} />
  }

  if (!currentQuestion) {
    return null
  }

  const progressValue = ((questionIndex + (feedback ? 1 : 0)) / lesson.questions.length) * 100

  return (
    <div
      className='min-h-full bg-linear-to-b from-amber-500/8 via-background to-background p-4'
      data-testid='learn-lesson-player'
    >
      <div className='sticky top-0 z-10 -mx-4 mb-4 border-b bg-background/95 p-4 backdrop-blur-sm supports-backdrop-filter:bg-background/80'>
        <div className='flex items-center gap-3'>
          <BackButton />
          <div className='min-w-0 flex-1 space-y-2'>
            <div className='flex items-center justify-between gap-3'>
              <p className='truncate text-sm font-medium'>{t(lesson.titleKey)}</p>
              <div className='flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-200'>
                <HeartIcon size={16} weight='fill' />
                <span className='tabular-nums'>{heartsRemaining}</span>
              </div>
            </div>
            <Progress
              value={progressValue}
              className='**:data-[slot=progress-indicator]:bg-amber-500 *:data-[slot=progress-track]:h-2'
            />
          </div>
        </div>
      </div>

      <div className='space-y-6 pb-24'>
        <div className='space-y-1'>
          <p className='text-sm font-medium text-orange-700 dark:text-orange-300'>
            {t('learn.lesson.question-step', { current: questionIndex + 1, total: lesson.questions.length })}
          </p>
          <h1 className='text-2xl font-semibold tracking-tight'>{t(currentQuestion.promptKey)}</h1>
          <p className='text-sm text-muted-foreground'>
            {currentQuestion.type === 'multi-select'
              ? t('learn.lesson.select-many', { count: currentQuestion.correctChoiceCount })
              : t('learn.lesson.select-one')}
          </p>
        </div>

        <div className='grid gap-3'>
          {currentQuestion.choices.map((choice) => {
            const isSelected = selectedChoiceIds.includes(choice.id)
            const isCorrect = feedback?.correct && feedback.selectedChoiceIds.includes(choice.id)
            const isWrongSelection = feedback && !feedback.correct && feedback.selectedChoiceIds.includes(choice.id)
            let feedbackIcon: ReactNode = null

            if (isCorrect) {
              feedbackIcon = (
                <CheckCircleIcon size={20} weight='fill' className='shrink-0 text-green-600 dark:text-green-300' />
              )
            } else if (isWrongSelection) {
              feedbackIcon = <XCircleIcon size={20} weight='fill' className='shrink-0 text-red-600 dark:text-red-300' />
            }

            return (
              <button
                key={choice.id}
                type='button'
                onClick={() => {
                  toggleChoice(choice.id)
                }}
                aria-pressed={isSelected}
                disabled={Boolean(feedback)}
                className={getChoiceClassName({
                  isSelected,
                  isCorrect: Boolean(isCorrect),
                  isWrongSelection: Boolean(isWrongSelection),
                  feedbackVisible: Boolean(feedback),
                })}
              >
                <span className='flex items-start justify-between gap-3'>
                  <span className='block'>{t(choice.textKey)}</span>
                  {feedbackIcon}
                </span>
              </button>
            )
          })}
        </div>

        {feedback ? (
          <Card
            size='sm'
            className={cn(
              feedback.correct
                ? 'border-green-200/80 bg-green-50/80 dark:border-green-900/50 dark:bg-green-950/30'
                : 'border-red-200/80 bg-red-50/80 dark:border-red-900/50 dark:bg-red-950/30',
            )}
          >
            <CardHeader>
              <CardTitle
                className={cn(
                  'flex items-center gap-2',
                  feedback.correct ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100',
                )}
              >
                {feedback.correct ? (
                  <CheckCircleIcon size={22} weight='fill' className='text-green-600 dark:text-green-300' />
                ) : (
                  <XCircleIcon size={22} weight='fill' className='text-red-600 dark:text-red-300' />
                )}
                <span>{feedback.correct ? t('learn.lesson.correct') : t('learn.lesson.incorrect')}</span>
              </CardTitle>
              <CardDescription>{t(currentQuestion.explanationKey)}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* eslint-disable-next-line no-void */}
              <Button onClick={() => void handleContinue()} className='w-full' disabled={isSubmitting}>
                {questionIndex === lesson.questions.length - 1 || feedback.completed
                  ? t('learn.lesson.finish')
                  : t('learn.lesson.continue')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Button onClick={handleCheck} className='w-full' disabled={selectedChoiceIds.length === 0 || isSubmitting}>
            {t('learn.lesson.check')}
          </Button>
        )}

        {isSubmitting ? (
          <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
            <Spinner />
            {t('learn.lesson.submitting')}
          </div>
        ) : null}
      </div>
    </div>
  )
}
