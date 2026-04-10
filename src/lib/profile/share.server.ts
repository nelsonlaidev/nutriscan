import 'server-only'

import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { achievementUnlocks, foodEntries, learnProgress, waterEntries } from '@/db/schemas'
import { ACHIEVEMENT_COUNT } from '@/lib/achievements/catalog'
import { evaluateMealAchievements, evaluateWaterAchievements } from '@/lib/achievements/evaluator'
import { getLearnStatusMap, LEARN_FLAT_LESSONS } from '@/lib/learn/catalog'

export type ProfileShareSnapshot = {
  completedLessons: number
  mealStreak: number
  totalAchievements: number
  totalLessons: number
  unlockedAchievements: number
  waterStreak: number
}

export async function getProfileShareSnapshot(userId: string): Promise<ProfileShareSnapshot> {
  const [foodRows, waterRows, unlockRows, progressRows] = await Promise.all([
    db
      .select({
        createdAt: foodEntries.createdAt,
        mealCategory: foodEntries.mealCategory,
      })
      .from(foodEntries)
      .where(eq(foodEntries.userId, userId)),
    db
      .select({
        createdAt: waterEntries.createdAt,
      })
      .from(waterEntries)
      .where(eq(waterEntries.userId, userId)),
    db
      .select({
        achievementId: achievementUnlocks.achievementId,
      })
      .from(achievementUnlocks)
      .where(eq(achievementUnlocks.userId, userId)),
    db.select().from(learnProgress).where(eq(learnProgress.userId, userId)),
  ])

  const meal = evaluateMealAchievements(foodRows)
  const water = evaluateWaterAchievements(waterRows)
  const learnStatusMap = getLearnStatusMap(progressRows)

  // eslint-disable-next-line unicorn/no-array-reduce
  const completedLessons = LEARN_FLAT_LESSONS.reduce((count, lesson) => {
    const status = learnStatusMap.get(lesson.id) ?? 'locked'

    if (status === 'completed' || status === 'mastered') {
      return count + 1
    }

    return count
  }, 0)

  return {
    completedLessons,
    mealStreak: meal.streak.current,
    totalAchievements: ACHIEVEMENT_COUNT,
    totalLessons: LEARN_FLAT_LESSONS.length,
    unlockedAchievements: unlockRows.length,
    waterStreak: water.streak.current,
  }
}
