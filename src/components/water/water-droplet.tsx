'use client'

import { cn } from '@/lib/utils'

type WaterDropletProps = {
  percentage: number
  className?: string
}

export function WaterDroplet(props: WaterDropletProps) {
  const { percentage, className } = props
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100)
  const fillY = 100 - clampedPercentage

  return (
    <svg viewBox='0 0 200 260' className={cn('w-48', className)}>
      <defs>
        <clipPath id='droplet-clip'>
          <path d='M100 10 C100 10, 30 120, 30 170 C30 210, 60 250, 100 250 C140 250, 170 210, 170 170 C170 120, 100 10, 100 10Z' />
        </clipPath>
        <linearGradient id='water-gradient' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0%' stopColor='#60a5fa' />
          <stop offset='100%' stopColor='#3b82f6' />
        </linearGradient>
      </defs>

      {/* Droplet outline */}
      <path
        d='M100 10 C100 10, 30 120, 30 170 C30 210, 60 250, 100 250 C140 250, 170 210, 170 170 C170 120, 100 10, 100 10Z'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        className='text-blue-200 dark:text-blue-900'
      />

      {/* Water fill with wave animation */}
      <g clipPath='url(#droplet-clip)'>
        {/* Background fill */}
        <rect
          x='0'
          y={`${(fillY / 100) * 260}`}
          width='200'
          height={`${(clampedPercentage / 100) * 260}`}
          fill='url(#water-gradient)'
          className='transition-all duration-700 ease-out'
        />

        {/* Wave effect */}
        <g
          className='transition-all duration-700 ease-out'
          style={{ transform: `translateY(${(fillY / 100) * 260}px)` }}
        >
          <path d='M0 8 Q25 0, 50 8 T100 8 T150 8 T200 8 V30 H0Z' fill='#60a5fa' opacity='0.5'>
            <animateTransform
              attributeName='transform'
              type='translate'
              values='0,0;-50,0;0,0'
              dur='3s'
              repeatCount='indefinite'
            />
          </path>
          <path d='M0 12 Q25 4, 50 12 T100 12 T150 12 T200 12 V30 H0Z' fill='#3b82f6' opacity='0.3'>
            <animateTransform
              attributeName='transform'
              type='translate'
              values='0,0;50,0;0,0'
              dur='4s'
              repeatCount='indefinite'
            />
          </path>
        </g>
      </g>
    </svg>
  )
}
