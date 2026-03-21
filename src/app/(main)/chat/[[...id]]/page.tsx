import type { UIMessage } from 'ai'

import * as z from 'zod'

import { getChatById, getChats } from '@/actions/chat'
import { Chat } from '@/components/chat'

const ParamsSchema = z.uuid().optional()

export default async function ChatPage(props: PageProps<'/chat/[[...id]]'>) {
  const { params } = props
  const { id } = await params

  const parsedId = ParamsSchema.parse(id?.join(''))
  // Server component, not a hook/client render
  // oxlint-disable-next-line react-x/purity
  const randomId = crypto.randomUUID()

  let initialMessages: UIMessage[] = []
  let chatTitle: string | undefined

  if (parsedId) {
    const chat = await getChatById(parsedId)

    if (chat) {
      initialMessages = chat.messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        parts: msg.parts as UIMessage['parts'],
      }))

      chatTitle = chat.title
    }
  }

  const chats = await getChats()

  return (
    <Chat
      isNewChat={parsedId === undefined}
      id={parsedId ?? randomId}
      chatTitle={chatTitle}
      initialMessages={initialMessages}
      chats={chats}
    />
  )
}
