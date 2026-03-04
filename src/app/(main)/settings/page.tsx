import { getTranslations } from 'next-intl/server'

import { MainLayout } from '@/components/main-layout'
import { Feedback } from '@/components/settings/feedback'
import { LanguageSelector } from '@/components/settings/language-selector'
import { PersonalDetailsLink } from '@/components/settings/personal-details-link'
import { PersonalInfo } from '@/components/settings/personal-info'
import { SignOutButton } from '@/components/settings/sign-out-button'
import { ThemeToggle } from '@/components/settings/theme-toggle'
import { Card, CardContent } from '@/components/ui/card'

export default async function SettingsPage() {
  const t = await getTranslations()

  return (
    <MainLayout title={t('settings.title')}>
      <div className='space-y-6'>
        <PersonalInfo />

        <Card size='sm'>
          <CardContent className='space-y-6'>
            <PersonalDetailsLink />
            <ThemeToggle />
            <LanguageSelector />
            <Feedback />
          </CardContent>
        </Card>

        <SignOutButton />
      </div>
    </MainLayout>
  )
}
