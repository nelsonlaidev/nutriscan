import { getTranslations } from 'next-intl/server'

import { PageContainer } from '@/components/page-container'
import { PageTitle } from '@/components/page-title'
import { LanguageSelector } from '@/components/settings/language-selector'
import { PersonalDetailsLink } from '@/components/settings/personal-details-link'
import { PersonalInfo } from '@/components/settings/personal-info'
import { SignOutButton } from '@/components/settings/sign-out-button'
import { ThemeToggle } from '@/components/settings/theme-toggle'
import { Card, CardContent } from '@/components/ui/card'

export default async function SettingsPage() {
  const t = await getTranslations()

  return (
    <PageContainer className='pb-20'>
      <PageTitle title={t('settings.title')} />

      <div className='space-y-6'>
        <PersonalInfo />

        <Card size='sm'>
          <CardContent className='space-y-6'>
            <PersonalDetailsLink />
            <ThemeToggle />
            <LanguageSelector />
          </CardContent>
        </Card>

        <SignOutButton />
      </div>
    </PageContainer>
  )
}
