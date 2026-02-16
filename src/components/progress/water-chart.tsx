'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts'

import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

import { ChartTypeToggle } from './chart-type-toggle'

type WaterChartProps = {
  data: Array<{ date: string; amount: number }>
  goal: number
}

const chartConfig = {
  amount: {
    label: 'Water (mL)',
    color: 'var(--color-sky-500)'
  }
} satisfies ChartConfig

export function WaterChart({ data, goal }: WaterChartProps) {
  const t = useTranslations()
  const [chartType, setChartType] = useState<'bar' | 'area'>('bar')

  const yDomain: [number, (dataMax: number) => number] = [
    0,
    (dataMax: number) => Math.ceil(Math.max(dataMax, goal) / 500) * 500
  ]
  const yTicks = Array.from(
    { length: Math.ceil(Math.max(Math.max(...data.map((d) => d.amount)), goal) / 500) + 1 },
    (_, i) => i * 500
  )

  return (
    <Card size='sm'>
      <CardHeader>
        <CardTitle>{t('progress.water-chart')}</CardTitle>
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
              <YAxis
                domain={yDomain}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                fontSize={12}
                width={40}
                ticks={yTicks}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ReferenceLine y={goal} stroke='var(--color-sky-400)' strokeDasharray='6 4' strokeWidth={2} />
              <Bar dataKey='amount' fill='var(--color-amount)' radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={data} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray='3 3' />
              <XAxis dataKey='date' axisLine={false} tickLine={false} tickMargin={8} fontSize={12} />
              <YAxis
                domain={yDomain}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                fontSize={12}
                width={40}
                ticks={yTicks}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ReferenceLine y={goal} stroke='var(--color-sky-400)' strokeDasharray='6 4' strokeWidth={2} />
              <Area
                type='monotone'
                dataKey='amount'
                fill='var(--color-amount)'
                stroke='var(--color-amount)'
                fillOpacity={0.4}
              />
            </AreaChart>
          )}
        </ChartContainer>
        <div className='mt-2 flex items-center gap-2 text-xs text-muted-foreground'>
          <span className='inline-block h-0 w-4 border-t-2 border-dashed border-sky-400' />
          {t('progress.water-goal')}: {goal} mL
        </div>
      </CardContent>
    </Card>
  )
}
