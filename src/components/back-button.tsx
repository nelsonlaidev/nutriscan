'use client'

import { ArrowLeftIcon } from '@phosphor-icons/react/ssr'
import { useRouter } from 'next/navigation'

import { Button } from './ui/button'

type BackButtonProps = {
  onClick?: () => void
} & Omit<React.ComponentProps<typeof Button>, 'onClick'>

export function BackButton(props: BackButtonProps) {
  const { onClick, ...rest } = props
  const router = useRouter()

  function handleClick() {
    if (onClick) {
      onClick()
    } else {
      router.back()
    }
  }

  return (
    <Button onClick={handleClick} type='button' size='icon-sm' variant='outline' {...rest}>
      <ArrowLeftIcon size={20} />
    </Button>
  )
}
