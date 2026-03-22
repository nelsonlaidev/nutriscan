import { eq } from 'drizzle-orm'

import { users } from '@/db/schemas'

import { protectedProcedure } from '../procedures'
import { CompleteOnboardingInputSchema } from '../schemas/onboarding.schema'

const complete = protectedProcedure.input(CompleteOnboardingInputSchema).handler(async ({ input, context }) => {
  await context.db
    .update(users)
    .set({
      startingWeight: input.currentWeight,
      currentWeight: input.currentWeight,
      goalWeight: input.goalWeight,
      height: input.height,
      birthday: input.birthday,
      gender: input.gender,
      plan: input.plan,
      calorieBudget: input.calorieBudget,
      proteinTarget: input.proteinTarget,
      carbTarget: input.carbTarget,
      fatTarget: input.fatTarget,
      onboarded: true,
    })
    .where(eq(users.id, context.session.user.id))
})

export const onboardingRouter = {
  complete,
}
