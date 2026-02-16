'use client'

import { GearIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { PageTitle } from '@/components/page-title'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { UserAvatar } from '@/components/user-avatar'
import { useSession } from '@/lib/session'

function Page() {
  const { user } = useSession()
  const t = useTranslations()

  const displayName = user.name

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <PageTitle title={t('profile.page-title')} />
        <Link href='/settings' className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
          <GearIcon size={28} />
        </Link>
      </div>

      <div className='flex flex-col items-center gap-2 py-4'>
        <UserAvatar className='size-24' />
        <div className='text-center'>
          <p className='text-xl font-semibold'>{displayName}</p>
          <p className='text-sm text-muted-foreground'>{user.email}</p>
        </div>
      </div>

      <Separator />

      <div className='flex flex-col gap-2'>
        <h2 className='text-sm font-medium text-muted-foreground'>{t('profile.health-metrics')}</h2>
        <div className='grid grid-cols-3 gap-3'>
          <div className='rounded-lg bg-muted/50 p-3 text-center'>
            <p className='text-xs text-muted-foreground'>{t('profile.current-weight')}</p>
            <p className='text-lg font-semibold'>{user.currentWeight} kg</p>
          </div>
          <div className='rounded-lg bg-muted/50 p-3 text-center'>
            <p className='text-xs text-muted-foreground'>{t('profile.goal-weight')}</p>
            <p className='text-lg font-semibold'>{user.goalWeight} kg</p>
          </div>
          <div className='rounded-lg bg-muted/50 p-3 text-center'>
            <p className='text-xs text-muted-foreground'>{t('profile.height')}</p>
            <p className='text-lg font-semibold'>{user.height} cm</p>
          </div>
        </div>
      </div>

      <Separator />

      <div className='flex flex-col gap-3'>
        <h2 className='text-sm font-medium text-muted-foreground'>{t('profile.account')}</h2>
        <div className='flex items-center justify-between'>
          <p className='text-sm'>{t('profile.member-since')}</p>
          <p className='text-sm text-muted-foreground'>{memberSince}</p>
        </div>
      </div>
    </div>
  )
}

export default Page
