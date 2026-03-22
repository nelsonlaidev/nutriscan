'use client'

import type { DayRange } from '@/lib/utils'

import { DropIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useWaterTotal } from '@/hooks/queries/water.query'
import { formatMl } from '@/lib/utils'

import { Progress } from '../ui/progress'

type WaterIntakeProps = {
  dayRange: DayRange
  goal: number
}

export function WaterIntake(props: WaterIntakeProps) {
  const { dayRange, goal } = props
  const { data: amount } = useWaterTotal(dayRange)
  const t = useTranslations()

  const percentage = goal > 0 ? Math.min((amount / goal) * 100, 100) : 0

  return (
    <Link href='/water' className='block'>
      <Card size='sm'>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <DropIcon size={20} />
              {t('dashboard.water-intake')}
            </div>
            <span className='text-sm font-medium text-blue-500'>
              {t('dashboard.water-amount-of-goal', { amount: formatMl(amount), goal: formatMl(goal) })}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress
            value={percentage}
            className='**:data-[slot=progress-indicator]:rounded-md **:data-[slot=progress-indicator]:bg-blue-400 *:data-[slot=progress-track]:h-7 *:data-[slot=progress-track]:rounded-md *:data-[slot=progress-track]:bg-blue-100 dark:*:data-[slot=progress-track]:bg-blue-950'
          />
        </CardContent>
      </Card>
    </Link>
  )
}
