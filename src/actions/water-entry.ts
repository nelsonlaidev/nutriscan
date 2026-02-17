'use server'

import type { ErrorResponse } from '@/types'

import { and, eq } from 'drizzle-orm'

import { db } from '@/db'
import { waterEntries } from '@/db/schemas/water-entry.schema'
import { getCurrentLocalDate } from '@/lib/date-utils'
import { authActionClient } from '@/lib/safe-action'
import { AddWaterEntrySchema, DeleteWaterEntrySchema, UpdateWaterEntrySchema } from '@/lib/zod-schemas'

export const addWaterEntry = authActionClient.inputSchema(AddWaterEntrySchema).action(async ({ parsedInput, ctx }) => {
  const localDate = getCurrentLocalDate(ctx.user.timezone)

  const entry = await db
    .insert(waterEntries)
    .values({
      userId: ctx.user.id,
      amount: parsedInput.amount,
      localDate
    })
    .returning({ id: waterEntries.id, localDate: waterEntries.localDate, createdAt: waterEntries.createdAt })

  return { success: true, entry: entry[0] }
})

export const updateWaterEntry = authActionClient
  .inputSchema(UpdateWaterEntrySchema)
  .action(async ({ parsedInput, ctx }) => {
    const [existing] = await db
      .select({ id: waterEntries.id })
      .from(waterEntries)
      .where(and(eq(waterEntries.id, parsedInput.id), eq(waterEntries.userId, ctx.user.id)))
      .limit(1)

    if (!existing) {
      return { success: false, error: 'errors.entry-not-found' } satisfies ErrorResponse
    }

    await db
      .update(waterEntries)
      .set({ amount: parsedInput.amount })
      .where(and(eq(waterEntries.id, parsedInput.id), eq(waterEntries.userId, ctx.user.id)))

    return { success: true }
  })

export const deleteWaterEntry = authActionClient
  .inputSchema(DeleteWaterEntrySchema)
  .action(async ({ parsedInput, ctx }) => {
    const [entry] = await db
      .select({ id: waterEntries.id })
      .from(waterEntries)
      .where(and(eq(waterEntries.id, parsedInput.id), eq(waterEntries.userId, ctx.user.id)))
      .limit(1)

    if (!entry) {
      return { success: false, error: 'errors.entry-not-found' } satisfies ErrorResponse
    }

    await db.delete(waterEntries).where(and(eq(waterEntries.id, parsedInput.id), eq(waterEntries.userId, ctx.user.id)))

    return { success: true }
  })
