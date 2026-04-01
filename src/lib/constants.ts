import type { InferInsertModel } from 'drizzle-orm'
import type { users } from '@/db/schemas'

import { env } from '@/env'

// window is not always defined
// eslint-disable-next-line unicorn/no-typeof-undefined
export const IS_SERVER = typeof globalThis.window === 'undefined'

export const IS_PROD = env.NODE_ENV === 'production'
export const IS_DEV = env.NODE_ENV === 'development'

export const DEFAULT_LOCALE = 'en'
export const LOCALES = [DEFAULT_LOCALE, 'zh-TW', 'zh-CN'] as const
export const LOCALE_ITEMS: Array<{ label: string; value: (typeof LOCALES)[number] }> = [
  { label: 'English', value: 'en' },
  { label: '繁體中文', value: 'zh-TW' },
  { label: '简体中文', value: 'zh-CN' },
]

export const DEFAULT_STARTING_WEIGHT = 70
export const DEFAULT_CURRENT_WEIGHT = 70
export const DEFAULT_GOAL_WEIGHT = 60
export const DEFAULT_HEIGHT = 170
export const DEFAULT_WATER_GOAL = 2500
export const DEFAULT_CALORIE_BUDGET = 2000
export const DEFAULT_PROTEIN_TARGET = 150
export const DEFAULT_CARB_TARGET = 200
export const DEFAULT_FAT_TARGET = 67

export const MAX_WATER_INTAKE = 10_000
export const MAX_FEEDBACK_LENGTH = 1000

export const MEAL_EMOJI: Record<Meal, string> = {
  breakfast: '🍞',
  lunch: '🌤️',
  dinner: '🌙',
  snacks: '🍿',
} as const

export type Meal = (typeof MEALS)[number]
export const MEALS = ['breakfast', 'lunch', 'dinner', 'snacks'] as const
export const MEALS_SET = new Set(MEALS)
export const DEFAULT_MEAL: Meal = 'breakfast'

export const TIME_RANGES = ['7d', '30d', '12m'] as const
export type TimeRange = (typeof TIME_RANGES)[number]

export const TEST_USER: InferInsertModel<typeof users> = {
  id: '00000000000000000000000000000000',
  name: 'Test',
  email: 'test@example.com',
  emailVerified: true,
  startingWeight: 80,
  currentWeight: 80,
  goalWeight: 70,
  height: 175,
  birthday: '1990-06-15',
  gender: 'male',
  waterGoal: 2500,
  calorieBudget: 2200,
  proteinTarget: 160,
  carbTarget: 220,
  fatTarget: 70,
  onboarded: true,
  plan: 'steady',
}

export const TEST_USER_CLEAN: InferInsertModel<typeof users> = {
  id: '11111111111111111111111111111111',
  name: 'Fresh',
  email: 'fresh@example.com',
  emailVerified: true,
  startingWeight: 72,
  currentWeight: 72,
  goalWeight: 68,
  height: 170,
  birthday: '1994-03-20',
  gender: 'female',
  waterGoal: 2200,
  calorieBudget: 1900,
  proteinTarget: 140,
  carbTarget: 180,
  fatTarget: 63,
  onboarded: true,
}
