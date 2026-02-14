'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSession } from '@/lib/session'
import { cn, getInitials } from '@/lib/utils'

type UserAvatarProps = {
  className?: string
  fallbackClassName?: string
  initialsLimit?: number
}

export function UserAvatar({ className, fallbackClassName, initialsLimit = 2 }: UserAvatarProps) {
  const { user } = useSession()

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={user.image ?? undefined} alt={user.name} />
      <AvatarFallback className={fallbackClassName}>{getInitials(user.name, initialsLimit)}</AvatarFallback>
    </Avatar>
  )
}
