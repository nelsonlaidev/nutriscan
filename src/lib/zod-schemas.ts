import * as z from 'zod'

const CurrentWeightField = z
  .number()
  .min(20, 'Weight must be at least 20 kg')
  .max(300, 'Weight must be at most 300 kg')
  .positive('Weight must be a positive number')

const GoalWeightField = z
  .number()
  .min(20, 'Goal weight must be at least 20 kg')
  .max(300, 'Goal weight must be at most 300 kg')
  .positive('Goal weight must be a positive number')

const HeightField = z
  .number()
  .min(50, 'Height must be at least 50 cm')
  .max(250, 'Height must be at most 250 cm')
  .positive('Height must be a positive number')

export const OnboardingFieldsFormSchema = z.object({
  currentWeight: CurrentWeightField.or(z.literal('')).refine((val) => val !== '', {
    message: 'Please enter your current weight'
  }),
  goalWeight: GoalWeightField.or(z.literal('')).refine((val) => val !== '', {
    message: 'Please enter your goal weight'
  }),
  height: HeightField.or(z.literal('')).refine((val) => val !== '', {
    message: 'Please enter your height'
  })
})

export const OnboardingStep1FormSchema = OnboardingFieldsFormSchema.pick({ currentWeight: true })
export const OnboardingStep2FormSchema = OnboardingFieldsFormSchema.pick({ goalWeight: true })
export const OnboardingStep3FormSchema = OnboardingFieldsFormSchema.pick({ height: true })

export const OnboardingActionSchema = z.object({
  currentWeight: CurrentWeightField,
  goalWeight: GoalWeightField,
  height: HeightField
})

export const ManualFoodEntrySchema = z.object({
  foodName: z.string().min(1, 'Food name is required'),
  servingSize: z.string().min(1, 'Serving size is required'),
  calories: z.coerce.number().min(0, 'Must be 0 or more').max(5000, 'Must be 5000 or less'),
  protein: z.coerce.number().min(0, 'Must be 0 or more').max(1000, 'Must be 1000 or less'),
  carbs: z.coerce.number().min(0, 'Must be 0 or more').max(1000, 'Must be 1000 or less'),
  fat: z.coerce.number().min(0, 'Must be 0 or more').max(1000, 'Must be 1000 or less'),
  fiber: z.coerce.number().min(0, 'Must be 0 or more').max(1000, 'Must be 1000 or less')
})

export type ManualFoodEntry = z.infer<typeof ManualFoodEntrySchema>

export const SignInFormSchema = z.object({
  email: z.email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password must be at most 128 characters long')
})

export const SignUpFormSchema = z
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
