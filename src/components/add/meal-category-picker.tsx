import type { Meal } from '@/lib/constants'

import { BowlFoodIcon, CoffeeIcon, HamburgerIcon, MoonStarsIcon, PopcornIcon } from '@phosphor-icons/react/ssr'
import { useTranslations } from 'next-intl'

import { MEAL_EMOJI, MEALS } from '@/lib/constants'
import { cn } from '@/lib/utils'

type MealCategoryPickerProps = {
  value: string | null
  onChange: (meal: Meal) => void
  variant?: 'default' | 'saved-foods'
}

const MEAL_ICONS = {
  breakfast: CoffeeIcon,
  lunch: HamburgerIcon,
  dinner: MoonStarsIcon,
  snacks: PopcornIcon,
} as const

export function MealCategoryPicker(props: MealCategoryPickerProps) {
  const { value, onChange, variant = 'default' } = props
  const t = useTranslations()

  return (
    <div className='flex flex-col gap-3'>
      <h3 className='text-sm font-medium'>{t('add-food.select-meal')}</h3>
      <div className={cn('grid gap-2', variant === 'saved-foods' ? 'grid-cols-2' : 'grid-cols-4')}>
        {MEALS.map((meal) => {
          const selected = value === meal
          const Icon = MEAL_ICONS[meal]
          const buttonLayoutClass =
            variant === 'saved-foods'
              ? 'flex items-center gap-3 rounded-4xl border p-3 text-left transition-colors'
              : 'flex flex-col items-center gap-1.5 rounded-2xl border p-3 transition-colors'
          let buttonStateClass = 'border-border bg-card text-muted-foreground'

          if (selected) {
            buttonStateClass =
              variant === 'saved-foods'
                ? 'border-primary bg-primary/10 text-foreground'
                : 'border-primary bg-primary/5 text-foreground'
          }

          return (
            <button
              key={meal}
              type='button'
              onClick={() => {
                onChange(meal)
              }}
              className={cn(buttonLayoutClass, buttonStateClass)}
            >
              {variant === 'saved-foods' ? (
                <span
                  className={cn(
                    'flex size-10 shrink-0 items-center justify-center rounded-xl',
                    selected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary',
                  )}
                >
                  <Icon className='size-5' weight={selected ? 'fill' : 'regular'} />
                </span>
              ) : (
                <span className='text-xl'>{MEAL_EMOJI[meal]}</span>
              )}

              <span className={cn('font-medium', variant === 'saved-foods' ? 'text-sm' : 'text-xs')}>
                {t(`meals.${meal}`)}
              </span>
            </button>
          )
        })}
      </div>

      {variant === 'saved-foods' ? (
        <div className='flex items-center gap-2 rounded-4xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground'>
          <BowlFoodIcon className='size-4 shrink-0' />
          {t('saved-meals.choose-meal')}
        </div>
      ) : null}
    </div>
  )
}
