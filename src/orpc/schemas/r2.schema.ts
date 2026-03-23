import * as z from 'zod'

export const UploadImageInputSchema = z.object({
  type: z.enum(['chat', 'meal']),
  base64: z.string().min(1),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
})
