import type { DeepObject } from '@/types'
import type { Locale } from 'next-intl'

import { getRequestConfig } from 'next-intl/server'

import { getSession } from '@/lib/auth'
import { DEFAULT_LOCALE } from '@/lib/constants'

export default getRequestConfig(async () => {
  let locale: Locale = DEFAULT_LOCALE

  try {
    const session = await getSession()
    if (session?.user.locale) {
      locale = session.user.locale as Locale
    }
  } catch {
    // Not authenticated or headers unavailable — use cookie value
  }

  const mod = (await import(`../../messages/${locale}.json`)) as { default: DeepObject }
  const messages = mod.default

  return {
    locale,
    messages
  }
})
