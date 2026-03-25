import { useSuspenseQuery } from '@tanstack/react-query'

import { orpc } from '@/orpc/client'

export function useAchievementsOverview() {
  return useSuspenseQuery(orpc.achievements.overview.queryOptions())
}

export function useAchievementList() {
  return useSuspenseQuery(orpc.achievements.list.queryOptions())
}
