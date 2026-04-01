import type { InferSelectModel } from 'drizzle-orm'
import type { db } from '@/db'
import type { LearnAnswerInput } from '@/lib/learn/types'

import { ORPCError } from '@orpc/server'
import { and, eq } from 'drizzle-orm'

import { learnAttempts, learnProgress } from '@/db/schemas'
import {
  getLearnLesson,
  getLearnStatusMap,
  getNextAvailableLearnLessonId,
  getUnlockedLearnLessonIds,
  isLearnLessonUnlocked,
  LEARN_CATALOG,
  LEARN_FLAT_LESSONS,
} from '@/lib/learn/catalog'
import { calculateLearningStreak, evaluateLearnLessonAttempt, evaluateLearnQuestionAnswer } from '@/lib/learn/evaluator'
import { LEARN_HEARTS_PER_RUN } from '@/lib/learn/types'

import { protectedProcedure } from '../procedures'
import {
  CheckLearnAnswerInputSchema,
  CheckLearnAnswerResultSchema,
  GetLearnLessonInputSchema,
  LearnLessonSchema,
  LearnOverviewSchema,
  SubmitLearnAttemptInputSchema,
  SubmitLearnAttemptResultSchema,
} from '../schemas/learn.schema'

type LearnProgressRow = InferSelectModel<typeof learnProgress>
type LearnAttemptRow = Pick<InferSelectModel<typeof learnAttempts>, 'completedAt' | 'passed' | 'xpEarned'>

function buildLearnOverview(progressRows: LearnProgressRow[], attemptRows: LearnAttemptRow[]) {
  const progressMap = new Map(progressRows.map((row) => [row.lessonId, row]))
  const statusMap = getLearnStatusMap(progressRows)
  const passedAttemptDates = attemptRows.filter((row) => row.passed).map((row) => row.completedAt)
  const streak = calculateLearningStreak(passedAttemptDates)
  const totalXp = attemptRows.reduce((sum, row) => sum + row.xpEarned, 0)

  let completedLessons = 0
  let masteredLessons = 0

  const units = LEARN_CATALOG.map((unit) => {
    const lessons = unit.lessons.map((lesson) => {
      const progress = progressMap.get(lesson.id)
      const status = statusMap.get(lesson.id) ?? 'locked'

      if (status === 'completed' || status === 'mastered') {
        completedLessons += 1
      }

      if (status === 'mastered') {
        masteredLessons += 1
      }

      return {
        id: lesson.id,
        unitId: lesson.unitId,
        order: lesson.order,
        titleKey: lesson.titleKey,
        descriptionKey: lesson.descriptionKey,
        status,
        bestScore: progress?.bestScore ?? 0,
        lastScore: progress?.lastScore ?? 0,
        attemptCount: progress?.attemptCount ?? 0,
        questionCount: lesson.questions.length,
      }
    })

    return {
      id: unit.id,
      titleKey: unit.titleKey,
      descriptionKey: unit.descriptionKey,
      lessonCount: unit.lessons.length,
      completedCount: lessons.filter((lesson) => lesson.status === 'completed' || lesson.status === 'mastered').length,
      masteredCount: lessons.filter((lesson) => lesson.status === 'mastered').length,
      lessons,
    }
  })

  return {
    totalXp,
    totalLessons: LEARN_FLAT_LESSONS.length,
    completedLessons,
    masteredLessons,
    streak,
    nextLessonId: getNextAvailableLearnLessonId(progressRows),
    units,
  }
}

async function getLearnRows(database: typeof db, userId: string) {
  return Promise.all([getLearnProgressRows(database, userId), getLearnAttemptRows(database, userId)])
}

async function getLearnProgressRows(database: typeof db, userId: string) {
  return database.select().from(learnProgress).where(eq(learnProgress.userId, userId))
}

async function getLearnAttemptRows(database: typeof db, userId: string) {
  return database
    .select({
      completedAt: learnAttempts.completedAt,
      passed: learnAttempts.passed,
      xpEarned: learnAttempts.xpEarned,
    })
    .from(learnAttempts)
    .where(eq(learnAttempts.userId, userId))
}

const overview = protectedProcedure.output(LearnOverviewSchema).handler(async ({ context }) => {
  const [progressRows, attemptRows] = await getLearnRows(context.db, context.session.user.id)
  return buildLearnOverview(progressRows, attemptRows)
})

const getLesson = protectedProcedure
  .input(GetLearnLessonInputSchema)
  .output(LearnLessonSchema)
  .handler(async ({ input, context }) => {
    const progressRows = await getLearnProgressRows(context.db, context.session.user.id)

    if (!isLearnLessonUnlocked(input.lessonId, progressRows)) {
      throw new ORPCError('FORBIDDEN')
    }

    const lesson = getLearnLesson(input.lessonId)
    const progress = progressRows.find((row) => row.lessonId === input.lessonId)
    const status = getLearnStatusMap(progressRows).get(input.lessonId) ?? 'locked'

    return {
      id: lesson.id,
      unitId: lesson.unitId,
      order: lesson.order,
      titleKey: lesson.titleKey,
      descriptionKey: lesson.descriptionKey,
      status,
      bestScore: progress?.bestScore ?? 0,
      lastScore: progress?.lastScore ?? 0,
      attemptCount: progress?.attemptCount ?? 0,
      questionCount: lesson.questions.length,
      hearts: LEARN_HEARTS_PER_RUN,
      questions: lesson.questions.map((question) => ({
        id: question.id,
        type: question.type,
        promptKey: question.promptKey,
        explanationKey: question.explanationKey,
        correctChoiceCount: question.correctChoiceIds.length,
        choices: question.choices.map((choice) => ({
          id: choice.id,
          textKey: choice.textKey,
        })),
      })),
    }
  })

