'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NAVBAR_LINKS } from '@/lib/links'

import { UserAvatar } from './user-avatar'

export function Navbar() {
  const pathname = usePathname()

  return (
    <div className='fixed inset-x-0 bottom-2 flex items-center justify-center'>
      <nav className='flex items-center gap-1 rounded-full bg-background p-2 shadow-sm'>
        {NAVBAR_LINKS.map((link) => {
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
    </div>
  )
}
