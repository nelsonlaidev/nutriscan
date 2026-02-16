import { BarcodeIcon, CameraIcon, PencilSimpleIcon } from '@phosphor-icons/react/ssr'
import { useTranslations } from 'next-intl'

import { cn } from '@/lib/utils'

export type Mode = 'ai-scan' | 'manual' | 'barcode'

const MODES = [
  { id: 'ai-scan', icon: CameraIcon },
  { id: 'manual', icon: PencilSimpleIcon },
  { id: 'barcode', icon: BarcodeIcon }
] as const

type ModeSelectorProps = {
  value: Mode
  onChange: (mode: Mode) => void
}

export function ModeSelector(props: ModeSelectorProps) {
  const { value, onChange } = props
  const t = useTranslations()

  const modeLabels: Record<Mode, string> = {
    'ai-scan': t('add-food.ai-scan'),
    manual: t('add-food.manual'),
    barcode: t('add-food.barcode')
  }

  return (
    <div className='flex gap-1 rounded-full bg-muted p-1'>
      {MODES.map((mode) => {
        const active = value === mode.id
        return (
          <button
            key={mode.id}
            type='button'
            onClick={() => {
              onChange(mode.id)
            }}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-colors',
              active ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
            )}
          >
            <mode.icon size={16} weight={active ? 'fill' : 'regular'} />
            {modeLabels[mode.id]}
          </button>
        )
      })}
    </div>
  )
}
