import { getTranslations } from 'next-intl/server'

import { PageContainer } from '@/components/page-container'
import { PageTitle } from '@/components/page-title'
import { PersonalDetailsForm } from '@/components/settings/personal-details-form'

export default async function PersonalDetailsPage() {
  const t = await getTranslations()

  return (
    <PageContainer>
      <PageTitle title={t('settings.personal-details.title')} withBackButton />

      <div className='mt-6'>
        <PersonalDetailsForm />
      </div>
    </PageContainer>
  )
}
