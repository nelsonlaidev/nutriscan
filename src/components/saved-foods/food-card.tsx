import type { FoodLibraryRecord } from '@/lib/food-library'

import { TrashIcon } from '@phosphor-icons/react/ssr'

import { Button } from '@/components/ui/button'

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

export type FoodCardProps = FoodLibraryRecord & {
  id: string
  badge?: string
  actionLabel?: string
  onAction?: () => void
  actionDisabled?: boolean
  actionLoading?: boolean
  deleteLabel?: string
  onDelete?: () => void
}

export function FoodCard(props: FoodCardProps) {
  const {
    id,
    foodName,
    servingSize,
    calories,
    protein,
    carbs,
    fat,
    badge,
    actionLabel,
    onAction,
    actionDisabled,
    actionLoading,
    deleteLabel,
    onDelete,
  } = props

  return (
    <article key={id} className='rounded-[1.5rem] border border-border/70 bg-card p-4 ring-1 ring-foreground/5'>
      <div className='space-y-3'>
        <div className='flex items-start justify-between gap-3'>
          <div className='space-y-1'>
            <div className='flex flex-wrap items-center gap-2'>
              <h3 className='font-semibold'>{foodName}</h3>
              {badge ? (
                <span className='rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground'>
                  {badge}
                </span>
              ) : null}
            </div>
            <p className='text-sm text-muted-foreground'>{servingSize}</p>
          </div>
          {deleteLabel && onDelete ? (
            <Button variant='ghost' size='icon-sm' aria-label={deleteLabel} onClick={onDelete}>
              <TrashIcon className='size-4' />
            </Button>
          ) : null}
        </div>
        <NutritionBadgeRow calories={calories} protein={protein} carbs={carbs} fat={fat} />
        {actionLabel && onAction ? (
          <Button variant='outline' className='w-full' onClick={onAction} disabled={actionDisabled ?? actionLoading}>
            {actionLoading ? `${actionLabel}...` : actionLabel}
          </Button>
        ) : null}
      </div>
    </article>
  )
}
