'use server'

import type { ErrorResponse } from '@/types'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { db } from '@/db'
import { foodEntries } from '@/db/schemas'
import { authActionClient } from '@/lib/safe-action'
import { DeleteFoodEntrySchema } from '@/lib/zod-schemas'

export const deleteFoodEntry = authActionClient
  .inputSchema(DeleteFoodEntrySchema)
  .action(async ({ parsedInput, ctx }) => {
    const [entry] = await db
      .select({ id: foodEntries.id })
      .from(foodEntries)
      .where(and(eq(foodEntries.id, parsedInput.id), eq(foodEntries.userId, ctx.user.id)))
      .limit(1)

    if (!entry) {
      return { success: false, error: 'errors.entry-not-found' } satisfies ErrorResponse
    }

    await db.delete(foodEntries).where(and(eq(foodEntries.id, parsedInput.id), eq(foodEntries.userId, ctx.user.id)))

    revalidatePath('/dashboard')

    return { success: true }
  })
