import type { UIMessage } from 'ai'

import { convertToModelMessages, streamText, validateUIMessages } from 'ai'
import * as z from 'zod'

import { getChatById, saveChat } from '@/actions/chat'
import { defaultModel, generateTitle } from '@/lib/ai'
import { getSession } from '@/lib/auth'
import { chatSystemPrompt } from '@/lib/prompts'

const ChatSchema = z.object({
  chatId: z.uuid(),
  messages: z.array(z.unknown())
})

export const maxDuration = 30

export async function POST(request: Request) {
  const session = await getSession()

  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  let data: unknown
  try {
    data = await request.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const parsed = ChatSchema.safeParse(data)

  if (!parsed.success) {
    return new Response('Invalid request', { status: 400 })
  }

  const { chatId, messages: rawMessages } = parsed.data
  const validatedMessages = await validateUIMessages({ messages: rawMessages })

  const result = streamText({
    model: defaultModel,
    system: chatSystemPrompt,
    messages: await convertToModelMessages(validatedMessages),
    async onFinish({ text }) {
      try {
        const assistantMessage: UIMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          parts: [{ type: 'text', text }]
        }

        const allMessages = [...validatedMessages, assistantMessage]

        const existingChat = await getChatById(chatId)

        if (existingChat && existingChat.userId !== session.user.id) {
          return
        }

        const firstMessage = validatedMessages[0]
        let title = existingChat?.title ?? 'New Chat'
        if (!existingChat?.title && firstMessage) {
          try {
            title = await generateTitle(firstMessage)
          } catch {
            // Fall back to default title if AI title generation fails
          }
        }

        await saveChat({
          chatId,
          userId: session.user.id,
          title,
          messages: allMessages
        })
      } catch (error) {
        console.error('Failed to save chat:', error)
      }
    }
  })

  return result.toUIMessageStreamResponse()
}
