import { CameraIcon, ChartBarIcon, ChatsCircleIcon, HouseIcon } from '@phosphor-icons/react/ssr'

export const NAVBAR_LINKS = [
  {
    title: 'nav.home',
    href: '/dashboard',
    icon: HouseIcon,
  },
  {
    title: 'nav.progress',
    href: '/progress',
    icon: ChartBarIcon,
  },
  {
    title: 'nav.add',
    href: '/add',
    icon: CameraIcon,
  },
  {
    title: 'nav.chat',
    href: '/chat',
    icon: ChatsCircleIcon,
  },
  {
    title: 'nav.profile',
    href: '/profile',
    icon: null,
  },
] as const
