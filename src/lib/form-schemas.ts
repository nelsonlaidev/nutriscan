import * as z from 'zod'

export const OnboardingStep1Schema = z.object({
  currentWeight: z
    .number()
    .int('Weight must be a whole number')
    .min(20, 'Weight must be at least 20 kg')
    .max(300, 'Weight must be at most 300 kg')
    .positive('Weight must be a positive number')
    .or(z.literal(''))
    .refine((val) => val !== '', {
      message: 'Please enter your current weight'
    })
})

export const OnboardingStep2Schema = z.object({
  goalWeight: z
    .number()
    .int('Goal weight must be a whole number')
    .min(20, 'Goal weight must be at least 20 kg')
    .max(300, 'Goal weight must be at most 300 kg')
    .positive('Goal weight must be a positive number')
    .or(z.literal(''))
    .refine((val) => val !== '', {
      message: 'Please enter your goal weight'
    })
})

export const OnboardingStep3Schema = z.object({
  height: z
    .number()
    .int('Height must be a whole number')
    .min(50, 'Height must be at least 50 cm')
    .max(250, 'Height must be at most 250 cm')
    .positive('Height must be a positive number')
    .or(z.literal(''))
    .refine((val) => val !== '', {
      message: 'Please enter your height'
    })
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
