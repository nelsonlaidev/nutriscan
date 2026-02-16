import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { headers } from 'next/headers'

import { db } from '@/db'

export const auth = betterAuth({
  trustedOrigins: ['https://czf3nz7f-3000.asse.devtunnels.ms/', 'http://localhost:3000'],
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true
  }),
  emailAndPassword: {
    enabled: true
  },
  user: {
    additionalFields: {
      onboarded: {
        type: 'boolean',
        input: false,
        defaultValue: false,
        required: true
      },
      currentWeight: {
        type: 'number',
        required: true
      },
      goalWeight: {
        type: 'number',
        required: true
      },
      height: {
        type: 'number',
        required: true
      },
      locale: {
        type: 'string',
        required: true,
        defaultValue: 'en',
        input: false
      },
      waterGoal: {
        type: 'number',
        required: true,
        defaultValue: 2500,
        input: false
      }
    }
  }
})

export async function getSession() {
  return auth.api.getSession({
    headers: await headers()
  })
}

export type Session = typeof auth.$Infer.Session
