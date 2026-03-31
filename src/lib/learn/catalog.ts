import type {
  LearnChoiceDefinition,
  LearnLessonDefinition,
  LearnLessonId,
  LearnLessonStatus,
  LearnQuestionDefinition,
  LearnUnitDefinition,
  LearnUnitId,
  PersistedLearnLessonStatus,
} from './types'

import { LEARN_LESSON_IDS, LEARN_QUESTIONS_PER_LESSON } from './types'

function createQuestion(
  lessonId: LearnLessonId,
  order: number,
  type: LearnQuestionDefinition['type'],
  choices: readonly string[],
  correctChoiceIds: readonly string[],
): LearnQuestionDefinition {
  return {
    id: `${lessonId}_q${order}`,
    type,
    promptKey: `learn.lessons.${lessonId}.questions.q${order}.prompt` as LearnQuestionDefinition['promptKey'],
    explanationKey:
      `learn.lessons.${lessonId}.questions.q${order}.explanation` as LearnQuestionDefinition['explanationKey'],
    choices: choices.map((choiceId) => ({
      id: choiceId,
      textKey: `learn.lessons.${lessonId}.questions.q${order}.choices.${choiceId}` as LearnChoiceDefinition['textKey'],
    })),
    correctChoiceIds,
  }
}

function createLesson(
  unitId: LearnUnitId,
  id: LearnLessonId,
  order: number,
  questions: readonly LearnQuestionDefinition[],
): LearnLessonDefinition {
  return {
    id,
    unitId,
    order,
    titleKey: `learn.lessons.${id}.title` as LearnLessonDefinition['titleKey'],
    descriptionKey: `learn.lessons.${id}.description` as LearnLessonDefinition['descriptionKey'],
    questions,
  }
}

