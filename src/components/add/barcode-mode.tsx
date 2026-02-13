'use client'

import type { NutritionData } from './nutrition-result'

import { BarcodeIcon, SpinnerGapIcon } from '@phosphor-icons/react'
import { useCallback, useState } from 'react'

import { Button } from '@/components/ui/button'

const MOCK_BARCODE_RESULT: NutritionData = {
  foodName: 'Organic Granola Bar',
  servingSize: '40g',
  calories: 180,
  protein: 4,
  carbs: 28,
  fat: 7,
  fiber: 3
}

type BarcodeModeProps = {
  onResult: (data: NutritionData) => void
}

function BarcodeMode(props: BarcodeModeProps) {
  const { onResult } = props
  const [scanning, setScanning] = useState(false)

  const handleScan = useCallback(() => {
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      onResult(MOCK_BARCODE_RESULT)
    }, 2000)
  }, [onResult])

  return (
    <div className='flex flex-col gap-4'>
      <div className='relative flex aspect-4/3 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/50'>
        {scanning ? (
          <div className='flex flex-col items-center gap-2 text-muted-foreground'>
            <SpinnerGapIcon size={40} className='animate-spin' />
            <span className='text-sm'>Scanning...</span>
          </div>
        ) : (
          <>
            <div className='flex flex-col items-center gap-2 text-muted-foreground'>
              <BarcodeIcon size={40} />
              <span className='text-sm'>Point camera at barcode</span>
            </div>
            {/* Scanning frame overlay */}
            <div className='pointer-events-none absolute inset-12 rounded-xl border-2 border-primary/40' />
          </>
        )}
      </div>

      <Button onClick={handleScan} disabled={scanning}>
        <BarcodeIcon size={16} />
        {scanning ? 'Scanning...' : 'Scan'}
      </Button>
    </div>
  )
}

export default BarcodeMode
