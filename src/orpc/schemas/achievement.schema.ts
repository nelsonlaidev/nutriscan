import * as z from 'zod'

import { ACHIEVEMENT_GROUPS, ACHIEVEMENT_ICONS, ACHIEVEMENT_IDS } from '@/lib/achievements/types'

export const AchievementIdSchema = z.enum(ACHIEVEMENT_IDS)
export const AchievementGroupSchema = z.enum(ACHIEVEMENT_GROUPS)
export const AchievementIconSchema = z.enum(ACHIEVEMENT_ICONS)
export const AchievementStatusSchema = z.enum(['locked', 'unlocked'])

export const AchievementUnlockSummarySchema = z.object({
  id: AchievementIdSchema,
  category: AchievementGroupSchema,
  unlockedAt: z.date(),
})

export const AchievementStreakSchema = z.object({
  current: z.number().int().nonnegative(),
  best: z.number().int().nonnegative(),
})

export const AchievementOverviewSchema = z.object({
  unlockedCount: z.number().int().nonnegative(),
  totalCount: z.number().int().nonnegative(),
  recentUnlocks: z.array(AchievementUnlockSummarySchema),
  streaks: z.object({
    mealLogging: AchievementStreakSchema,
    waterLogging: AchievementStreakSchema,
  }),
})

export const AchievementCardSchema = z.object({
  id: AchievementIdSchema,
  category: AchievementGroupSchema,
  icon: AchievementIconSchema,
  status: AchievementStatusSchema,
  current: z.number().int().nonnegative(),
  target: z.number().int().positive(),
  unlockedAt: z.date().nullable(),
})

export const AchievementCardListSchema = z.array(AchievementCardSchema)
