import {
  BookmarkSimpleIcon,
  CameraIcon,
  ChartBarIcon,
  ChatsCircleIcon,
  HouseIcon,
  PlusIcon,
} from '@phosphor-icons/react/ssr'

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
    icon: PlusIcon,
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

export const ADD_FOOD_OPTIONS = [
  {
    title: 'add-food.scan-option-title',
    description: 'add-food.scan-option-description',
    href: '/add/scan',
    icon: CameraIcon,
    iconClassName: 'bg-linear-to-br from-primary/20 via-primary/10 to-primary/5 text-primary ring-primary/15',
  },
  {
    title: 'saved-meals.page-title',
    description: 'add-food.saved-option-description',
    href: '/saved-foods',
    icon: BookmarkSimpleIcon,
    iconClassName:
      'bg-linear-to-br from-amber-500/20 via-orange-500/10 to-background text-amber-700 ring-amber-500/20 dark:text-amber-200',
  },
] as const
