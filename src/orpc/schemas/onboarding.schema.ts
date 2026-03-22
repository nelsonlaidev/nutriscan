import * as z from 'zod'

export const CompleteOnboardingInputSchema = z.object({
  currentWeight: z.number().min(20).max(300).positive(),
  goalWeight: z.number().min(20).max(300).positive(),
  height: z.number().min(50).max(250).positive(),
  birthday: z.string().min(1),
  gender: z.enum(['male', 'female', 'other']),
  plan: z.enum(['relaxed', 'steady', 'accelerated']),
  calorieBudget: z.number().int().min(1),
  proteinTarget: z.number().int().min(1),
  carbTarget: z.number().int().min(1),
  fatTarget: z.number().int().min(1),
})
