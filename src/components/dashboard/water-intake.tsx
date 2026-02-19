import { DropIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { Card, CardContent } from '@/components/ui/card'
import { formatMl } from '@/lib/utils'

type WaterIntakeProps = {
  amount: number
  goal: number
}

export async function WaterIntake(props: WaterIntakeProps) {
  const { amount, goal } = props
  const t = await getTranslations()

  const percentage = goal > 0 ? Math.min((amount / goal) * 100, 100) : 0

  return (
    <Link href='/water' className='block'>
      <Card size='sm'>
        <CardContent className='space-y-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <DropIcon size={20} />
              <span className='text-sm font-semibold'>{t('dashboard.water-intake')}</span>
            </div>
            <span className='text-sm font-medium text-blue-500'>
              {t('dashboard.water-amount-of-goal', { amount: formatMl(amount), goal: formatMl(goal) })}
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
