import { useQuery } from '@tanstack/react-query'

import { getFoodEntries } from '@/actions/get-food-entries'

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function useFoodEntries(date: Date) {
  const dateKey = formatDateKey(date)

  return useQuery({
    queryKey: ['food-entries', dateKey],
    queryFn: async () => {
      const result = await getFoodEntries({ date: dateKey })
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- result.data is undefined when action errors
      return result?.data ?? []
    }
  })
}

export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snacks'

type FoodEntry = {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  mealCategory: MealCategory
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
