import { useTranslations } from 'next-intl'

import { type Meal, MEAL_EMOJI, MEALS } from '@/lib/constants'
import { cn } from '@/lib/utils'

type MealCategoryPickerProps = {
  value: string | null
  onChange: (meal: Meal) => void
}

export function MealCategoryPicker(props: MealCategoryPickerProps) {
  const { value, onChange } = props
  const t = useTranslations()

  return (
    <div className='flex flex-col gap-3'>
      <h3 className='text-sm font-medium'>{t('add-food.select-meal')}</h3>
      <div className='grid grid-cols-4 gap-2'>
        {MEALS.map((meal) => {
          const selected = value === meal
          return (
            <button
              key={meal}
              type='button'
              onClick={() => {
                onChange(meal)
              }}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-2xl border p-3 transition-colors',
                selected ? 'border-primary bg-primary/5 text-foreground' : 'border-border bg-card text-muted-foreground'
              )}
            >
              <span className='text-xl'>{MEAL_EMOJI[meal]}</span>
              <span className='text-xs font-medium'>{t(`meals.${meal}`)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
