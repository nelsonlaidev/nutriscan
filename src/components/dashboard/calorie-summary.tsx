import { getTranslations } from 'next-intl/server'

import { CircleProgress } from '@/components/dashboard/circle-progress'
import { Card, CardContent } from '@/components/ui/card'

type CalorieSummaryProps = {
  calories: number
  goal: number
}

export async function CalorieSummary(props: CalorieSummaryProps) {
  const { calories, goal } = props
  const remaining = goal - calories
  const t = await getTranslations()

  return (
    <Card size='sm'>
      <CardContent className='flex items-center gap-6'>
        <CircleProgress value={calories} max={goal} size={100} strokeWidth={8} progressClassName='stroke-primary'>
          <span className='text-xl font-bold'>{Math.round(calories)}</span>
          <span className='text-[10px] text-muted-foreground'>{t('dashboard.kcal')}</span>
          <span className='text-[10px] text-muted-foreground'>{t('dashboard.of-goal', { goal })}</span>
        </CircleProgress>
        <div className='grid flex-1 grid-cols-2 gap-y-3'>
          <div>
            <p className='text-xs text-muted-foreground'>{t('dashboard.eaten')}</p>
            <p className='text-lg font-semibold'>{Math.round(calories)}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>{t('dashboard.remaining')}</p>
            <p className='text-lg font-semibold text-primary'>{Math.round(remaining)}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>{t('dashboard.burned')}</p>
            <p className='text-lg font-semibold text-orange-500'>0</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>{t('dashboard.goal')}</p>
            <p className='text-lg font-semibold'>{goal}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
