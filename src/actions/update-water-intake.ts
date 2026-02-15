'use server'

import { db } from '@/db'
import { waterIntakes } from '@/db/schemas/water-intake.schema'
import { authActionClient } from '@/lib/safe-action'
import { UpdateWaterIntakeSchema } from '@/lib/zod-schemas'

export const updateWaterIntake = authActionClient
  .inputSchema(UpdateWaterIntakeSchema)
  .action(async ({ parsedInput, ctx }) => {
    await db
      .insert(waterIntakes)
      .values({
        userId: ctx.user.id,
        count: parsedInput.count,
        date: parsedInput.date
      })
      .onConflictDoUpdate({
        target: [waterIntakes.userId, waterIntakes.date],
        set: { count: parsedInput.count, updatedAt: new Date() }
      })

    return { success: true }
  })
