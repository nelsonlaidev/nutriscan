import { ORPCError } from '@orpc/server'
import { generateText, Output } from 'ai'
import * as z from 'zod'

import { defaultModel } from '@/lib/ai'
import { logger } from '@/lib/logger'
import { uploadImage } from '@/lib/r2'

import { protectedProcedure } from '../procedures'
import {
  AiImageScanInputSchema,
  BarcodeLookupInputSchema,
  OpenFoodFactsResponseSchema,
  UploadImageInputSchema,
} from '../schemas/scanning.schema'

const NutritionResponseSchema = z.object({
  isFood: z.boolean().describe('Whether the image contains identifiable food'),
  foodName: z.string().describe('Name of the food item, or empty string if not food'),
  servingSize: z.string().describe('Estimated serving size (e.g. "100g", "1 cup"), or empty string if not food'),
  calories: z.number().describe('Calories in kcal, or 0 if not food'),
  protein: z.number().describe('Protein in grams, or 0 if not food'),
  carbs: z.number().describe('Carbohydrates in grams, or 0 if not food'),
  fat: z.number().describe('Fat in grams, or 0 if not food'),
})

const aiImageScan = protectedProcedure.input(AiImageScanInputSchema).handler(async ({ input }) => {
  const { imageUrl } = input
  logger.debug({ imageUrl }, 'AI scan: analyzing image from R2')

  try {
    const { output } = await generateText({
      model: defaultModel,
      output: Output.object({ schema: NutritionResponseSchema }),
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', image: imageUrl },
            {
              type: 'text',
              text: 'Analyze this image. If it contains identifiable food, set isFood to true and estimate the nutritional information per serving: food name, serving size, calories (kcal), protein (g), carbs (g), and fat (g). Round all numbers to the nearest whole number. If the image does not contain food, set isFood to false.',
            },
          ],
        },
      ],
    })

    if (!output.isFood) {
      throw new ORPCError('BAD_REQUEST', { message: 'errors.no-food-detected' })
    }

    return {
      foodName: output.foodName,
      servingSize: output.servingSize,
      calories: Math.round(output.calories),
      protein: Math.round(output.protein),
      carbs: Math.round(output.carbs),
      fat: Math.round(output.fat),
      imageUrl,
    }
  } catch (error) {
    if (error instanceof ORPCError) throw error
    logger.error({ error }, 'AI scan: failed to analyze image')
    throw new ORPCError('INTERNAL_SERVER_ERROR', { message: 'errors.ai-scan-failed' })
  }
})

const barcodeLookup = protectedProcedure.input(BarcodeLookupInputSchema).handler(async ({ input }) => {
  const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${input.barcode}.json`)

  if (!response.ok) {
    throw new ORPCError('NOT_FOUND', { message: 'errors.product-not-found' })
  }

  const json = await response.json()
  const parsed = OpenFoodFactsResponseSchema.safeParse(json)

  if (!parsed.success || parsed.data.status !== 1 || !parsed.data.product) {
    throw new ORPCError('NOT_FOUND', { message: 'errors.product-not-found' })
  }

  const { product } = parsed.data
  const { nutriments } = product

  return {
    foodName: product.product_name || '',
    servingSize: product.serving_size || '',
    calories: Math.round(nutriments['energy-kcal_100g']),
    protein: Math.round(nutriments.proteins_100g),
    carbs: Math.round(nutriments.carbohydrates_100g),
    fat: Math.round(nutriments.fat_100g),
  }
})

const uploadImageProcedure = protectedProcedure.input(UploadImageInputSchema).handler(async ({ input, context }) => {
  const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

  const buffer = Buffer.from(input.base64, 'base64')
  if (buffer.length > MAX_SIZE) {
    throw new ORPCError('BAD_REQUEST', { message: 'File too large' })
  }

  const ext = input.mimeType.split('/')[1]
  const prefix = input.type === 'chat' ? 'chat-images' : 'meal-images'
  const key = `${prefix}/${context.session.user.id}/${Date.now()}.${ext}`
  const url = await uploadImage(key, buffer, input.mimeType)

  return { url }
})

export const scanningRouter = {
  aiImageScan,
  barcodeLookup,
  uploadImage: uploadImageProcedure,
}
