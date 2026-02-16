import { CameraIcon, ChartBarIcon, ChatsCircleIcon, HouseIcon } from '@phosphor-icons/react'

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
    title: 'Add',
    href: '/add',
    icon: CameraIcon,
    primary: true
  },
  {
    title: 'Chat',
    href: '/chat',
    icon: ChatsCircleIcon
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: null
  }
]
