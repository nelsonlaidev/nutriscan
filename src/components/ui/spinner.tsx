import type { IconProps } from '@phosphor-icons/react'

import { SpinnerIcon } from '@phosphor-icons/react/ssr'

import { cn } from '@/lib/utils'

type SpinnerProps = IconProps

function Spinner(props: SpinnerProps) {
  const { className, ...rest } = props

  return (
    <SpinnerIcon size={16} role='status' aria-label='Loading' className={cn('animate-spin', className)} {...rest} />
  )
}

export { Spinner }
