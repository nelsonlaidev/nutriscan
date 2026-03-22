import type { UIDataTypes, UIMessage, UIMessagePart, UITools } from 'ai'

import { useChatContext } from '@/contexts/chat'
import { cn } from '@/lib/utils'

import { Message } from './message'

type ResponseProps = {
  part: UIMessagePart<UIDataTypes, UITools>
  role: UIMessage['role']
}

export function Response(props: ResponseProps) {
  const { part, role } = props
  const { status } = useChatContext()
  const isStreaming = status === 'streaming'

  if (part.type === 'file' && part.mediaType.startsWith('image/')) {
    return (
      // oxlint-disable-next-line @next/next/no-img-element
      <img
        src={part.url}
        alt={part.filename ?? 'Image attachment'}
        className={cn('max-w-64 rounded-2xl', role === 'user' ? 'ml-auto' : 'mr-auto')}
      />
    )
  }

  if (part.type === 'text') {
    return (
      <Message isAnimating={isStreaming} role={role}>
        {part.text}
      </Message>
    )
  }

  return null
}
