'use client'

import type { ListFoodByCategoryInput } from '@/orpc/client'

import { FloppyDiskBackIcon } from '@phosphor-icons/react/ssr'
import { useLocale, useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useCreateSavedMealFromCategory, useFoodEntriesByCategory } from '@/hooks/queries/food.query'
import { formatDateForTimezone } from '@/lib/utils'

type HeaderProps = {
  input: ListFoodByCategoryInput
}

export function Header(props: HeaderProps) {
  const { input } = props

  const t = useTranslations()
  const locale = useLocale()
  const { data: entries } = useFoodEntriesByCategory(input)
  const [open, setOpen] = useState(false)
  const totalCalories = Math.round(entries.reduce((sum, e) => sum + e.calories, 0))
  const defaultName = useMemo(
    () =>
      t('saved-meals.default-name', {
        mealName: t(`meals.${input.category}`),
        date: formatDateForTimezone(input.startOfDay, locale, { month: 'short', day: 'numeric' }),
      }),
    [input.category, input.startOfDay, locale, t],
  )
  const [name, setName] = useState(defaultName)

  const { mutate: createSavedMeal, isPending } = useCreateSavedMealFromCategory(() => {
    toast.success(t('saved-meals.created'))
    setOpen(false)
  })

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (nextOpen) {
      setName(defaultName)
    }
  }

  function handleSubmit() {
    const nextName = name.trim()

    if (!nextName) {
      toast.error(t('saved-meals.create-error'))
      return
    }

    createSavedMeal(
      {
        ...input,
        name: nextName,
      },
      {
        onError: (error) => {
          if (error.message === 'errors.saved-meal-empty') {
            toast.error(t('errors.saved-meal-empty'))
            return
          }

          toast.error(t('saved-meals.create-error'))
        },
      },
    )
  }

  return (
    <>
      <div className='flex items-center justify-between gap-3'>
        <div>
          <div className='font-semibold'>{t('meals.total')}</div>
          <div className='font-medium'>{totalCalories} kcal</div>
        </div>

        {entries.length > 0 ? (
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              handleOpenChange(true)
            }}
            data-testid='save-meal-button'
          >
            <FloppyDiskBackIcon />
            {t('saved-meals.save-action')}
          </Button>
        ) : null}
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('saved-meals.dialog-title')}</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='saved-meal-name'>{t('saved-meals.name-label')}</FieldLabel>
              <Input
                id='saved-meal-name'
                value={name}
                onChange={(event) => {
                  setName(event.currentTarget.value)
                }}
                disabled={isPending}
                data-testid='saved-meal-name-input'
              />
              {name.trim() ? null : <FieldError>{t('saved-meals.name-required')}</FieldError>}
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                handleOpenChange(false)
              }}
              disabled={isPending}
            >
              {t('saved-meals.cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={isPending || !name.trim()} data-testid='saved-meal-save-confirm'>
              {isPending && <Spinner data-icon='inline-start' />}
              {t('saved-meals.save-action')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
