'use client'

import type { Session } from '@/lib/auth'

import { SessionProvider } from '@/lib/session'

type ProvidersProps = {
  children: React.ReactNode
  session: Session
}

function Providers(props: ProvidersProps) {
  const { children, session } = props

  return <SessionProvider session={session}>{children}</SessionProvider>
}

export default Providers
