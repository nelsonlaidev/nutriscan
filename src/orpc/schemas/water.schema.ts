import * as z from 'zod'

const MAX_WATER_INTAKE = 10_000

export const AddWaterEntryInputSchema = z.object({
  amount: z.number().int().min(1).max(MAX_WATER_INTAKE),
})

export const UpdateWaterEntryInputSchema = z.object({
  id: z.string().min(1),
  amount: z.number().int().min(1).max(MAX_WATER_INTAKE),
})

export const DeleteWaterEntryInputSchema = z.object({
  id: z.string().min(1),
})

export const GetWaterEntriesInputSchema = z.object({
  startOfDay: z.string(),
  endOfDay: z.string(),
})

export const GetWaterTotalInputSchema = z.object({
  startOfDay: z.string(),
  endOfDay: z.string(),
})

export const UpdateWaterGoalInputSchema = z.object({
  goal: z.number().int().min(500).max(MAX_WATER_INTAKE),
})
