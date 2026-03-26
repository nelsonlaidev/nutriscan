import type { Metadata } from 'next'

import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { BackButton } from '@/components/back-button'
import { MainLayout } from '@/components/main-layout'
import { ProfileForm } from '@/components/settings/profile-form'
import { getSession } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Edit Profile',
}

export default async function ProfilePage() {
  const [t, session] = await Promise.all([getTranslations(), getSession()])
  if (!session) redirect('/')

  return (
    <MainLayout title={t('settings.profile.title')} leftTitleButton={<BackButton />}>
      <ProfileForm user={session.user} />
    </MainLayout>
  )
}
