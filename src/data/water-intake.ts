import { and, eq, inArray } from 'drizzle-orm'

import { db } from '@/db'
import { waterIntakes } from '@/db/schemas/water-intake.schema'

export async function getWaterIntake(userId: string, date: string) {
  const row = await db
    .select({ amount: waterIntakes.amount })
    .from(waterIntakes)
    .where(and(eq(waterIntakes.userId, userId), eq(waterIntakes.date, date)))
    .limit(1)

  return row[0]?.amount ?? 0
}

export async function getWaterIntakeHistory(userId: string, dates: string[]) {
  if (dates.length === 0) return []

  const rows = await db
    .select({ date: waterIntakes.date, amount: waterIntakes.amount })
    .from(waterIntakes)
    .where(and(eq(waterIntakes.userId, userId), inArray(waterIntakes.date, dates)))

  return rows
}
