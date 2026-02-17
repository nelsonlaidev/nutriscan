'use server'

import { revalidatePath } from 'next/cache'

import { db } from '@/db'
import { foodEntries } from '@/db/schemas/food-entry.schema'
import { getCurrentLocalDate } from '@/lib/date-utils'
import { authActionClient } from '@/lib/safe-action'
import { AddFoodEntrySchema } from '@/lib/zod-schemas'

export const addFoodEntry = authActionClient.inputSchema(AddFoodEntrySchema).action(async ({ parsedInput, ctx }) => {
  await db.insert(foodEntries).values({
    ...parsedInput,
    userId: ctx.user.id,
    localDate: getCurrentLocalDate(ctx.user.timezone)
  })

  revalidatePath('/dashboard')

  return { success: true }
})
