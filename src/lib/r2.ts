import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { env } from '@/env'

const r2 = new S3Client({
  region: 'auto',
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY
  }
})

export async function uploadImage(key: string, buffer: Buffer, contentType: string) {
  await r2.send(
    new PutObjectCommand({
      Bucket: env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType
    })
  )

  return `${env.R2_PUBLIC_URL}/${key}`
}
