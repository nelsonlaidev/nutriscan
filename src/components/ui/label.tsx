'use client'

import { cn } from '@/lib/utils'

type LabelProps = React.ComponentProps<'label'>

function Label(props: LabelProps) {
  const { className, ...rest } = props

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control -- This is a label component
    <label
      data-slot='label'
      className={cn(
        'gap-2 text-sm leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed',
        className
      )}
      {...rest}
    />
  )
}

export { Label }
