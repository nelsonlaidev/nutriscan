import type { GetLearnLessonInput } from '@/orpc/client'

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useLearnOverview() {
  return useSuspenseQuery(orpc.learn.overview.queryOptions())
}

export function useLearnLesson(input: GetLearnLessonInput) {
  return useSuspenseQuery(orpc.learn.getLesson.queryOptions({ input }))
}

export function useCheckLearnAnswer() {
  return useMutation(orpc.learn.checkAnswer.mutationOptions())
}

export function useSubmitLearnAttempt(onSuccess?: () => void) {
  const queryClient = useQueryClient()

  return useMutation(
    orpc.learn.submitAttempt.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: orpc.learn.key() })
        onSuccess?.()
      },
    }),
  )
}
