import type { ManualFoodEntry } from '@/lib/zod-schemas'
import type { NutritionData } from './nutrition-result'

import { BarcodeIcon, CameraIcon, PencilSimpleIcon } from '@phosphor-icons/react/ssr'
import { useTranslations } from 'next-intl'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { AiImageMode } from './ai-image-mode'
import { BarcodeMode } from './barcode-mode'
import { ManualEntryMode } from './manual-entry-mode'

export type Mode = 'ai-scan' | 'manual' | 'barcode'

const MODES = [
  { id: 'ai-scan', icon: CameraIcon },
  { id: 'manual', icon: PencilSimpleIcon },
  { id: 'barcode', icon: BarcodeIcon },
] as const

type ModeSelectorProps = {
  value: Mode
  onValueChange: (mode: Mode) => void
  handleScanResult: (data: NutritionData) => void
  handleManualSubmit: (data: ManualFoodEntry) => void
}

export function ModeSelector(props: ModeSelectorProps) {
  const { handleScanResult, handleManualSubmit, value, onValueChange } = props
  const t = useTranslations()

  const modeLabels: Record<Mode, string> = {
    'ai-scan': t('add-food.ai-scan'),
    manual: t('add-food.manual'),
    barcode: t('add-food.barcode'),
  }

  return (
    <Tabs className='space-y-5' value={value} onValueChange={onValueChange}>
      <TabsList className='w-full'>
        {MODES.map((mode) => (
          <TabsTrigger key={mode.id} value={mode.id}>
            <mode.icon size={16} />
            {modeLabels[mode.id]}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value='ai-scan'>
        <AiImageMode onResult={handleScanResult} />
      </TabsContent>
      <TabsContent value='manual'>
        <ManualEntryMode onSubmit={handleManualSubmit} />
      </TabsContent>
      <TabsContent value='barcode'>
        <BarcodeMode onResult={handleScanResult} />
      </TabsContent>
    </Tabs>
  )
}
