import { createSafeActionClient } from 'next-safe-action'
import { ZodError } from 'zod'

import { getSession } from '@/lib/auth'

import { SERVER_ERROR_MESSAGE, VALIDATION_ERROR_MESSAGE } from './safe-action-utils'

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    if (e instanceof ZodError) {
      console.error(e.message)
      return VALIDATION_ERROR_MESSAGE
    }

    console.error('Action error:', e.message)
    return SERVER_ERROR_MESSAGE
  }
})

export const authActionClient = actionClient.use(async ({ next }) => {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  return next({ ctx: { user: session.user } })
})
