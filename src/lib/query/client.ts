import type { StandardRPCJsonSerializedMetaItem } from '@orpc/client/standard'

import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'

import { serializer } from './serializer'

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn(queryKey) {
          const [json, meta] = serializer.serialize(queryKey)
          return JSON.stringify({ json, meta })
        },
        staleTime: 60 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
        serializeData(data) {
          const [json, meta] = serializer.serialize(data)
          return { json, meta }
        },
      },
      hydrate: {
        deserializeData(data: { json: unknown; meta: StandardRPCJsonSerializedMetaItem[] }) {
          return serializer.deserialize(data.json, data.meta)
        },
      },
    },
  })
}
