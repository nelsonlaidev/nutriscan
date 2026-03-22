import type { GetChatByIdInput, GetChatTitleInput } from '@/orpc/client'

import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useChats() {
  return useSuspenseQuery(orpc.chat.list.queryOptions())
}

export function useChatById(input: GetChatByIdInput) {
  return useQuery({ ...orpc.chat.getById.queryOptions({ input }), enabled: input.chatId.length > 0 })
}

export function useChatTitle(input: GetChatTitleInput) {
  return useSuspenseQuery(orpc.chat.getTitle.queryOptions({ input }))
}

export function useDeleteChat(onSuccess?: () => void) {
  return useMutation(orpc.chat.delete.mutationOptions({ onSuccess }))
}

export function useSaveChat(onSuccess?: () => void) {
  return useMutation(orpc.chat.save.mutationOptions({ onSuccess }))
}