const checkAnswer = protectedProcedure
  .input(CheckLearnAnswerInputSchema)
  .output(CheckLearnAnswerResultSchema)
  .handler(async ({ input, context }) => {
    const progressRows = await getLearnProgressRows(context.db, context.session.user.id)

    if (!isLearnLessonUnlocked(input.lessonId, progressRows)) {
      throw new ORPCError('FORBIDDEN')
    }

    const lesson = getLearnLesson(input.lessonId)

    try {
      const currentQuestion = lesson.questions.find((question) => question.id === input.questionId)

      if (!currentQuestion) {
        throw new Error('Invalid lesson question')
      }

      const { correct } = evaluateLearnQuestionAnswer(currentQuestion, input.choiceIds)

      return {
        correct,
      }
    } catch (error) {
      throw new ORPCError('BAD_REQUEST', {
        message: error instanceof Error ? error.message : 'Invalid lesson answer',
      })
    }
  })

const submitAttempt = protectedProcedure
  .input(SubmitLearnAttemptInputSchema)
  .output(SubmitLearnAttemptResultSchema)
  .handler(async ({ input, context }) =>
    context.db.transaction(async (tx) => {
      const lesson = getLearnLesson(input.lessonId)
      const progressRows = await tx
        .select()
        .from(learnProgress)
        .where(eq(learnProgress.userId, context.session.user.id))

      if (!isLearnLessonUnlocked(input.lessonId, progressRows)) {
        throw new ORPCError('FORBIDDEN')
      }

      const currentProgress = progressRows.find((row) => row.lessonId === input.lessonId)

      let evaluation: ReturnType<typeof evaluateLearnLessonAttempt>

      try {
        evaluation = evaluateLearnLessonAttempt({
          lesson,
          answers: input.answers as LearnAnswerInput[],
          previousStatus: currentProgress?.status ?? null,
        })
      } catch (error) {
        throw new ORPCError('BAD_REQUEST', {
          message: error instanceof Error ? error.message : 'Invalid lesson submission',
        })
      }

      const beforeUnlockedSet = new Set(getUnlockedLearnLessonIds(progressRows))
      const now = new Date()

      await tx.insert(learnAttempts).values({
        userId: context.session.user.id,
        lessonId: input.lessonId,
        score: evaluation.score,
        passed: evaluation.passed,
        xpEarned: evaluation.xpEarned,
        completedAt: now,
      })

      const nextProgressRow = {
        userId: context.session.user.id,
        lessonId: input.lessonId,
        status: evaluation.status,
        bestScore: Math.max(currentProgress?.bestScore ?? 0, evaluation.score),
        lastScore: evaluation.score,
        attemptCount: (currentProgress?.attemptCount ?? 0) + 1,
        firstPassedAt: currentProgress?.firstPassedAt ?? (evaluation.passed ? now : null),
        lastAttemptedAt: now,
      } satisfies LearnProgressRow

      await (currentProgress
        ? tx
            .update(learnProgress)
            .set({
              status: nextProgressRow.status,
              bestScore: nextProgressRow.bestScore,
              lastScore: nextProgressRow.lastScore,
              attemptCount: nextProgressRow.attemptCount,
              firstPassedAt: nextProgressRow.firstPassedAt,
              lastAttemptedAt: nextProgressRow.lastAttemptedAt,
            })
            .where(and(eq(learnProgress.userId, context.session.user.id), eq(learnProgress.lessonId, input.lessonId)))
        : tx.insert(learnProgress).values(nextProgressRow))

      const nextProgressRows = [...progressRows.filter((row) => row.lessonId !== input.lessonId), nextProgressRow]

      const afterUnlockedSet = new Set(getUnlockedLearnLessonIds(nextProgressRows))
      const newlyUnlockedLessonIds = [...afterUnlockedSet].filter(
        (lessonId) => !beforeUnlockedSet.has(lessonId) && lessonId !== input.lessonId,
      )

      return {
        score: evaluation.score,
        totalQuestions: evaluation.totalQuestions,
        heartsRemaining: evaluation.heartsRemaining,
        passed: evaluation.passed,
        perfect: evaluation.perfect,
        xpEarned: evaluation.xpEarned,
        status: evaluation.status,
        newlyUnlockedLessonIds,
        nextLessonId: getNextAvailableLearnLessonId(nextProgressRows),
      }
    }),
  )

export const learnRouter = {
  overview,
  getLesson,
  checkAnswer,
  submitAttempt,
}
