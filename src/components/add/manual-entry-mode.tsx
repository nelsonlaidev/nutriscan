'use client'

import type { ManualFoodEntry } from '@/lib/zod-schemas'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ManualFoodEntrySchema } from '@/lib/zod-schemas'

type ManualEntryModeProps = {
  onSubmit: (data: ManualFoodEntry) => void
}

function ManualEntryMode(props: ManualEntryModeProps) {
  const { onSubmit } = props
  const [form, setForm] = useState({
    foodName: '',
    servingSize: '',
    calories: '0',
    protein: '0',
    carbs: '0',
    fat: '0',
    fiber: '0'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => Object.fromEntries(Object.entries(prev).filter(([key]) => key !== field)))
  }

  function handleSubmit() {
    const result = ManualFoodEntrySchema.safeParse({
      ...form,
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fat: Number(form.fat),
      fiber: Number(form.fiber)
    })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0]
        if (field && !fieldErrors[String(field)]) {
          fieldErrors[String(field)] = issue.message
        }
      }
      setErrors(fieldErrors)
      return
    }

    onSubmit(result.data)
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-1'>
        <label htmlFor='me-foodName' className='text-sm font-medium'>
          Food Name
        </label>
        <Input
          id='me-foodName'
          placeholder='e.g. Grilled Chicken'
          value={form.foodName}
          onChange={(e) => {
            updateField('foodName', e.target.value)
          }}
          aria-invalid={!!errors.foodName}
        />
        {errors.foodName && <span className='text-xs text-destructive'>{errors.foodName}</span>}
      </div>

      <div className='flex flex-col gap-1'>
        <label htmlFor='me-servingSize' className='text-sm font-medium'>
          Serving Size
        </label>
        <Input
          id='me-servingSize'
          placeholder='e.g. 100g, 1 cup'
          value={form.servingSize}
          onChange={(e) => {
            updateField('servingSize', e.target.value)
          }}
          aria-invalid={!!errors.servingSize}
        />
        {errors.servingSize && <span className='text-xs text-destructive'>{errors.servingSize}</span>}
      </div>

      <div className='flex flex-col gap-1'>
        <label htmlFor='me-calories' className='text-sm font-medium'>
          Calories
        </label>
        <Input
          id='me-calories'
          type='number'
          value={form.calories}
          onChange={(e) => {
            updateField('calories', e.target.value)
          }}
          aria-invalid={!!errors.calories}
        />
        {errors.calories && <span className='text-xs text-destructive'>{errors.calories}</span>}
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <div className='flex flex-col gap-1'>
          <label htmlFor='me-protein' className='text-sm text-muted-foreground'>
            Protein (g)
          </label>
          <Input
            id='me-protein'
            type='number'
            value={form.protein}
            onChange={(e) => {
              updateField('protein', e.target.value)
            }}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='me-carbs' className='text-sm text-muted-foreground'>
            Carbs (g)
          </label>
          <Input
            id='me-carbs'
            type='number'
            value={form.carbs}
            onChange={(e) => {
              updateField('carbs', e.target.value)
            }}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='me-fat' className='text-sm text-muted-foreground'>
            Fat (g)
          </label>
          <Input
            id='me-fat'
            type='number'
            value={form.fat}
            onChange={(e) => {
              updateField('fat', e.target.value)
            }}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='me-fiber' className='text-sm text-muted-foreground'>
            Fiber (g)
          </label>
          <Input
            id='me-fiber'
            type='number'
            value={form.fiber}
            onChange={(e) => {
              updateField('fiber', e.target.value)
            }}
          />
        </div>
      </div>

      <Button onClick={handleSubmit}>Add</Button>
    </div>
  )
}

export default ManualEntryMode
