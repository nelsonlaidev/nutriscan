'use server'

import { db } from '@/db'
import { feedback } from '@/db/schemas/feedback.schema'
import { authActionClient } from '@/lib/safe-action'
import { SendFeedbackSchema } from '@/lib/zod-schemas'

export const sendFeedback = authActionClient.inputSchema(SendFeedbackSchema).action(async ({ parsedInput, ctx }) => {
  await db.insert(feedback).values({
    message: parsedInput.message,
    userId: ctx.user.id
  })

  return { success: true }
})
