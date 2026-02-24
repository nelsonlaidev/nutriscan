'use server'

import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { users } from '@/db/schemas/auth.schema'
import { authActionClient } from '@/lib/safe-action'
import { OnboardingActionSchema } from '@/lib/zod-schemas'

export const completeOnboarding = authActionClient
  .inputSchema(OnboardingActionSchema)
  .action(async ({ parsedInput, ctx }) => {
    await db
      .update(users)
      .set({
        startingWeight: parsedInput.currentWeight,
        currentWeight: parsedInput.currentWeight,
        goalWeight: parsedInput.goalWeight,
        height: parsedInput.height,
        birthday: parsedInput.birthday,
        gender: parsedInput.gender,
        calorieBudget: parsedInput.calorieBudget,
        proteinTarget: parsedInput.proteinTarget,
        carbTarget: parsedInput.carbTarget,
        fatTarget: parsedInput.fatTarget,
        onboarded: true
      })
      .where(eq(users.id, ctx.user.id))

    return { success: true }
  })
