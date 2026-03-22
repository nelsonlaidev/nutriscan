import * as z from 'zod'

export const AddWeightEntryInputSchema = z.object({
  weight: z.number().min(20).max(300).positive(),
})

export const UpdateWeightEntryInputSchema = z.object({
  id: z.string().min(1),
  weight: z.number().min(20).max(300).positive(),
})

export const DeleteWeightEntryInputSchema = z.object({
  id: z.string().min(1),
})
