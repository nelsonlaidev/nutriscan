'use client'

import { GearIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function SettingsLink() {
  return (
    <Link href='/settings' className={cn(buttonVariants({ variant: 'ghost', size: 'icon-lg' }))}>
      <GearIcon size={28} />
    </Link>
  )
}
