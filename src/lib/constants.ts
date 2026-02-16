import { env } from '@/env'

export const isProd = env.NODE_ENV === 'production'
export const isDev = env.NODE_ENV === 'development'

export const DEFAULT_LOCALE = 'en'
export const LOCALES = [DEFAULT_LOCALE, 'zh-TW'] as const
export const LOCALE_ITEMS = [
  { label: 'English', value: 'en' },
  { label: '繁體中文', value: 'zh-TW' }
]

export const DEFAULT_CURRENT_WEIGHT = 70
export const DEFAULT_GOAL_WEIGHT = 60
export const DEFAULT_HEIGHT = 170
export const DEFAULT_WATER_GOAL = 2500

export const MAX_WATER_INTAKE = 10_000
