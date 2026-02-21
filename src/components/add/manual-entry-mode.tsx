import type { ManualFoodEntry } from '@/lib/zod-schemas'

import { useForm } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { createManualFoodEntryFormSchema } from '@/lib/zod-schemas'

type ManualEntryModeProps = {
  onSubmit: (data: ManualFoodEntry) => void
}

export function ManualEntryMode(props: ManualEntryModeProps) {
  const { onSubmit } = props
  const t = useTranslations()

  const form = useForm({
    defaultValues: {
      foodName: '',
      servingSize: '',
      calories: '' as '' | number,
      protein: '' as '' | number,
      carbs: '' as '' | number,
      fat: '' as '' | number
    },
    validators: {
      onSubmit: createManualFoodEntryFormSchema(t)
    },
    onSubmit: ({ value }) => {
      onSubmit({
        foodName: value.foodName,
        servingSize: value.servingSize,
        calories: value.calories as number,
        protein: value.protein as number,
        carbs: value.carbs as number,
        fat: value.fat as number
      })
    }
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        void form.handleSubmit()
      }}
      className='flex flex-col gap-4'
    >
      <FieldGroup className='gap-4'>
        <form.Field name='foodName'>
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{t('add-food.food-name')}</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  placeholder={t('add-food.food-name-placeholder')}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value)
                  }}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name='servingSize'>
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{t('add-food.serving-size')}</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  placeholder={t('add-food.serving-size-placeholder')}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    field.handleChange(e.target.value)
                  }}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name='calories'>
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>{t('add-food.calories')}</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type='number'
                  inputMode='decimal'
                  placeholder='0'
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    const value = e.target.valueAsNumber
                    field.handleChange(Number.isNaN(value) ? '' : value)
                  }}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>
      </FieldGroup>

      <div className='grid grid-cols-2 gap-3'>
        {(['protein', 'carbs', 'fat'] as const).map((macro) => (
          <form.Field key={macro} name={macro}>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field>
                  <FieldLabel htmlFor={field.name} className='text-muted-foreground'>
                    {t(`add-food.${macro}-grams`)}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type='number'
                    inputMode='decimal'
                    placeholder='0'
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber
                      field.handleChange(Number.isNaN(value) ? '' : value)
                    }}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        ))}
      </div>

      <Button type='submit'>{t('add-food.add')}</Button>
    </form>
  )
}
