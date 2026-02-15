import { and, eq } from 'drizzle-orm'

import { db } from '@/db'
import { waterIntakes } from '@/db/schemas/water-intake.schema'

export async function getWaterIntake(userId: string, date: string) {
  const row = await db
    .select({ count: waterIntakes.count })
    .from(waterIntakes)
    .where(and(eq(waterIntakes.userId, userId), eq(waterIntakes.date, date)))
    .limit(1)

  return row[0]?.count ?? 0
}
