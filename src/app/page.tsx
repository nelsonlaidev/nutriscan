'use client'

import { LeafIcon } from 'lucide-react'
import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'

function Page() {
  return (
    <div className='flex min-h-svh flex-col p-6'>
      <div className='flex-1' />
      <div className='flex flex-col items-center gap-4'>
        <div className='flex size-18 items-center justify-center rounded-2xl bg-primary'>
          <LeafIcon className='size-9 text-primary-foreground' />
        </div>
        <h1 className='text-3xl font-semibold'>NutriScan</h1>
      </div>
      <div className='flex-1' />
      <div className='flex flex-col gap-4'>
        <Link href='/auth/sign-up' className={buttonVariants({ size: 'lg' })}>
          Sign Up
        </Link>
        <Link href='/auth/sign-in' className={buttonVariants({ variant: 'ghost', size: 'lg' })}>
          Sign In
        </Link>
      </div>
    </div>
  )
}

export default Page
