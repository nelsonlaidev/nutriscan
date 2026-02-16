import { useTranslations } from 'next-intl'

import { Input } from '@/components/ui/input'

export type NutritionData = {
  foodName: string
  servingSize: string
  calories: number
  protein: number
  carbs: number
  fat: number
  imageUrl?: string
}

type NutritionResultProps = {
  data: NutritionData
  onChange: (data: NutritionData) => void
}

export function NutritionResult(props: NutritionResultProps) {
  const { data, onChange } = props
  const t = useTranslations()

  function updateField(field: keyof NutritionData, value: string) {
    if (field === 'foodName' || field === 'servingSize') {
      onChange({ ...data, [field]: value })
    } else {
      onChange({ ...data, [field]: Number(value) || 0 })
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-1'>
          <label htmlFor='nr-foodName' className='text-sm font-medium'>
            {t('add-food.food-name')}
          </label>
          <Input
            id='nr-foodName'
            value={data.foodName}
            onChange={(e) => {
              updateField('foodName', e.target.value)
            }}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='nr-servingSize' className='text-sm font-medium'>
            {t('add-food.serving-size')}
          </label>
          <Input
            id='nr-servingSize'
            value={data.servingSize}
            onChange={(e) => {
              updateField('servingSize', e.target.value)
            }}
          />
        </div>
      </div>

      <div className='flex flex-col gap-1'>
        <label htmlFor='nr-calories' className='text-sm font-medium'>
          {t('add-food.calories')}
        </label>
        <Input
          id='nr-calories'
          type='number'
          value={data.calories}
          onChange={(e) => {
            updateField('calories', e.target.value)
          }}
        />
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <div className='flex flex-col gap-1'>
          <label htmlFor='nr-protein' className='text-sm text-muted-foreground'>
            {t('add-food.protein-grams')}
          </label>
          <Input
            id='nr-protein'
            type='number'
            value={data.protein}
            onChange={(e) => {
              updateField('protein', e.target.value)
            }}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='nr-carbs' className='text-sm text-muted-foreground'>
            {t('add-food.carbs-grams')}
          </label>
          <Input
            id='nr-carbs'
            type='number'
            value={data.carbs}
            onChange={(e) => {
              updateField('carbs', e.target.value)
            }}
          />
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor='nr-fat' className='text-sm text-muted-foreground'>
            {t('add-food.fat-grams')}
          </label>
          <Input
            id='nr-fat'
            type='number'
            value={data.fat}
            onChange={(e) => {
              updateField('fat', e.target.value)
            }}
          />
        </div>
      </div>
    </div>
  )
}
