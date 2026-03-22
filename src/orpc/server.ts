import 'server-only'

import { createRouterClient } from '@orpc/server'

import { createORPCContext } from './context'
import { router } from './routers'

globalThis.$client = createRouterClient(router, {
  context: createORPCContext,
})
