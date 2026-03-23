import * as z from 'zod'

export const AiImageScanInputSchema = z.object({
  imageUrl: z.url(),
})

export const BarcodeLookupInputSchema = z.object({
  barcode: z.string().regex(/^\d{8,14}$/, 'Barcode must be 8-14 digits'),
})

// Internal schema for parsing OpenFoodFacts response
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
