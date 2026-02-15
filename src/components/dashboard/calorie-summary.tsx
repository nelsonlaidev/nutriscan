import { CircleProgress } from '@/components/dashboard/circle-progress'
import { Card, CardContent } from '@/components/ui/card'
import { DAILY_GOALS } from '@/lib/mock-data'

type CalorieSummaryProps = {
  calories: number
}

export function CalorieSummary(props: CalorieSummaryProps) {
  const { calories } = props
  const remaining = DAILY_GOALS.calories - calories

  return (
    <Card>
      <CardContent className='flex items-center gap-6'>
        <CircleProgress
          value={calories}
          max={DAILY_GOALS.calories}
          size={100}
          strokeWidth={8}
          progressClassName='stroke-primary'
        >
          <span className='text-xl font-bold'>{Math.round(calories)}</span>
          <span className='text-[10px] text-muted-foreground'>kcal</span>
          <span className='text-[10px] text-muted-foreground'>of {DAILY_GOALS.calories}</span>
        </CircleProgress>
        <div className='grid flex-1 grid-cols-2 gap-y-3'>
          <div>
            <p className='text-xs text-muted-foreground'>Eaten</p>
            <p className='text-lg font-semibold'>{Math.round(calories)}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Remaining</p>
            <p className='text-lg font-semibold text-primary'>{Math.round(remaining)}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Burned</p>
            <p className='text-lg font-semibold text-orange-500'>0</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Goal</p>
            <p className='text-lg font-semibold'>{DAILY_GOALS.calories}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
