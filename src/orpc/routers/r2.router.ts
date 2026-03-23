import { ORPCError } from '@orpc/server'

import { uploadImage } from '@/lib/r2'

import { protectedProcedure } from '../procedures'
import { UploadImageInputSchema } from '../schemas/r2.schema'

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

export const r2Router = {
  uploadImage: uploadImageProcedure,
}
