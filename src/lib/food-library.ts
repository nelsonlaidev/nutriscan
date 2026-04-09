export type FoodNutritionLike = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export type FoodLibraryRecord = FoodNutritionLike & {
  foodName: string
  servingSize: string
  imageUrl?: string | null
}

export const FOOD_DATABASE = [
  {
    id: 'catalog-oats',
    foodName: 'Overnight Oats',
    servingSize: '1 jar',
    calories: 320,
    protein: 16,
    carbs: 42,
    fat: 9,
  },
  {
    id: 'catalog-greek-yogurt',
    foodName: 'Greek Yogurt Bowl',
    servingSize: '1 bowl',
    calories: 240,
    protein: 19,
    carbs: 20,
    fat: 8,
  },
  {
    id: 'catalog-chicken-rice',
    foodName: 'Chicken Rice Bowl',
    servingSize: '1 bowl',
    calories: 520,
    protein: 38,
    carbs: 46,
    fat: 18,
  },
  {
    id: 'catalog-salmon',
    foodName: 'Salmon Plate',
    servingSize: '180g plate',
    calories: 470,
    protein: 34,
    carbs: 24,
    fat: 22,
  },
  {
    id: 'catalog-wrap',
    foodName: 'Turkey Wrap',
    servingSize: '1 wrap',
    calories: 410,
    protein: 27,
    carbs: 30,
    fat: 16,
  },
  {
    id: 'catalog-salad',
    foodName: 'Tuna Salad',
    servingSize: '1 bowl',
    calories: 290,
    protein: 25,
    carbs: 12,
    fat: 14,
  },
  {
    id: 'catalog-banana',
    foodName: 'Banana',
    servingSize: '1 medium',
    calories: 105,
    protein: 1,
    carbs: 27,
    fat: 0,
  },
  {
    id: 'catalog-protein-shake',
    foodName: 'Protein Shake',
    servingSize: '1 bottle',
    calories: 190,
    protein: 30,
    carbs: 9,
    fat: 3,
  },
] as const satisfies ReadonlyArray<FoodLibraryRecord & { id: string }>

export function getNutritionTotals(items: FoodNutritionLike[]) {
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 }

  for (const item of items) {
    totals.calories += item.calories
    totals.protein += item.protein
    totals.carbs += item.carbs
    totals.fat += item.fat
  }

  return totals
}

export function filterFoodRecords<T extends FoodLibraryRecord>(items: T[], query: string) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return items
  }

  return items.filter((item) => {
    return [item.foodName, item.servingSize].join(' ').toLowerCase().includes(normalizedQuery)
  })
}
