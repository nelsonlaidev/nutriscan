import type { UIMessage } from 'ai'
import type { InferSelectModel } from 'drizzle-orm'

import { ORPCError, streamToEventIterator } from '@orpc/server'
import { convertToModelMessages, smoothStream, streamText } from 'ai'
import { and, asc, desc, eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

import { chatMessages, chats } from '@/db/schemas'
import { defaultModel, generateTitle } from '@/lib/ai'
import { chatSystemPrompt } from '@/lib/prompts'

import { protectedProcedure } from '../procedures'
import {
  DeleteChatInputSchema,
  GetChatByIdInputSchema,
  GetChatTitleInputSchema,
  SaveChatInputSchema,
  SendMessageInputSchema,
} from '../schemas/chat.schema'

export type Chats = Array<InferSelectModel<typeof chats>>
export type Chat = InferSelectModel<typeof chats> & {
  messages: Array<InferSelectModel<typeof chatMessages>>
}

const send = protectedProcedure.input(SendMessageInputSchema).handler(async ({ input, context, signal }) => {
  const chat = await context.db.query.chats.findFirst({
    where: eq(chats.id, input.chatId),
  })

  if (chat && chat.userId !== context.session.user.id) {
    throw new ORPCError('FORBIDDEN')
  }

  if (!chat) {
    const title = await generateTitle(input.message)

    await context.db.insert(chats).values({
      id: input.chatId,
      userId: context.session.user.id,
      title,
    })
  }

  const messagesList = await context.db.query.chatMessages.findMany({
    where: eq(chatMessages.chatId, input.chatId),
    orderBy: asc(chatMessages.createdAt),
  })

  const previousMessages: UIMessage[] = messagesList.map((m) => ({
    id: m.id,
    parts: m.parts,
    role: m.role,
  }))

  const result = streamText({
    model: defaultModel,
    system: chatSystemPrompt,
    messages: await convertToModelMessages([...previousMessages, input.message]),
    abortSignal: signal,
    experimental_transform: smoothStream(),
  })

  return streamToEventIterator(
    result.toUIMessageStream({
      generateMessageId: uuidv4,
      onFinish: async ({ responseMessage }) => {
        await context.db.insert(chatMessages).values([
          {
            chatId: input.chatId,
            role: 'user',
            parts: input.message.parts,
          },
          {
            chatId: input.chatId,
            role: 'assistant',
            parts: responseMessage.parts,
          },
        ])
      },
    }),
  )
})

const list = protectedProcedure.handler(async ({ context }) =>
  context.db.select().from(chats).where(eq(chats.userId, context.session.user.id)).orderBy(desc(chats.updatedAt)),
)

const getById = protectedProcedure.input(GetChatByIdInputSchema).handler(async ({ input, context }) => {
  const chat = await context.db.query.chats.findFirst({
    where: and(eq(chats.id, input.chatId), eq(chats.userId, context.session.user.id)),
    with: {
      messages: {
        where: eq(chatMessages.chatId, input.chatId),
        orderBy: asc(chatMessages.createdAt),
      },
    },
  })

  return chat ?? null
})

const getTitle = protectedProcedure.input(GetChatTitleInputSchema).handler(async ({ input, context }) => {
  const [chat] = await context.db
    .select({ title: chats.title })
    .from(chats)
    .where(and(eq(chats.id, input.chatId), eq(chats.userId, context.session.user.id)))

  return chat?.title ?? null
})

const save = protectedProcedure.input(SaveChatInputSchema).handler(async ({ input, context }) => {
  const userId = context.session.user.id

  await context.db
    .insert(chats)
    .values({ id: input.chatId, userId, title: input.title })
    .onConflictDoUpdate({
      target: chats.id,
      set: { title: input.title, updatedAt: new Date() },
      setWhere: eq(chats.userId, userId),
    })

  if (input.messages.length === 0) return

  // Only insert messages for chats owned by this user
  const [chat] = await context.db
    .select({ id: chats.id })
    .from(chats)
    .where(and(eq(chats.id, input.chatId), eq(chats.userId, userId)))

  if (!chat) return

  // Deduplicate by message ID
  const existing = await context.db
    .select({ id: chatMessages.id })
    .from(chatMessages)
    .where(eq(chatMessages.chatId, input.chatId))
  const existingIds = new Set(existing.map((m) => m.id))

  const newMessages = input.messages.filter((m) => !existingIds.has(m.id))

  if (newMessages.length > 0) {
    const now = Date.now()
    await context.db.insert(chatMessages).values(
      newMessages.map((msg, index) => ({
        id: msg.id,
        chatId: input.chatId,
        role: msg.role as 'user' | 'assistant',
        parts: msg.parts,
        attachments: [],
        createdAt: new Date(now + index),
      })),
    )
  }
})

const deleteChat = protectedProcedure.input(DeleteChatInputSchema).handler(async ({ input, context }) => {
  const [chat] = await context.db.select().from(chats).where(eq(chats.id, input.chatId))

  if (chat?.userId !== context.session.user.id) {
    throw new ORPCError('NOT_FOUND')
  }

  await context.db.delete(chats).where(eq(chats.id, input.chatId))
})

export const chatRouter = {
  send,
  list,
  getById,
  getTitle,
  save,
  delete: deleteChat,
}
