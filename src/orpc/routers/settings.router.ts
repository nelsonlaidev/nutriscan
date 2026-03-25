import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'

import { users } from '@/db/schemas/auth.schema'
import { feedback } from '@/db/schemas/feedback.schema'
import { weightEntries } from '@/db/schemas/weight-entry.schema'
import { evaluateAndUnlockAchievementGroup } from '@/lib/achievements/server'

import { protectedProcedure } from '../procedures'
import {
  SendFeedbackInputSchema,
  UpdateLocaleInputSchema,
  UpdatePersonalDetailsInputSchema,
} from '../schemas/settings.schema'

const updatePersonalDetails = protectedProcedure
  .input(UpdatePersonalDetailsInputSchema)
  .handler(async ({ input, context }) =>
    context.db.transaction(async (tx) => {
      await Promise.all([
        tx
          .update(users)
          .set({
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
          })
          .where(eq(users.id, context.session.user.id)),
        tx.insert(weightEntries).values({
          userId: context.session.user.id,
          weight: input.currentWeight,
        }),
      ])

      const newUnlocks = await evaluateAndUnlockAchievementGroup(tx, context.session.user.id, 'weight')

      return { newUnlocks }
    }),
  )

const updateLocale = protectedProcedure.input(UpdateLocaleInputSchema).handler(async ({ input, context }) => {
  const cookieStore = await cookies()
  cookieStore.set('NEXT_LOCALE', input.locale)
  await context.db.update(users).set({ locale: input.locale }).where(eq(users.id, context.session.user.id))
})

const sendFeedback = protectedProcedure.input(SendFeedbackInputSchema).handler(async ({ input, context }) => {
  await context.db.insert(feedback).values({
    message: input.message,
    userId: context.session.user.id,
  })
})

export const settingsRouter = {
  updatePersonalDetails,
  updateLocale,
  sendFeedback,
}
