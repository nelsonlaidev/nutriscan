export const ACHIEVEMENT_GROUPS = ['meals', 'water', 'weight'] as const

export type AchievementGroup = (typeof ACHIEVEMENT_GROUPS)[number]

export const ACHIEVEMENT_IDS = [
  'all_meals_in_a_day',
  'first_meal_logged',
  'first_water_logged',
  'first_weigh_in',
  'meal_logging_streak_7',
  'water_logging_days_7',
  'water_logging_streak_7',
  'weight_checkins_30',
  'weight_checkins_7',
] as const

export const ACHIEVEMENT_ICONS = [
  'barbell',
  'bowl-food',
  'calendar-blank',
  'check-circle',
  'drop',
  'fire',
  'scales',
  'target',
] as const

export type AchievementIcon = (typeof ACHIEVEMENT_ICONS)[number]

export type AchievementProgressKind = 'check-ins' | 'days' | 'entries' | 'meal-categories' | 'streak-days'

export type AchievementId = (typeof ACHIEVEMENT_IDS)[number]

export type AchievementDefinition = {
  id: AchievementId
  category: AchievementGroup
  icon: AchievementIcon
  titleKey: string
  descriptionKey: string
  target: number
  progressKind: AchievementProgressKind
}

export type AchievementMetric = {
  current: number
  target: number
}

export type AchievementUnlockSummary = {
  id: AchievementId
  category: AchievementGroup
  unlockedAt: Date
}

export type AchievementStreak = {
  current: number
  best: number
}

export type AchievementStreaks = {
  mealLogging: AchievementStreak
  waterLogging: AchievementStreak
}
