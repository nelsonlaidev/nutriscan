'use client'

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
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAddWeightEntry } from '@/hooks/queries/weight.query'

import { Spinner } from '../ui/spinner'

export function WeightEntryDialog() {
  const t = useTranslations()
  const [open, setOpen] = useState(false)
  const [weight, setWeight] = useState('')

  const { mutate: addWeight, isPending: saving } = useAddWeightEntry(() => {
    toast.success(t('weight.entry-added'))
    setOpen(false)
    setWeight('')
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const value = Number.parseFloat(weight)
    if (Number.isNaN(value) || value < 20 || value > 300) {
      toast.error(t('weight.weight-range-error'))
      return
    }

    addWeight({ weight: value }, { onError: () => toast.error(t('weight.entry-add-error')) })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className='w-full bg-emerald-500 hover:bg-emerald-600' />}>
        {t('weight.update-weight')}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('weight.update-weight')}</DialogTitle>
          <DialogDescription>{t('weight.update-weight-description')}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} id='add-weight-entry-form'>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='weight'>{t('weight.weight-kg')}</FieldLabel>
              <Input
                id='weight'
                type='number'
                step='0.1'
                min='20'
                max='300'
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value)
                }}
                placeholder={t('weight.weight-placeholder')}
                disabled={saving}
              />
              <FieldDescription>{t('weight.weight-hint')}</FieldDescription>
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button type='submit' disabled={saving} form='add-weight-entry-form'>
            {saving && <Spinner data-icon='inline-start' />}
            {saving ? t('weight.saving') : t('weight.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
