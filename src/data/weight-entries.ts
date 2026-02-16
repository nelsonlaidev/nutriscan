import { and, between, desc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { weightEntries } from '@/db/schemas/weight-entry.schema'

export async function getWeightEntriesByDateRange(userId: string, startDate: string, endDate: string) {
  return db
    .select({
      date: weightEntries.date,
      weight: weightEntries.weight
    })
    .from(weightEntries)
    .where(and(eq(weightEntries.userId, userId), between(weightEntries.date, startDate, endDate)))
    .orderBy(weightEntries.date)
}

export async function getLatestWeight(userId: string) {
  const [row] = await db
    .select({
      weight: weightEntries.weight,
      date: weightEntries.date
    })
    .from(weightEntries)
    .where(eq(weightEntries.userId, userId))
    .orderBy(desc(weightEntries.date))
    .limit(1)

  return row ?? null
}
