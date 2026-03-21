import type { auth } from './auth'

import { inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { toast } from 'sonner'

const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        toast.error('Too many requests. Please try again later.')
      }
    },
  },
})

export const { signIn, signUp, signOut } = authClient
