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
      startingWeight: {
        type: 'number',
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
      },
      birthday: {
        type: 'string',
        required: false
      },
      gender: {
        type: 'string',
        required: false
      },
      calorieBudget: {
        type: 'number',
        required: true,
        defaultValue: 2000
      },
      proteinTarget: {
        type: 'number',
        required: true,
        defaultValue: 150
      },
      carbTarget: {
        type: 'number',
        required: true,
        defaultValue: 200
      },
      fatTarget: {
        type: 'number',
        required: true,
        defaultValue: 67
      },
      timezone: {
        type: 'string',
        required: true,
        defaultValue: 'UTC',
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
