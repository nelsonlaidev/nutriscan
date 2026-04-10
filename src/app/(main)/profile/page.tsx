import type { Metadata } from 'next'

import { redirect } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'

import { AchievementSection } from '@/components/achievements/achievement-section'
import { LearningSection } from '@/components/learn/learning-section'
import { MainLayout } from '@/components/main-layout'
import { ProfileShareButton } from '@/components/profile/profile-share-button'
import { UserAvatar } from '@/components/user-avatar'
import { getSession } from '@/lib/auth'
import { getQueryClient, HydrateClient } from '@/lib/query/hydration'
import { orpc } from '@/orpc/client'

import { SettingsLink } from './settings-link'

export const metadata: Metadata = {
  title: 'Profile',
}

type ProfileMetricCardProps = {
  label: string
  value: string
  unit: string
}

function ProfileMetricCard({ label, value, unit }: ProfileMetricCardProps) {
  return (
    <div className='rounded-2xl border border-border/60 bg-background/80 p-4 shadow-xs backdrop-blur-sm'>
      <p className='text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase'>{label}</p>
      <div className='mt-3 flex items-end gap-1.5'>
        <p className='text-2xl font-semibold tracking-tight tabular-nums'>{value}</p>
        <p className='pb-1 text-sm font-medium text-muted-foreground'>{unit}</p>
      </div>
    </div>
  )
}

export default async function Page() {
  const [session, t, locale] = await Promise.all([getSession(), getTranslations(), getLocale()])
  if (!session) redirect('/')

  const { user } = session
  const queryClient = getQueryClient()

  await Promise.all([
    queryClient.prefetchQuery(orpc.achievements.overview.queryOptions()),
    queryClient.prefetchQuery(orpc.achievements.list.queryOptions()),
    queryClient.prefetchQuery(orpc.learn.overview.queryOptions()),
  ])

  const memberSince = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(Date.parse(String(user.createdAt)))
  const formatMetric = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  })

  return (
    <MainLayout title={t('profile.page-title')} className='space-y-12' rightTitleButton={<SettingsLink />}>
      <HydrateClient client={queryClient}>
        <section className='overflow-hidden rounded-[2rem] border border-border/60 bg-linear-to-br from-background via-background to-primary/5 shadow-xs'>
          <div className='space-y-6 px-5 py-6'>
            <div className='flex items-center gap-4'>
              <div className='rounded-[1.75rem] bg-primary/8 p-1.5 ring-1 ring-primary/10'>
                <UserAvatar user={user} className='size-20 rounded-4xl' />
              </div>
              <div className='min-w-0 space-y-1'>
                <p className='truncate text-2xl font-semibold tracking-tight'>{user.name}</p>
                <p className='truncate text-sm text-muted-foreground'>{user.email}</p>
                <p className='inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary'>
                  {t('profile.member-since')} {memberSince}
                </p>
              </div>
            </div>

            <div className='space-y-3'>
              <h2 className='text-sm font-medium text-muted-foreground'>{t('profile.health-metrics')}</h2>
              <div className='grid grid-cols-1 gap-3 min-[420px]:grid-cols-3'>
                <ProfileMetricCard
                  label={t('profile.current-weight')}
                  value={formatMetric.format(user.currentWeight)}
                  unit='kg'
                />
                <ProfileMetricCard
                  label={t('profile.goal-weight')}
                  value={formatMetric.format(user.goalWeight)}
                  unit='kg'
                />
                <ProfileMetricCard label={t('profile.height')} value={formatMetric.format(user.height)} unit='cm' />
              </div>
            </div>
            <div className='pt-1'>
              <ProfileShareButton name={user.name} />
            </div>
          </div>
        </section>

        <LearningSection />
        <AchievementSection />
      </HydrateClient>
    </MainLayout>
  )
}
