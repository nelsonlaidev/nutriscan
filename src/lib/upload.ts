import { client } from '@/orpc/client'

export async function uploadImage(file: File, type: 'chat' | 'meal'): Promise<string> {
  const buffer = await file.arrayBuffer()
  const base64 = btoa(String.fromCodePoint(...new Uint8Array(buffer)))

  const result = await client.scanning.uploadImage({
    base64,
    mimeType: file.type as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
    type,
  })

  return result.url
}
