'use server'

import type { DateRange, DayRange } from '@/lib/utils'

import { and, desc, eq, gte, type InferSelectModel, lte, type SQL, sum } from 'drizzle-orm'

import { db } from '@/db'
import { waterEntries } from '@/db/schemas'

export type WaterEntry = Pick<InferSelectModel<typeof waterEntries>, 'id' | 'amount' | 'createdAt'>

export async function getWaterEntries(userId: string, dateRange?: DateRange): Promise<WaterEntry[]> {
  const filters: SQL[] = [eq(waterEntries.userId, userId)]

  if (dateRange && dateRange.dates.length > 0) {
    filters.push(gte(waterEntries.createdAt, dateRange.startOfDay), lte(waterEntries.createdAt, dateRange.endOfDay))
  }

  const rows = await db
    .select({
      id: waterEntries.id,
      amount: waterEntries.amount,
      createdAt: waterEntries.createdAt
    })
    .from(waterEntries)
    .where(and(...filters))
    .orderBy(desc(waterEntries.createdAt))

  return rows
}

export async function getWaterTotal(userId: string, dayRange: DayRange) {
  const [row] = await db
    .select({ total: sum(waterEntries.amount) })
    .from(waterEntries)
    .where(
      and(
        eq(waterEntries.userId, userId),
        gte(waterEntries.createdAt, dayRange.startOfDay),
        lte(waterEntries.createdAt, dayRange.endOfDay)
      )
    )

  return Number(row?.total ?? 0)
}
