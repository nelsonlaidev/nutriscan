import type { Metadata } from 'next'

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
  getWeightEntriesByDateRange
} from '@/data/progress'
import { getLatestWeight } from '@/data/weight'
import { getSession } from '@/lib/auth'
import { getDateRange } from '@/lib/utils'

import { progressCache } from './search-params'

export const metadata: Metadata = {
  title: 'Progress'
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
    getLatestWeight(user.id)
  ])

  // Build lookup maps
  const calorieMap = new Map(calorieRows.map((r) => [r.date, r.calories]))
  const nutritionMap = new Map(nutritionRows.map((r) => [r.date, r]))
  const waterMap = new Map(waterRows.map((r) => [r.date, r.amount]))
  const weightMap = new Map(weightRows.map((r) => [r.date, r.weight]))

  const calorieData = dateRange.dates.map((d) => ({
    date: d.label,
    calories: Math.round(calorieMap.get(d.value) ?? 0)
  }))

  const nutritionData = dateRange.dates.map((d) => {
    const row = nutritionMap.get(d.value)
    return {
      date: d.label,
      protein: Math.round(row?.protein ?? 0),
      carbs: Math.round(row?.carbs ?? 0),
      fat: Math.round(row?.fat ?? 0)
    }
  })

  const waterData = dateRange.dates.map((d) => ({
    date: d.label,
    amount: waterMap.get(d.value) ?? 0
  }))

  const weightData = dateRange.dates.map((d) => ({
    date: d.label,
    weight: weightMap.get(d.value) ?? null
  }))

  const currentWeight = latestWeight?.weight ?? user.currentWeight

  return (
    <MainLayout title={t('progress.page-title')} className='space-y-6'>
      <TimeRangeTabs>
        <div className='space-y-6'>
          <CalorieChart data={calorieData} goal={user.calorieBudget} />
          <NutritionChart data={nutritionData} />
          <WaterChart data={waterData} goal={user.waterGoal} />
          <WeightChart data={weightData} goal={user.goalWeight} />
        </div>
      </TimeRangeTabs>

      <BmiCard weight={currentWeight} height={user.height} />
    </MainLayout>
  )
}
