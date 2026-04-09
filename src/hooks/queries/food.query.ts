import type { GetFoodByIdInput, GetFoodMealsInput, GetFoodTotalsInput, ListFoodByCategoryInput } from '@/orpc/client'

import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useFoodEntriesByCategory(input: ListFoodByCategoryInput) {
  return useSuspenseQuery(orpc.food.listByCategory.queryOptions({ input }))
}

export function useFoodEntryById(input: GetFoodByIdInput) {
  return useSuspenseQuery(orpc.food.getById.queryOptions({ input }))
}

export function useCreateFoodEntry(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.food.create.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.food.key() })
        void queryClient.invalidateQueries({ queryKey: orpc.progress.key() })
        void queryClient.invalidateQueries({ queryKey: orpc.achievements.key() })
        onSuccess?.()
      },
    }),
  )
}

export function useSavedMealTemplates() {
  return useQuery(orpc.food.listSavedMeals.queryOptions())
}

export function useCreateSavedMeal(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.food.createSavedMeal.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.food.key() })
        onSuccess?.()
      },
    }),
  )
}

export function useCreateSavedMealFromCategory(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.food.createSavedMealFromCategory.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.food.key() })
        onSuccess?.()
      },
    }),
  )
}

export function useDeleteSavedMeal(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.food.deleteSavedMeal.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.food.key() })
        onSuccess?.()
      },
    }),
  )
}

export function useCustomFoods() {
  return useQuery(orpc.food.listCustomFoods.queryOptions())
}

export function useSavedFoods() {
  return useQuery(orpc.food.listSavedFoods.queryOptions())
}

export function useCreateSavedFood(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.food.createSavedFood.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.food.key() })
        onSuccess?.()
      },
    }),
  )
}

export function useDeleteSavedFood(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.food.deleteSavedFood.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.food.key() })
        onSuccess?.()
      },
    }),
  )
}

export function useDeleteFoodEntry(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.food.delete.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.food.key() })
        void queryClient.invalidateQueries({ queryKey: orpc.progress.key() })
        void queryClient.invalidateQueries({ queryKey: orpc.achievements.key() })
        onSuccess?.()
      },
    }),
  )
}

export function useFoodTotals(input: GetFoodTotalsInput) {
  return useSuspenseQuery(orpc.food.totals.queryOptions({ input }))
}

export function useFoodMeals(input: GetFoodMealsInput) {
  return useSuspenseQuery(orpc.food.meals.queryOptions({ input }))
}
