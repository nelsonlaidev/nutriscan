'use client'

import type { Session } from '@/lib/auth'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

import { SessionProvider } from '@/lib/session'

type ProvidersProps = {
  children: React.ReactNode
  session: Session
}

function Providers(props: ProvidersProps) {
  const { children, session } = props
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>{children}</SessionProvider>
    </QueryClientProvider>
  )
}

export default Providers
