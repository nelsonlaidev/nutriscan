import type { db } from '@/db'
import type { AchievementId, AchievementMetric, AchievementStreaks } from '@/lib/achievements/types'

import { desc, eq } from 'drizzle-orm'

import { achievementUnlocks, foodEntries, waterEntries, weightEntries } from '@/db/schemas'
import { ACHIEVEMENT_CATALOG, ACHIEVEMENT_CATALOG_BY_ID, ACHIEVEMENT_COUNT } from '@/lib/achievements/catalog'
import {
  evaluateMealAchievements,
  evaluateWaterAchievements,
  evaluateWeightAchievements,
} from '@/lib/achievements/evaluator'

import { protectedProcedure } from '../procedures'
import { AchievementCardListSchema, AchievementOverviewSchema } from '../schemas/achievement.schema'

async function buildAchievementState(database: typeof db, userId: string) {
  const [foodRows, waterRows, weightRows, unlockRows] = await Promise.all([
    database
      .select({
        createdAt: foodEntries.createdAt,
        mealCategory: foodEntries.mealCategory,
      })
      .from(foodEntries)
      .where(eq(foodEntries.userId, userId)),
    database
      .select({
        createdAt: waterEntries.createdAt,
      })
      .from(waterEntries)
      .where(eq(waterEntries.userId, userId)),
    database
      .select({
        createdAt: weightEntries.createdAt,
      })
      .from(weightEntries)
      .where(eq(weightEntries.userId, userId)),
    database
      .select({
        achievementId: achievementUnlocks.achievementId,
        unlockedAt: achievementUnlocks.unlockedAt,
      })
      .from(achievementUnlocks)
      .where(eq(achievementUnlocks.userId, userId))
      .orderBy(desc(achievementUnlocks.unlockedAt)),
  ])

  const meal = evaluateMealAchievements(foodRows)
  const water = evaluateWaterAchievements(waterRows)
  const weight = evaluateWeightAchievements(weightRows)

  const metrics = {
    ...meal.metrics,
    ...water.metrics,
    ...weight.metrics,
  } satisfies Record<AchievementId, AchievementMetric>

  const streaks: AchievementStreaks = {
    mealLogging: meal.streak,
    waterLogging: water.streak,
  }

  const recentUnlocks = unlockRows.slice(0, 3).map((row) => {
    const achievementId = row.achievementId as AchievementId
    const achievement = ACHIEVEMENT_CATALOG_BY_ID[achievementId]

    return {
      id: achievementId,
      category: achievement.category,
      unlockedAt: row.unlockedAt,
    }
  })

  return {
    metrics,
    streaks,
    unlockMap: new Map(unlockRows.map((row) => [row.achievementId as AchievementId, row.unlockedAt])),
    recentUnlocks,
  }
}

const overview = protectedProcedure.output(AchievementOverviewSchema).handler(async ({ context }) => {
  const state = await buildAchievementState(context.db, context.session.user.id)

  return {
    unlockedCount: state.unlockMap.size,
    totalCount: ACHIEVEMENT_COUNT,
    recentUnlocks: state.recentUnlocks,
    streaks: state.streaks,
  }
})

const list = protectedProcedure.output(AchievementCardListSchema).handler(async ({ context }) => {
  const state = await buildAchievementState(context.db, context.session.user.id)

  return ACHIEVEMENT_CATALOG.map((achievement) => ({
    id: achievement.id,
    category: achievement.category,
    icon: achievement.icon,
    status: state.unlockMap.has(achievement.id) ? 'unlocked' : 'locked',
    current: state.metrics[achievement.id].current,
    target: state.metrics[achievement.id].target,
    unlockedAt: state.unlockMap.get(achievement.id) ?? null,
  }))
})

export const achievementsRouter = {
  overview,
  list,
}
