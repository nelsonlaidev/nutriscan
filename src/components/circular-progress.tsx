import { cn } from '@/lib/utils'

type CircularProgressProps = {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  className?: string
  trackClassName?: string
  progressClassName?: string
  children?: React.ReactNode
}

export function CircularProgress(props: CircularProgressProps) {
  const { value, max, size = 80, strokeWidth = 6, className, trackClassName, progressClassName, children } = props

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const percentage = max > 0 ? Math.min(value / max, 1) : 0
  const offset = circumference - percentage * circumference
  const hasChildren = children !== null

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className='-rotate-90'>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill='none'
          strokeWidth={strokeWidth}
          className={cn('stroke-muted', trackClassName)}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill='none'
          strokeWidth={strokeWidth}
          strokeLinecap='round'
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn('stroke-primary transition-all duration-500', progressClassName)}
        />
      </svg>
      {hasChildren && <div className='absolute inset-0 flex flex-col items-center justify-center'>{children}</div>}
    </div>
  )
}
