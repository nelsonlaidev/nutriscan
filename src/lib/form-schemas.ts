import * as z from 'zod'

export const OnboardingStep1Schema = z.object({
  name: z.string().min(1, 'Name is required')
})

export const OnboardingStep2Schema = z.object({
  currentWeight: z.number().min(1, 'Current weight is not valid')
})

export const OnboardingStep3Schema = z.object({
  goalWeight: z.number().min(1, 'Goal weight is not valid')
})

export const OnboardingStep4Schema = z.object({
  height: z.number().min(1, 'Height is not valid')
})
