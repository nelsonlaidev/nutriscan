'use server'

import type { ErrorResponse } from '@/types'

import { generateText, Output } from 'ai'
import * as z from 'zod'

import { defaultModel } from '@/lib/ai'
import { logger } from '@/lib/logger'
import { authActionClient } from '@/lib/safe-action'
import { AiImageScanSchema } from '@/lib/zod-schemas'

const NutritionResponseSchema = z.object({
  isFood: z.boolean().describe('Whether the image contains identifiable food'),
  foodName: z.string().describe('Name of the food item, or empty string if not food'),
  servingSize: z.string().describe('Estimated serving size (e.g. "100g", "1 cup"), or empty string if not food'),
  calories: z.number().describe('Calories in kcal, or 0 if not food'),
  protein: z.number().describe('Protein in grams, or 0 if not food'),
  carbs: z.number().describe('Carbohydrates in grams, or 0 if not food'),
  fat: z.number().describe('Fat in grams, or 0 if not food')
})

export const scanFoodImage = authActionClient.inputSchema(AiImageScanSchema).action(async ({ parsedInput }) => {
  const { imageUrl } = parsedInput

  logger.debug({ imageUrl }, 'AI scan: analyzing image from R2')

  try {
    const { output } = await generateText({
      model: defaultModel,
      output: Output.object({ schema: NutritionResponseSchema }),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              image: imageUrl
            },
            {
              type: 'text',
              text: 'Analyze this image. If it contains identifiable food, set isFood to true and estimate the nutritional information per serving: food name, serving size, calories (kcal), protein (g), carbs (g), and fat (g). Round all numbers to the nearest whole number. If the image does not contain food, set isFood to false.'
            }
          ]
        }
      ]
    })

    if (!output.isFood) {
      return { success: false, error: 'errors.no-food-detected' } satisfies ErrorResponse
    }

    return {
      success: true,
      data: {
        foodName: output.foodName,
        servingSize: output.servingSize,
        calories: Math.round(output.calories),
        protein: Math.round(output.protein),
        carbs: Math.round(output.carbs),
        fat: Math.round(output.fat),
        imageUrl
      }
    }
  } catch (error) {
    logger.error({ error }, 'AI scan: failed to analyze image')
    return { success: false, error: 'errors.ai-scan-failed' } satisfies ErrorResponse
  }
})
