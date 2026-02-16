'use server'

import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { users } from '@/db/schemas/auth.schema'
import { authActionClient } from '@/lib/safe-action'
import { UpdateWaterGoalSchema } from '@/lib/zod-schemas'

export const updateWaterGoal = authActionClient
  .inputSchema(UpdateWaterGoalSchema)
  .action(async ({ parsedInput, ctx }) => {
    await db.update(users).set({ waterGoal: parsedInput.goal }).where(eq(users.id, ctx.user.id))

    return { success: true }
  })
