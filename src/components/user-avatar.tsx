'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { Skeleton } from './ui/skeleton'

type UserAvatarProps = React.ComponentProps<typeof Avatar> & {
  user: { id: string; name: string; image?: string | null }
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  const imageSrc = user.image ?? `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${user.id}`

  return (
    <Avatar {...props}>
      <AvatarImage src={imageSrc} alt={`${user.name}'s avatar`} />
      <AvatarFallback>
        <Skeleton className='size-full rounded-full' />
      </AvatarFallback>
    </Avatar>
  )
}
