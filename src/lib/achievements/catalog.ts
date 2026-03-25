import type { Translator } from '@/types'
import type { AchievementDefinition, AchievementGroup, AchievementId } from './types'

export const ACHIEVEMENT_CATALOG = [
  {
    id: 'first_meal_logged',
    category: 'meals',
    icon: 'bowl-food',
    titleKey: 'achievements.items.first-meal-logged.title',
    descriptionKey: 'achievements.items.first-meal-logged.description',
    target: 1,
    progressKind: 'entries',
  },
  {
    id: 'all_meals_in_a_day',
    category: 'meals',
    icon: 'target',
    titleKey: 'achievements.items.all-meals-in-a-day.title',
    descriptionKey: 'achievements.items.all-meals-in-a-day.description',
    target: 4,
    progressKind: 'meal-categories',
  },
  {
    id: 'meal_logging_streak_7',
    category: 'meals',
    icon: 'fire',
    titleKey: 'achievements.items.meal-logging-streak-7.title',
    descriptionKey: 'achievements.items.meal-logging-streak-7.description',
    target: 7,
    progressKind: 'streak-days',
  },
  {
    id: 'first_water_logged',
    category: 'water',
    icon: 'drop',
    titleKey: 'achievements.items.first-water-logged.title',
    descriptionKey: 'achievements.items.first-water-logged.description',
    target: 1,
    progressKind: 'entries',
  },
  {
    id: 'water_logging_days_7',
    category: 'water',
    icon: 'calendar-blank',
    titleKey: 'achievements.items.water-logging-days-7.title',
    descriptionKey: 'achievements.items.water-logging-days-7.description',
    target: 7,
    progressKind: 'days',
  },
  {
    id: 'water_logging_streak_7',
    category: 'water',
    icon: 'fire',
    titleKey: 'achievements.items.water-logging-streak-7.title',
    descriptionKey: 'achievements.items.water-logging-streak-7.description',
    target: 7,
    progressKind: 'streak-days',
  },
  {
    id: 'first_weigh_in',
    category: 'weight',
    icon: 'scales',
    titleKey: 'achievements.items.first-weigh-in.title',
    descriptionKey: 'achievements.items.first-weigh-in.description',
    target: 1,
    progressKind: 'entries',
  },
  {
    id: 'weight_checkins_7',
    category: 'weight',
    icon: 'check-circle',
    titleKey: 'achievements.items.weight-checkins-7.title',
    descriptionKey: 'achievements.items.weight-checkins-7.description',
    target: 7,
    progressKind: 'check-ins',
  },
  {
    id: 'weight_checkins_30',
    category: 'weight',
    icon: 'barbell',
    titleKey: 'achievements.items.weight-checkins-30.title',
    descriptionKey: 'achievements.items.weight-checkins-30.description',
    target: 30,
    progressKind: 'check-ins',
  },
] as const satisfies readonly AchievementDefinition[]

export const ACHIEVEMENT_COUNT = ACHIEVEMENT_CATALOG.length

export const ACHIEVEMENT_CATALOG_BY_ID = Object.fromEntries(
  ACHIEVEMENT_CATALOG.map((achievement) => [achievement.id, achievement]),
) as Record<AchievementId, AchievementDefinition>

export const MEAL_ACHIEVEMENT_IDS = ACHIEVEMENT_CATALOG.filter((achievement) => achievement.category === 'meals').map(
  (achievement) => achievement.id,
)

export const WATER_ACHIEVEMENT_IDS = ACHIEVEMENT_CATALOG.filter((achievement) => achievement.category === 'water').map(
  (achievement) => achievement.id,
)

export const WEIGHT_ACHIEVEMENT_IDS = ACHIEVEMENT_CATALOG.filter(
  (achievement) => achievement.category === 'weight',
).map((achievement) => achievement.id)

export const ACHIEVEMENT_IDS_BY_GROUP = {
  meals: MEAL_ACHIEVEMENT_IDS,
  water: WATER_ACHIEVEMENT_IDS,
  weight: WEIGHT_ACHIEVEMENT_IDS,
} satisfies Record<AchievementGroup, AchievementId[]>

export function getAchievementTitle(id: AchievementId, t: Translator) {
  return t(ACHIEVEMENT_CATALOG_BY_ID[id].titleKey as never)
}

export function getAchievementDescription(id: AchievementId, t: Translator) {
  return t(ACHIEVEMENT_CATALOG_BY_ID[id].descriptionKey as never)
}

export function getAchievementProgressText(id: AchievementId, current: number, t: Translator) {
  const definition = ACHIEVEMENT_CATALOG_BY_ID[id]
  const values = {
    current: Math.min(current, definition.target),
    target: definition.target,
  }

  switch (definition.progressKind) {
    case 'check-ins': {
      return t('achievements.progress.check-ins', values)
    }
    case 'days': {
      return t('achievements.progress.days', values)
    }
    case 'entries': {
      return t('achievements.progress.entries', values)
    }
    case 'meal-categories': {
      return t('achievements.progress.meal-categories', values)
    }
    case 'streak-days': {
      return t('achievements.progress.streak-days', values)
    }
    default: {
      throw new Error('Unknown progress kind')
    }
  }
}