export const LEARN_CATALOG = [
  {
    id: 'calories_portions',
    titleKey: 'learn.units.calories_portions.title',
    descriptionKey: 'learn.units.calories_portions.description',
    lessons: [
      createLesson('calories_portions', 'calories_portions_1', 1, [
        createQuestion('calories_portions_1', 1, 'single-choice', ['a', 'b', 'c', 'd'], ['b']),
        createQuestion('calories_portions_1', 2, 'single-choice', ['a', 'b', 'c', 'd'], ['c']),
        createQuestion('calories_portions_1', 3, 'multi-select', ['a', 'b', 'c', 'd'], ['a', 'd']),
        createQuestion('calories_portions_1', 4, 'single-choice', ['a', 'b', 'c', 'd'], ['a']),
        createQuestion('calories_portions_1', 5, 'single-choice', ['a', 'b', 'c', 'd'], ['d']),
      ]),
      createLesson('calories_portions', 'calories_portions_2', 2, [
        createQuestion('calories_portions_2', 1, 'single-choice', ['a', 'b', 'c', 'd'], ['b']),
        createQuestion('calories_portions_2', 2, 'single-choice', ['a', 'b', 'c', 'd'], ['a']),
        createQuestion('calories_portions_2', 3, 'multi-select', ['a', 'b', 'c', 'd'], ['b', 'c']),
        createQuestion('calories_portions_2', 4, 'single-choice', ['a', 'b', 'c', 'd'], ['d']),
        createQuestion('calories_portions_2', 5, 'single-choice', ['a', 'b', 'c', 'd'], ['c']),
      ]),
      createLesson('calories_portions', 'calories_portions_3', 3, [
        createQuestion('calories_portions_3', 1, 'single-choice', ['a', 'b', 'c', 'd'], ['a']),
        createQuestion('calories_portions_3', 2, 'single-choice', ['a', 'b', 'c', 'd'], ['c']),
        createQuestion('calories_portions_3', 3, 'multi-select', ['a', 'b', 'c', 'd'], ['a', 'c']),
        createQuestion('calories_portions_3', 4, 'single-choice', ['a', 'b', 'c', 'd'], ['d']),
        createQuestion('calories_portions_3', 5, 'single-choice', ['a', 'b', 'c', 'd'], ['b']),
      ]),
      createLesson('calories_portions', 'calories_portions_4', 4, [
        createQuestion('calories_portions_4', 1, 'single-choice', ['a', 'b', 'c', 'd'], ['d']),
        createQuestion('calories_portions_4', 2, 'single-choice', ['a', 'b', 'c', 'd'], ['b']),
        createQuestion('calories_portions_4', 3, 'multi-select', ['a', 'b', 'c', 'd'], ['a', 'd']),
        createQuestion('calories_portions_4', 4, 'single-choice', ['a', 'b', 'c', 'd'], ['c']),
        createQuestion('calories_portions_4', 5, 'single-choice', ['a', 'b', 'c', 'd'], ['a']),
      ]),
    ],
  },
  {
    id: 'macro_basics',
    titleKey: 'learn.units.macro_basics.title',
    descriptionKey: 'learn.units.macro_basics.description',
    lessons: [
      createLesson('macro_basics', 'macro_basics_1', 5, [
        createQuestion('macro_basics_1', 1, 'single-choice', ['a', 'b', 'c', 'd'], ['c']),
        createQuestion('macro_basics_1', 2, 'single-choice', ['a', 'b', 'c', 'd'], ['b']),
        createQuestion('macro_basics_1', 3, 'multi-select', ['a', 'b', 'c', 'd'], ['a', 'd']),
        createQuestion('macro_basics_1', 4, 'single-choice', ['a', 'b', 'c', 'd'], ['a']),
        createQuestion('macro_basics_1', 5, 'single-choice', ['a', 'b', 'c', 'd'], ['d']),
      ]),
      createLesson('macro_basics', 'macro_basics_2', 6, [
        createQuestion('macro_basics_2', 1, 'single-choice', ['a', 'b', 'c', 'd'], ['a']),
        createQuestion('macro_basics_2', 2, 'single-choice', ['a', 'b', 'c', 'd'], ['d']),
        createQuestion('macro_basics_2', 3, 'multi-select', ['a', 'b', 'c', 'd'], ['b', 'c']),
        createQuestion('macro_basics_2', 4, 'single-choice', ['a', 'b', 'c', 'd'], ['c']),
        createQuestion('macro_basics_2', 5, 'single-choice', ['a', 'b', 'c', 'd'], ['b']),
      ]),
      createLesson('macro_basics', 'macro_basics_3', 7, [
        createQuestion('macro_basics_3', 1, 'single-choice', ['a', 'b', 'c', 'd'], ['d']),
        createQuestion('macro_basics_3', 2, 'single-choice', ['a', 'b', 'c', 'd'], ['a']),
        createQuestion('macro_basics_3', 3, 'multi-select', ['a', 'b', 'c', 'd'], ['a', 'c']),
        createQuestion('macro_basics_3', 4, 'single-choice', ['a', 'b', 'c', 'd'], ['b']),
        createQuestion('macro_basics_3', 5, 'single-choice', ['a', 'b', 'c', 'd'], ['c']),
      ]),
      createLesson('macro_basics', 'macro_basics_4', 8, [
        createQuestion('macro_basics_4', 1, 'single-choice', ['a', 'b', 'c', 'd'], ['b']),
        createQuestion('macro_basics_4', 2, 'single-choice', ['a', 'b', 'c', 'd'], ['c']),
        createQuestion('macro_basics_4', 3, 'multi-select', ['a', 'b', 'c', 'd'], ['b', 'd']),
        createQuestion('macro_basics_4', 4, 'single-choice', ['a', 'b', 'c', 'd'], ['a']),
        createQuestion('macro_basics_4', 5, 'single-choice', ['a', 'b', 'c', 'd'], ['d']),
      ]),
    ],
  },
  {
    id: 'balanced_meals_labels',
    titleKey: 'learn.units.balanced_meals_labels.title',
    descriptionKey: 'learn.units.balanced_meals_labels.description',
    lessons: [
      createLesson('balanced_meals_labels', 'balanced_meals_labels_1', 9, [
        createQuestion('balanced_meals_labels_1', 1, 'single-choice', ['a', 'b', 'c', 'd'], ['a']),
        createQuestion('balanced_meals_labels_1', 2, 'single-choice', ['a', 'b', 'c', 'd'], ['d']),
        createQuestion('balanced_meals_labels_1', 3, 'multi-select', ['a', 'b', 'c', 'd'], ['b', 'c']),
        createQuestion('balanced_meals_labels_1', 4, 'single-choice', ['a', 'b', 'c', 'd'], ['c']),
        createQuestion('balanced_meals_labels_1', 5, 'single-choice', ['a', 'b', 'c', 'd'], ['b']),
      ]),
      createLesson('balanced_meals_labels', 'balanced_meals_labels_2', 10, [
        createQuestion('balanced_meals_labels_2', 1, 'single-choice', ['a', 'b', 'c', 'd'], ['c']),
        createQuestion('balanced_meals_labels_2', 2, 'single-choice', ['a', 'b', 'c', 'd'], ['a']),
        createQuestion('balanced_meals_labels_2', 3, 'multi-select', ['a', 'b', 'c', 'd'], ['a', 'd']),
        createQuestion('balanced_meals_labels_2', 4, 'single-choice', ['a', 'b', 'c', 'd'], ['b']),
        createQuestion('balanced_meals_labels_2', 5, 'single-choice', ['a', 'b', 'c', 'd'], ['d']),
      ]),
      createLesson('balanced_meals_labels', 'balanced_meals_labels_3', 11, [
        createQuestion('balanced_meals_labels_3', 1, 'single-choice', ['a', 'b', 'c', 'd'], ['d']),
        createQuestion('balanced_meals_labels_3', 2, 'single-choice', ['a', 'b', 'c', 'd'], ['b']),
        createQuestion('balanced_meals_labels_3', 3, 'multi-select', ['a', 'b', 'c', 'd'], ['b', 'd']),
        createQuestion('balanced_meals_labels_3', 4, 'single-choice', ['a', 'b', 'c', 'd'], ['a']),
        createQuestion('balanced_meals_labels_3', 5, 'single-choice', ['a', 'b', 'c', 'd'], ['c']),
      ]),
      createLesson('balanced_meals_labels', 'balanced_meals_labels_4', 12, [
        createQuestion('balanced_meals_labels_4', 1, 'single-choice', ['a', 'b', 'c', 'd'], ['b']),
        createQuestion('balanced_meals_labels_4', 2, 'single-choice', ['a', 'b', 'c', 'd'], ['c']),
        createQuestion('balanced_meals_labels_4', 3, 'multi-select', ['a', 'b', 'c', 'd'], ['a', 'c']),
        createQuestion('balanced_meals_labels_4', 4, 'single-choice', ['a', 'b', 'c', 'd'], ['d']),
        createQuestion('balanced_meals_labels_4', 5, 'single-choice', ['a', 'b', 'c', 'd'], ['a']),
      ]),
    ],
  },
] as const satisfies readonly LearnUnitDefinition[]

