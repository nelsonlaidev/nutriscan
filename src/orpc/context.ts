import { headers } from 'next/headers'

import { db } from '@/db'
import { getSession } from '@/lib/auth'

export async function createORPCContext() {
  const session = await getSession()

  return {
    session,
    db,
    headers: await headers(),
  }
}

export type ORPCContext = Awaited<ReturnType<typeof createORPCContext>>
