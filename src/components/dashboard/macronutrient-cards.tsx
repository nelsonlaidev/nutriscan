import { CircleProgress } from '@/components/dashboard/circle-progress'
import { Card, CardContent } from '@/components/ui/card'
import { DAILY_GOALS } from '@/lib/mock-data'

type MacronutrientCardsProps = {
  protein: number
  carbs: number
  fat: number
  fiber: number
}

const MACROS = [
  { key: 'protein' as const, label: 'Protein', color: 'stroke-blue-500' },
  { key: 'carbs' as const, label: 'Carbs', color: 'stroke-amber-500' },
  { key: 'fat' as const, label: 'Fat', color: 'stroke-rose-500' },
  { key: 'fiber' as const, label: 'Fiber', color: 'stroke-primary' }
]

export function MacronutrientCards(props: MacronutrientCardsProps) {
  const values = props

  return (
    <div className='space-y-2'>
      <h2 className='text-base font-semibold'>Macronutrients</h2>
      <div className='grid grid-cols-4 gap-2'>
        {MACROS.map((macro) => (
          <Card key={macro.key} size='sm'>
            <CardContent className='flex flex-col items-center gap-1 p-3'>
              <CircleProgress
                value={values[macro.key]}
                max={DAILY_GOALS[macro.key]}
                size={48}
                strokeWidth={4}
                progressClassName={macro.color}
              />
              <span className='text-sm font-bold'>{Math.round(values[macro.key])}g</span>
              <span className='text-[10px] text-muted-foreground'>{macro.label}</span>
              <span className='text-[10px] text-muted-foreground'>/ {DAILY_GOALS[macro.key]}g</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
