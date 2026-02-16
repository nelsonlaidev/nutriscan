import type { NutritionData } from './nutrition-result'

import { BarcodeIcon, CameraIcon, SpinnerGapIcon, WarningIcon, XIcon } from '@phosphor-icons/react/ssr'
import { Scanner } from '@yudiel/react-qr-scanner'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import { useBarcodeScanner } from '@/hooks/use-barcode-scanner'

type BarcodeModeProps = {
  onResult: (data: NutritionData) => void
}

export function BarcodeMode(props: BarcodeModeProps) {
  const { onResult } = props
  const t = useTranslations()
  const { state, startScanning, stopScanning, active, handleScan, handleError } = useBarcodeScanner(onResult)

  return (
    <div className='flex flex-col gap-4'>
      <div className='relative flex aspect-4/3 flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/50'>
        {active ? (
          <Scanner
            onScan={handleScan}
            onError={handleError}
            paused={state.status === 'looking-up'}
            formats={['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39']}
            components={{ finder: false }}
            styles={{ container: { width: '100%', height: '100%' } }}
          />
        ) : (
          <div className='flex flex-col items-center gap-2 text-muted-foreground'>
            <BarcodeIcon size={40} />
            <span className='text-sm'>{t('add-food.point-camera')}</span>
          </div>
        )}

        {/* Looking up overlay */}
        {state.status === 'looking-up' && (
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40'>
            <SpinnerGapIcon size={40} className='animate-spin text-white' />
            <span className='text-sm font-medium text-white'>{t('add-food.looking-up')}</span>
          </div>
        )}

        {/* Error overlay */}
        {state.status === 'error' && (
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40'>
            <WarningIcon size={40} className='text-amber-400' />
            <span className='text-sm font-medium text-white'>{state.message}</span>
          </div>
        )}
      </div>

      {active ? (
        <Button variant='outline' onClick={stopScanning}>
          <XIcon size={16} />
          {t('add-food.stop')}
        </Button>
      ) : (
        <Button onClick={startScanning}>
          <CameraIcon size={16} />
          {t('add-food.start-scanning')}
        </Button>
      )}
    </div>
  )
}
