import type { GetFoodByIdInput, GetFoodMealsInput, GetFoodTotalsInput, ListFoodByCategoryInput } from '@/orpc/client'

import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useFoodEntriesByCategory(input: ListFoodByCategoryInput) {
  return useSuspenseQuery(orpc.food.listByCategory.queryOptions({ input }))
}

export function useFoodEntryById(input: GetFoodByIdInput) {
  return useSuspenseQuery(orpc.food.getById.queryOptions({ input }))
}

export function useCreateFoodEntry(onSuccess?: () => void) {
  return useMutation(orpc.food.create.mutationOptions({ onSuccess }))
}

export function useDeleteFoodEntry(onSuccess?: () => void) {
  return useMutation(orpc.food.delete.mutationOptions({ onSuccess }))
}

export function useFoodTotals(input: GetFoodTotalsInput) {
  return useSuspenseQuery(orpc.food.totals.queryOptions({ input }))
}

export function useFoodMeals(input: GetFoodMealsInput) {
  return useSuspenseQuery(orpc.food.meals.queryOptions({ input }))
}
