import type { CalorieChartInput, NutritionChartInput, WaterChartInput, WeightByDateRangeInput } from '@/orpc/client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useCalorieChartData(input: CalorieChartInput) {
  return useSuspenseQuery(orpc.progress.calorieChart.queryOptions({ input }))
}

export function useNutritionChartData(input: NutritionChartInput) {
  return useSuspenseQuery(orpc.progress.nutritionChart.queryOptions({ input }))
}

export function useWaterChartData(input: WaterChartInput) {
  return useSuspenseQuery(orpc.progress.waterChart.queryOptions({ input }))
}

export function useWeightByDateRange(input: WeightByDateRangeInput) {
  return useSuspenseQuery(orpc.progress.weightByDateRange.queryOptions({ input }))
}
