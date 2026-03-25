'use client'

import { DropIcon, PencilSimpleIcon } from '@phosphor-icons/react/ssr'
import { format } from 'date-fns'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useDeleteWaterEntry, useUpdateWaterEntry } from '@/hooks/queries/water.query'
import { showAchievementUnlockToast } from '@/lib/achievements/toast'
import { MAX_WATER_INTAKE } from '@/lib/constants'
import { formatMl, getDayRange } from '@/lib/utils'

import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { Spinner } from '../ui/spinner'

type WaterEntry = {
  id: string
  amount: number
  createdAt: Date
}

type WaterEntryItemProps = {
  entry: WaterEntry
}

export function WaterEntryItem(props: WaterEntryItemProps) {
  const { entry } = props
  const t = useTranslations()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(String(entry.amount))
  const dayRange = getDayRange()

  const { mutate: updateWater, isPending: saving } = useUpdateWaterEntry(dayRange, () => {
    setOpen(false)
    toast.success(t('water.entry-updated'))
  })

  const { mutate: deleteWater, isPending: deleting } = useDeleteWaterEntry(dayRange, () => {
    setOpen(false)
    toast.success(t('water.entry-deleted'))
  })

  const timeStr = format(entry.createdAt, t('water.time-format'))
  const submitting = saving || deleting

  function handleSave() {
    if (submitting) return

    const parsed = Number.parseInt(value, 10)
    if (Number.isNaN(parsed) || parsed < 1 || parsed > MAX_WATER_INTAKE) {
      toast.error(t('water.amount-range-error', { max: formatMl(MAX_WATER_INTAKE) }))
      return
    }

    updateWater(
      { id: entry.id, amount: parsed },
      {
        onSuccess: (data) => {
          showAchievementUnlockToast(data.newUnlocks, t)
        },
        onError: () => toast.error(t('water.entry-update-error')),
      },
    )
  }

  function handleDelete() {
    if (submitting) return

    deleteWater({ id: entry.id }, { onError: () => toast.error(t('water.entry-delete-error')) })
  }

  return (
    <div className='flex items-center justify-between py-2'>
      <div className='flex items-center gap-3'>
        <DropIcon size={20} weight='fill' className='text-blue-500' />
        <div>
          <p className='text-sm font-medium'>{t('water.water')}</p>
          <p className='text-xs text-muted-foreground'>{timeStr}</p>
        </div>
      </div>
      <div className='flex items-center gap-1'>
        <span className='text-sm font-medium'>{formatMl(entry.amount)}</span>
        <Dialog
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (isOpen) setValue(String(entry.amount))
          }}
        >
          <DialogTrigger
            render={
              <Button variant='ghost' size='icon-sm' aria-label={t('water.edit-entry')}>
                <PencilSimpleIcon size={16} />
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('water.edit-entry-title')}</DialogTitle>
              <DialogDescription>{t('water.edit-entry-description')}</DialogDescription>
            </DialogHeader>
            <form>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor='edit-water-amount'>{t('water.amount-ml')}</FieldLabel>
                  <Input
                    id='edit-water-amount'
                    type='number'
                    min={1}
                    max={MAX_WATER_INTAKE}
                    step={50}
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value)
                    }}
                    disabled={submitting}
                  />
                </Field>
              </FieldGroup>
            </form>
            <DialogFooter>
              <Button variant='destructive' onClick={handleDelete} disabled={submitting}>
                {deleting && <Spinner data-icon='inline-start' />}
                {deleting ? t('water.deleting') : t('water.delete')}
              </Button>
              <Button onClick={handleSave} disabled={submitting}>
                {saving && <Spinner data-icon='inline-start' />}
                {saving ? t('water.saving') : t('water.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
