import { BowlFoodIcon } from '@phosphor-icons/react/ssr'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { DAILY_GOALS } from '@/lib/mock-data'

type MacronutrientCardsProps = {
  values: {
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
}

const MACROS = [
  { key: 'protein' as const, label: 'Protein', className: '**:data-[slot=progress-indicator]:bg-blue-500' },
  { key: 'carbs' as const, label: 'Carbs', className: '**:data-[slot=progress-indicator]:bg-amber-500' },
  { key: 'fat' as const, label: 'Fat', className: '**:data-[slot=progress-indicator]:bg-rose-500' },
  { key: 'fiber' as const, label: 'Fiber', className: '**:data-[slot=progress-indicator]:bg-primary' }
]

export function MacronutrientCards(props: MacronutrientCardsProps) {
  const { values } = props

  return (
    <Card size='sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <BowlFoodIcon className='size-5' />
          Macronutrients
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {MACROS.map((macro) => {
          const value = Math.round(values[macro.key])
          const goal = DAILY_GOALS[macro.key]
          const percentage = Math.min(Math.round((value / goal) * 100), 100)

          return (
            <div key={macro.key} className='space-y-1'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>{macro.label}</span>
                <span className='ml-auto text-sm text-muted-foreground'>
                  {value}g / {goal}g
                </span>
              </div>
              <Progress value={percentage} className={macro.className} />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
