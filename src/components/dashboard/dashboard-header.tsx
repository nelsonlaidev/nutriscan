'use client'

import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

import { UserAvatar } from '@/components/user-avatar'

function getGreetingKey(hour: number) {
  if (hour >= 5 && hour < 12) return 'greeting.morning'
  if (hour >= 12 && hour < 18) return 'greeting.afternoon'
  return 'greeting.evening'
}

type DashboardHeaderProps = {
  user: { id: string; name: string; image?: string | null }
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const t = useTranslations()
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    return t(getGreetingKey(hour))
  }, [t])

  return (
    <div className='flex items-center gap-3'>
      <UserAvatar user={user} className='size-10' />
      <div>
        <p className='text-sm text-muted-foreground'>{greeting},</p>
        <h1 className='text-lg font-semibold'>{user.name}</h1>
      </div>
    </div>
  )
}
