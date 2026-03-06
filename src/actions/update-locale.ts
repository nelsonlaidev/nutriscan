'use server'

import { eq } from 'drizzle-orm'
import { cookies } from 'next/headers'

import { db } from '@/db'
import { users } from '@/db/schemas/auth.schema'
import { authActionClient } from '@/lib/safe-action'
import { UpdateLocaleSchema } from '@/lib/zod-schemas'

export const updateLocale = authActionClient.inputSchema(UpdateLocaleSchema).action(async ({ parsedInput, ctx }) => {
  const cookieStore = await cookies()

  cookieStore.set('NEXT_LOCALE', parsedInput.locale)
  await db.update(users).set({ locale: parsedInput.locale }).where(eq(users.id, ctx.user.id))

  return { success: true }
})
