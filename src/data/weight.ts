import { desc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { weightEntries } from '@/db/schemas'

export type WeightEntry = {
  id: string
  weight: number
  createdAt: Date
}

export async function getWeightEntries(userId: string, limit = 30): Promise<WeightEntry[]> {
  const rows = await db
    .select({
      id: weightEntries.id,
      weight: weightEntries.weight,
      createdAt: weightEntries.createdAt,
    })
    .from(weightEntries)
    .where(eq(weightEntries.userId, userId))
    .orderBy(desc(weightEntries.createdAt))
    .limit(limit)

  return rows
}

type LatestWeight = {
  weight: number
  createdAt: Date
} | null

export async function getLatestWeight(userId: string): Promise<LatestWeight> {
  const [row] = await db
    .select({
      weight: weightEntries.weight,
      createdAt: weightEntries.createdAt,
    })
    .from(weightEntries)
    .where(eq(weightEntries.userId, userId))
    .orderBy(desc(weightEntries.createdAt))
    .limit(1)

  return row ?? null
}
