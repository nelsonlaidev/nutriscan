'use server'

import { and, eq, gte, lt } from 'drizzle-orm'
import * as z from 'zod'

import { db } from '@/db'
import { foodEntries } from '@/db/schemas/food-entry.schema'
import { authActionClient } from '@/lib/safe-action'

export const getFoodEntries = authActionClient
  .inputSchema(z.object({ date: z.string() }))
  .action(async ({ parsedInput, ctx }) => {
    const start = new Date(parsedInput.date)
    start.setHours(0, 0, 0, 0)

    const end = new Date(start)
    end.setDate(end.getDate() + 1)

    const entries = await db
      .select()
      .from(foodEntries)
      .where(
        and(eq(foodEntries.userId, ctx.user.id), gte(foodEntries.createdAt, start), lt(foodEntries.createdAt, end))
      )

    return entries
  })
