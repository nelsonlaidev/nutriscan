'use client'

import { ChartBarIcon, ChartLineUpIcon } from '@phosphor-icons/react/ssr'

type ChartType = 'bar' | 'area'

type ChartTypeToggleProps = {
  value: ChartType
  onChange: (type: ChartType) => void
}

export function ChartTypeToggle({ value, onChange }: ChartTypeToggleProps) {
  return (
    <div className='flex items-center gap-0.5 rounded-lg bg-muted p-0.5'>
      <button
        type='button'
        onClick={() => {
          onChange('bar')
        }}
        className={`rounded-md p-1 transition-colors ${
          value === 'bar' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <ChartBarIcon className='size-4' />
      </button>
      <button
        type='button'
        onClick={() => {
          onChange('area')
        }}
        className={`rounded-md p-1 transition-colors ${
          value === 'area' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        <ChartLineUpIcon className='size-4' />
      </button>
    </div>
  )
}
