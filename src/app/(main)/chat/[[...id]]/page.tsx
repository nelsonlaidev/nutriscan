import * as z from 'zod'

import { Chat } from '@/components/chat'
import { getQueryClient, HydrateClient } from '@/lib/query/hydration'
import { orpc } from '@/orpc/client'

const ParamsSchema = z.uuid().optional()

export default async function ChatPage(props: PageProps<'/chat/[[...id]]'>) {
  const { params } = props
  const { id } = await params

  const parsedId = ParamsSchema.parse(id?.join(''))
  // Server component, not a hook/client render
  // oxlint-disable-next-line react-x/purity
  const randomId = crypto.randomUUID()

  const queryClient = getQueryClient()

  const prefetches = [queryClient.prefetchQuery(orpc.chat.list.queryOptions())]

  if (parsedId) {
    prefetches.push(queryClient.prefetchQuery(orpc.chat.getById.queryOptions({ input: { chatId: parsedId } })))
  }

  await Promise.all(prefetches)

  return (
    <HydrateClient client={queryClient}>
      <Chat isNewChat={parsedId === undefined} id={parsedId ?? randomId} />
    </HydrateClient>
  )
}
