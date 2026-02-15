import { MEAL_CATEGORIES } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

type MealCategoryPickerProps = {
  value: string | null
  onChange: (categoryId: string) => void
}

export function MealCategoryPicker(props: MealCategoryPickerProps) {
  const { value, onChange } = props

  return (
    <div className='flex flex-col gap-3'>
      <h3 className='text-sm font-medium'>Select Meal</h3>
      <div className='grid grid-cols-4 gap-2'>
        {MEAL_CATEGORIES.map((category) => {
          const selected = value === category.id
          return (
            <button
              key={category.id}
              type='button'
              onClick={() => {
                onChange(category.id)
              }}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-2xl border p-3 transition-colors',
                selected ? 'border-primary bg-primary/5 text-foreground' : 'border-border bg-card text-muted-foreground'
              )}
            >
              <span className='text-xl'>{category.emoji}</span>
              <span className='text-xs font-medium'>{category.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
