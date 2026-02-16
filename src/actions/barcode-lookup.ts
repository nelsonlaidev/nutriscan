'use server'

import { authActionClient } from '@/lib/safe-action'
import { BarcodeLookupSchema, OpenFoodFactsResponseSchema } from '@/lib/zod-schemas'

export const lookupBarcode = authActionClient.inputSchema(BarcodeLookupSchema).action(async ({ parsedInput }) => {
  const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${parsedInput.barcode}.json`)

  if (!response.ok) {
    return { success: false as const, error: 'product-not-found' as const }
  }

  const json = await response.json()
  const parsed = OpenFoodFactsResponseSchema.safeParse(json)

  if (!parsed.success || parsed.data.status !== 1 || !parsed.data.product) {
    return { success: false as const, error: 'product-not-found' as const }
  }

  const { product } = parsed.data
  const { nutriments } = product

  return {
    success: true as const,
    data: {
      foodName: product.product_name,
      servingSize: product.serving_size,
      calories: Math.round(nutriments['energy-kcal_100g']),
      protein: Math.round(nutriments.proteins_100g),
      carbs: Math.round(nutriments.carbohydrates_100g),
      fat: Math.round(nutriments.fat_100g)
    }
  }
})
