'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts'

import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

import { ChartTypeToggle } from './chart-type-toggle'

type CalorieChartProps = {
  data: Array<{ date: string; calories: number }>
  goal: number
}

const chartConfig = {
  calories: {
    label: 'Calories',
    color: 'var(--color-orange-500)'
  }
} satisfies ChartConfig

export function CalorieChart({ data, goal }: CalorieChartProps) {
  const t = useTranslations()
  const [chartType, setChartType] = useState<'bar' | 'area'>('bar')

  const yDomain: [number, (dataMax: number) => number] = [
    0,
    (dataMax: number) => Math.ceil(Math.max(dataMax, goal) / 500) * 500
  ]
  const yTicks = Array.from(
    { length: Math.ceil(Math.max(Math.max(...data.map((d) => d.calories)), goal) / 500) + 1 },
    (_, i) => i * 500
  )

  return (
    <Card size='sm'>
      <CardHeader>
        <CardTitle>{t('progress.calories-chart')}</CardTitle>
        <CardAction>
          <ChartTypeToggle value={chartType} onChange={setChartType} />
        </CardAction>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='aspect-video w-full'>
          {chartType === 'bar' ? (
            <BarChart data={data} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray='3 3' />
              <XAxis
                dataKey='date'
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                fontSize={12}
                interval={data.length > 10 ? Math.floor(data.length / 10) : 0}
              />
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
              <ReferenceLine y={goal} stroke='var(--color-orange-400)' strokeDasharray='6 4' strokeWidth={2} />
              <Bar dataKey='calories' fill='var(--color-calories)' radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={data} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray='3 3' />
              <XAxis
                dataKey='date'
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                fontSize={12}
                interval={data.length > 10 ? Math.floor(data.length / 10) : 0}
              />
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
              <ReferenceLine y={goal} stroke='var(--color-orange-400)' strokeDasharray='6 4' strokeWidth={2} />
              <Area
                type='monotone'
                dataKey='calories'
                fill='var(--color-calories)'
                stroke='var(--color-calories)'
                fillOpacity={0.4}
              />
            </AreaChart>
          )}
        </ChartContainer>
        <div className='mt-2 flex items-center gap-2 text-xs text-muted-foreground'>
          <span className='inline-block h-0 w-4 border-t-2 border-dashed border-orange-400' />
          {t('progress.calorie-goal')}: {goal} {t('progress.cal-unit')}
        </div>
      </CardContent>
    </Card>
  )
}
