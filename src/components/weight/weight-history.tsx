'use client'

import { DotsThreeIcon, PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react/ssr'
import { format, isToday, isYesterday } from 'date-fns'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useDeleteWeightEntry, useUpdateWeightEntry } from '@/hooks/queries/weight.query'
import { showAchievementUnlockToast } from '@/lib/achievements/toast'
import { toZonedDate } from '@/lib/utils'

import { Spinner } from '../ui/spinner'

type WeightEntry = {
  id: string
  weight: number
  createdAt: Date
}

type WeightHistoryProps = {
  entries: WeightEntry[]
}

export function WeightHistory(props: WeightHistoryProps) {
  const { entries } = props
  const t = useTranslations()
  const [editEntry, setEditEntry] = useState<WeightEntry | null>(null)
  const [editWeight, setEditWeight] = useState('')

  const { mutate: updateWeight, isPending: saving } = useUpdateWeightEntry(() => {
    toast.success(t('weight.entry-updated'))
    setEditEntry(null)
  })

  const { mutate: deleteWeight } = useDeleteWeightEntry(() => {
    toast.success(t('weight.entry-deleted'))
  })

  function formatDate(rawDate: Date) {
    const date = toZonedDate(rawDate)
    const formatted = format(date, 'd MMM yyyy')

    if (isToday(date)) return t('weight.today-date', { date: formatted })
    if (isYesterday(date)) return t('weight.yesterday-date', { date: formatted })
    return formatted
  }

  function getChangeBadge(index: number) {
    const current = entries.at(index)
    const previous = entries.at(index + 1)
    if (!current || !previous) return null
    const change = current.weight - previous.weight
    if (change === 0) return null

    const isPositive = change > 0

    return (
      <span
        data-positive={isPositive}
        className='text-xs font-medium data-[positive=false]:text-emerald-500 data-[positive=true]:text-red-500'
      >
        {isPositive ? '+' : '-'}
        {Math.abs(change).toFixed(1)} kg
      </span>
    )
  }

  function handleEditOpen(entry: WeightEntry) {
    setEditEntry(entry)
    setEditWeight(String(entry.weight))
  }

  function handleEditSave(e: React.SubmitEvent) {
    e.preventDefault()
    if (!editEntry) return

    const value = Number.parseFloat(editWeight)
    if (Number.isNaN(value) || value < 20 || value > 300) {
      toast.error(t('weight.weight-range-error'))
      return
    }

    updateWeight(
      { id: editEntry.id, weight: value },
      {
        onSuccess: (data) => {
          showAchievementUnlockToast(data.newUnlocks, t)
        },
        onError: () => toast.error(t('weight.entry-update-error')),
      },
    )
  }

  if (entries.length === 0) {
    return <p className='text-center text-sm text-muted-foreground'>{t('weight.no-entries')}</p>
  }

  return (
    <div className='flex w-full flex-col gap-2'>
      <h3 className='font-semibold'>{t('weight.history')}</h3>
      <div className='divide-y'>
        {entries.map((entry, index) => (
          <div key={entry.id} data-testid='weight-entry' className='flex items-center justify-between py-3'>
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-3'>
                <span className='text-sm font-medium'>{entry.weight.toFixed(1)} kg</span>
                {getChangeBadge(index)}
              </div>
              <span className='text-xs text-muted-foreground'>{formatDate(entry.createdAt)}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant='ghost' size='icon' aria-label={t('weight.entry-options')}>
                    <DotsThreeIcon size={20} weight='bold' />
                  </Button>
                }
              />
              <DropdownMenuContent align='end'>
                <DropdownMenuItem
                  onClick={() => {
                    handleEditOpen(entry)
                  }}
                >
                  <PencilSimpleIcon size={16} />
                  {t('weight.edit')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    deleteWeight({ id: entry.id }, { onError: () => toast.error(t('weight.entry-delete-error')) })
                  }}
                  variant='destructive'
                >
                  <TrashIcon size={16} />
                  {t('weight.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      <Dialog
        open={editEntry !== null}
        onOpenChange={(open) => {
          if (!open) setEditEntry(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('weight.edit-weight')}</DialogTitle>
            <DialogDescription>{t('weight.edit-weight-description')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSave} id='edit-weight-entry-form'>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='edit-weight'>{t('weight.weight-kg')}</FieldLabel>
                <Input
                  id='edit-weight'
                  type='number'
                  step='0.1'
                  min='20'
                  max='300'
                  value={editWeight}
                  onChange={(e) => {
                    setEditWeight(e.target.value)
                  }}
                  placeholder={t('weight.weight-placeholder')}
                  disabled={saving}
                />
                <FieldDescription>{t('weight.weight-hint')}</FieldDescription>
              </Field>
            </FieldGroup>
          </form>
          <DialogFooter>
            <Button type='submit' disabled={saving} form='edit-weight-entry-form'>
              {saving && <Spinner data-icon='inline-start' />}
              {saving ? t('weight.saving') : t('weight.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
