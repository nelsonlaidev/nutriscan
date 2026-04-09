'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { NAVBAR_LINKS } from '@/lib/links'

import { UserAvatar } from './user-avatar'

type NavbarProps = {
  user: { id: string; name: string; image?: string | null }
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const t = useTranslations()

  return (
    <nav className='fixed bottom-0 left-1/2 flex w-full max-w-240 -translate-x-1/2 items-center justify-around gap-1 border-t bg-background p-2'>
      {NAVBAR_LINKS.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
        const isPrimary = link.href === '/add'

        return (
          <Link
            href={link.href}
            key={link.href}
            aria-current={active ? 'page' : undefined}
            aria-label={t(link.title)}
            data-active={active}
            data-primary={isPrimary}
            className='inline-flex items-center justify-center rounded-full p-3 transition-colors data-[primary=true]:bg-primary data-[primary=true]:text-primary-foreground data-active:bg-accent'
          >
            {link.icon ? (
              <link.icon size={24} weight={active && !isPrimary ? 'fill' : 'regular'} />
            ) : (
              <UserAvatar user={user} className='size-6' />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
