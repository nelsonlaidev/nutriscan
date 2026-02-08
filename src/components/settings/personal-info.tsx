'use client'

import { UserCircleIcon } from '@phosphor-icons/react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSession } from '@/lib/auth-client'

export function PersonalInfo() {
  const { data: session } = useSession()
  const user = session?.user

  if (!user) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <UserCircleIcon size={24} />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className='flex items-center gap-4'>
        <Avatar className='size-16'>
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className='space-y-1'>
          <p className='font-medium'>{user.name}</p>
          <p className='text-sm text-muted-foreground'>{user.email}</p>
        </div>
      </CardContent>
    </Card>
  )
}
