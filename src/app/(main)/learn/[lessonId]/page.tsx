import type { Metadata } from 'next'
import type { LearnLessonId } from '@/lib/learn/types'
import type { GetLearnLessonInput } from '@/orpc/client'

import { notFound, redirect } from 'next/navigation'

import { LessonPlayer } from '@/components/learn/lesson-player'
import { MainLayout } from '@/components/main-layout'
import { getSession } from '@/lib/auth'
import { LEARN_LESSON_IDS_SET } from '@/lib/learn/catalog'
import { getQueryClient, HydrateClient } from '@/lib/query/hydration'
import { orpc } from '@/orpc/client'

export const metadata: Metadata = {
  title: 'Lesson',
}

type LearnLessonPageProps = {
  params: Promise<{ lessonId: string }>
}

export default async function LearnLessonPage(props: LearnLessonPageProps) {
  const { lessonId } = await props.params

  if (!LEARN_LESSON_IDS_SET.has(lessonId)) {
    notFound()
  }

  const validatedLessonId = lessonId as LearnLessonId

  const session = await getSession()
  if (!session) redirect('/')

  const queryClient = getQueryClient()
  const input: GetLearnLessonInput = { lessonId: validatedLessonId }

  try {
    await queryClient.fetchQuery(orpc.learn.getLesson.queryOptions({ input }))
  } catch {
    redirect(`/learn?locked=${lessonId}`)
  }

  return (
    <MainLayout className='space-y-0 px-0 pt-0'>
      <HydrateClient client={queryClient}>
        <LessonPlayer lessonId={validatedLessonId} />
      </HydrateClient>
    </MainLayout>
  )
}
