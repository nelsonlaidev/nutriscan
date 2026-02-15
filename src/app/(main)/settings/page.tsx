import { PageTitle } from '@/components/page-title'
import { LanguageSelector } from '@/components/settings/language-selector'
import { PersonalInfo } from '@/components/settings/personal-info'
import { SignOutButton } from '@/components/settings/sign-out-button'
import { ThemeToggle } from '@/components/settings/theme-toggle'
import { Card, CardContent } from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className='flex flex-col gap-6 pb-20'>
      <PageTitle title='Settings' />

      <div className='space-y-6'>
        <PersonalInfo />

        <Card size='sm'>
          <CardContent className='space-y-6'>
            <ThemeToggle />
            <LanguageSelector />
          </CardContent>
        </Card>

        <SignOutButton />
      </div>
    </div>
  )
}
