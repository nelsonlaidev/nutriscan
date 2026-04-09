import { describe, expect, test } from 'vitest'

import { filterFoodRecords, FOOD_DATABASE, getNutritionTotals } from './food-library'

describe('food library helpers', () => {
  test('filters records by name or serving size', () => {
    const filtered = filterFoodRecords([...FOOD_DATABASE], 'bowl')

    expect(filtered.map((item) => item.foodName)).toEqual(['Greek Yogurt Bowl', 'Chicken Rice Bowl', 'Tuna Salad'])
  })

  test('returns all records when the query is empty', () => {
    expect(filterFoodRecords([...FOOD_DATABASE], '   ')).toHaveLength(FOOD_DATABASE.length)
  })

  test('sums nutrition totals', () => {
    expect(
      getNutritionTotals([
        { calories: 240, protein: 18, carbs: 12, fat: 7 },
        { calories: 320, protein: 22, carbs: 35, fat: 11 },
      ]),
    ).toStrictEqual({
      calories: 560,
      protein: 40,
      carbs: 47,
      fat: 18,
    })
  })
})
