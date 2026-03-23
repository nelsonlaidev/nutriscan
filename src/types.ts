import type { useTranslations } from 'next-intl'

export type DeepObject = {
  [key: string]: string | DeepObject
}

export type Translator = ReturnType<typeof useTranslations<never>>

export type TimeRange = 'weekly' | 'monthly' | 'yearly'
