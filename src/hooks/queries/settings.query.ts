import { useMutation, useQueryClient } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useUpdatePersonalDetails(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.settings.updatePersonalDetails.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.settings.key() })
        void queryClient.invalidateQueries({ queryKey: orpc.weight.key() })
        void queryClient.invalidateQueries({ queryKey: orpc.progress.key() })
        void queryClient.invalidateQueries({ queryKey: orpc.achievements.key() })
        onSuccess?.()
      },
    }),
  )
}

export function useUpdateLocale(onSuccess?: () => void) {
  return useMutation(orpc.settings.updateLocale.mutationOptions({ onSuccess }))
}

export function useSendFeedback(onSuccess?: () => void) {
  return useMutation(orpc.settings.sendFeedback.mutationOptions({ onSuccess }))
}
