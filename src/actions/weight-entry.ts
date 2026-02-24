'use server'

import type { ErrorResponse } from '@/types'

import { and, desc, eq } from 'drizzle-orm'

import { db } from '@/db'
import { users } from '@/db/schemas/auth.schema'
import { weightEntries } from '@/db/schemas/weight-entry.schema'
import { authActionClient } from '@/lib/safe-action'
import { AddWeightEntrySchema, DeleteWeightEntrySchema, UpdateWeightEntrySchema } from '@/lib/zod-schemas'

export const addWeightEntry = authActionClient
  .inputSchema(AddWeightEntrySchema)
  .action(async ({ parsedInput, ctx }) => {
    const entry = await db
      .insert(weightEntries)
      .values({
        userId: ctx.user.id,
        weight: parsedInput.weight
      })
      .returning({ id: weightEntries.id, createdAt: weightEntries.createdAt })

    // Update user's current weight
    await db.update(users).set({ currentWeight: parsedInput.weight }).where(eq(users.id, ctx.user.id))

    return { success: true, entry: entry[0] }
  })

export const updateWeightEntry = authActionClient
  .inputSchema(UpdateWeightEntrySchema)
  .action(async ({ parsedInput, ctx }) => {
    const [existing] = await db
      .select({ id: weightEntries.id })
      .from(weightEntries)
      .where(and(eq(weightEntries.id, parsedInput.id), eq(weightEntries.userId, ctx.user.id)))
      .limit(1)

    if (!existing) {
      return { success: false, error: 'errors.entry-not-found' } satisfies ErrorResponse
    }

    await db
      .update(weightEntries)
      .set({ weight: parsedInput.weight })
      .where(and(eq(weightEntries.id, parsedInput.id), eq(weightEntries.userId, ctx.user.id)))

    // Update user's current weight if this is the latest entry
    const [latest] = await db
      .select({ id: weightEntries.id })
      .from(weightEntries)
      .where(eq(weightEntries.userId, ctx.user.id))
      .orderBy(desc(weightEntries.createdAt))
      .limit(1)

    if (latest?.id === parsedInput.id) {
      await db.update(users).set({ currentWeight: parsedInput.weight }).where(eq(users.id, ctx.user.id))
    }

    return { success: true }
  })

export const deleteWeightEntry = authActionClient
  .inputSchema(DeleteWeightEntrySchema)
  .action(async ({ parsedInput, ctx }) => {
    const [entry] = await db
      .select({ id: weightEntries.id })
      .from(weightEntries)
      .where(and(eq(weightEntries.id, parsedInput.id), eq(weightEntries.userId, ctx.user.id)))
      .limit(1)

    if (!entry) {
      return { success: false, error: 'errors.entry-not-found' } satisfies ErrorResponse
    }

    await db
      .delete(weightEntries)
      .where(and(eq(weightEntries.id, parsedInput.id), eq(weightEntries.userId, ctx.user.id)))

    // Update user's current weight to the latest remaining entry
    const [latest] = await db
      .select({ weight: weightEntries.weight })
      .from(weightEntries)
      .where(eq(weightEntries.userId, ctx.user.id))
      .orderBy(desc(weightEntries.createdAt))
      .limit(1)

    if (latest) {
      await db.update(users).set({ currentWeight: latest.weight }).where(eq(users.id, ctx.user.id))
    }

    return { success: true }
  })
