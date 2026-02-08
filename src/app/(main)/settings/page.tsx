import PageTitle from '@/components/page-title'
import { LanguageSelector } from '@/components/settings/language-selector'
import { PersonalInfo } from '@/components/settings/personal-info'
import { SignOutButton } from '@/components/settings/sign-out-button'
import { ThemeToggle } from '@/components/settings/theme-toggle'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  return (
    <div className='flex flex-col gap-6 p-4 pb-20 md:p-6 md:pb-6'>
      <PageTitle title='Settings' />

      <div className='space-y-6'>
        <PersonalInfo />

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className='space-y-6'>
            <ThemeToggle />
            <Separator />
            <LanguageSelector />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <SignOutButton />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
