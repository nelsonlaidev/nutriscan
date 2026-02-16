import { and, desc, eq, inArray, sql, sum } from 'drizzle-orm'

import { db } from '@/db'
import { waterEntries } from '@/db/schemas/water-entry.schema'

export async function getWaterEntries(userId: string, dates: string[]) {
  if (dates.length === 0) return []

  return db
    .select({
      id: waterEntries.id,
      amount: waterEntries.amount,
      date: waterEntries.date,
      createdAt: waterEntries.createdAt
    })
    .from(waterEntries)
    .where(and(eq(waterEntries.userId, userId), inArray(waterEntries.date, dates)))
    .orderBy(desc(waterEntries.createdAt))
}

export type WaterEntry = Awaited<ReturnType<typeof getWaterEntries>>[number]

export async function getWaterTotal(userId: string, date: string) {
  const [row] = await db
    .select({ total: sum(waterEntries.amount) })
    .from(waterEntries)
    .where(and(eq(waterEntries.userId, userId), eq(waterEntries.date, date)))

  return Number(row?.total ?? 0)
}

export async function getWaterTotalsByDate(userId: string, dates: string[]) {
  if (dates.length === 0) return []

  const rows = await db
    .select({
      date: waterEntries.date,
      amount: sql<number>`cast(coalesce(sum(${waterEntries.amount}), 0) as int)`
    })
    .from(waterEntries)
    .where(and(eq(waterEntries.userId, userId), inArray(waterEntries.date, dates)))
    .groupBy(waterEntries.date)

  return rows
}
