import { cn } from '@/lib/utils'

type PageContainerProps = React.ComponentProps<'div'>

export function PageContainer(props: PageContainerProps) {
  const { children, className, ...rest } = props

  return (
    <div className={cn('flex flex-col gap-6', className)} {...rest}>
      {children}
    </div>
  )
}
