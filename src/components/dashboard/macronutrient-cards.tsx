import { BowlFoodIcon } from '@phosphor-icons/react/ssr'
import { getTranslations } from 'next-intl/server'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

type MacroGoals = {
  protein: number
  carbs: number
  fat: number
}

type MacronutrientCardsProps = {
  values: MacroGoals
  goals: MacroGoals
}

export async function MacronutrientCards(props: MacronutrientCardsProps) {
  const { values, goals } = props
  const t = await getTranslations()

  const MACROS = [
    {
      key: 'protein',
      label: t('dashboard.protein'),
      className: '**:data-[slot=progress-indicator]:bg-blue-500'
    },
    { key: 'carbs', label: t('dashboard.carbs'), className: '**:data-[slot=progress-indicator]:bg-amber-500' },
    { key: 'fat', label: t('dashboard.fat'), className: '**:data-[slot=progress-indicator]:bg-rose-500' }
  ] as const

  return (
    <Card size='sm'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <BowlFoodIcon size={20} />
          {t('dashboard.macronutrients')}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {MACROS.map((macro) => {
          const value = Math.round(values[macro.key])
          const goal = goals[macro.key]
          const percentage = Math.min(Math.round((value / goal) * 100), 100)

          return (
            <div key={macro.key} className='space-y-1'>
              <div className='flex items-center justify-between text-sm'>
                <span className='font-medium'>{macro.label}</span>
                <span className='text-muted-foreground'>{t('dashboard.grams-of-goal', { value, goal })}</span>
              </div>
              <Progress value={percentage} className={macro.className} />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
