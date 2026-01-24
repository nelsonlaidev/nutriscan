'use server'

import { eq } from 'drizzle-orm'
import * as z from 'zod'

import { db } from '@/db'
import { users } from '@/db/schemas/auth.schema'
import { authActionClient } from '@/lib/safe-action'

const onboardingSchema = z.object({
  currentWeight: z.number().int().min(30).max(300),
  goalWeight: z.number().int().min(30).max(300),
  height: z.number().int().min(100).max(250)
})

export const completeOnboarding = authActionClient
  .inputSchema(onboardingSchema)
  .action(async ({ parsedInput, ctx }) => {
    await db
      .update(users)
      .set({
        currentWeight: parsedInput.currentWeight,
        goalWeight: parsedInput.goalWeight,
        height: parsedInput.height,
        onboarded: true
      })
      .where(eq(users.id, ctx.user.id))

    return { success: true }
  })
