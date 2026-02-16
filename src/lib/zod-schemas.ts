import * as z from 'zod'

import { LOCALES, MAX_WATER_INTAKE } from './constants'

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

const NumberOrEmpty = (field: z.ZodNumber, message: string) =>
  field.or(z.literal('')).refine((val) => val !== '', { message })

export const OnboardingStep1FormSchema = z.object({
  currentWeight: NumberOrEmpty(CurrentWeightField, 'Please enter your current weight'),
  goalWeight: NumberOrEmpty(GoalWeightField, 'Please enter your goal weight')
})

export const OnboardingStep2FormSchema = z.object({
  birthday: z.string().min(1, 'Please enter your birthday'),
  height: NumberOrEmpty(HeightField, 'Please enter your height'),
  gender: z.enum(['male', 'female', 'other'], { message: 'Please select a gender' }),
  plan: z.enum(['relaxed', 'steady', 'accelerated'], { message: 'Please select a plan' })
})

export const OnboardingActionSchema = z.object({
  currentWeight: CurrentWeightField,
  goalWeight: GoalWeightField,
  height: HeightField,
  birthday: z.string().min(1),
  gender: z.enum(['male', 'female', 'other']),
  calorieBudget: z.number().int().min(1),
  proteinTarget: z.number().int().min(1),
  carbTarget: z.number().int().min(1),
  fatTarget: z.number().int().min(1)
})

export const ManualFoodEntrySchema = z.object({
  foodName: z.string().min(1, 'Food name is required'),
  servingSize: z.string().min(1, 'Serving size is required'),
  calories: z.coerce.number().min(0, 'Must be 0 or more').max(5000, 'Must be 5000 or less'),
  protein: z.coerce.number().min(0, 'Must be 0 or more').max(1000, 'Must be 1000 or less'),
  carbs: z.coerce.number().min(0, 'Must be 0 or more').max(1000, 'Must be 1000 or less'),
  fat: z.coerce.number().min(0, 'Must be 0 or more').max(1000, 'Must be 1000 or less')
})

export type ManualFoodEntry = z.infer<typeof ManualFoodEntrySchema>

export const AddFoodEntrySchema = z.object({
  foodName: z.string().min(1),
  servingSize: z.string().min(1),
  calories: z.number().min(0),
  protein: z.number().min(0),
  carbs: z.number().min(0),
  fat: z.number().min(0),
  mealCategory: z.enum(['breakfast', 'lunch', 'dinner', 'snacks']),
  source: z.enum(['ai-scan', 'manual', 'barcode']),
  imageUrl: z.url().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
})

export const BarcodeLookupSchema = z.object({
  barcode: z.string().regex(/^\d{8,14}$/, 'Barcode must be 8-14 digits')
})

export const OpenFoodFactsResponseSchema = z.object({
  status: z.number(),
  product: z
    .object({
      product_name: z.string().optional().default('Unknown Product'),
      serving_size: z.string().optional().default('100g'),
      nutriments: z
        .object({
          'energy-kcal_100g': z.number().optional().default(0),
          proteins_100g: z.number().optional().default(0),
          carbohydrates_100g: z.number().optional().default(0),
          fat_100g: z.number().optional().default(0)
        })
        .optional()
        .default({
          'energy-kcal_100g': 0,
          proteins_100g: 0,
          carbohydrates_100g: 0,
          fat_100g: 0
        })
    })
    .optional()
})

export const AiImageScanSchema = z.object({
  imageBase64: z.string().min(1)
})

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

export const UpdateLocaleSchema = z.object({
  locale: z.enum(LOCALES)
})

export const UpdateWaterGoalSchema = z.object({
  goal: z.number().int().min(500).max(MAX_WATER_INTAKE)
})

export const AddWaterEntrySchema = z.object({
  amount: z.number().int().min(1).max(MAX_WATER_INTAKE),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
})

export const UpdateWaterEntrySchema = z.object({
  id: z.string().min(1),
  amount: z.number().int().min(1).max(MAX_WATER_INTAKE)
})

export const DeleteWaterEntrySchema = z.object({
  id: z.string().min(1)
})
