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
export const DEFAULT_CALORIE_BUDGET = 2000
export const DEFAULT_PROTEIN_TARGET = 150
export const DEFAULT_CARB_TARGET = 200
export const DEFAULT_FAT_TARGET = 67

export const MAX_WATER_INTAKE = 10_000

export const MEAL_EMOJI = {
  breakfast: '🍞',
  lunch: '🌤️',
  dinner: '🌙',
  snacks: '🍿'
} as const

export const MEAL_CATEGORIES = [
  { id: 'breakfast', name: 'Breakfast', emoji: MEAL_EMOJI.breakfast, items: 0, calories: 0 },
  { id: 'lunch', name: 'Lunch', emoji: MEAL_EMOJI.lunch, items: 0, calories: 0 },
  { id: 'dinner', name: 'Dinner', emoji: MEAL_EMOJI.dinner, items: 0, calories: 0 },
  { id: 'snacks', name: 'Snacks', emoji: MEAL_EMOJI.snacks, items: 0, calories: 0 }
] as const
