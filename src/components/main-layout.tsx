import { cn } from '@/lib/utils'

type MainLayoutProps = {
  title?: string
  leftTitleButton?: React.ReactNode
  rightTitleButton?: React.ReactNode
} & React.ComponentProps<'main'>

export function MainLayout(props: MainLayoutProps) {
  const { title, leftTitleButton, rightTitleButton, children, className, ...rest } = props

  return (
    <main className={cn('min-h-full px-4 pt-6 pb-24', className)} {...rest}>
      {title && (
        <div className='-mx-4 -mt-6 mb-4 flex items-center bg-background p-4'>
          <div className='flex-1'>{leftTitleButton}</div>
          <h1 className='font-semibold sm:text-2xl'>{title}</h1>
          <div className='flex flex-1 justify-end'>{rightTitleButton}</div>
        </div>
      )}
      {children}
    </main>
  )
}
