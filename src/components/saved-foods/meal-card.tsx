import type { SavedMealTemplateListOutput } from '@/orpc/client'

import { TrashIcon } from '@phosphor-icons/react/ssr'

import { Button } from '@/components/ui/button'

type SavedMealLike = SavedMealTemplateListOutput[number]

function NutritionBadgeRow(props: { calories: number; protein: number; carbs: number; fat: number }) {
  const { calories, protein, carbs, fat } = props

  return (
    <div className='flex flex-wrap gap-2 text-xs font-medium text-muted-foreground'>
      <span className='rounded-full bg-muted px-2.5 py-1'>{Math.round(calories)} kcal</span>
      <span className='rounded-full bg-muted px-2.5 py-1'>
        {Math.round(protein)}P / {Math.round(carbs)}C / {Math.round(fat)}F
      </span>
    </div>
  )
}

export type MealCardProps = {
  meal: SavedMealLike
  onDelete: (meal: SavedMealLike) => void
  itemsCaloriesText: string
  deleteButtonLabel: string
}

export function MealCard({ meal, onDelete, itemsCaloriesText, deleteButtonLabel }: MealCardProps) {
  return (
    <article className='rounded-[1.75rem] border border-border/70 bg-card p-4 ring-1 ring-foreground/5'>
      <div className='space-y-4'>
        <div className='flex items-start justify-between gap-3'>
          <div className='space-y-1'>
            <h3 className='text-base font-semibold'>{meal.name}</h3>
            <p className='text-sm text-muted-foreground'>{itemsCaloriesText}</p>
          </div>
          <Button
            variant='ghost'
            size='icon-sm'
            aria-label={deleteButtonLabel}
            onClick={() => {
              onDelete(meal)
            }}
          >
            <TrashIcon className='size-4' />
          </Button>
        </div>

        <NutritionBadgeRow
          calories={meal.totals.calories}
          protein={meal.totals.protein}
          carbs={meal.totals.carbs}
          fat={meal.totals.fat}
        />

        <div className='flex flex-wrap gap-2'>
          {meal.items.map((item) => (
            <span
              key={item.id}
              className='rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground/80'
            >
              {item.foodName}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}
