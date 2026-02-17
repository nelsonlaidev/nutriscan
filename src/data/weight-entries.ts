import { and, between, desc, eq, lt } from 'drizzle-orm'

import { db } from '@/db'
import { weightEntries } from '@/db/schemas/weight-entry.schema'

export type WeightEntry = {
  id: string
  weight: number
  createdAt: Date
}

export async function getWeightEntries(userId: string, limit = 30): Promise<WeightEntry[]> {
  return db
    .select({
      id: weightEntries.id,
      weight: weightEntries.weight,
      createdAt: weightEntries.createdAt
    })
    .from(weightEntries)
    .where(eq(weightEntries.userId, userId))
    .orderBy(desc(weightEntries.createdAt))
    .limit(limit)
}

export async function getWeightEntriesByDateRange(userId: string, startDate: string, endDate: string) {
  const rows = await db
    .select({
      localDate: weightEntries.localDate,
      weight: weightEntries.weight
    })
    .from(weightEntries)
    .where(and(eq(weightEntries.userId, userId), between(weightEntries.localDate, startDate, endDate)))
    .orderBy(weightEntries.localDate)

  // Keep the last entry per day
  const map = new Map<string, number>()
  for (const row of rows) {
    map.set(row.localDate, row.weight)
  }

  return [...map.entries()].map(([date, weight]) => ({ date, weight })).toSorted((a, b) => a.date.localeCompare(b.date))
}

export async function getLatestWeightBefore(userId: string, date: string) {
  const [row] = await db
    .select({
      weight: weightEntries.weight
    })
    .from(weightEntries)
    .where(and(eq(weightEntries.userId, userId), lt(weightEntries.localDate, date)))
    .orderBy(desc(weightEntries.createdAt))
    .limit(1)

  return row ?? null
}

export async function getLatestWeight(userId: string) {
  const [row] = await db
    .select({
      weight: weightEntries.weight,
      createdAt: weightEntries.createdAt
    })
    .from(weightEntries)
    .where(eq(weightEntries.userId, userId))
    .orderBy(desc(weightEntries.createdAt))
    .limit(1)

  return row ?? null
}
