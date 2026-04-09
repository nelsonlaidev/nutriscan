'use client'

import type { Meal } from '@/lib/constants'
import type { FoodLibraryRecord } from '@/lib/food-library'
import type { ManualFoodEntry } from '@/lib/zod-schemas'
import type { SavedFoodsOutput } from '@/orpc/client'
import type { Translator } from '@/types'

import { BookmarkSimpleIcon, MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react/ssr'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import { ManualEntryMode } from '@/components/add/manual-entry-mode'
import { MealCategoryPicker } from '@/components/add/meal-category-picker'
import { BackButton } from '@/components/back-button'
import { MainLayout } from '@/components/main-layout'
import { DeleteConfirmationDialog } from '@/components/saved-foods/delete-confirmation-dialog'
import { FoodCard } from '@/components/saved-foods/food-card'
import { MealBuilderDialog } from '@/components/saved-foods/meal-builder-dialog'
import { MealCard } from '@/components/saved-foods/meal-card'
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useCreateFoodEntry,
  useCreateSavedFood,
  useCreateSavedMeal,
  useDeleteSavedFood,
  useDeleteSavedMeal,
} from '@/hooks/queries/food.query'
import { useSavedFoodsData } from '@/hooks/use-saved-foods-data'
import { DEFAULT_MEAL } from '@/lib/constants'

type AddableFood = FoodLibraryRecord & {
  id: string
  source: 'manual' | 'ai-scan' | 'barcode'
}

type SavedFoodLike = SavedFoodsOutput[number]

function getSavedFoodBadge(source: SavedFoodLike['source'], t: Translator) {
  if (source === 'manual') {
    return t('saved-meals.saved-foods-tab')
  }

  if (source === 'ai-scan') {
    return t('add-food.ai-scan')
  }

  return t('add-food.barcode')
}

function SavedFoodsSkeleton() {
  return (
    <div className='space-y-3'>
      <Skeleton className='h-28 rounded-[1.5rem]' />
      <Skeleton className='h-28 rounded-[1.5rem]' />
      <Skeleton className='h-28 rounded-[1.5rem]' />
    </div>
  )
}

function EmptyState(props: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: React.ReactNode
}) {
  const { icon: Icon, title, description, action } = props

  return (
    <Card size='sm' className='rounded-[2rem] bg-transparent'>
      <CardContent className='space-y-4 py-8 text-center'>
        <div className='mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground'>
          <Icon className='size-7' />
        </div>
        <div className='space-y-1'>
          <h2 className='text-lg font-semibold'>{title}</h2>
          <p className='mx-auto max-w-sm text-sm text-muted-foreground'>{description}</p>
        </div>
        {action}
      </CardContent>
    </Card>
  )
}

