import type { Translator } from '@/types'

import * as z from 'zod'

import { LOCALES, MAX_FEEDBACK_LENGTH, MAX_WATER_INTAKE } from './constants'

const NumberOrEmpty = (field: z.ZodNumber, message: string) =>
  field.or(z.literal('')).refine((val) => val !== '', { message })

export function createOnboardingStep1FormSchema(t: Translator) {
  return z.object({
    currentWeight: NumberOrEmpty(
      z
        .number()
        .min(20, t('validation.weight-min'))
        .max(300, t('validation.weight-max'))
        .positive(t('validation.weight-positive')),
      t('validation.current-weight-required'),
    ),
    goalWeight: NumberOrEmpty(
      z
        .number()
        .min(20, t('validation.goal-weight-min'))
        .max(300, t('validation.goal-weight-max'))
        .positive(t('validation.goal-weight-positive')),
      t('validation.goal-weight-required'),
    ),
  })
}

export function createOnboardingStep2FormSchema(t: Translator) {
  return z.object({
    birthday: z.string().min(1, t('validation.birthday-required')),
    height: NumberOrEmpty(
      z
        .number()
        .min(50, t('validation.height-min'))
        .max(250, t('validation.height-max'))
        .positive(t('validation.height-positive')),
      t('validation.height-required'),
    ),
    gender: z.enum(['male', 'female', 'other'], { message: t('validation.gender-required') }),
    plan: z.enum(['relaxed', 'steady', 'accelerated'], { message: t('validation.plan-required') }),
  })
}

export function createPersonalDetailsFormSchema(t: Translator) {
  return z.object({
    currentWeight: NumberOrEmpty(
      z
        .number()
        .min(20, t('validation.weight-min'))
        .max(300, t('validation.weight-max'))
        .positive(t('validation.weight-positive')),
      t('validation.current-weight-required'),
    ),
    goalWeight: NumberOrEmpty(
      z
        .number()
        .min(20, t('validation.goal-weight-min'))
        .max(300, t('validation.goal-weight-max'))
        .positive(t('validation.goal-weight-positive')),
      t('validation.goal-weight-required'),
    ),
    birthday: z.string().min(1, t('validation.birthday-required')),
    height: NumberOrEmpty(
      z
        .number()
        .min(50, t('validation.height-min'))
        .max(250, t('validation.height-max'))
        .positive(t('validation.height-positive')),
      t('validation.height-required'),
    ),
    gender: z.enum(['male', 'female', 'other'], { message: t('validation.gender-required') }),
    plan: z.enum(['relaxed', 'steady', 'accelerated'], { message: t('validation.plan-required') }),
  })
}

export const UpdatePersonalDetailsSchema = z.object({
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

export const OnboardingActionSchema = z.object({
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

export function createManualFoodEntrySchema(t: Translator) {
  return z.object({
    foodName: z.string().min(1, t('validation.food-name-required')),
    servingSize: z.string().min(1, t('validation.serving-size-required')),
    calories: z.number().min(0, t('validation.must-be-0-or-more')).max(5000, t('validation.must-be-5000-or-less')),
    protein: z.number().min(0, t('validation.must-be-0-or-more')).max(1000, t('validation.must-be-1000-or-less')),
    carbs: z.number().min(0, t('validation.must-be-0-or-more')).max(1000, t('validation.must-be-1000-or-less')),
    fat: z.number().min(0, t('validation.must-be-0-or-more')).max(1000, t('validation.must-be-1000-or-less')),
  })
}

export type ManualFoodEntry = z.infer<ReturnType<typeof createManualFoodEntrySchema>>

export function createManualFoodEntryFormSchema(t: Translator) {
  const { foodName, servingSize, calories, protein, carbs, fat } = createManualFoodEntrySchema(t).shape
  const required = t('validation.must-be-0-or-more')

  return z.object({
    foodName,
    servingSize,
    calories: NumberOrEmpty(calories, required),
    protein: NumberOrEmpty(protein, required),
    carbs: NumberOrEmpty(carbs, required),
    fat: NumberOrEmpty(fat, required),
  })
}

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
})

export const BarcodeLookupSchema = z.object({
  barcode: z.string().regex(/^\d{8,14}$/, 'Barcode must be 8-14 digits'),
})

export const OpenFoodFactsResponseSchema = z.object({
  status: z.number(),
  product: z
    .object({
      product_name: z.string().optional().default(''),
      serving_size: z.string().optional().default(''),
      nutriments: z
        .object({
          'energy-kcal_100g': z.number().optional().default(0),
          proteins_100g: z.number().optional().default(0),
          carbohydrates_100g: z.number().optional().default(0),
          fat_100g: z.number().optional().default(0),
        })
        .optional()
        .default({
          'energy-kcal_100g': 0,
          proteins_100g: 0,
          carbohydrates_100g: 0,
          fat_100g: 0,
        }),
    })
    .optional(),
})

export const AiImageScanSchema = z.object({
  imageUrl: z.url(),
})

export function createSignInFormSchema(t: Translator) {
  return z.object({
    email: z.email(t('validation.invalid-email')),
    password: z.string().min(8, t('validation.password-min')).max(128, t('validation.password-max')),
  })
}

export function createSignUpFormSchema(t: Translator) {
  return z
    .object({
      name: z.string().min(1, t('validation.display-name-required')),
      email: z.email(t('validation.invalid-email')),
      password: z.string().min(8, t('validation.password-min')).max(128, t('validation.password-max')),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwords-no-match'),
      path: ['confirmPassword'],
    })
}

export const UpdateLocaleSchema = z.object({
  locale: z.enum(LOCALES),
})

export const UpdateWaterGoalSchema = z.object({
  goal: z.number().int().min(500).max(MAX_WATER_INTAKE),
})

export const AddWaterEntrySchema = z.object({
  amount: z.number().int().min(1).max(MAX_WATER_INTAKE),
})

export const UpdateWaterEntrySchema = z.object({
  id: z.string().min(1),
  amount: z.number().int().min(1).max(MAX_WATER_INTAKE),
})

export const DeleteWaterEntrySchema = z.object({
  id: z.string().min(1),
})

export const AddWeightEntrySchema = z.object({
  weight: z.number().min(20).max(300).positive(),
})

export const UpdateWeightEntrySchema = z.object({
  id: z.string().min(1),
  weight: z.number().min(20).max(300).positive(),
})

export const DeleteWeightEntrySchema = z.object({
  id: z.string().min(1),
})

export const DeleteFoodEntrySchema = z.object({
  id: z.string().min(1),
})

export const SendFeedbackSchema = z.object({
  message: z.string().min(1).max(MAX_FEEDBACK_LENGTH),
})
