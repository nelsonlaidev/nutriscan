import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useWeightEntries() {
  return useSuspenseQuery(orpc.weight.list.queryOptions())
}

export function useLatestWeight() {
  return useSuspenseQuery(orpc.weight.latest.queryOptions())
}

export function useAddWeightEntry(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  const queryKey = orpc.weight.list.queryKey()

  return useMutation(
    orpc.weight.create.mutationOptions({
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey })

        const previousData = queryClient.getQueryData(queryKey)

        if (previousData) {
          queryClient.setQueryData(queryKey, [
            {
              id: crypto.randomUUID(),
              weight: newData.weight,
              createdAt: new Date(),
            },
            ...previousData,
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
        void queryClient.invalidateQueries({ queryKey: orpc.weight.key() })
        void queryClient.invalidateQueries({ queryKey: orpc.progress.key() })
        void queryClient.invalidateQueries({ queryKey: orpc.achievements.key() })
      },
    }),
  )
}

export function useUpdateWeightEntry(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  const queryKey = orpc.weight.list.queryKey()

  return useMutation(
    orpc.weight.update.mutationOptions({
      onMutate: async (newData) => {
        await queryClient.cancelQueries({ queryKey })

        const previousData = queryClient.getQueryData(queryKey)

        if (previousData) {
          queryClient.setQueryData(
            queryKey,
            previousData.map((entry) => (entry.id === newData.id ? { ...entry, weight: newData.weight } : entry)),
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
        void queryClient.invalidateQueries({ queryKey: orpc.weight.key() })
        void queryClient.invalidateQueries({ queryKey: orpc.progress.key() })
        void queryClient.invalidateQueries({ queryKey: orpc.achievements.key() })
      },
    }),
  )
}

export function useDeleteWeightEntry(onSuccess?: () => void) {
  const queryClient = useQueryClient()
  const queryKey = orpc.weight.list.queryKey()

  return useMutation(
    orpc.weight.delete.mutationOptions({
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
        void queryClient.invalidateQueries({ queryKey: orpc.weight.key() })
        void queryClient.invalidateQueries({ queryKey: orpc.progress.key() })
        void queryClient.invalidateQueries({ queryKey: orpc.achievements.key() })
      },
    }),
  )
}
