import { LeafIcon } from '@phosphor-icons/react/ssr'
import { getTranslations } from 'next-intl/server'

import { LandingButtons } from '@/components/landing-buttons'

async function Page() {
  const t = await getTranslations()

  return (
    <div className='flex min-h-svh flex-col p-6'>
      <div className='flex-1' />
      <div className='flex flex-col items-center gap-4'>
        <div className='flex size-18 items-center justify-center rounded-2xl bg-primary'>
          <LeafIcon size={36} className='text-primary-foreground' />
        </div>
        <h1 className='text-3xl font-semibold'>{t('landing.app-name')}</h1>
      </div>
      <div className='flex-1' />
      <LandingButtons signUpText={t('auth.sign-up')} signInText={t('auth.sign-in')} />
    </div>
  )
}

export default Page
