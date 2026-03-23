import { useMutation } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useUploadImage(onSuccess?: (data: { url: string }) => void) {
  return useMutation(orpc.r2.uploadImage.mutationOptions({ onSuccess }))
}
