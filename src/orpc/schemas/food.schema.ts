import * as z from 'zod'

import { MEALS } from '@/lib/constants'

export const AddFoodEntryInputSchema = z.object({
  foodName: z.string().min(1),
  servingSize: z.string().min(1),
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  mealCategory: z.enum(MEALS),
  source: z.enum(['ai-scan', 'manual', 'barcode']),
  imageUrl: z.url().optional(),
})

export const DeleteFoodEntryInputSchema = z.object({
  id: z.string().min(1),
})

export const GetFoodEntriesInputSchema = z.object({
  startOfDay: z.string(),
  endOfDay: z.string(),
})

export const GetFoodEntriesByCategoryInputSchema = z.object({
  startOfDay: z.string(),
  endOfDay: z.string(),
  category: z.enum(MEALS),
})

export const GetFoodEntryByIdInputSchema = z.object({
  id: z.string().min(1),
  category: z.enum(MEALS),
})
