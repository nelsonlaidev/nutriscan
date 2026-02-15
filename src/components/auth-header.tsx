import { LeafIcon } from '@phosphor-icons/react'

type AuthHeaderProps = {
  title: string
  description: string
}

export function AuthHeader(props: AuthHeaderProps) {
  const { title, description } = props

  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='flex size-18 items-center justify-center rounded-2xl bg-primary'>
        <LeafIcon size={36} className='text-background' />
      </div>
      <div className='space-y-1 text-center'>
        <h1 className='text-3xl font-semibold'>{title}</h1>
        <p className='text-muted-foreground'>{description}</p>
      </div>
    </div>
  )
}
