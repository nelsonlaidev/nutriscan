'use server'

import type { ErrorResponse } from '@/types'

import { generateText, Output } from 'ai'
import * as z from 'zod'

import { defaultModel } from '@/lib/ai'
import { logger } from '@/lib/logger'
import { authActionClient } from '@/lib/safe-action'
import { AiImageScanSchema } from '@/lib/zod-schemas'

const NutritionResponseSchema = z.object({
  foodName: z.string().describe('Name of the food item'),
  servingSize: z.string().describe('Estimated serving size (e.g. "100g", "1 cup")'),
  calories: z.number().describe('Calories in kcal'),
  protein: z.number().describe('Protein in grams'),
  carbs: z.number().describe('Carbohydrates in grams'),
  fat: z.number().describe('Fat in grams')
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
              text: 'Analyze this food image. Identify the food item and estimate its nutritional information per serving. Return the food name, estimated serving size, calories (kcal), protein (g), carbs (g), and fat (g). Round all numbers to the nearest whole number.'
            }
          ]
        }
      ]
    })

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
    console.error('AI scan error:', error)
    return { success: false, error: 'errors.ai-scan-failed' } satisfies ErrorResponse
  }
})
