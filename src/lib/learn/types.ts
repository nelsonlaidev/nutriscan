import type { TranslationKey } from '@/types'

export const LEARN_UNIT_IDS = ['calories_portions', 'macro_basics', 'balanced_meals_labels'] as const

export type LearnUnitId = (typeof LEARN_UNIT_IDS)[number]

export const LEARN_LESSON_IDS = [
  'calories_portions_1',
  'calories_portions_2',
  'calories_portions_3',
  'calories_portions_4',
  'macro_basics_1',
  'macro_basics_2',
  'macro_basics_3',
  'macro_basics_4',
  'balanced_meals_labels_1',
  'balanced_meals_labels_2',
  'balanced_meals_labels_3',
  'balanced_meals_labels_4',
] as const

export type LearnLessonId = (typeof LEARN_LESSON_IDS)[number]

export type LearnQuestionId = `${LearnLessonId}_q${number}`

export const LEARN_QUESTION_TYPES = ['single-choice', 'multi-select'] as const

export type LearnQuestionType = (typeof LEARN_QUESTION_TYPES)[number]

export const LEARN_LESSON_STATUSES = ['locked', 'available', 'completed', 'mastered'] as const

export type LearnLessonStatus = (typeof LEARN_LESSON_STATUSES)[number]

export const LEARN_PROGRESS_STATUSES = ['available', 'completed', 'mastered'] as const

export type PersistedLearnLessonStatus = (typeof LEARN_PROGRESS_STATUSES)[number]

export const LEARN_QUESTIONS_PER_LESSON = 5
export const LEARN_HEARTS_PER_RUN = 3
export const LEARN_PASSING_SCORE = 4
export const LEARN_PASS_XP = 10
export const LEARN_FIRST_PERFECT_BONUS_XP = 5

export type LearnChoiceDefinition = {
  id: string
  textKey: TranslationKey
}

export type LearnQuestionDefinition = {
  id: LearnQuestionId
  type: LearnQuestionType
  promptKey: TranslationKey
  explanationKey: TranslationKey
  choices: readonly LearnChoiceDefinition[]
  correctChoiceIds: readonly string[]
}

export type LearnLessonDefinition = {
  id: LearnLessonId
  unitId: LearnUnitId
  order: number
  titleKey: TranslationKey
  descriptionKey: TranslationKey
  questions: readonly LearnQuestionDefinition[]
}

export type LearnUnitDefinition = {
  id: LearnUnitId
  titleKey: TranslationKey
  descriptionKey: TranslationKey
  lessons: readonly LearnLessonDefinition[]
}

export type LearnAnswerInput = {
  questionId: LearnQuestionId
  choiceIds: string[]
}

export type LearnQuestionResult = {
  questionId: LearnQuestionId
  correct: boolean
  selectedChoiceIds: string[]
  correctChoiceIds: string[]
  heartsRemaining: number
}
