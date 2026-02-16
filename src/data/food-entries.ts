import { and, eq } from 'drizzle-orm'

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
