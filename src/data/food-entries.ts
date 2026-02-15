import { and, eq } from 'drizzle-orm'

import { db } from '@/db'
import { foodEntries } from '@/db/schemas/food-entry.schema'

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snacks'

type FoodEntry = {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  mealCategory: MealCategory
}

export async function getFoodEntriesByDate(userId: string, date: string) {
  return db
    .select()
    .from(foodEntries)
    .where(and(eq(foodEntries.userId, userId), eq(foodEntries.date, date)))
}

export function computeTotals(entries: FoodEntry[]) {
  let calories = 0
  let protein = 0
  let carbs = 0
  let fat = 0
  let fiber = 0

  for (const entry of entries) {
    calories += entry.calories
    protein += entry.protein
    carbs += entry.carbs
    fat += entry.fat
    fiber += entry.fiber
  }

  return { calories, protein, carbs, fat, fiber }
}

const MEAL_META: Record<MealCategory, { name: string; emoji: string }> = {
  breakfast: { name: 'Breakfast', emoji: '🍞' },
  lunch: { name: 'Lunch', emoji: '🌤️' },
  dinner: { name: 'Dinner', emoji: '🌙' },
  snacks: { name: 'Snacks', emoji: '🍿' }
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
