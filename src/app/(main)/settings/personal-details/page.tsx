import { getTranslations } from 'next-intl/server'

import { BackButton } from '@/components/back-button'
import { MainLayout } from '@/components/main-layout'
import { PersonalDetailsForm } from '@/components/settings/personal-details-form'

export default async function PersonalDetailsPage() {
  const t = await getTranslations()

  return (
    <MainLayout title={t('settings.personal-details.title')} leftTitleButton={<BackButton />}>
      <PersonalDetailsForm />
    </MainLayout>
  )
}
