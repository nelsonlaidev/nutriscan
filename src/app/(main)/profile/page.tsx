import type { Metadata } from 'next'

import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { AchievementSection } from '@/components/achievements/achievement-section'
import { MainLayout } from '@/components/main-layout'
import { Separator } from '@/components/ui/separator'
import { UserAvatar } from '@/components/user-avatar'
import { getSession } from '@/lib/auth'
import { getQueryClient, HydrateClient } from '@/lib/query/hydration'
import { orpc } from '@/orpc/client'

import { SettingsLink } from './settings-link'

export const metadata: Metadata = {
  title: 'Profile',
}

export default async function Page() {
  const [session, t] = await Promise.all([getSession(), getTranslations()])
  if (!session) redirect('/')

  const { user } = session
  const queryClient = getQueryClient()

  await Promise.all([
    queryClient.prefetchQuery(orpc.achievements.overview.queryOptions()),
    queryClient.prefetchQuery(orpc.achievements.list.queryOptions()),
  ])

  // Server component
  // oxlint-disable-next-line react-x/purity
  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <MainLayout title={t('profile.page-title')} className='space-y-4' rightTitleButton={<SettingsLink />}>
      <HydrateClient client={queryClient}>
        <div className='flex flex-col items-center gap-2 py-4'>
          <UserAvatar user={user} className='size-24' />
          <div className='text-center'>
            <p className='text-xl font-semibold'>{user.name}</p>
            <p className='text-sm text-muted-foreground'>{user.email}</p>
          </div>
        </div>

        <Separator />

        <div className='flex flex-col gap-2'>
          <h2 className='text-sm font-medium text-muted-foreground'>{t('profile.health-metrics')}</h2>
          <div className='grid grid-cols-3 gap-3'>
            <div className='rounded-lg bg-muted/50 p-3 text-center'>
              <p className='text-xs text-muted-foreground'>{t('profile.current-weight')}</p>
              <p className='text-lg font-semibold'>{user.currentWeight} kg</p>
            </div>
            <div className='rounded-lg bg-muted/50 p-3 text-center'>
              <p className='text-xs text-muted-foreground'>{t('profile.goal-weight')}</p>
              <p className='text-lg font-semibold'>{user.goalWeight} kg</p>
            </div>
            <div className='rounded-lg bg-muted/50 p-3 text-center'>
              <p className='text-xs text-muted-foreground'>{t('profile.height')}</p>
              <p className='text-lg font-semibold'>{user.height} cm</p>
            </div>
          </div>
        </div>

        <Separator />

        <AchievementSection />

        <Separator />

        <div className='flex flex-col gap-3'>
          <h2 className='text-sm font-medium text-muted-foreground'>{t('profile.account')}</h2>
          <div className='flex items-center justify-between'>
            <p className='text-sm'>{t('profile.member-since')}</p>
            <p className='text-sm text-muted-foreground'>{memberSince}</p>
          </div>
        </div>
      </HydrateClient>
    </MainLayout>
  )
}
