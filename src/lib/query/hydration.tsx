import type { QueryClient } from '@tanstack/react-query'

import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { cache } from 'react'

import { createQueryClient } from './client'

export const getQueryClient = cache(createQueryClient)

type HydrateClientProps = {
  children: React.ReactNode
  client: QueryClient
}

export function HydrateClient(props: HydrateClientProps) {
  const { children, client } = props

  return <HydrationBoundary state={dehydrate(client)}>{children}</HydrationBoundary>
}
