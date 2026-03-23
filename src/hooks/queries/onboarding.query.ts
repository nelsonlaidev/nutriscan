import { useMutation } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useCompleteOnboarding(onSuccess?: () => void) {
  return useMutation(orpc.onboarding.complete.mutationOptions({ onSuccess }))
}
