import type messages from './messages/en.json'
import type { LOCALES } from '@/lib/constants'

import '@total-typescript/ts-reset'

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof LOCALES)[number]
    Messages: typeof messages
  }
}

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined
  }
}
