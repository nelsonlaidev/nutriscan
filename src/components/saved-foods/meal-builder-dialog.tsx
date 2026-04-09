import type { MealBuilderSourceItem } from '@/hooks/use-saved-foods-data'

import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react/ssr'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

export type MealBuilderItem = {
  id: string
  foodName: string
  servingSize: string
  calories: number
  protein: number
  carbs: number
  fat: number
  imageUrl?: string
  sourceLabel: string
}

export type MealBuilderDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  mealName: string
  onMealNameChange: (name: string) => void
  mealItemSearch: string
  onMealItemSearchChange: (search: string) => void
  mealItems: MealBuilderItem[]
  mealBuilderSources: MealBuilderSourceItem[]
  mealTotals: { calories: number; protein: number; carbs: number; fat: number }
  onAddMealItem: (item: MealBuilderSourceItem) => void
  onRemoveMealItem: (id: string) => void
  onCreateMeal: () => void
  onCancel: () => void
  isCreatingMeal: boolean
  t: (key: string, values?: Record<string, unknown>) => string
}

export function MealBuilderDialog({
  open,
  onOpenChange,
  mealName,
  onMealNameChange,
  mealItemSearch,
  onMealItemSearchChange,
  mealItems,
  mealBuilderSources,
  mealTotals,
  onAddMealItem,
  onRemoveMealItem,
  onCreateMeal,
  onCancel,
  isCreatingMeal,
  t,
}: MealBuilderDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isCreatingMeal && !isOpen) {
          onOpenChange(false)
        }
      }}
    >
      <DialogContent className='max-w-xl'>
        <DialogHeader>
          <DialogTitle>{t('saved-meals.meal-builder-title')}</DialogTitle>
          <DialogDescription>{t('saved-meals.meal-builder-description')}</DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='meal-name' className='text-sm font-medium'>
              {t('saved-meals.name-label')}
            </label>
            <Input
              id='meal-name'
              value={mealName}
              onChange={(event) => {
                onMealNameChange(event.currentTarget.value)
              }}
              placeholder={t('saved-meals.meal-name-placeholder')}
            />
          </div>

          <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
            {[
              { label: t('add-food.calories'), value: `${Math.round(mealTotals.calories)} kcal` },
              { label: t('add-food.protein-grams'), value: Math.round(mealTotals.protein) },
              { label: t('add-food.carbs-grams'), value: Math.round(mealTotals.carbs) },
              { label: t('add-food.fat-grams'), value: Math.round(mealTotals.fat) },
            ].map((card) => (
              <div key={card.label} className='rounded-4xl border border-border/70 bg-muted/30 p-3'>
                <p className='text-xs font-medium text-muted-foreground'>{card.label}</p>
                <p className='mt-2 text-lg font-semibold'>{card.value}</p>
              </div>
            ))}
          </div>

          <div className='space-y-2'>
            <label htmlFor='meal-item-search' className='text-sm font-medium'>
              {t('saved-meals.add-to-meal-search-label')}
            </label>
            <div className='relative'>
              <MagnifyingGlassIcon className='pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                id='meal-item-search'
                value={mealItemSearch}
                onChange={(event) => {
                  onMealItemSearchChange(event.currentTarget.value)
                }}
                placeholder={t('saved-meals.add-to-meal-search-placeholder')}
                className='pl-10'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <p className='text-sm font-medium'>{t('saved-meals.add-to-meal-title')}</p>
            <div className='grid gap-2'>
              {mealBuilderSources.map((item: MealBuilderSourceItem) => (
                <button
                  key={`${item.sourceLabel}-${item.id}`}
                  type='button'
                  className='rounded-4xl border border-border/70 bg-background p-3 text-left ring-1 ring-foreground/5'
                  onClick={() => {
                    onAddMealItem(item)
                  }}
                >
                  <div className='flex items-center justify-between gap-3'>
                    <div>
                      <p className='font-medium'>{item.foodName}</p>
                      <p className='text-sm text-muted-foreground'>
                        {item.servingSize} · {Math.round(item.calories)} kcal
                      </p>
                    </div>
                    <span className='rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground'>
                      {t(item.sourceLabel)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className='space-y-2'>
            <p className='text-sm font-medium'>{t('saved-meals.meal-items-title')}</p>
            {mealItems.length === 0 ? (
              <p className='text-sm text-muted-foreground'>{t('saved-meals.meal-items-empty')}</p>
            ) : (
              <div className='space-y-2'>
                {mealItems.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center justify-between gap-3 rounded-4xl border border-border/70 bg-muted/20 p-3'
                  >
                    <div>
                      <p className='font-medium'>{item.foodName}</p>
                      <p className='text-sm text-muted-foreground'>
                        {item.servingSize} · {t(item.sourceLabel)}
                      </p>
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => {
                        onRemoveMealItem(item.id)
                      }}
                    >
                      <XIcon className='size-4' />
                      {t('saved-meals.remove-item')}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => {
              onCancel()
            }}
            disabled={isCreatingMeal}
          >
            {t('saved-meals.cancel')}
          </Button>
          <Button onClick={onCreateMeal} disabled={isCreatingMeal || !mealName.trim() || mealItems.length === 0}>
            {isCreatingMeal && <Spinner data-icon='inline-start' />}
            {t('saved-meals.create-meal-button')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
