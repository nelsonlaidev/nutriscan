'use client'

import { GearIcon } from '@phosphor-icons/react'

import PageTitle from '@/components/page-title'
import { Button } from '@/components/ui/button'

function Page() {
  return (
    <div className='flex items-center justify-between'>
      <PageTitle title='Profile' />
      <Button variant='ghost' size='icon'>
        <GearIcon className='size-7' />
      </Button>
    </div>
  )
}

export default Page