export default function Page() {
  const t = useTranslations()
  const [selectedFood, setSelectedFood] = useState<AddableFood | null>(null)
  const [selectedMeal, setSelectedMeal] = useState<Meal>(DEFAULT_MEAL)
  const [deleteDialogFood, setDeleteDialogFood] = useState<SavedFoodLike | null>(null)

  const {
    // State
    tab,
    setTab,
    search,
    setSearch,
    dialogState,
    setDialogState,
    mealName,
    setMealName,
    mealItemSearch,
    setMealItemSearch,
    mealItems,
    mealBuilderSources,
    mealTotals,
    deleteDialogTemplate,
    setDeleteDialogTemplate,

    // Data
    savedFoods,
    savedMeals,
    filteredSavedFoods,
    filteredSavedMeals,

    // Status
    hasError,
    isLoading,

    // Actions
    handleAddMealItem,
    handleRemoveMealItem,
    resetMealBuilder,
    retryAllQueries,
  } = useSavedFoodsData()
  const savedFoodIds = new Set(savedFoods.map((item) => item.id))

  const { mutate: createSavedFood, isPending: isCreatingSavedFood } = useCreateSavedFood(() => {
    toast.success(t('saved-meals.saved-food-created'))
    setDialogState(null)
  })

  const { mutate: createSavedMeal, isPending: isCreatingMeal } = useCreateSavedMeal(() => {
    toast.success(t('saved-meals.created'))
    setDialogState(null)
    resetMealBuilder()
  })

  const { mutate: deleteSavedMeal, isPending: isDeletingSavedMeal } = useDeleteSavedMeal(() => {
    toast.success(t('saved-meals.deleted'))
    setDeleteDialogTemplate(null)
  })
  const { mutate: deleteSavedFood, isPending: isDeletingSavedFood } = useDeleteSavedFood(() => {
    toast.success(t('saved-meals.saved-food-deleted'))
    setDeleteDialogFood(null)
  })

  const { mutate: addToMeal, isPending: isAddingToMeal } = useCreateFoodEntry()

  function handleAddSavedFood(data: ManualFoodEntry) {
    createSavedFood(
      {
        ...data,
        source: 'manual',
      },
      {
        onError: () => {
          toast.error(t('saved-meals.saved-food-create-error'))
        },
      },
    )
  }

  function handleCreateMeal() {
    const nextName = mealName.trim()

    if (!nextName || mealItems.length === 0) {
      toast.error(t('saved-meals.create-error'))
      return
    }

    createSavedMeal(
      {
        name: nextName,
        items: mealItems.map(({ sourceLabel: _sourceLabel, id: _id, ...item }) => item),
      },
      {
        onError: () => {
          toast.error(t('saved-meals.create-error'))
        },
      },
    )
  }

  function handleDeleteSavedMeal() {
    if (!deleteDialogTemplate) return

    deleteSavedMeal(
      { templateId: deleteDialogTemplate.id },
      {
        onError: () => {
          toast.error(t('saved-meals.delete-error'))
        },
      },
    )
  }

  function handleDeleteSavedFood() {
    if (!deleteDialogFood) return

    deleteSavedFood(
      { savedFoodId: deleteDialogFood.id },
      {
        onError: () => {
          toast.error(t('saved-meals.saved-food-delete-error'))
        },
      },
    )
  }

  function openAddToMealDialog(food: AddableFood) {
    setSelectedFood(food)
    setSelectedMeal(DEFAULT_MEAL)
  }

  function handleConfirmAddToMeal() {
    if (!selectedFood) return

    addToMeal(
      {
        foodName: selectedFood.foodName,
        servingSize: selectedFood.servingSize,
        calories: selectedFood.calories,
        protein: selectedFood.protein,
        carbs: selectedFood.carbs,
        fat: selectedFood.fat,
        imageUrl: selectedFood.imageUrl ?? undefined,
        mealCategory: selectedMeal,
        source: selectedFood.source,
      },
      {
        onSuccess: () => {
          toast.success(t('add-food.success', { mealName: t(`meals.${selectedMeal}`) }))
          setSelectedFood(null)
        },
        onError: () => {
          toast.error(t('add-food.save-error'))
        },
      },
    )
  }

  return (
    <>
      <MainLayout title={t('saved-meals.page-title')} leftTitleButton={<BackButton />}>
        <div className='space-y-5'>
          <Tabs
            value={tab}
            onValueChange={(value) => {
              setTab(value as 'all' | 'my-meals' | 'saved-foods')
            }}
            className='space-y-4'
          >
            <TabsList variant='line' className='w-full justify-start gap-2 overflow-x-auto px-1'>
              <TabsTrigger value='all'>{t('saved-meals.all-tab')}</TabsTrigger>
              <TabsTrigger value='my-meals'>{t('saved-meals.my-meals-tab')}</TabsTrigger>
              <TabsTrigger value='saved-foods'>{t('saved-meals.saved-foods-tab')}</TabsTrigger>
            </TabsList>

            {hasError ? (
              <Alert variant='destructive'>
                <AlertTitle>{t('saved-meals.load-error-title')}</AlertTitle>
                <AlertDescription>{t('saved-meals.load-error-description')}</AlertDescription>
                <AlertAction>
                  <Button size='sm' variant='outline' onClick={retryAllQueries}>
                    {t('saved-meals.retry')}
                  </Button>
                </AlertAction>
              </Alert>
            ) : null}

            <TabsContent value='all' className='space-y-4'>
              <section>
                <InputGroup>
                  <InputGroupAddon align='inline-start'>
                    <MagnifyingGlassIcon className='size-4 text-muted-foreground' />
                  </InputGroupAddon>
                  <InputGroupInput
                    id='saved-foods-search'
                    value={search}
                    onChange={(event) => {
                      setSearch(event.currentTarget.value)
                    }}
                    placeholder={t('saved-meals.search-placeholder')}
                    data-testid='saved-foods-search'
                  />
                </InputGroup>
              </section>

              {isLoading ? <SavedFoodsSkeleton /> : null}

              {!isLoading && !hasError ? (
                <div className='space-y-5'>
                  <section className='space-y-3'>
                    <h3 className='font-semibold'>{t('saved-meals.my-meals-tab')}</h3>
                    {filteredSavedMeals.length > 0 ? (
                      <div className='grid gap-3'>
                        {filteredSavedMeals.map((meal) => (
                          <MealCard
                            key={meal.id}
                            meal={meal}
                            onDelete={setDeleteDialogTemplate}
                            itemsCaloriesText={t('saved-meals.items-calories', {
                              count: meal.itemCount,
                              calories: Math.round(meal.totals.calories),
                            })}
                            deleteButtonLabel={t('saved-meals.delete')}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className='text-sm text-muted-foreground'>{t('saved-meals.no-results')}</p>
                    )}
                  </section>

                  <section className='space-y-3'>
                    <h3 className='font-semibold'>{t('saved-meals.saved-foods-tab')}</h3>
                    {filteredSavedFoods.length > 0 ? (
                      <div className='grid gap-3'>
                        {filteredSavedFoods.map((item) => (
                          <FoodCard
                            key={item.id}
                            id={item.id}
                            foodName={item.foodName}
                            servingSize={item.servingSize}
                            calories={item.calories}
                            protein={item.protein}
                            carbs={item.carbs}
                            fat={item.fat}
                            badge={getSavedFoodBadge(item.source, t)}
                            actionLabel={t('add-food.add-to-meal')}
                            onAction={() => {
                              openAddToMealDialog({
                                ...item,
                                imageUrl: item.imageUrl ?? undefined,
                                source: item.source,
                              })
                            }}
                            deleteLabel={
                              savedFoodIds.has(item.id) ? t('saved-meals.saved-food-delete-button') : undefined
                            }
                            onDelete={
                              savedFoodIds.has(item.id)
                                ? () => {
                                    const savedFood = savedFoods.find((savedItem) => savedItem.id === item.id)
                                    if (savedFood) {
                                      setDeleteDialogFood(savedFood)
                                    }
                                  }
                                : undefined
                            }
                          />
                        ))}
                      </div>
                    ) : (
                      <p className='text-sm text-muted-foreground'>{t('saved-meals.no-results')}</p>
                    )}
                  </section>
                </div>
              ) : null}
            </TabsContent>

            <TabsContent value='my-meals' className='space-y-4'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <h3 className='font-semibold'>{t('saved-meals.my-meals-title')}</h3>
                  <p className='text-sm text-muted-foreground'>{t('saved-meals.my-meals-description')}</p>
                </div>
                <Button
                  onClick={() => {
                    setDialogState('meal-builder')
                  }}
                >
                  <PlusIcon />
                  {t('saved-meals.create-meal-button')}
                </Button>
              </div>

              {isLoading ? <SavedFoodsSkeleton /> : null}

              {!isLoading && !hasError && savedMeals.length === 0 ? (
                <EmptyState
                  icon={BookmarkSimpleIcon}
                  title={t('saved-meals.my-meals-empty-title')}
                  description={t('saved-meals.my-meals-empty-description')}
                />
              ) : null}

              {!isLoading && !hasError && savedMeals.length > 0 ? (
                <div className='grid gap-3'>
                  {savedMeals.map((meal) => (
                    <MealCard
                      key={meal.id}
                      meal={meal}
                      onDelete={setDeleteDialogTemplate}
                      itemsCaloriesText={t('saved-meals.items-calories', {
                        count: meal.itemCount,
                        calories: Math.round(meal.totals.calories),
                      })}
                      deleteButtonLabel={t('saved-meals.delete')}
                    />
                  ))}
                </div>
              ) : null}
            </TabsContent>

            <TabsContent value='saved-foods' className='space-y-4'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <h3 className='font-semibold'>{t('saved-meals.saved-foods-title')}</h3>
                  <p className='text-sm text-muted-foreground'>{t('saved-meals.saved-foods-description')}</p>
                </div>
                <Button
                  onClick={() => {
                    setDialogState('saved-food')
                  }}
                >
                  <PlusIcon />
                  {t('saved-meals.add-saved-food-button')}
                </Button>
              </div>

              {isLoading ? <SavedFoodsSkeleton /> : null}

              {!isLoading && !hasError && savedFoods.length === 0 ? (
                <EmptyState
                  icon={BookmarkSimpleIcon}
                  title={t('saved-meals.saved-foods-empty-title')}
                  description={t('saved-meals.saved-foods-empty-description')}
                />
              ) : null}

              {!isLoading && !hasError && savedFoods.length > 0 ? (
                <div className='grid gap-3'>
                  {savedFoods.map((item) => (
                    <FoodCard
                      key={item.id}
                      id={item.id}
                      foodName={item.foodName}
                      servingSize={item.servingSize}
                      calories={item.calories}
                      protein={item.protein}
                      carbs={item.carbs}
                      fat={item.fat}
                      badge={getSavedFoodBadge(item.source, t)}
                      actionLabel={t('add-food.add-to-meal')}
                      onAction={() => {
                        openAddToMealDialog({
                          ...item,
                          imageUrl: item.imageUrl ?? undefined,
                          source: item.source,
                        })
                      }}
                      deleteLabel={t('saved-meals.saved-food-delete-button')}
                      onDelete={() => {
                        setDeleteDialogFood(item)
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>

      <Dialog
        open={dialogState === 'saved-food'}
        onOpenChange={(open) => {
          if (!isCreatingSavedFood && !open) {
            setDialogState(null)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('saved-meals.saved-food-dialog-title')}</DialogTitle>
            <DialogDescription>{t('saved-meals.saved-food-dialog-description')}</DialogDescription>
          </DialogHeader>
          <ManualEntryMode onSubmit={handleAddSavedFood} />
        </DialogContent>
      </Dialog>

      <MealBuilderDialog
        open={dialogState === 'meal-builder'}
        onOpenChange={(open) => {
          setDialogState(open ? 'meal-builder' : null)
        }}
        mealName={mealName}
        onMealNameChange={setMealName}
        mealItemSearch={mealItemSearch}
        onMealItemSearchChange={setMealItemSearch}
        mealItems={mealItems}
        mealBuilderSources={mealBuilderSources}
        mealTotals={mealTotals}
        onAddMealItem={handleAddMealItem}
        onRemoveMealItem={handleRemoveMealItem}
        onCreateMeal={handleCreateMeal}
        onCancel={() => {
          setDialogState(null)
        }}
        isCreatingMeal={isCreatingMeal}
        t={t as (key: string, values?: Record<string, unknown>) => string}
      />

      <DeleteConfirmationDialog
        open={Boolean(deleteDialogTemplate)}
        onOpenChange={(open) => {
          if (!isDeletingSavedMeal && !open) {
            setDeleteDialogTemplate(null)
          }
        }}
        onConfirm={handleDeleteSavedMeal}
        isDeleting={isDeletingSavedMeal}
        title={t('saved-meals.delete-title')}
        description={t('saved-meals.delete-description', {
          name: deleteDialogTemplate?.name ?? '',
        })}
        cancelText={t('saved-meals.cancel')}
        confirmText={t('saved-meals.delete-confirm')}
        deletingText={t('saved-meals.deleting')}
      />

      <DeleteConfirmationDialog
        open={Boolean(deleteDialogFood)}
        onOpenChange={(open) => {
          if (!isDeletingSavedFood && !open) {
            setDeleteDialogFood(null)
          }
        }}
        onConfirm={handleDeleteSavedFood}
        isDeleting={isDeletingSavedFood}
        title={t('saved-meals.saved-food-delete-title')}
        description={t('saved-meals.saved-food-delete-description', {
          name: deleteDialogFood?.foodName ?? '',
        })}
        cancelText={t('saved-meals.cancel')}
        confirmText={t('saved-meals.saved-food-delete-confirm')}
        deletingText={t('saved-meals.saved-food-deleting')}
      />

      <Dialog
        open={Boolean(selectedFood)}
        onOpenChange={(open) => {
          if (!isAddingToMeal && !open) {
            setSelectedFood(null)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('saved-meals.choose-meal')}</DialogTitle>
            <DialogDescription>{selectedFood?.foodName}</DialogDescription>
          </DialogHeader>

          <div className='space-y-4'>
            <MealCategoryPicker value={selectedMeal} onChange={setSelectedMeal} variant='saved-foods' />

            <DialogFooter className='gap-3'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  setSelectedFood(null)
                }}
                disabled={isAddingToMeal}
              >
                {t('saved-meals.cancel')}
              </Button>
              <Button size='sm' onClick={handleConfirmAddToMeal} disabled={isAddingToMeal}>
                {t('add-food.add-to-meal')}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
