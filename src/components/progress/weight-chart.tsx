'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts'

import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

import { ChartTypeToggle } from './chart-type-toggle'

type WeightChartProps = {
  data: Array<{ date: string; weight: number }>
  goal: number
}

const chartConfig = {
  weight: {
    label: 'Weight',
    color: 'var(--color-emerald-500)'
  }
} satisfies ChartConfig

export function WeightChart({ data, goal }: WeightChartProps) {
  const t = useTranslations()
  const [chartType, setChartType] = useState<'bar' | 'area'>('area')

  const weights = data.map((d) => d.weight)
  const dataMin = Math.min(...weights, goal)
  const dataMax = Math.max(...weights, goal)
  const padding = Math.max((dataMax - dataMin) * 0.15, 2)
  const yMin = Math.floor(dataMin - padding)
  const yMax = Math.ceil(dataMax + padding)

  return (
    <Card size='sm'>
      <CardHeader>
        <CardTitle>{t('progress.weight-progress')}</CardTitle>
        <CardAction>
          <ChartTypeToggle value={chartType} onChange={setChartType} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='aspect-video w-full'>
          {chartType === 'bar' ? (
            <BarChart data={data} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray='3 3' />
              <XAxis dataKey='date' axisLine={false} tickLine={false} tickMargin={8} fontSize={12} />
              <YAxis domain={[yMin, yMax]} axisLine={false} tickLine={false} tickMargin={8} fontSize={12} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ReferenceLine y={goal} stroke='var(--color-emerald-400)' strokeDasharray='6 4' strokeWidth={2} />
              <Bar dataKey='weight' fill='var(--color-weight)' radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={data} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray='3 3' />
              <XAxis dataKey='date' axisLine={false} tickLine={false} tickMargin={8} fontSize={12} />
              <YAxis domain={[yMin, yMax]} axisLine={false} tickLine={false} tickMargin={8} fontSize={12} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ReferenceLine y={goal} stroke='var(--color-emerald-400)' strokeDasharray='6 4' strokeWidth={2} />
              <Area
                type='monotone'
                dataKey='weight'
                fill='var(--color-weight)'
                stroke='var(--color-weight)'
                fillOpacity={0.4}
              />
            </AreaChart>
          )}
        </ChartContainer>
        <div className='mt-2 flex items-center gap-2 text-xs text-muted-foreground'>
          <span className='inline-block h-0 w-4 border-t-2 border-dashed border-emerald-400' />
          {t('progress.weight-goal')}: {goal} kg
        </div>
        <div className='mt-3 rounded-xl bg-green-50 px-4 py-3 text-center text-xs font-medium text-green-600'>
          {t('progress.encouragement')}
        </div>
      </CardContent>
    </Card>
  )
}
