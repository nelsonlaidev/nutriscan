'use client'

import Link from 'next/link'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type LandingButtonsProps = {
  signUpText: string
  signInText: string
}

export function LandingButtons(props: LandingButtonsProps) {
  const { signUpText, signInText } = props

  return (
    <div className='flex flex-col gap-4'>
      <Link href='/auth/sign-up' className={cn(buttonVariants({ size: 'lg' }))}>
        {signUpText}
      </Link>
      <Link href='/auth/sign-in' className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }))}>
        {signInText}
      </Link>
    </div>
  )
}
