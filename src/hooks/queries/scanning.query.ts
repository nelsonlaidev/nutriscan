import { useMutation } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useAiImageScan(
  onSuccess?: (data: {
    foodName: string
    servingSize: string
    calories: number
    protein: number
    carbs: number
    fat: number
    imageUrl: string
  }) => void,
) {
  return useMutation(orpc.scanning.aiImageScan.mutationOptions({ onSuccess }))
}

export function useBarcodeLookup(
  onSuccess?: (data: {
    foodName: string
    servingSize: string
    calories: number
    protein: number
    carbs: number
    fat: number
  }) => void,
) {
  return useMutation(orpc.scanning.barcodeLookup.mutationOptions({ onSuccess }))
}
