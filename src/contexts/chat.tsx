import type { ChatStatus } from 'ai'

import { createContext, use, useMemo } from 'react'

type ChatContextValue = {
  status: ChatStatus
}

const ChatContext = createContext<ChatContextValue | null>(null)
ChatContext.displayName = 'ChatContext'

export function useChatContext() {
  const context = use(ChatContext)

  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }

  return context
}

type ChatProviderProps = {
  children: React.ReactNode
} & ChatContextValue

export function ChatProvider(props: ChatProviderProps) {
  const { children, status } = props

  const value = useMemo<ChatContextValue>(
    () => ({
      status,
    }),
    [status],
  )

  return <ChatContext value={value}>{children}</ChatContext>
}
