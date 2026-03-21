'use client'

import type { ChartConfig } from '@/components/ui/chart'
import type { TimeRange } from '@/types'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts'

import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

import { ChartTypeToggle } from './chart-type-toggle'

type WaterChartProps = {
  data: Array<{ date: string; amount: number; goal?: number }>
  goal: number
  range: TimeRange
}

const chartConfig = {
  amount: {
    label: 'Water (mL)',
    color: 'var(--color-sky-500)',
  },
  goal: {
    label: 'Goal',
    color: 'var(--color-sky-400)',
  },
} satisfies ChartConfig

function formatYAxis(value: number, isYearly: boolean) {
  if (!isYearly) return value.toLocaleString()
  if (value >= 1000) return `${Math.round(value / 1000)}K`
  return String(value)
}

export function WaterChart({ data, goal, range }: WaterChartProps) {
  const t = useTranslations()
  const [chartType, setChartType] = useState<'bar' | 'area'>('bar')

  const isYearly = range === 'yearly'
  const maxGoal = isYearly ? Math.max(...data.map((d) => d.goal ?? 0), 0) : goal
  const step = isYearly ? 10_000 : 500

  const yDomain: [number, (dataMax: number) => number] = [
    0,
    (dataMax: number) => Math.ceil(Math.max(dataMax, maxGoal) / step) * step,
  ]
  const yTicks = Array.from(
    { length: Math.ceil(Math.max(...data.map((d) => d.amount), maxGoal, 0) / step) + 1 },
    (_, i) => i * step,
  )

  const sharedXAxis = (
    <XAxis
      dataKey='date'
      axisLine={false}
      tickLine={false}
      tickMargin={8}
      fontSize={12}
      interval={data.length > 10 ? Math.floor(data.length / 10) : 0}
    />
  )

  const sharedYAxis = (
    <YAxis
      domain={yDomain}
      axisLine={false}
      tickLine={false}
      tickMargin={8}
      fontSize={12}
      width={50}
      ticks={yTicks}
      tickFormatter={(v: number) => formatYAxis(v, isYearly)}
    />
  )

  const dailyChart =
    chartType === 'bar' ? (
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} strokeDasharray='3 3' />
        {sharedXAxis}
        {sharedYAxis}
        <ChartTooltip content={<ChartTooltipContent />} />
        <ReferenceLine y={goal} stroke='var(--color-sky-400)' strokeDasharray='6 4' strokeWidth={2} />
        <Bar dataKey='amount' fill='var(--color-amount)' radius={[4, 4, 0, 0]} />
      </BarChart>
    ) : (
      <AreaChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} strokeDasharray='3 3' />
        {sharedXAxis}
        {sharedYAxis}
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
          {isYearly ? (
            <ComposedChart data={data} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray='3 3' />
              {sharedXAxis}
              {sharedYAxis}
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                dataKey='goal'
                type='monotone'
                stroke='var(--color-sky-400)'
                strokeDasharray='6 4'
                strokeWidth={2}
                dot={false}
                activeDot={false}
              />
              {chartType === 'bar' ? (
                <Bar dataKey='amount' fill='var(--color-amount)' radius={[4, 4, 0, 0]} />
              ) : (
                <Area
                  type='monotone'
                  dataKey='amount'
                  fill='var(--color-amount)'
                  stroke='var(--color-amount)'
                  fillOpacity={0.4}
                />
              )}
            </ComposedChart>
          ) : (
            dailyChart
          )}
        </ChartContainer>
        <div className='mt-2 flex items-center gap-2 text-xs text-muted-foreground'>
          <span className='inline-block h-0 w-4 border-t-2 border-dashed border-sky-400' />
          {t('progress.water-goal')}: {isYearly ? `${goal} mL × days/mo` : `${goal} mL`}
        </div>
      </CardContent>
    </Card>
  )
}
