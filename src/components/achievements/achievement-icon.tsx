import type { AchievementIcon as AchievementIconName } from '@/lib/achievements/types'

import {
  BarbellIcon,
  BowlFoodIcon,
  CalendarBlankIcon,
  CheckCircleIcon,
  DropIcon,
  FireIcon,
  ScalesIcon,
  TargetIcon,
} from '@phosphor-icons/react/ssr'

import { cn } from '@/lib/utils'

const ICONS = {
  barbell: BarbellIcon,
  'bowl-food': BowlFoodIcon,
  'calendar-blank': CalendarBlankIcon,
  'check-circle': CheckCircleIcon,
  drop: DropIcon,
  fire: FireIcon,
  scales: ScalesIcon,
  target: TargetIcon,
} satisfies Record<AchievementIconName, React.ComponentType<{ className?: string; size?: number }>>

type AchievementIconProps = {
  icon: AchievementIconName
  className?: string
  size?: number
}

export function AchievementIcon({ icon, className, size = 18 }: AchievementIconProps) {
  const Icon = ICONS[icon]

  return <Icon size={size} className={cn('text-current', className)} />
}
