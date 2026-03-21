'use server'

import type { UIMessage } from 'ai'
import type { InferSelectModel } from 'drizzle-orm'

import { and, asc, desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import * as z from 'zod'

import { db } from '@/db'
import { chatMessages, chats } from '@/db/schemas'
import { getSession } from '@/lib/auth'
import { authActionClient } from '@/lib/safe-action'

export type Chats = Array<InferSelectModel<typeof chats>>

export async function getChats(): Promise<Chats> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  return db.select().from(chats).where(eq(chats.userId, session.user.id)).orderBy(desc(chats.updatedAt))
}

export type Chat = InferSelectModel<typeof chats> & {
  messages: Array<InferSelectModel<typeof chatMessages>>
}

export async function getChatById(chatId: string): Promise<Chat | null> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  const chat = await db.query.chats.findFirst({
    where: and(eq(chats.id, chatId), eq(chats.userId, session.user.id)),
    with: {
      messages: {
        where: eq(chatMessages.chatId, chatId),
        orderBy: asc(chatMessages.createdAt),
      },
    },
  })

  if (!chat) return null

  return chat
}

export async function saveChat({
  chatId,
  userId,
  title,
  messages,
}: {
  chatId: string
  userId: string
  title: string
  messages: UIMessage[]
}) {
  await db
    .insert(chats)
    .values({ id: chatId, userId, title })
    .onConflictDoUpdate({
      target: chats.id,
      set: { title, updatedAt: new Date() },
      setWhere: eq(chats.userId, userId),
    })

  if (messages.length === 0) return

  // Only insert messages for chats owned by this user
  const [chat] = await db
    .select({ id: chats.id })
    .from(chats)
    .where(and(eq(chats.id, chatId), eq(chats.userId, userId)))

  if (!chat) return

  // Deduplicate by message ID to avoid inserting duplicates under concurrent requests
  const existing = await db.select({ id: chatMessages.id }).from(chatMessages).where(eq(chatMessages.chatId, chatId))
  const existingIds = new Set(existing.map((m) => m.id))

  const newMessages = messages.filter((m) => !existingIds.has(m.id))

  if (newMessages.length > 0) {
    const now = Date.now()
    await db.insert(chatMessages).values(
      newMessages.map((msg, index) => ({
        id: msg.id,
        chatId,
        role: msg.role as 'user' | 'assistant',
        parts: msg.parts,
        attachments: [],
        createdAt: new Date(now + index),
      })),
    )
  }
}

export async function getChatTitle(chatId: string): Promise<string | null> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  const [chat] = await db
    .select({ title: chats.title })
    .from(chats)
    .where(and(eq(chats.id, chatId), eq(chats.userId, session.user.id)))

  return chat?.title ?? null
}

export const deleteChat = authActionClient
  .inputSchema(z.object({ chatId: z.uuid() }))
  .action(async ({ parsedInput: { chatId }, ctx: { user } }) => {
    const [chat] = await db.select().from(chats).where(eq(chats.id, chatId))

    if (chat?.userId !== user.id) {
      throw new Error('Chat not found')
    }

    await db.delete(chats).where(eq(chats.id, chatId))

    revalidatePath('/chat')
  })
