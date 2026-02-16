'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

import { ChartTypeToggle } from './chart-type-toggle'

type NutritionChartProps = {
  data: Array<{ date: string; protein: number; carbs: number; fat: number }>
}

const chartConfig = {
  protein: {
    label: 'Protein',
    color: 'var(--color-blue-500)'
  },
  carbs: {
    label: 'Carbs',
    color: 'var(--color-amber-500)'
  },
  fat: {
    label: 'Fat',
    color: 'var(--color-rose-500)'
  }
} satisfies ChartConfig

export function NutritionChart({ data }: NutritionChartProps) {
  const t = useTranslations()
  const [chartType, setChartType] = useState<'bar' | 'area'>('area')

  return (
    <Card size='sm'>
      <CardHeader>
        <CardTitle>{t('progress.nutrition-chart')}</CardTitle>
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
              <YAxis axisLine={false} tickLine={false} tickMargin={8} fontSize={12} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey='protein' fill='var(--color-protein)' stackId='1' radius={[0, 0, 0, 0]} />
              <Bar dataKey='carbs' fill='var(--color-carbs)' stackId='1' radius={[0, 0, 0, 0]} />
              <Bar dataKey='fat' fill='var(--color-fat)' stackId='1' radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={data} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray='3 3' />
              <XAxis dataKey='date' axisLine={false} tickLine={false} tickMargin={8} fontSize={12} />
              <YAxis axisLine={false} tickLine={false} tickMargin={8} fontSize={12} width={40} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type='monotone'
                dataKey='protein'
                stackId='1'
                fill='var(--color-protein)'
                stroke='var(--color-protein)'
                fillOpacity={0.4}
              />
              <Area
                type='monotone'
                dataKey='carbs'
                stackId='1'
                fill='var(--color-carbs)'
                stroke='var(--color-carbs)'
                fillOpacity={0.4}
              />
              <Area
                type='monotone'
                dataKey='fat'
                stackId='1'
                fill='var(--color-fat)'
                stroke='var(--color-fat)'
                fillOpacity={0.4}
              />
            </AreaChart>
          )}
        </ChartContainer>
        <div className='mt-2 flex items-center gap-4 text-xs text-muted-foreground'>
          <span className='flex items-center gap-1'>
            <span className='size-2.5 rounded-sm bg-blue-500' />
            {t('progress.protein')}
          </span>
          <span className='flex items-center gap-1'>
            <span className='size-2.5 rounded-sm bg-amber-500' />
            {t('progress.carbs')}
          </span>
          <span className='flex items-center gap-1'>
            <span className='size-2.5 rounded-sm bg-rose-500' />
            {t('progress.fat')}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
