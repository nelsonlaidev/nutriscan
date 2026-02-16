import type { Translator } from '@/types'

import { CameraIcon, ChartBarIcon, ChatsCircleIcon, HouseIcon } from '@phosphor-icons/react'

export type NavbarLink = {
  title: string
  href: string
  icon: typeof HouseIcon | null
  primary?: boolean
}

export function getNavbarLinks(t: Translator): NavbarLink[] {
  return [
    {
      title: t('nav.home'),
      href: '/dashboard',
      icon: HouseIcon
    },
    {
      title: t('nav.progress'),
      href: '/progress',
      icon: ChartBarIcon
    },
    {
      title: t('nav.add'),
      href: '/add',
      icon: CameraIcon,
      primary: true
    },
    {
      title: t('nav.chat'),
      href: '/chat',
      icon: ChatsCircleIcon
    },
    {
      title: t('nav.profile'),
      href: '/profile',
      icon: null
    }
  ]
}
