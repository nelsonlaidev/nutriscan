import type { GetTotalWaterInput, GetWaterEntriesInput } from '@/orpc/client'

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useWaterEntries(input: GetWaterEntriesInput) {
  return useSuspenseQuery(orpc.water.list.queryOptions({ input }))
}

export function useWaterTotal(input: GetTotalWaterInput) {
  return useSuspenseQuery(orpc.water.total.queryOptions({ input }))
}

export function useAddWaterEntry(input: GetWaterEntriesInput, onSuccess?: () => void) {
  const queryClient = useQueryClient()
  const queryKey = orpc.water.list.queryKey({ input })

  return useMutation(
    orpc.water.create.mutationOptions({
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey })

        const previousData = queryClient.getQueryData(queryKey)

        if (previousData) {
          queryClient.setQueryData(queryKey, [
            ...previousData,
            {
              id: crypto.randomUUID(),
              amount: newData.amount,
              createdAt: new Date(),
            },
          ])
        }

        return { previousData }
      },
      onError: (_error, _variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(queryKey, context.previousData)
        }
      },
      onSuccess,
      onSettled: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.water.key() })
        void queryClient.invalidateQueries({ queryKey: orpc.progress.key() })
        void queryClient.invalidateQueries({ queryKey: orpc.achievements.key() })
      },
    }),
  )
}

export function useUpdateWaterEntry(input: GetWaterEntriesInput, onSuccess?: () => void) {
  const queryClient = useQueryClient()
  const queryKey = orpc.water.list.queryKey({ input })

  return useMutation(
    orpc.water.update.mutationOptions({
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey })

        const previousData = queryClient.getQueryData(queryKey)

        if (previousData) {
          queryClient.setQueryData(
            queryKey,
            previousData.map((entry) => (entry.id === newData.id ? { ...entry, amount: newData.amount } : entry)),
          )
        }

        return { previousData }
      },
      onError: (_error, _variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(queryKey, context.previousData)
        }
      },
      onSuccess,
      onSettled: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.water.key() })
        void queryClient.invalidateQueries({ queryKey: orpc.progress.key() })
        void queryClient.invalidateQueries({ queryKey: orpc.achievements.key() })
      },
    }),
  )
}

export function useDeleteWaterEntry(input: GetWaterEntriesInput, onSuccess?: () => void) {
  const queryClient = useQueryClient()
  const queryKey = orpc.water.list.queryKey({ input })

  return useMutation(
    orpc.water.delete.mutationOptions({
      onMutate: async (deletedData) => {
        await queryClient.cancelQueries({ queryKey })

        const previousData = queryClient.getQueryData(queryKey)

        if (previousData) {
          queryClient.setQueryData(
            queryKey,
            previousData.filter((entry) => entry.id !== deletedData.id),
          )
        }

        return { previousData }
      },
      onError: (_error, _variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(queryKey, context.previousData)
        }
      },
      onSuccess,
      onSettled: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.water.key() })
        void queryClient.invalidateQueries({ queryKey: orpc.progress.key() })
        void queryClient.invalidateQueries({ queryKey: orpc.achievements.key() })
      },
    }),
  )
}

export function useUpdateWaterGoal(onSuccess?: () => void) {
  return useMutation(orpc.water.updateGoal.mutationOptions({ onSuccess }))
}
