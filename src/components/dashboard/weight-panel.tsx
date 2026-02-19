import { ScalesIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { Card, CardContent } from '@/components/ui/card'

type WeightPanelProps = {
  currentWeight: number
  startingWeight: number
  goalWeight: number
}

export async function WeightPanel(props: WeightPanelProps) {
  const { currentWeight, startingWeight, goalWeight } = props
  const t = await getTranslations()

  const totalChange = Math.abs(startingWeight - goalWeight)
  const currentProgress = Math.abs(startingWeight - currentWeight)
  const percentage = totalChange > 0 ? Math.min((currentProgress / totalChange) * 100, 100) : 0

  return (
    <Link href='/weight' className='block'>
      <Card size='sm'>
        <CardContent className='space-y-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <ScalesIcon size={20} />
              <span className='text-sm font-semibold'>{t('dashboard.weight')}</span>
            </div>
            <span className='text-sm font-medium text-emerald-500'>
              {t('dashboard.weight-current', { weight: currentWeight.toFixed(1) })}
            </span>
          </div>
          <div className='relative h-7 overflow-hidden rounded-md bg-emerald-100 dark:bg-emerald-950'>
            <div
              className='h-full rounded-md bg-emerald-400 transition-all duration-300'
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className='flex justify-between text-xs text-muted-foreground'>
            <span>{t('dashboard.weight-starting', { weight: startingWeight.toFixed(1) })}</span>
            <span>{t('dashboard.weight-goal', { weight: goalWeight.toFixed(1) })}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
