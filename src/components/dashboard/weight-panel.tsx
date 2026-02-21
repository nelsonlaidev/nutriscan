import { ScalesIcon } from '@phosphor-icons/react/ssr'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Progress } from '../ui/progress'

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
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <ScalesIcon size={20} />
              {t('dashboard.weight')}
            </div>
            <span className='text-sm font-medium text-emerald-400'>
              {t('dashboard.weight-current', { weight: currentWeight.toFixed(1) })}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <Progress
            value={percentage}
            className='**:data-[slot=progress-indicator]:rounded-md **:data-[slot=progress-indicator]:bg-emerald-400 *:data-[slot=progress-track]:h-7 *:data-[slot=progress-track]:rounded-md *:data-[slot=progress-track]:bg-emerald-100 dark:*:data-[slot=progress-track]:bg-emerald-950'
          />
          <div className='flex justify-between text-xs text-muted-foreground'>
            <span>{t('dashboard.weight-starting', { weight: startingWeight.toFixed(1) })}</span>
            <span>{t('dashboard.weight-goal', { weight: goalWeight.toFixed(1) })}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
