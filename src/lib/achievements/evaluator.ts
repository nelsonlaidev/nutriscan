import type { AchievementMetric, AchievementStreak } from './types'

import { differenceInCalendarDays, parseISO } from 'date-fns'

import { DEFAULT_TIMEZONE } from '@/lib/time'
import { getDateBucket } from '@/lib/utils'

type FoodActivity = {
  createdAt: Date
  mealCategory: string
}

type TimestampedActivity = {
  createdAt: Date
}

function getSortedDistinctDayKeys(dates: Date[], timezone = DEFAULT_TIMEZONE) {
  return [...new Set(dates.map((date) => getDateBucket(date, timezone)))].toSorted((a, b) => a.localeCompare(b))
}

export function calculateDayStreak(dayKeys: string[], today = new Date()): AchievementStreak {
  if (dayKeys.length === 0) {
    return { current: 0, best: 0 }
  }

  const uniqueKeys = [...new Set(dayKeys)].toSorted((a, b) => a.localeCompare(b))
  let best = 1
  let run = 1

  for (let index = 1; index < uniqueKeys.length; index += 1) {
    const current = uniqueKeys[index]
    const previous = uniqueKeys[index - 1]

    if (!current || !previous) continue

    const difference = differenceInCalendarDays(parseISO(current), parseISO(previous))
    run = difference === 1 ? run + 1 : 1
    best = Math.max(best, run)
  }

  const lastKey = uniqueKeys.at(-1)

  if (!lastKey) {
    return { current: 0, best: 0 }
  }

  const todayKey = getDateBucket(today)
  const daysSinceLastEntry = differenceInCalendarDays(parseISO(todayKey), parseISO(lastKey))

  if (daysSinceLastEntry > 1) {
    return { current: 0, best }
  }

  let current = 1

  for (let index = uniqueKeys.length - 1; index > 0; index -= 1) {
    const currentKey = uniqueKeys[index]
    const previousKey = uniqueKeys[index - 1]

    if (!currentKey || !previousKey) continue

    const difference = differenceInCalendarDays(parseISO(currentKey), parseISO(previousKey))

    if (difference !== 1) {
      break
    }

    current += 1
  }

  return { current, best }
}

export function getMaxDistinctMealsInSingleDay(entries: FoodActivity[], timezone = DEFAULT_TIMEZONE) {
  const mealsPerDay = new Map<string, Set<string>>()

  for (const entry of entries) {
    const dayKey = getDateBucket(entry.createdAt, timezone)
    const meals = mealsPerDay.get(dayKey) ?? new Set<string>()
    meals.add(entry.mealCategory)
    mealsPerDay.set(dayKey, meals)
  }

  return Math.max(...[...mealsPerDay.values()].map((meals) => meals.size), 0)
}

export function evaluateMealAchievements(entries: FoodActivity[]) {
  const totalEntries = entries.length
  const distinctDayKeys = getSortedDistinctDayKeys(entries.map((entry) => entry.createdAt))
  const streak = calculateDayStreak(distinctDayKeys)

  const metrics = {
    first_meal_logged: { current: totalEntries, target: 1 },
    all_meals_in_a_day: { current: getMaxDistinctMealsInSingleDay(entries), target: 4 },
    meal_logging_streak_7: { current: streak.current, target: 7 },
  } satisfies Record<'all_meals_in_a_day' | 'first_meal_logged' | 'meal_logging_streak_7', AchievementMetric>

  return {
    metrics,
    streak,
  }
}

export function evaluateWaterAchievements(entries: TimestampedActivity[]) {
  const totalEntries = entries.length
  const distinctDayKeys = getSortedDistinctDayKeys(entries.map((entry) => entry.createdAt))
  const streak = calculateDayStreak(distinctDayKeys)

  const metrics = {
    first_water_logged: { current: totalEntries, target: 1 },
    water_logging_days_7: { current: distinctDayKeys.length, target: 7 },
    water_logging_streak_7: { current: streak.current, target: 7 },
  } satisfies Record<'first_water_logged' | 'water_logging_days_7' | 'water_logging_streak_7', AchievementMetric>

  return {
    metrics,
    streak,
  }
}

export function evaluateWeightAchievements(entries: TimestampedActivity[]) {
  const totalEntries = entries.length

  const metrics = {
    first_weigh_in: { current: totalEntries, target: 1 },
    weight_checkins_7: { current: totalEntries, target: 7 },
    weight_checkins_30: { current: totalEntries, target: 30 },
  } satisfies Record<'first_weigh_in' | 'weight_checkins_30' | 'weight_checkins_7', AchievementMetric>

  return { metrics }
}
