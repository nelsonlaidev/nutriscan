import CircleProgress from '@/components/dashboard/circle-progress'
import { Card, CardContent } from '@/components/ui/card'
import { CURRENT_INTAKE, DAILY_GOALS } from '@/lib/mock-data'

function CalorieSummary() {
  const remaining = DAILY_GOALS.calories - CURRENT_INTAKE.calories + CURRENT_INTAKE.burned

  return (
    <Card>
      <CardContent className='flex items-center gap-6'>
        <CircleProgress
          value={CURRENT_INTAKE.calories}
          max={DAILY_GOALS.calories}
          size={100}
          strokeWidth={8}
          progressClassName='stroke-primary'
        >
          <span className='text-xl font-bold'>{CURRENT_INTAKE.calories}</span>
          <span className='text-[10px] text-muted-foreground'>kcal</span>
          <span className='text-[10px] text-muted-foreground'>of {DAILY_GOALS.calories}</span>
        </CircleProgress>
        <div className='grid flex-1 grid-cols-2 gap-y-3'>
          <div>
            <p className='text-xs text-muted-foreground'>Eaten</p>
            <p className='text-lg font-semibold'>{CURRENT_INTAKE.calories}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Remaining</p>
            <p className='text-lg font-semibold text-primary'>{remaining}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Burned</p>
            <p className='text-lg font-semibold text-orange-500'>{CURRENT_INTAKE.burned}</p>
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

export default CalorieSummary
