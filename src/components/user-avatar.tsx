'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSession } from '@/lib/session'

import { Skeleton } from './ui/skeleton'

type UserAvatarProps = React.ComponentProps<typeof Avatar>

export function UserAvatar(props: UserAvatarProps) {
  const { user } = useSession()

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
