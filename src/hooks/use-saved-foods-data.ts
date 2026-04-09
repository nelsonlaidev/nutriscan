import type { FoodLibraryRecord } from '@/lib/food-library'
import type { CustomFoodsOutput, SavedFoodsOutput, SavedMealTemplateListOutput } from '@/orpc/client'

import { useMemo, useState } from 'react'

import { useCustomFoods, useSavedFoods, useSavedMealTemplates } from '@/hooks/queries/food.query'
import { filterFoodRecords, getNutritionTotals } from '@/lib/food-library'

const EMPTY_CUSTOM_FOODS = [] as const satisfies CustomFoodsOutput
const EMPTY_SAVED_FOODS = [] as const satisfies SavedFoodsOutput
const EMPTY_SAVED_MEALS = [] as const satisfies SavedMealTemplateListOutput

type LibraryTab = 'all' | 'my-meals' | 'saved-foods'

type MealBuilderItem = {
  id: string
  foodName: string
  servingSize: string
  calories: number
  protein: number
  carbs: number
  fat: number
  imageUrl?: string
  sourceLabel: string
}

export type MealBuilderSourceItem = FoodLibraryRecord & {
  id: string
  sourceLabel: string
}

type DialogState = 'saved-food' | 'meal-builder' | null

type SavedMealLike = SavedMealTemplateListOutput[number]

export function useSavedFoodsData() {
  const [tab, setTab] = useState<LibraryTab>('all')
  const [search, setSearch] = useState('')
  const [dialogState, setDialogState] = useState<DialogState>(null)
  const [mealName, setMealName] = useState('')
  const [mealItemSearch, setMealItemSearch] = useState('')
  const [mealItems, setMealItems] = useState<MealBuilderItem[]>([])
  const [deleteDialogTemplate, setDeleteDialogTemplate] = useState<SavedMealLike | null>(null)

  const customFoodsQuery = useCustomFoods()
  const savedFoodsQuery = useSavedFoods()
  const savedMealsQuery = useSavedMealTemplates()

  const customFoods = customFoodsQuery.data ?? EMPTY_CUSTOM_FOODS
  const savedFoods = savedFoodsQuery.data ?? EMPTY_SAVED_FOODS
  const savedMeals = savedMealsQuery.data ?? EMPTY_SAVED_MEALS
  const libraryFoods = useMemo(
    () => [
      ...savedFoods,
      ...customFoods.map((item) => ({
        ...item,
        source: 'manual' as const,
      })),
    ],
    [customFoods, savedFoods],
  )

  const query = search.trim()
  const filteredSavedFoods = useMemo(() => filterFoodRecords(libraryFoods, query), [libraryFoods, query])
  const filteredSavedMeals = useMemo(() => {
    const normalized = query.toLowerCase()

    if (!normalized) {
      return savedMeals
    }

    return savedMeals.filter((meal) => {
      return [meal.name, ...meal.items.map((item) => item.foodName)].join(' ').toLowerCase().includes(normalized)
    })
  }, [query, savedMeals])

  const mealBuilderSources = useMemo(() => {
    const saved = libraryFoods.map((item) => ({
      ...item,
      sourceLabel: 'saved-meals.saved-foods-tab', // Will be translated in component
    }))

    return filterFoodRecords(saved, mealItemSearch).slice(0, 8) as MealBuilderSourceItem[]
  }, [libraryFoods, mealItemSearch])

  const mealTotals = useMemo(() => getNutritionTotals(mealItems), [mealItems])

  const hasError = customFoodsQuery.isError || savedFoodsQuery.isError || savedMealsQuery.isError
  const isLoading = customFoodsQuery.isLoading || savedFoodsQuery.isLoading || savedMealsQuery.isLoading

  function handleAddMealItem(item: MealBuilderSourceItem) {
    setMealItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        foodName: item.foodName,
        servingSize: item.servingSize,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fat: item.fat,
        imageUrl: 'imageUrl' in item ? (item.imageUrl ?? undefined) : undefined,
        sourceLabel: item.sourceLabel,
      },
    ])
  }

  function handleRemoveMealItem(id: string) {
    setMealItems((current) => current.filter((mealItem) => mealItem.id !== id))
  }

  function resetMealBuilder() {
    setMealName('')
    setMealItemSearch('')
    setMealItems([])
  }

  function retryAllQueries() {
    void customFoodsQuery.refetch()
    void savedFoodsQuery.refetch()
    void savedMealsQuery.refetch()
  }

  return {
    // State
    tab,
    setTab,
    search,
    setSearch,
    dialogState,
    setDialogState,
    mealName,
    setMealName,
    mealItemSearch,
    setMealItemSearch,
    mealItems,
    setMealItems,
    deleteDialogTemplate,
    setDeleteDialogTemplate,

    // Data
    savedFoods,
    savedMeals,
    filteredSavedFoods,
    filteredSavedMeals,
    mealBuilderSources,
    mealTotals,

    // Status
    hasError,
    isLoading,
    customFoodsQuery,
    savedFoodsQuery,
    savedMealsQuery,

    // Actions
    handleAddMealItem,
    handleRemoveMealItem,
    resetMealBuilder,
    retryAllQueries,
  }
}
