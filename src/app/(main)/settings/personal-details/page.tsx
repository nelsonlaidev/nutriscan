import type { Metadata } from 'next'

import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { BackButton } from '@/components/back-button'
import { MainLayout } from '@/components/main-layout'
import { PersonalDetailsForm } from '@/components/settings/personal-details-form'
import { getSession } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Personal Details',
}

export default async function PersonalDetailsPage() {
  const [t, session] = await Promise.all([getTranslations(), getSession()])
  if (!session) redirect('/')

  return (
    <MainLayout title={t('settings.personal-details.title')} leftTitleButton={<BackButton />}>
      <PersonalDetailsForm user={session.user} />
    </MainLayout>
  )
}
