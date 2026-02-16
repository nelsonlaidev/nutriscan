import { DropIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'

import { Card, CardContent } from '@/components/ui/card'
import { formatMl } from '@/lib/utils'

type WaterIntakeProps = {
  amount: number
  goal: number
}

export function WaterIntake(props: WaterIntakeProps) {
  const { amount, goal } = props

  const percentage = goal > 0 ? Math.min((amount / goal) * 100, 100) : 0

  return (
    <Link href='/water'>
      <Card size='sm'>
        <CardContent className='space-y-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <DropIcon size={20} />
              <span className='text-sm font-semibold'>Water Intake</span>
            </div>
            <span className='text-sm font-medium text-blue-500'>
              {formatMl(amount)} / {formatMl(goal)}
            </span>
          </div>
          <div className='relative h-7 overflow-hidden rounded-md bg-blue-100 dark:bg-blue-950'>
            <div
              className='h-full rounded-md bg-blue-400 transition-all duration-300'
              style={{ width: `${percentage}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
