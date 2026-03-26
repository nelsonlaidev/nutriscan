'use client'

import { PencilSimpleLineIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { Card, CardContent } from '@/components/ui/card'
import { UserAvatar } from '@/components/user-avatar'

type PersonalInfoProps = {
  user: { id: string; name: string; email: string; image?: string | null }
}

export function PersonalInfo({ user }: PersonalInfoProps) {
  const t = useTranslations()

  return (
    <Link
      href='/settings/profile'
      aria-label={t('settings.profile.edit')}
      className='group block rounded-2xl focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none'
    >
      <Card size='sm' className='transition-colors group-hover:bg-muted/30 group-hover:ring-foreground/15'>
        <CardContent className='flex items-center justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <UserAvatar user={user} className='size-14' />
            <div>
              <div className='text-lg font-medium'>{user.name}</div>
              <div className='text-sm text-muted-foreground'>{user.email}</div>
            </div>
          </div>
          <div className='flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary'>
            <PencilSimpleLineIcon size={18} />
            <span className='sr-only'>{t('settings.profile.edit')}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
