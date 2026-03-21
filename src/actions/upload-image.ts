'use server'

import * as z from 'zod'

import { uploadImage } from '@/lib/r2'
import { authActionClient } from '@/lib/safe-action'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

const schema = z.object({
  formData: z.instanceof(FormData),
  type: z.enum(['chat', 'meal']),
})

export const uploadImageAction = authActionClient
  .inputSchema(schema)
  .action(async ({ parsedInput: { formData, type }, ctx: { user } }) => {
    const file = formData.get('file')

    if (!(file instanceof File)) {
      throw new TypeError('No file provided')
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      throw new Error('Invalid file type')
    }

    if (file.size > MAX_SIZE) {
      throw new Error('File too large')
    }

    const ext = file.type.split('/')[1]
    const prefix = type === 'chat' ? 'chat-images' : 'meal-images'
    const key = `${prefix}/${user.id}/${Date.now()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())
    const url = await uploadImage(key, buffer, file.type)

    return { url }
  })
