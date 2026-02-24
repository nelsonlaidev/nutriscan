'use client'

import type { NavbarLink } from '@/lib/links'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { getNavbarLinks } from '@/lib/links'

import { UserAvatar } from './user-avatar'

export function Navbar() {
  const pathname = usePathname()
  const t = useTranslations()
  const navbarLinks = getNavbarLinks(t)

  return (
    <nav className='fixed inset-x-0 bottom-0 flex items-center justify-around gap-1 border-t bg-background p-2'>
      {navbarLinks.map((link: NavbarLink) => {
        const active = pathname === link.href
        const isPrimary = link.primary

        return (
          <Link
            href={link.href}
            key={link.href}
            aria-label={link.title}
            data-active={active}
            data-primary={isPrimary}
            className='inline-flex items-center justify-center rounded-full p-3 transition-colors data-[primary=true]:bg-primary data-[primary=true]:text-primary-foreground data-active:bg-accent'
          >
            {link.icon ? (
              <link.icon size={24} weight={active && !isPrimary ? 'fill' : 'regular'} />
            ) : (
              <UserAvatar className='size-6' />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
