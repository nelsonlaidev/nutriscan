import { and, eq, inArray, sql } from 'drizzle-orm'

import { db } from '@/db'
import { foodEntries } from '@/db/schemas/food-entry.schema'
import { MEAL_EMOJI } from '@/lib/constants'

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snacks'

type FoodEntry = {
  calories: number
  protein: number
  carbs: number
  fat: number
  mealCategory: MealCategory
}

export async function getFoodEntriesByDate(userId: string, date: string) {
  return db
    .select()
    .from(foodEntries)
    .where(and(eq(foodEntries.userId, userId), eq(foodEntries.date, date)))
}

export async function getFoodEntriesByDateAndCategory(userId: string, date: string, category: MealCategory) {
  return db
    .select()
    .from(foodEntries)
    .where(and(eq(foodEntries.userId, userId), eq(foodEntries.date, date), eq(foodEntries.mealCategory, category)))
}

export function computeTotals(entries: FoodEntry[]) {
  let calories = 0
  let protein = 0
  let carbs = 0
  let fat = 0

  for (const entry of entries) {
    calories += entry.calories
    protein += entry.protein
    carbs += entry.carbs
    fat += entry.fat
  }

  return { calories, protein, carbs, fat }
}

const MEAL_META: Record<MealCategory, { name: string; emoji: string }> = {
  breakfast: { name: 'Breakfast', emoji: MEAL_EMOJI.breakfast },
  lunch: { name: 'Lunch', emoji: MEAL_EMOJI.lunch },
  dinner: { name: 'Dinner', emoji: MEAL_EMOJI.dinner },
  snacks: { name: 'Snacks', emoji: MEAL_EMOJI.snacks }
}

export async function getCalorieTotalsByDate(userId: string, dates: string[]) {
  if (dates.length === 0) return []

  return db
    .select({
      date: foodEntries.date,
      calories: sql<number>`cast(coalesce(sum(${foodEntries.calories}), 0) as real)`
    })
    .from(foodEntries)
    .where(and(eq(foodEntries.userId, userId), inArray(foodEntries.date, dates)))
    .groupBy(foodEntries.date)
}

export async function getNutritionTotalsByDate(userId: string, dates: string[]) {
  if (dates.length === 0) return []

  return db
    .select({
      date: foodEntries.date,
      protein: sql<number>`cast(coalesce(sum(${foodEntries.protein}), 0) as real)`,
      carbs: sql<number>`cast(coalesce(sum(${foodEntries.carbs}), 0) as real)`,
      fat: sql<number>`cast(coalesce(sum(${foodEntries.fat}), 0) as real)`
    })
    .from(foodEntries)
    .where(and(eq(foodEntries.userId, userId), inArray(foodEntries.date, dates)))
    .groupBy(foodEntries.date)
}

export function computeMealBreakdowns(entries: FoodEntry[]) {
  const categories: MealCategory[] = ['breakfast', 'lunch', 'dinner', 'snacks']

  return categories.map((id) => {
    const items = entries.filter((e) => e.mealCategory === id)
    let calories = 0
    for (const item of items) {
      calories += item.calories
    }
    return { id, ...MEAL_META[id], items: items.length, calories: Math.round(calories) }
  })
}
