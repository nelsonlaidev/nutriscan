import type { Metadata } from 'next'

import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { LearnHome } from '@/components/learn/learn-home'
import { MainLayout } from '@/components/main-layout'
import { getSession } from '@/lib/auth'
import { getQueryClient, HydrateClient } from '@/lib/query/hydration'
import { orpc } from '@/orpc/client'

export const metadata: Metadata = {
  title: 'Learn',
}

export default async function LearnPage() {
  const session = await getSession()
  if (!session) redirect('/')

  const t = await getTranslations()
  const queryClient = getQueryClient()

  await queryClient.prefetchQuery(orpc.learn.overview.queryOptions())

  return (
    <MainLayout title={t('learn.page-title')} className='space-y-6'>
      <HydrateClient client={queryClient}>
        <LearnHome />
      </HydrateClient>
    </MainLayout>
  )
}
