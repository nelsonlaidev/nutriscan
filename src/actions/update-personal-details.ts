'use server'

import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { users } from '@/db/schemas/auth.schema'
import { weightEntries } from '@/db/schemas/weight-entry.schema'
import { getCurrentLocalDate } from '@/lib/date-utils'
import { authActionClient } from '@/lib/safe-action'
import { UpdatePersonalDetailsSchema } from '@/lib/zod-schemas'

export const updatePersonalDetails = authActionClient
  .inputSchema(UpdatePersonalDetailsSchema)
  .action(async ({ parsedInput, ctx }) => {
    const localDate = getCurrentLocalDate(ctx.user.timezone)

    await Promise.all([
      db
        .update(users)
        .set({
          currentWeight: parsedInput.currentWeight,
          goalWeight: parsedInput.goalWeight,
          height: parsedInput.height,
          birthday: parsedInput.birthday,
          gender: parsedInput.gender,
          calorieBudget: parsedInput.calorieBudget,
          proteinTarget: parsedInput.proteinTarget,
          carbTarget: parsedInput.carbTarget,
          fatTarget: parsedInput.fatTarget
        })
        .where(eq(users.id, ctx.user.id)),
      db.insert(weightEntries).values({
        userId: ctx.user.id,
        weight: parsedInput.currentWeight,
        localDate
      })
    ])

    return { success: true }
  })
