'use client'

import { GearIcon } from '@phosphor-icons/react'
import { UserCircleIcon } from '@phosphor-icons/react/dist/ssr'

import PageTitle from '@/components/page-title'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/session'
import { getInitials } from '@/lib/utils'

function Page() {
  const { user } = useSession()

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <PageTitle title='Profile' />
        <Button variant='ghost' size='icon'>
          <GearIcon size={28} />
        </Button>
      </div>
      <div className='flex flex-col'>
        {user.image ? (
          <Avatar>
            <AvatarImage src={user.image} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        ) : (
          <UserCircleIcon size={100} />
        )}
      </div>
    </div>
  )
}

export default Page
