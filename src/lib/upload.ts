import { uploadImageAction } from '@/actions/upload-image'

export async function uploadImage(file: File, type: 'chat' | 'meal'): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const result = await uploadImageAction({ formData, type })

  if (!result.data?.url) {
    throw new Error('Upload failed')
  }

  return result.data.url
}
