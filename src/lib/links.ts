import { CameraIcon, ChartBarIcon, ChatsCircleIcon, HouseIcon } from '@phosphor-icons/react'

export const NAVBAR_LINKS = [
  {
    // i18n-check t('nav.home')
    title: 'nav.home',
    href: '/dashboard',
    icon: HouseIcon,
  },
  {
    // i18n-check t('nav.progress')
    title: 'nav.progress',
    href: '/progress',
    icon: ChartBarIcon,
  },
  {
    // i18n-check t('nav.add')
    title: 'nav.add',
    href: '/add',
    icon: CameraIcon,
  },
  {
    // i18n-check t('nav.chat')
    title: 'nav.chat',
    href: '/chat',
    icon: ChatsCircleIcon,
  },
  {
    // i18n-check t('nav.profile')
    title: 'nav.profile',
    href: '/profile',
    icon: null,
  },
] as const
