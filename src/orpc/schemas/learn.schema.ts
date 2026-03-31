import type { TranslationKey } from '@/types'

import * as z from 'zod'

import {
  LEARN_HEARTS_PER_RUN,
  LEARN_LESSON_IDS,
  LEARN_LESSON_STATUSES,
  LEARN_QUESTION_TYPES,
  LEARN_QUESTIONS_PER_LESSON,
  LEARN_UNIT_IDS,
} from '@/lib/learn/types'

const LearnUnitIdSchema = z.enum(LEARN_UNIT_IDS)
const LearnLessonIdSchema = z.enum(LEARN_LESSON_IDS)
const LearnLessonStatusSchema = z.enum(LEARN_LESSON_STATUSES)
const LearnQuestionTypeSchema = z.enum(LEARN_QUESTION_TYPES)
const TranslationKeySchema = z.custom<TranslationKey>((value) => typeof value === 'string' && value.length > 0)

const LearnChoiceSchema = z.object({
  id: z.string().min(1),
  textKey: TranslationKeySchema,
})

const LearnQuestionSchema = z.object({
  id: z.string().min(1),
  type: LearnQuestionTypeSchema,
  promptKey: TranslationKeySchema,
  explanationKey: TranslationKeySchema,
  correctChoiceCount: z.number().int().positive(),
  choices: z.array(LearnChoiceSchema).min(2),
})

const LearnLessonSummarySchema = z.object({
  id: LearnLessonIdSchema,
  unitId: LearnUnitIdSchema,
  order: z.number().int().positive(),
  titleKey: TranslationKeySchema,
  descriptionKey: TranslationKeySchema,
  status: LearnLessonStatusSchema,
  bestScore: z.number().int().nonnegative(),
  lastScore: z.number().int().nonnegative(),
  attemptCount: z.number().int().nonnegative(),
  questionCount: z.number().int().positive(),
})

const LearnStreakSchema = z.object({
  current: z.number().int().nonnegative(),
  best: z.number().int().nonnegative(),
})

export const LearnOverviewSchema = z.object({
  totalXp: z.number().int().nonnegative(),
  totalLessons: z.number().int().positive(),
  completedLessons: z.number().int().nonnegative(),
  masteredLessons: z.number().int().nonnegative(),
  streak: LearnStreakSchema,
  nextLessonId: LearnLessonIdSchema.nullable(),
  units: z.array(
    z.object({
      id: LearnUnitIdSchema,
      titleKey: TranslationKeySchema,
      descriptionKey: TranslationKeySchema,
      lessonCount: z.number().int().positive(),
      completedCount: z.number().int().nonnegative(),
      masteredCount: z.number().int().nonnegative(),
      lessons: z.array(LearnLessonSummarySchema),
    }),
  ),
})

export const GetLearnLessonInputSchema = z.object({
  lessonId: LearnLessonIdSchema,
})

export const LearnLessonSchema = LearnLessonSummarySchema.extend({
  hearts: z.literal(LEARN_HEARTS_PER_RUN),
  questions: z.array(LearnQuestionSchema).length(LEARN_QUESTIONS_PER_LESSON),
})

export const CheckLearnAnswerInputSchema = z.object({
  lessonId: LearnLessonIdSchema,
  questionId: z.string().min(1),
  choiceIds: z.array(z.string().min(1)).min(1),
})

export const CheckLearnAnswerResultSchema = z.object({
  correct: z.boolean(),
})

export const SubmitLearnAttemptInputSchema = z.object({
  lessonId: LearnLessonIdSchema,
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        choiceIds: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1)
    .max(LEARN_QUESTIONS_PER_LESSON),
})

export const SubmitLearnAttemptResultSchema = z.object({
  score: z.number().int().nonnegative(),
  totalQuestions: z.number().int().positive(),
  heartsRemaining: z.number().int().nonnegative(),
  passed: z.boolean(),
  perfect: z.boolean(),
  xpEarned: z.number().int().nonnegative(),
  status: z.enum(['available', 'completed', 'mastered']),
  newlyUnlockedLessonIds: z.array(LearnLessonIdSchema),
  nextLessonId: LearnLessonIdSchema.nullable(),
})
