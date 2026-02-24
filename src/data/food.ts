import type { DayRange } from '@/lib/utils'
import type { MealCategory } from '@/types'

import { and, eq, gte, lte } from 'drizzle-orm'

import { db } from '@/db'
import { foodEntries } from '@/db/schemas'

export async function getFoodEntries(userId: string, dayRange: DayRange) {
  const rows = await db
    .select()
    .from(foodEntries)
    .where(
      and(
        eq(foodEntries.userId, userId),
        gte(foodEntries.createdAt, dayRange.startOfDay),
        lte(foodEntries.createdAt, dayRange.endOfDay)
      )
    )

  return rows
}

export async function getFoodEntriesByCategory(userId: string, dayRange: DayRange, category: MealCategory) {
  const rows = await db
    .select()
    .from(foodEntries)
    .where(
      and(
        eq(foodEntries.userId, userId),
        gte(foodEntries.createdAt, dayRange.startOfDay),
        lte(foodEntries.createdAt, dayRange.endOfDay),
        eq(foodEntries.mealCategory, category)
      )
    )

  return rows
}
