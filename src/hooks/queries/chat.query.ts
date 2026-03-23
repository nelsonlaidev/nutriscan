import type { GetChatTitleInput } from '@/orpc/client'

import { skipToken, useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useChats() {
  return useSuspenseQuery(orpc.chat.list.queryOptions())
}

export function useChatById(input: { chatId?: string }) {
  return useQuery(
    orpc.chat.getById.queryOptions({
      input: input.chatId ? { chatId: input.chatId } : skipToken,
    }),
  )
}

export function useChatTitle(input: GetChatTitleInput) {
  return useSuspenseQuery(orpc.chat.getTitle.queryOptions({ input }))
}

export function useDeleteChat(onSuccess?: (id: string) => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.chat.delete.mutationOptions({
      onSuccess: (_data, variables) => {
        void queryClient.invalidateQueries({ queryKey: orpc.chat.list.key() })
        onSuccess?.(variables.chatId)
      },
    }),
  )
}

export function useSaveChat(onSuccess?: () => void) {
  return useMutation(orpc.chat.save.mutationOptions({ onSuccess }))
}
