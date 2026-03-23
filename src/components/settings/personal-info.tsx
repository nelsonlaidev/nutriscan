'use client'

import { Card, CardContent } from '@/components/ui/card'
import { UserAvatar } from '@/components/user-avatar'

type PersonalInfoProps = {
  user: { id: string; name: string; email: string; image?: string | null }
}

export function PersonalInfo({ user }: PersonalInfoProps) {
  return (
    <Card size='sm'>
      <CardContent className='flex items-center gap-3'>
        <UserAvatar user={user} className='size-14' />
        <div>
          <div className='text-lg font-medium'>{user.name}</div>
          <div className='text-sm'>{user.email}</div>
        </div>
      </CardContent>
    </Card>
  )
}
