import type { Locale } from 'next-intl'
import type { DeepObject } from '@/types'

import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

import { getSession } from '@/lib/auth'
import { DEFAULT_LOCALE } from '@/lib/constants'

export default getRequestConfig(async () => {
  let locale: Locale

  try {
    const session = await getSession()
    if (session?.user.locale) {
      locale = session.user.locale as Locale
    }
  } catch {
    // Not authenticated or headers unavailable — use cookie value
  }

  const cookieStore = await cookies()

  // Logic here should mirror your middleware priority
  // 1. Check DB (if possible in this context)
  // 2. Check Cookie

  locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined) ?? DEFAULT_LOCALE

  const mod = (await import(`../../messages/${locale}.json`)) as { default: DeepObject }
  const messages = mod.default

  return {
    locale,
    messages,
  }
})
