import 'server-only'

import type { Transaction } from '@/types'
import type { AchievementId, AchievementMetric, AchievementUnlockSummary } from './types'

import { and, eq, inArray } from 'drizzle-orm'

import { achievementUnlocks, foodEntries, waterEntries, weightEntries } from '@/db/schemas'

import { ACHIEVEMENT_CATALOG_BY_ID, ACHIEVEMENT_IDS_BY_GROUP } from './catalog'
import { evaluateMealAchievements, evaluateWaterAchievements, evaluateWeightAchievements } from './evaluator'

async function getGroupUnlockRows(database: Transaction, userId: string, ids: AchievementId[]) {
  return database
    .select({
      achievementId: achievementUnlocks.achievementId,
      unlockedAt: achievementUnlocks.unlockedAt,
    })
    .from(achievementUnlocks)
    .where(and(eq(achievementUnlocks.userId, userId), inArray(achievementUnlocks.achievementId, ids)))
}

export async function evaluateAndUnlockAchievementGroup(
  tx: Transaction,
  userId: string,
  group: keyof typeof ACHIEVEMENT_IDS_BY_GROUP,
): Promise<AchievementUnlockSummary[]> {
  const ids = ACHIEVEMENT_IDS_BY_GROUP[group]
  const existingUnlockRows = await getGroupUnlockRows(tx, userId, ids)
  const existingUnlockIds = new Set(existingUnlockRows.map((row) => row.achievementId as AchievementId))

  let metrics: Partial<Record<AchievementId, AchievementMetric>> = {}

  if (group === 'meals') {
    const rows = await tx
      .select({
        createdAt: foodEntries.createdAt,
        mealCategory: foodEntries.mealCategory,
      })
      .from(foodEntries)
      .where(eq(foodEntries.userId, userId))

    metrics = evaluateMealAchievements(rows).metrics
  }

  if (group === 'water') {
    const rows = await tx
      .select({
        createdAt: waterEntries.createdAt,
      })
      .from(waterEntries)
      .where(eq(waterEntries.userId, userId))

    metrics = evaluateWaterAchievements(rows).metrics
  }

  if (group === 'weight') {
    const rows = await tx
      .select({
        createdAt: weightEntries.createdAt,
      })
      .from(weightEntries)
      .where(eq(weightEntries.userId, userId))

    metrics = evaluateWeightAchievements(rows).metrics
  }

  const now = new Date()
  const newUnlocks = ids
    .filter((id) => {
      const metric = metrics[id]
      return Boolean(metric && metric.current >= metric.target && !existingUnlockIds.has(id))
    })
    .map((id) => ({
      userId,
      achievementId: id,
      unlockedAt: now,
    }))

  if (newUnlocks.length > 0) {
    await tx.insert(achievementUnlocks).values(newUnlocks).onConflictDoNothing()
  }

  return newUnlocks.map((unlock) => ({
    id: unlock.achievementId,
    category: ACHIEVEMENT_CATALOG_BY_ID[unlock.achievementId].category,
    unlockedAt: unlock.unlockedAt,
  }))
}
