import type { NutritionData } from './nutrition-result'

import { CameraIcon, ImageIcon, SpinnerGapIcon } from '@phosphor-icons/react/ssr'
import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'

const MOCK_AI_RESULT: NutritionData = {
  foodName: 'Grilled Chicken Breast',
  servingSize: '100g',
  calories: 165,
  protein: 31,
  carbs: 0,
  fat: 3.6,
  fiber: 0
}

type AiImageModeProps = {
  onResult: (data: NutritionData) => void
}

export function AiImageMode(props: AiImageModeProps) {
  const { onResult } = props
  const [scanning, setScanning] = useState(false)

  const handleScan = useCallback(() => {
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      onResult(MOCK_AI_RESULT)
    }, 1500)
  }, [onResult])

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex aspect-4/3 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/50'>
        {scanning ? (
          <div className='flex flex-col items-center gap-2 text-muted-foreground'>
            <SpinnerGapIcon size={40} className='animate-spin' />
            <span className='text-sm'>Analyzing image...</span>
          </div>
        ) : (
          <div className='flex flex-col items-center gap-2 text-muted-foreground'>
            <CameraIcon size={40} />
            <span className='text-sm'>Camera viewfinder</span>
          </div>
        )}
      </div>

      <div className='flex gap-3'>
        <Button className='flex-1' onClick={handleScan} disabled={scanning}>
          <CameraIcon size={16} />
          Take Photo
        </Button>
        <Button variant='outline' className='flex-1' onClick={handleScan} disabled={scanning}>
          <ImageIcon size={16} />
          Upload Photo
        </Button>
      </div>
    </div>
  )
}
