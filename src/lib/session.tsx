import type { Session } from './auth'

import { createContext, use } from 'react'

const SessionContext = createContext<Session | null>(null)
SessionContext.displayName = 'SessionContext'

export function useSession() {
  const context = use(SessionContext)

  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }

  return context
}

type SessionProviderProps = {
  children: React.ReactNode
  session: Session
}

export function SessionProvider(props: SessionProviderProps) {
  const { children, session } = props

  return <SessionContext value={session}>{children}</SessionContext>
}
