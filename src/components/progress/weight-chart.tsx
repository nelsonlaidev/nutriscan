'use client'

import type { ChartConfig } from '@/components/ui/chart'
import type { TimeRange } from '@/lib/constants'

import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from 'recharts'

import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { useWeightByDateRange } from '@/hooks/queries/progress.query'
import { getDateRange } from '@/lib/utils'

import { ChartTypeToggle } from './chart-type-toggle'

type WeightChartProps = {
  range: TimeRange
  goal: number
}

const chartConfig = {
  weight: {
    label: 'Weight',
    color: 'var(--color-emerald-500)',
  },
} satisfies ChartConfig

export function WeightChart({ range, goal }: WeightChartProps) {
  const t = useTranslations()
  const [chartType, setChartType] = useState<'bar' | 'area'>('area')

  const isYear = range === '12m'
  const dateRange = getDateRange(range)
  const hasDates = dateRange.dates.length > 0
  const dateInput = { startOfDay: dateRange.startOfDay, endOfDay: dateRange.endOfDay, hasDates }

  const { data: rows } = useWeightByDateRange(dateInput)

  const data = useMemo(() => {
    const map = new Map<string, { weight: number; count: number }>()
    for (const r of rows) {
      const key = isYear ? r.date.slice(0, 7) : r.date
      const prev = map.get(key) ?? { weight: 0, count: 0 }
      map.set(key, { weight: prev.weight + r.weight, count: prev.count + 1 })
    }

    return dateRange.dates.map((d) => {
      const entry = map.get(d.value)
      return {
        date: d.label,
        weight: entry ? Math.round(entry.weight / entry.count) : null,
      }
    })
  }, [rows, dateRange.dates, isYear])

  const weights = data.map((d) => d.weight).filter((w): w is number => w !== null)
  const dataMin = weights.length > 0 ? Math.min(...weights, goal) : goal
  const dataMax = weights.length > 0 ? Math.max(...weights, goal) : goal
  const padding = Math.max((dataMax - dataMin) * 0.15, 2)
  const yMin = Math.floor((dataMin - padding) / 5) * 5
  const yMax = Math.ceil((dataMax + padding) / 5) * 5
  const yTicks = Array.from({ length: (yMax - yMin) / 5 + 1 }, (_, i) => yMin + i * 5)

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
              <XAxis
                dataKey='date'
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                fontSize={12}
                interval={data.length > 10 ? Math.floor(data.length / 10) : 0}
              />
              <YAxis
                domain={[yMin, yMax]}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                fontSize={12}
                width={40}
                ticks={yTicks}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ReferenceLine y={goal} stroke='var(--color-emerald-400)' strokeDasharray='6 4' strokeWidth={2} />
              <Bar dataKey='weight' fill='var(--color-weight)' radius={[4, 4, 0, 0]} />
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
                domain={[yMin, yMax]}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                fontSize={12}
                width={40}
                ticks={yTicks}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ReferenceLine y={goal} stroke='var(--color-emerald-400)' strokeDasharray='6 4' strokeWidth={2} />
              <Area
                type='monotone'
                dataKey='weight'
                fill='var(--color-weight)'
                stroke='var(--color-weight)'
                fillOpacity={0.4}
                connectNulls
              />
            </AreaChart>
          )}
        </ChartContainer>
        <div className='mt-2 flex items-center gap-2 text-xs text-muted-foreground'>
          <span className='inline-block h-0 w-4 border-t-2 border-dashed border-emerald-400' />
          {t('progress.weight-goal')}: {goal} kg
        </div>
      </CardContent>
    </Card>
  )
}
