import type { ORPCContext } from './context'

import { ORPCError, os } from '@orpc/server'

const base = os.$context<ORPCContext>()

const authMiddleware = base.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError('UNAUTHORIZED')
  }

  return next({
    context: {
      session: context.session,
    },
  })
})

export const publicProcedure = base
export const protectedProcedure = publicProcedure.use(authMiddleware)
