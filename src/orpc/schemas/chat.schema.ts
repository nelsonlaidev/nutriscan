import type { UIMessage } from 'ai'

import { validateUIMessages } from 'ai'
import * as z from 'zod'

export const SendMessageInputSchema = z.object({
  chatId: z.uuid(),
  message: z.custom<UIMessage>().refine(async (data) => {
    try {
      await validateUIMessages({
        messages: [data],
      })
    } catch (error) {
      console.error('error', error)

      return false
    }

    return true
  }, 'Invalid message'),
})

export const DeleteChatInputSchema = z.object({
  chatId: z.uuid(),
})

export const UpdateChatTitleInputSchema = z.object({
  chatId: z.uuid(),
  title: z.string().trim().min(1).max(100),
})

export const GetChatByIdInputSchema = z.object({
  chatId: z.string().min(1),
})
