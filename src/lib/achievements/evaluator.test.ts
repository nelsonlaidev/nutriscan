import { describe, expect, test } from 'vitest'

import {
  calculateDayStreak,
  evaluateMealAchievements,
  evaluateWaterAchievements,
  evaluateWeightAchievements,
  getMaxDistinctMealsInSingleDay,
} from './evaluator'

describe('achievement evaluator', () => {
  test('detects all four meal categories logged in one day', () => {
    const entries = [
      { createdAt: new Date('2026-03-24T01:00:00.000Z'), mealCategory: 'breakfast' },
      { createdAt: new Date('2026-03-24T04:00:00.000Z'), mealCategory: 'lunch' },
      { createdAt: new Date('2026-03-24T10:00:00.000Z'), mealCategory: 'dinner' },
      { createdAt: new Date('2026-03-24T13:00:00.000Z'), mealCategory: 'snacks' },
    ]

    expect(getMaxDistinctMealsInSingleDay(entries)).toBe(4)
    expect(evaluateMealAchievements(entries).metrics.all_meals_in_a_day.current).toBe(4)
  })

  test('counts distinct local days across timezone boundaries', () => {
    const entries = [
      { createdAt: new Date('2026-03-24T15:30:00.000Z') },
      { createdAt: new Date('2026-03-24T16:30:00.000Z') },
    ]

    expect(evaluateWaterAchievements(entries).metrics.water_logging_days_7.current).toBe(2)
  })

  test('tracks current and best streak when the latest day is yesterday', () => {
    const streak = calculateDayStreak(
      ['2026-03-20', '2026-03-21', '2026-03-23', '2026-03-24'],
      new Date('2026-03-25T04:00:00.000Z'),
    )

    expect(streak).toStrictEqual({ current: 2, best: 2 })
  })

  test('resets the current streak after a gap but preserves the best streak', () => {
    const streak = calculateDayStreak(['2026-03-18', '2026-03-19'], new Date('2026-03-22T04:00:00.000Z'))

    expect(streak).toStrictEqual({ current: 0, best: 2 })
  })

  test('counts weight check-ins toward larger milestones', () => {
    const entries = Array.from({ length: 8 }, (_, index) => ({
      createdAt: new Date(`2026-03-${String(index + 1).padStart(2, '0')}T01:00:00.000Z`),
    }))

    const { metrics } = evaluateWeightAchievements(entries)

    expect(metrics.first_weigh_in.current).toBe(8)
    expect(metrics.weight_checkins_7.current).toBe(8)
    expect(metrics.weight_checkins_30.current).toBe(8)
  })
})
