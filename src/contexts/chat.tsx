import type { ChatStatus } from 'ai'
import type { Chats } from '@/actions/chat'

import { createContext, use, useMemo } from 'react'

type ChatContextValue = {
  status: ChatStatus
  chats: Chats
}

const ChatContext = createContext<ChatContextValue | null>(null)
ChatContext.displayName = 'ChatContext'

export function useChat() {
  const context = use(ChatContext)

  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }

  return context
}

type ChatProviderProps = {
  children: React.ReactNode
} & ChatContextValue

export function ChatProvider(props: ChatProviderProps) {
  const { children, status, chats } = props

  const value = useMemo<ChatContextValue>(
    () => ({
      status,
      chats,
    }),
    [status, chats],
  )

  return <ChatContext value={value}>{children}</ChatContext>
}
