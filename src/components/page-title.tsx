'use client'

import { ArrowLeftIcon } from '@phosphor-icons/react/ssr'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'

import { Button } from './ui/button'

type PageTitleProps = {
  title: string
  onClickBack?: () => void
  withBackButton?: boolean
  children?: React.ReactNode
} & Omit<React.ComponentProps<'div'>, 'children'>

export function PageTitle(props: PageTitleProps) {
  const { title, onClickBack, withBackButton = false, children, className, ...rest } = props
  const router = useRouter()

  function handleClickBack() {
    if (onClickBack) {
      onClickBack()
      return
    }

    router.back()
  }

  return (
    <div className={cn('relative flex items-center justify-center gap-3 bg-background', className)} {...rest}>
      {withBackButton && (
        <Button onClick={handleClickBack} type='button' size='icon-sm' variant='outline' className='absolute left-0'>
          <ArrowLeftIcon size={20} />
        </Button>
      )}
      <h1 className='text-2xl font-semibold'>{title}</h1>
      {children}
    </div>
  )
}
