'use client'

import { UserCircleIcon } from '@phosphor-icons/react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserAvatar } from '@/components/user-avatar'
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
        <UserAvatar className='size-16' fallbackClassName='text-2xl' />
        <div className='space-y-1'>
          <p className='font-medium'>{user.name}</p>
          <p className='text-sm text-muted-foreground'>{user.email}</p>
        </div>
      </CardContent>
    </Card>
  )
}
