import { createEnv } from '@t3-oss/env-nextjs'
import * as z from 'zod'

export const env = createEnv({
  shared: {
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development')
  },

  server: {
    DATABASE_URL: z.url(),

    BETTER_AUTH_SECRET: z.string().min(1),

    OPENROUTER_API_KEY: z.string().min(1),

    R2_ACCESS_KEY_ID: z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
    R2_ENDPOINT: z.url(),
    R2_BUCKET_NAME: z.string().min(1),
    R2_PUBLIC_URL: z.url()
  },

  client: {},

  experimental__runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV
  },

  emptyStringAsUndefined: true
})
