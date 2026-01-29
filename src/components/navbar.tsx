'use client'

import { PlusIcon } from '@phosphor-icons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NAVBAR_LINKS } from '@/lib/constants'
import { cn } from '@/lib/utils'

import { buttonVariants } from './ui/button'

function Navbar() {
  const pathname = usePathname()

  return (
    <div className='fixed inset-x-0 bottom-2 flex items-center justify-center gap-4'>
      <nav className='rounded-full bg-background p-1 shadow-sm'>
        {NAVBAR_LINKS.map((link) => {
          const active = pathname === link.href

          return (
            <Link
              href={link.href}
              key={link.href}
              className={cn(
                'inline-flex flex-col items-center px-4 py-1 text-muted-foreground',
                active && 'text-foreground bg-accent rounded-full'
              )}
            >
              <link.icon size={20} weight={active ? 'fill' : 'regular'} />
              <span className='text-sm'>{link.title}</span>
            </Link>
          )
        })}
      </nav>
      <Link
        href='/add'
        aria-label='Add new item'
        className={cn(buttonVariants({ size: 'icon' }), 'size-14 rounded-full')}
      >
        <PlusIcon />
      </Link>
    </div>
  )
}

export default Navbar
