'use server'

import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { generateText, Output } from 'ai'
import * as z from 'zod'

import { env } from '@/env'
import { logger } from '@/lib/logger'
import { uploadImage } from '@/lib/r2'
import { authActionClient } from '@/lib/safe-action'
import { AiImageScanSchema } from '@/lib/zod-schemas'

const NutritionResponseSchema = z.object({
  foodName: z.string().describe('Name of the food item'),
  servingSize: z.string().describe('Estimated serving size (e.g. "100g", "1 cup")'),
  calories: z.number().describe('Calories in kcal'),
  protein: z.number().describe('Protein in grams'),
  carbs: z.number().describe('Carbohydrates in grams'),
  fat: z.number().describe('Fat in grams'),
  fiber: z.number().describe('Fiber in grams')
})

export const scanFoodImage = authActionClient.inputSchema(AiImageScanSchema).action(async ({ parsedInput, ctx }) => {
  const openrouter = createOpenRouter({ apiKey: env.OPENROUTER_API_KEY })

  const imageSizeKB = Math.round((parsedInput.imageBase64.length * 3) / 4 / 1024)
  logger.debug({ imageSizeKB }, 'AI scan: image size before sending to OpenRouter')

  try {
    // Upload image to R2
    const base64Data = parsedInput.imageBase64.replace(/^data:image\/\w+;base64,/, '')
    const contentType = /^data:(image\/\w+);base64,/.exec(parsedInput.imageBase64)?.[1] ?? 'image/jpeg'
    const buffer = Buffer.from(base64Data, 'base64')
    const key = `food-images/${ctx.user.id}/${Date.now()}.${contentType.split('/')[1]}`
    const imageUrl = await uploadImage(key, buffer, contentType)

    logger.debug({ imageUrl }, 'AI scan: image uploaded to R2')

    const { output } = await generateText({
      model: openrouter('google/gemini-3-flash-preview'),
      output: Output.object({ schema: NutritionResponseSchema }),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              image: parsedInput.imageBase64
            },
            {
              type: 'text',
              text: 'Analyze this food image. Identify the food item and estimate its nutritional information per serving. Return the food name, estimated serving size, calories (kcal), protein (g), carbs (g), fat (g), and fiber (g). Round all numbers to the nearest whole number.'
            }
          ]
        }
      ]
    })

    return {
      success: true as const,
      data: {
        foodName: output.foodName,
        servingSize: output.servingSize,
        calories: Math.round(output.calories),
        protein: Math.round(output.protein),
        carbs: Math.round(output.carbs),
        fat: Math.round(output.fat),
        fiber: Math.round(output.fiber),
        imageUrl
      }
    }
  } catch (error) {
    console.error('AI scan error:', error)
    return { success: false as const, error: 'Failed to analyze image' }
  }
})
