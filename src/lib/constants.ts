import { ChartBarIcon, GearIcon, HouseIcon, UserCircleIcon } from '@phosphor-icons/react'

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
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: GearIcon
  }
]
