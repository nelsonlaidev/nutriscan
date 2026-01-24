import * as z from 'zod'

export const OnboardingStep1Schema = z.object({
  currentWeight: z.number().min(1, 'Current weight is not valid')
})

export const OnboardingStep2Schema = z.object({
  goalWeight: z.number().min(1, 'Goal weight is not valid')
})

export const OnboardingStep3Schema = z.object({
  height: z.number().min(1, 'Height is not valid')
})

export const SignInSchema = z.object({
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password must be at most 128 characters long')
})

export const SignUpSchema = z
  .object({
    name: z.string().min(1, 'Display name is required'),
    email: z.email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .max(128, 'Password must be at most 128 characters long'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })
