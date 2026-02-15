import { ChartBarIcon, HouseIcon, UserCircleIcon } from '@phosphor-icons/react/ssr'

import { env } from '@/env'

export const isProd = env.NODE_ENV === 'production'
export const isDev = env.NODE_ENV === 'development'

export const DEFAULT_LOCALE = 'en'
export const LOCALES = [DEFAULT_LOCALE, 'zh-TW'] as const
export const LOCALE_ITEMS = [
  { label: 'English', value: 'en' },
  { label: '繁體中文', value: 'zh-TW' }
]

export const NAVBAR_LINKS = [
  {
    title: 'Home',
    href: '/dashboard',
    icon: HouseIcon
  },
  {
    title: 'Progress',
    href: '/progress',
    icon: ChartBarIcon
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: UserCircleIcon
  }
]