export const LEARN_LESSON_IDS_SET = new Set(LEARN_LESSON_IDS)
export const LEARN_FLAT_LESSONS = LEARN_CATALOG.flatMap((unit) => unit.lessons)

const LEARN_LESSON_BY_ID = Object.fromEntries(LEARN_FLAT_LESSONS.map((lesson) => [lesson.id, lesson])) as Record<
  LearnLessonId,
  LearnLessonDefinition
>

export function getLearnLesson(lessonId: LearnLessonId) {
  return LEARN_LESSON_BY_ID[lessonId]
}

function getLearnLessonIndex(lessonId: LearnLessonId) {
  return LEARN_FLAT_LESSONS.findIndex((lesson) => lesson.id === lessonId)
}

function getPreviousLearnLessonId(lessonId: LearnLessonId) {
  const index = getLearnLessonIndex(lessonId)

  if (index <= 0) return null

  return LEARN_FLAT_LESSONS[index - 1]?.id ?? null
}

export function getLearnStatusMap(
  progressRows: Array<{
    lessonId: LearnLessonId
    status: PersistedLearnLessonStatus
  }>,
) {
  const progressMap = new Map(progressRows.map((row) => [row.lessonId, row.status]))
  const statusMap = new Map<LearnLessonId, LearnLessonStatus>()

  for (const lesson of LEARN_FLAT_LESSONS) {
    const persistedStatus = progressMap.get(lesson.id)

    if (persistedStatus) {
      statusMap.set(lesson.id, persistedStatus)
      continue
    }

    const previousLessonId = getPreviousLearnLessonId(lesson.id)
    const previousStatus = previousLessonId ? statusMap.get(previousLessonId) : null
    const isUnlocked = previousLessonId === null || previousStatus === 'completed' || previousStatus === 'mastered'

    statusMap.set(lesson.id, isUnlocked ? 'available' : 'locked')
  }

  return statusMap
}

export function getUnlockedLearnLessonIds(
  progressRows: Array<{
    lessonId: LearnLessonId
    status: PersistedLearnLessonStatus
  }>,
) {
  return [...getLearnStatusMap(progressRows).entries()]
    .filter(([, status]) => status !== 'locked')
    .map(([lessonId]) => lessonId)
}

export function getNextAvailableLearnLessonId(
  progressRows: Array<{
    lessonId: LearnLessonId
    status: PersistedLearnLessonStatus
  }>,
) {
  const statusMap = getLearnStatusMap(progressRows)

  return (
    LEARN_FLAT_LESSONS.find((lesson) => {
      const status = statusMap.get(lesson.id)
      return status === 'available'
    })?.id ?? null
  )
}

export function isLearnLessonUnlocked(
  lessonId: LearnLessonId,
  progressRows: Array<{
    lessonId: LearnLessonId
    status: PersistedLearnLessonStatus
  }>,
) {
  const status = getLearnStatusMap(progressRows).get(lessonId)
  return status !== 'locked'
}

function assertLearnCatalogIntegrity() {
  for (const lesson of LEARN_FLAT_LESSONS) {
    if (lesson.questions.length !== LEARN_QUESTIONS_PER_LESSON) {
      throw new Error(`Lesson ${lesson.id} must have ${LEARN_QUESTIONS_PER_LESSON} questions`)
    }

    for (const question of lesson.questions) {
      if (question.correctChoiceIds.length === 0) {
        throw new Error(`Question ${question.id} must have at least one correct choice`)
      }
    }
  }
}

assertLearnCatalogIntegrity()
