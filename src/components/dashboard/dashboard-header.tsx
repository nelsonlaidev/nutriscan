'use client'

import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { UserAvatar } from '@/components/user-avatar'
import { useSession } from '@/lib/session'

function getGreetingKey(hour: number) {
  if (hour >= 5 && hour < 12) return 'greeting.morning'
  if (hour >= 12 && hour < 18) return 'greeting.afternoon'
  return 'greeting.evening'
}

export function DashboardHeader() {
  const { user } = useSession()
  const t = useTranslations()
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    return t(getGreetingKey(hour))
  }, [t])

  return (
    <div className='flex items-center gap-3'>
      <UserAvatar className='size-10' />
      <div>
        <p className='text-sm text-muted-foreground'>{greeting},</p>
        <h1 className='text-lg font-semibold'>{user.name}</h1>
      </div>
    </div>
  )
}
