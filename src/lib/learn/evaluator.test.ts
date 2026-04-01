import { describe, expect, test } from 'vitest'

import { getLearnLesson, getNextAvailableLearnLessonId, getUnlockedLearnLessonIds } from './catalog'
import { calculateLearningStreak, evaluateLearnLessonAttempt } from './evaluator'

function getPerfectAnswers(lessonId: Parameters<typeof getLearnLesson>[0]) {
  const lesson = getLearnLesson(lessonId)

  return lesson.questions.map((question) => ({
    questionId: question.id,
    choiceIds: [...question.correctChoiceIds],
  }))
}

describe('learn evaluator', () => {
  test('awards a perfect first pass with mastery bonus XP', () => {
    const lesson = getLearnLesson('calories_portions_1')

    const result = evaluateLearnLessonAttempt({
      lesson,
      answers: getPerfectAnswers(lesson.id),
      previousStatus: null,
    })

    expect(result.score).toBe(5)
    expect(result.passed).toBe(true)
    expect(result.perfect).toBe(true)
    expect(result.status).toBe('mastered')
    expect(result.xpEarned).toBe(15)
  })

  test('awards standard XP for a passed but imperfect lesson', () => {
    const lesson = getLearnLesson('calories_portions_1')
    const answers = getPerfectAnswers(lesson.id)
    const firstQuestion = lesson.questions[0]

    if (!firstQuestion) {
      throw new Error('Expected first question')
    }

    answers[0] = {
      questionId: firstQuestion.id,
      choiceIds: ['a'],
    }

    const result = evaluateLearnLessonAttempt({
      lesson,
      answers,
      previousStatus: null,
    })

    expect(result.score).toBe(4)
    expect(result.passed).toBe(true)
    expect(result.perfect).toBe(false)
    expect(result.status).toBe('completed')
    expect(result.xpEarned).toBe(10)
  })

  test('stops the run when hearts hit zero', () => {
    const lesson = getLearnLesson('calories_portions_1')
    const [question1, question2, question3, question4] = lesson.questions

    if (!question1 || !question2 || !question3 || !question4) {
      throw new Error('Expected lesson questions')
    }

    const result = evaluateLearnLessonAttempt({
      lesson,
      answers: [
        { questionId: question1.id, choiceIds: ['a'] },
        { questionId: question2.id, choiceIds: ['a'] },
        { questionId: question3.id, choiceIds: ['b'] },
        { questionId: question4.id, choiceIds: ['a'] },
      ],
      previousStatus: null,
    })

    expect(result.heartsRemaining).toBe(0)
    expect(result.questionResults).toHaveLength(3)
    expect(result.score).toBe(0)
    expect(result.passed).toBe(false)
    expect(result.xpEarned).toBe(0)
  })

  test('keeps mastered status after a failed replay', () => {
    const lesson = getLearnLesson('calories_portions_1')
    const [question1, question2, question3] = lesson.questions

    if (!question1 || !question2 || !question3) {
      throw new Error('Expected lesson questions')
    }

    const result = evaluateLearnLessonAttempt({
      lesson,
      answers: [
        { questionId: question1.id, choiceIds: ['a'] },
        { questionId: question2.id, choiceIds: ['a'] },
        { questionId: question3.id, choiceIds: ['b'] },
      ],
      previousStatus: 'mastered',
    })

    expect(result.passed).toBe(false)
    expect(result.status).toBe('mastered')
    expect(result.xpEarned).toBe(0)
  })

  test('calculates learning streaks from passed attempt dates', () => {
    const streak = calculateLearningStreak([
      new Date('2026-03-20T02:00:00.000Z'),
      new Date('2026-03-21T04:00:00.000Z'),
      new Date('2026-03-21T08:00:00.000Z'),
      new Date('2026-03-22T05:00:00.000Z'),
    ])

    expect(streak).toStrictEqual({ current: 0, best: 3 })
  })

  test('unlocks the next lesson after a lesson is completed', () => {
    expect(getUnlockedLearnLessonIds([])).toStrictEqual(['calories_portions_1'])
    expect(getNextAvailableLearnLessonId([])).toBe('calories_portions_1')

    const progress = [{ lessonId: 'calories_portions_1' as const, status: 'completed' as const }]

    expect(getUnlockedLearnLessonIds(progress)).toStrictEqual(['calories_portions_1', 'calories_portions_2'])
    expect(getNextAvailableLearnLessonId(progress)).toBe('calories_portions_2')
  })
})
