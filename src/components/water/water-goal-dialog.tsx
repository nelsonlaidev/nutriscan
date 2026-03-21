'use client'

import { PencilSimpleIcon } from '@phosphor-icons/react/ssr'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

import { updateWaterGoal } from '@/actions/update-water-goal'
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
import { formatMl } from '@/lib/utils'

import { Field, FieldDescription, FieldGroup, FieldLabel } from '../ui/field'
import { Spinner } from '../ui/spinner'

type WaterGoalDialogProps = {
  currentGoal: number
  onGoalChange: (goal: number) => void
}

export function WaterGoalDialog(props: WaterGoalDialogProps) {
  const { currentGoal, onGoalChange } = props
  const t = useTranslations()
  const [open, setOpen] = useState(false)
  const [goal, setGoal] = useState(String(currentGoal))
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    const parsed = Number.parseInt(goal, 10)
    if (Number.isNaN(parsed) || parsed < 500 || parsed > 10_000) {
      toast.error(t('water.goal-range-error'))
      return
    }

    setSaving(true)
    const result = await updateWaterGoal({ goal: parsed })
    setSaving(false)

    if (result.data?.success) {
      onGoalChange(parsed)
      setOpen(false)
      toast.success(t('water.goal-updated'))
    } else {
      toast.error(t('water.goal-update-error'))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant='ghost'>
            <span>{t('water.daily-goal-button', { goal: formatMl(currentGoal) })}</span>
            <PencilSimpleIcon size={14} />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('water.daily-goal-title')}</DialogTitle>
          <DialogDescription>{t('water.daily-goal-description')}</DialogDescription>
        </DialogHeader>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='water-goal'>{t('water.goal-ml')}</FieldLabel>
              <Input
                id='water-goal'
                type='number'
                min={500}
                max={10_000}
                step={100}
                value={goal}
                onChange={(e) => {
                  setGoal(e.target.value)
                }}
              />
              <FieldDescription>{t('water.goal-recommended')}</FieldDescription>
            </Field>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Spinner data-icon='inline-start' />}
            {saving ? t('water.saving') : t('water.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
