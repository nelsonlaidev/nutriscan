import type {
  LearnAnswerInput,
  LearnLessonDefinition,
  LearnQuestionDefinition,
  LearnQuestionResult,
  PersistedLearnLessonStatus,
} from './types'

import { calculateDayStreak } from '@/lib/achievements/evaluator'
import { getDateBucket } from '@/lib/utils'

import {
  LEARN_FIRST_PERFECT_BONUS_XP,
  LEARN_HEARTS_PER_RUN,
  LEARN_PASS_XP,
  LEARN_PASSING_SCORE,
  LEARN_QUESTIONS_PER_LESSON,
} from './types'

function normalizeIds(values: readonly string[]) {
  return [...new Set(values)].toSorted((a, b) => a.localeCompare(b))
}

function buildAnswerMap(answers: LearnAnswerInput[]) {
  const answerMap = new Map<string, string[]>()

  for (const answer of answers) {
    if (answerMap.has(answer.questionId)) {
      throw new Error(`Duplicate answer for question: ${answer.questionId}`)
    }

    answerMap.set(answer.questionId, normalizeIds(answer.choiceIds))
  }

  return answerMap
}

function assertValidChoiceIds(question: LearnQuestionDefinition, choiceIds: readonly string[]) {
  const validChoiceIds = new Set(question.choices.map((choice) => choice.id))

  for (const choiceId of choiceIds) {
    if (!validChoiceIds.has(choiceId)) {
      throw new Error(`Invalid choice id: ${choiceId}`)
    }
  }
}

function isLearnAnswerCorrect(question: LearnQuestionDefinition, selectedChoiceIds: readonly string[]) {
  const normalizedSelected = normalizeIds(selectedChoiceIds)
  const normalizedCorrect = normalizeIds(question.correctChoiceIds)

  if (normalizedSelected.length !== normalizedCorrect.length) {
    return false
  }

  return normalizedSelected.every((choiceId, index) => choiceId === normalizedCorrect[index])
}

export function evaluateLearnQuestionAnswer(question: LearnQuestionDefinition, selectedChoiceIds: readonly string[]) {
  assertValidChoiceIds(question, selectedChoiceIds)

  return {
    correct: isLearnAnswerCorrect(question, selectedChoiceIds),
  }
}

function buildQuestionResults(lesson: LearnLessonDefinition, answerMap: Map<string, string[]>) {
  const questionResults: LearnQuestionResult[] = []
  let heartsRemaining = LEARN_HEARTS_PER_RUN

  for (const question of lesson.questions) {
    if (heartsRemaining === 0) break

    const selectedChoiceIds = answerMap.get(question.id)

    if (!selectedChoiceIds) break

    const { correct } = evaluateLearnQuestionAnswer(question, selectedChoiceIds)
    heartsRemaining = correct ? heartsRemaining : Math.max(heartsRemaining - 1, 0)

    questionResults.push({
      questionId: question.id,
      correct,
      selectedChoiceIds,
      correctChoiceIds: [...question.correctChoiceIds],
      heartsRemaining,
    })
  }

  return {
    questionResults,
    heartsRemaining,
  }
}

function assertNoUnknownQuestionIds(lesson: LearnLessonDefinition, answers: LearnAnswerInput[]) {
  const knownQuestionIds = new Set(lesson.questions.map((question) => question.id))

  for (const answer of answers) {
    if (!knownQuestionIds.has(answer.questionId)) {
      throw new Error(`Unknown question id: ${answer.questionId}`)
    }
  }
}

function getNextLessonStatus(input: {
  previousStatus?: PersistedLearnLessonStatus | null
  passed: boolean
  perfect: boolean
}): PersistedLearnLessonStatus {
  const { previousStatus = null, passed, perfect } = input

  if (previousStatus === 'mastered' || perfect) {
    return 'mastered'
  }

  if (passed) {
    return 'completed'
  }

  return previousStatus ?? 'available'
}

function getAttemptXp(input: {
  previousStatus?: PersistedLearnLessonStatus | null
  passed: boolean
  perfect: boolean
}) {
  const { previousStatus = null, passed, perfect } = input

  if (!passed) {
    return 0
  }

  const masteryBonus = perfect && previousStatus !== 'mastered' ? LEARN_FIRST_PERFECT_BONUS_XP : 0

  return LEARN_PASS_XP + masteryBonus
}

export function evaluateLearnLessonAttempt(input: {
  lesson: LearnLessonDefinition
  answers: LearnAnswerInput[]
  previousStatus?: PersistedLearnLessonStatus | null
}) {
  const { lesson, answers, previousStatus = null } = input
  const answerMap = buildAnswerMap(answers)
  const { questionResults, heartsRemaining } = buildQuestionResults(lesson, answerMap)

  if (answerMap.size > questionResults.length) {
    assertNoUnknownQuestionIds(lesson, answers)
  }

  const score = questionResults.filter((result) => result.correct).length
  const answeredAllQuestions = questionResults.length === lesson.questions.length
  const passed = answeredAllQuestions && score >= LEARN_PASSING_SCORE
  const perfect = passed && score === LEARN_QUESTIONS_PER_LESSON
  const status = getNextLessonStatus({ previousStatus, passed, perfect })
  const xpEarned = getAttemptXp({ previousStatus, passed, perfect })

  return {
    score,
    totalQuestions: lesson.questions.length,
    heartsRemaining,
    questionResults,
    passed,
    perfect,
    xpEarned,
    status,
  }
}

export function calculateLearningStreak(dates: Date[]) {
  const dayKeys = [...new Set(dates.map((date) => getDateBucket(date)))].toSorted((a, b) => a.localeCompare(b))
  return calculateDayStreak(dayKeys)
}
