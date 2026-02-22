'use client'

import { CaretRightIcon, UserIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export function PersonalDetailsLink() {
  const t = useTranslations()

  return (
    <Link href='/settings/personal-details' className='flex h-9 items-center justify-between'>
      <div className='flex items-center gap-2'>
        <UserIcon size={20} />
        <span className='text-base'>{t('settings.personal-details.title')}</span>
      </div>
      <CaretRightIcon size={20} className='text-muted-foreground' />
    </Link>
  )
}
