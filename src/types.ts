import type { useTranslations } from 'next-intl'

export type DeepObject = {
  [key: string]: string | DeepObject
}

export type Translator = ReturnType<typeof useTranslations<never>>
export type TranslationKey = Parameters<Translator>[0]

export type ErrorResponse = {
  success: false
  error: TranslationKey
}

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snacks'
export type TimeRange = 'weekly' | 'monthly' | 'yearly'
