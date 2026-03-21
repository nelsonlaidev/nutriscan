import type { Metadata } from 'next'

import { getDaysInMonth, parse } from 'date-fns'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { MainLayout } from '@/components/main-layout'
import { BmiCard } from '@/components/progress/bmi-card'
import { CalorieChart } from '@/components/progress/calorie-chart'
import { NutritionChart } from '@/components/progress/nutrition-chart'
import { TimeRangeTabs } from '@/components/progress/time-range-tabs'
import { WaterChart } from '@/components/progress/water-chart'
import { WeightChart } from '@/components/progress/weight-chart'
import {
  getCalorieChartData,
  getNutritionChartData,
  getWaterChartData,
  getWeightEntriesByDateRange,
} from '@/data/progress'
import { getLatestWeight } from '@/data/weight'
import { getSession } from '@/lib/auth'
import { getDateRange } from '@/lib/utils'

import { progressCache } from './search-params'

export const metadata: Metadata = {
  title: 'Progress',
}

export default async function ProgressPage(props: PageProps<'/progress'>) {
  const { searchParams } = props
  const session = await getSession()
  if (!session) redirect('/')

  const { user } = session
  const t = await getTranslations()

  const { range } = await progressCache.parse(searchParams)

  const dateRange = getDateRange(range)

  const [calorieRows, nutritionRows, waterRows, weightRows, latestWeight] = await Promise.all([
    getCalorieChartData(user.id, dateRange),
    getNutritionChartData(user.id, dateRange),
    getWaterChartData(user.id, dateRange),
    getWeightEntriesByDateRange(user.id, dateRange),
    getLatestWeight(user.id),
  ])

  // For yearly, aggregate daily rows by month (yyyy-MM); otherwise use daily keys
  const isYearly = range === 'yearly'

  const calorieMap = new Map<string, number>()
  for (const r of calorieRows) {
    const key = isYearly ? r.date.slice(0, 7) : r.date
    calorieMap.set(key, (calorieMap.get(key) ?? 0) + r.calories)
  }

  const nutritionMap = new Map<string, { protein: number; carbs: number; fat: number }>()
  for (const r of nutritionRows) {
    const key = isYearly ? r.date.slice(0, 7) : r.date
    const prev = nutritionMap.get(key) ?? { protein: 0, carbs: 0, fat: 0 }
    nutritionMap.set(key, {
      protein: prev.protein + r.protein,
      carbs: prev.carbs + r.carbs,
      fat: prev.fat + r.fat,
    })
  }

  const waterMap = new Map<string, number>()
  for (const r of waterRows) {
    const key = isYearly ? r.date.slice(0, 7) : r.date
    waterMap.set(key, (waterMap.get(key) ?? 0) + r.amount)
  }

  const weightMap = new Map<string, { weight: number; count: number }>()
  for (const r of weightRows) {
    const key = isYearly ? r.date.slice(0, 7) : r.date
    const prev = weightMap.get(key) ?? { weight: 0, count: 0 }
    weightMap.set(key, { weight: prev.weight + r.weight, count: prev.count + 1 })
  }

  const calorieData = dateRange.dates.map((d) => ({
    date: d.label,
    calories: Math.round(calorieMap.get(d.value) ?? 0),
    ...(isYearly && {
      goal: user.calorieBudget * getDaysInMonth(parse(d.value, 'yyyy-MM', new Date())),
    }),
  }))

  const nutritionData = dateRange.dates.map((d) => {
    const row = nutritionMap.get(d.value)
    return {
      date: d.label,
      protein: Math.round(row?.protein ?? 0),
      carbs: Math.round(row?.carbs ?? 0),
      fat: Math.round(row?.fat ?? 0),
    }
  })

  const waterData = dateRange.dates.map((d) => ({
    date: d.label,
    amount: waterMap.get(d.value) ?? 0,
    ...(isYearly && {
      goal: user.waterGoal * getDaysInMonth(parse(d.value, 'yyyy-MM', new Date())),
    }),
  }))

  const weightData = dateRange.dates.map((d) => {
    const entry = weightMap.get(d.value)
    return {
      date: d.label,
      weight: entry ? Math.round(entry.weight / entry.count) : null,
    }
  })

  const currentWeight = latestWeight?.weight ?? user.currentWeight

  return (
    <MainLayout title={t('progress.page-title')} className='space-y-6'>
      <TimeRangeTabs>
        <div className='space-y-6'>
          <CalorieChart data={calorieData} goal={user.calorieBudget} range={range} />
          <NutritionChart data={nutritionData} />
          <WaterChart data={waterData} goal={user.waterGoal} range={range} />
          <WeightChart data={weightData} goal={user.goalWeight} />
        </div>
      </TimeRangeTabs>

      <BmiCard weight={currentWeight} height={user.height} />
    </MainLayout>
  )
}
