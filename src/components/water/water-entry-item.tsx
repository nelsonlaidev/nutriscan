'use client'

import type { WaterEntry } from '@/data/water'

import { DropIcon, PencilSimpleIcon } from '@phosphor-icons/react/ssr'
import { format } from 'date-fns'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import { deleteWaterEntry, updateWaterEntry } from '@/actions/water-entry'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { MAX_WATER_INTAKE } from '@/lib/constants'
import { formatMl } from '@/lib/utils'

import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { Spinner } from '../ui/spinner'

type WaterEntryItemProps = {
  entry: WaterEntry
  onUpdate: (id: string, amount: number) => void
  onDelete: (id: string) => void
}

export function WaterEntryItem(props: WaterEntryItemProps) {
  const { entry, onUpdate, onDelete } = props
  const t = useTranslations()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(String(entry.amount))
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const timeStr = format(entry.createdAt, t('water.time-format'))
  const submitting = saving || deleting

  async function handleSave() {
    const parsed = Number.parseInt(value, 10)
    if (Number.isNaN(parsed) || parsed < 1 || parsed > MAX_WATER_INTAKE) {
      toast.error(t('water.amount-range-error', { max: formatMl(MAX_WATER_INTAKE) }))
      return
    }

    setSaving(true)
    const result = await updateWaterEntry({ id: entry.id, amount: parsed })
    setSaving(false)

    if (result.data?.success) {
      onUpdate(entry.id, parsed)
      setOpen(false)
      toast.success(t('water.entry-updated'))
    } else {
      toast.error(t('water.entry-update-error'))
    }
  }

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteWaterEntry({ id: entry.id })
    setDeleting(false)

    if (result.data?.success) {
      onDelete(entry.id)
      setOpen(false)
      toast.success(t('water.entry-deleted'))
    } else {
      toast.error(t('water.entry-delete-error'))
    }
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
