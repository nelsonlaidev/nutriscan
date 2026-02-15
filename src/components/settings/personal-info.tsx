'use client'

import { Card, CardContent } from '@/components/ui/card'
import { UserAvatar } from '@/components/user-avatar'
import { useSession } from '@/lib/session'

export function PersonalInfo() {
  const { user } = useSession()

  return (
    <Card>
      <CardContent className='flex items-center gap-3'>
        <UserAvatar className='size-14' />
        <div>
          <div className='text-lg font-medium'>{user.name}</div>
          <div className='text-sm'>{user.email}</div>
        </div>
      </CardContent>
    </Card>
  )
}
