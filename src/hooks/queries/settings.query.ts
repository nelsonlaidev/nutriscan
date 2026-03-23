import { useMutation } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useUpdatePersonalDetails(onSuccess?: () => void) {
  return useMutation(orpc.settings.updatePersonalDetails.mutationOptions({ onSuccess }))
}

export function useUpdateLocale(onSuccess?: () => void) {
  return useMutation(orpc.settings.updateLocale.mutationOptions({ onSuccess }))
}

export function useSendFeedback(onSuccess?: () => void) {
  return useMutation(orpc.settings.sendFeedback.mutationOptions({ onSuccess }))
}
