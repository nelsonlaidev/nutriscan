import * as z from 'zod'

export const DeleteChatInputSchema = z.object({
  chatId: z.uuid(),
})

export const GetChatByIdInputSchema = z.object({
  chatId: z.string().min(1),
})

export const GetChatTitleInputSchema = z.object({
  chatId: z.string().min(1),
})

export const SaveChatInputSchema = z.object({
  chatId: z.string().min(1),
  title: z.string().min(1),
  messages: z.array(
    z.object({
      id: z.string(),
      role: z.enum(['user', 'assistant', 'system', 'function', 'data', 'tool']),
      parts: z.array(z.any()),
      attachments: z.array(z.any()).optional(),
    }),
  ),
})
