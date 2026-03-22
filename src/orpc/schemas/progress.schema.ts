import * as z from 'zod'

export const DateRangeInputSchema = z.object({
  startOfDay: z.string(),
  endOfDay: z.string(),
  hasDates: z.boolean(),
})
