'use client'

import { GearIcon, SignOutIcon, SpinnerGapIcon } from '@phosphor-icons/react'
import { UserCircleIcon } from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'

import PageTitle from '@/components/page-title'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { authClient } from '@/lib/auth-client'
import { useSession } from '@/lib/session'
import { getInitials } from '@/lib/utils'

function formatMetric(value: number | null | undefined, unit: string) {
  if (value === null) return 'Not set'
  return `${value} ${unit}`
}

function Page() {
  const { user } = useSession()
  const [signingOut, setSigningOut] = useState(false)

  const displayName = user.name

  async function handleSignOut() {
    setSigningOut(true)
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          globalThis.location.href = '/auth/sign-in'
        }
      }
    })
    setSigningOut(false)
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <PageTitle title='Profile' />
        <Button variant='ghost' size='icon'>
          <GearIcon size={28} />
        </Button>
      </div>

      {/* Avatar + Name + Email */}
      <div className='flex flex-col items-center gap-2 py-4'>
        {user.image ? (
          <Avatar className='size-24'>
            <AvatarImage src={user.image} />
            <AvatarFallback className='text-2xl'>{getInitials(displayName)}</AvatarFallback>
          </Avatar>
        ) : (
          <UserCircleIcon size={96} />
        )}
        <div className='text-center'>
          <p className='text-xl font-semibold'>{displayName}</p>
          <p className='text-sm text-muted-foreground'>{user.email}</p>
        </div>
      </div>

      <Separator />

      {/* Health Metrics */}
      <div className='flex flex-col gap-2'>
        <h2 className='text-sm font-medium text-muted-foreground'>Health Metrics</h2>
        <div className='grid grid-cols-3 gap-3'>
          <div className='rounded-lg bg-muted/50 p-3 text-center'>
            <p className='text-xs text-muted-foreground'>Current Weight</p>
            <p className='text-lg font-semibold'>{formatMetric(user.currentWeight, 'kg')}</p>
          </div>
          <div className='rounded-lg bg-muted/50 p-3 text-center'>
            <p className='text-xs text-muted-foreground'>Goal Weight</p>
            <p className='text-lg font-semibold'>{formatMetric(user.goalWeight, 'kg')}</p>
          </div>
          <div className='rounded-lg bg-muted/50 p-3 text-center'>
            <p className='text-xs text-muted-foreground'>Height</p>
            <p className='text-lg font-semibold'>{formatMetric(user.height, 'cm')}</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Account Info */}
      <div className='flex flex-col gap-3'>
        <h2 className='text-sm font-medium text-muted-foreground'>Account</h2>
        <div className='flex items-center justify-between'>
          <p className='text-sm'>Member since</p>
          <p className='text-sm text-muted-foreground'>{memberSince}</p>
        </div>
      </div>

      <Separator />

      {/* Sign Out */}
      <Button variant='destructive' onClick={handleSignOut} disabled={signingOut} className='w-full'>
        {signingOut ? <SpinnerGapIcon size={20} className='animate-spin' /> : <SignOutIcon size={20} />}
        {signingOut ? 'Signing out...' : 'Sign out'}
      </Button>
    </div>
  )
}

export default Page
