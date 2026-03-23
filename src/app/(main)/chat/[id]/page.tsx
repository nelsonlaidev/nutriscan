import { Chat } from '@/components/chat'
import { getQueryClient, HydrateClient } from '@/lib/query/hydration'
import { orpc } from '@/orpc/client'

export default async function ChatPage(props: PageProps<'/chat/[id]'>) {
  const { params } = props
  const { id } = await params

  const queryClient = getQueryClient()

  await Promise.all([
    queryClient.prefetchQuery(orpc.chat.list.queryOptions()),
    queryClient.prefetchQuery(orpc.chat.getById.queryOptions({ input: { chatId: id } })),
  ])

  return (
    <HydrateClient client={queryClient}>
      <Chat id={id} />
    </HydrateClient>
  )
}
