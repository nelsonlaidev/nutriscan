import { PencilSimpleIcon } from '@phosphor-icons/react/ssr'
import { useState } from 'react'
import { toast } from 'sonner'

import { updateWaterIntake } from '@/actions/update-water-intake'
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
import { Label } from '@/components/ui/label'
import { MAX_WATER_INTAKE } from '@/lib/constants'
import { formatMl } from '@/lib/utils'

type WaterAmountDialogProps = {
  amount: number
  date: string
  onAmountChange: (amount: number) => void
}

export function WaterAmountDialog(props: WaterAmountDialogProps) {
  const { amount, date, onAmountChange } = props
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(String(amount))
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    const parsed = Number.parseInt(value, 10)
    if (Number.isNaN(parsed) || parsed < 0 || parsed > MAX_WATER_INTAKE) {
      toast.error(`Amount must be between 0 and ${formatMl(MAX_WATER_INTAKE)}`)
      return
    }

    setSaving(true)
    const result = await updateWaterIntake({ amount: parsed, date })
    setSaving(false)

    if (result.data?.success) {
      onAmountChange(parsed)
      setOpen(false)
      toast.success('Water intake updated')
    } else {
      toast.error('Failed to update water intake')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (isOpen) setValue(String(amount))
      }}
    >
      <DialogTrigger
        render={
          <Button variant='ghost' size='lg' className='text-3xl font-semibold'>
            <span>{formatMl(amount)}</span>
            <PencilSimpleIcon size={18} />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Water Intake</DialogTitle>
          <DialogDescription>Adjust your water intake for today in milliliters.</DialogDescription>
        </DialogHeader>
        <div className='space-y-2'>
          <Label htmlFor='water-amount'>Amount (mL)</Label>
          <Input
            id='water-amount'
            type='number'
            min={0}
            max={MAX_WATER_INTAKE}
            step={100}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
            }}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
