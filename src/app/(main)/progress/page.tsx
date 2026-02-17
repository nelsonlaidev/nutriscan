import type { SearchParams } from 'nuqs/server'

import { differenceInDays, format, subDays, subMonths, subYears } from 'date-fns'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { PageTitle } from '@/components/page-title'
import { BmiCard } from '@/components/progress/bmi-card'
import { CalorieChart } from '@/components/progress/calorie-chart'
import { NutritionChart } from '@/components/progress/nutrition-chart'
import { TimeRangeTabs } from '@/components/progress/time-range-tabs'
import { WaterChart } from '@/components/progress/water-chart'
import { WeightChart } from '@/components/progress/weight-chart'
import { getCalorieTotalsByDate, getNutritionTotalsByDate } from '@/data/food-entries'
import { getWaterTotalsByDate } from '@/data/water-entries'
import { getLatestWeight, getLatestWeightBefore, getWeightEntriesByDateRange } from '@/data/weight-entries'
import { getSession } from '@/lib/auth'

import { progressCache } from './search-params'

type TimeRange = 'weekly' | 'monthly' | 'yearly'

type ProgressPageProps = {
  searchParams: Promise<SearchParams>
}

function getDateRange(range: TimeRange) {
  const today = new Date()
  const endDate = format(today, 'yyyy-MM-dd')

  let start: Date
  switch (range) {
    case 'weekly': {
      start = subDays(today, 6)
      break
    }
    case 'monthly': {
      start = subMonths(today, 1)
      break
    }
    case 'yearly': {
      start = subYears(today, 1)
      break
    }
    default: {
      start = subDays(today, 6)
    }
  }

  const startDate = format(start, 'yyyy-MM-dd')
  const days = differenceInDays(today, start) + 1

  return { startDate, endDate, days }
}

function generateDates(startDate: string, days: number) {
  const dates: string[] = []
  const start = new Date(startDate)
  for (let i = 0; i < days; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    dates.push(format(d, 'yyyy-MM-dd'))
  }
  return dates
}

function formatDateLabel(dateStr: string, range: TimeRange) {
  const d = new Date(dateStr)
  switch (range) {
    case 'weekly': {
      return format(d, 'EEE')
    }
    case 'monthly': {
      return format(d, 'M/d')
    }
    case 'yearly': {
      return format(d, 'MMM')
    }
    default: {
      return format(d, 'EEE')
    }
  }
}

function buildWeightTimeline(dates: string[], weightMap: Map<string, number>, initialWeight: number, range: TimeRange) {
  const result: Array<{ date: string; weight: number }> = []
  let carry = initialWeight
  for (const d of dates) {
    carry = weightMap.get(d) ?? carry
    result.push({ date: formatDateLabel(d, range), weight: carry })
  }
  return result
}

export default async function ProgressPage({ searchParams }: ProgressPageProps) {
  const session = await getSession()
  if (!session) redirect('/')

  const { user } = session
  const t = await getTranslations()

  const { range } = await progressCache.parse(searchParams)
  const { startDate, endDate, days } = getDateRange(range)
  const dates = generateDates(startDate, days)

  const [calorieRows, nutritionRows, waterRows, weightRows, latestWeight, weightBefore] = await Promise.all([
    getCalorieTotalsByDate(user.id, dates),
    getNutritionTotalsByDate(user.id, dates),
    getWaterTotalsByDate(user.id, dates),
    getWeightEntriesByDateRange(user.id, startDate, endDate),
    getLatestWeight(user.id),
    getLatestWeightBefore(user.id, startDate)
  ])

  // Build lookup maps
  const calorieMap = new Map(calorieRows.map((r) => [r.date, r.calories]))
  const nutritionMap = new Map(nutritionRows.map((r) => [r.date, r]))
  const waterMap = new Map(waterRows.map((r) => [r.date, r.amount]))

  // For yearly, sample ~12 points instead of 365
  const displayDates = range === 'yearly' ? dates.filter((_, i) => i % 30 === 0 || i === dates.length - 1) : dates

  const calorieData = displayDates.map((d) => ({
    date: formatDateLabel(d, range),
    calories: Math.round(calorieMap.get(d) ?? 0)
  }))

  const nutritionData = displayDates.map((d) => {
    const row = nutritionMap.get(d)
    return {
      date: formatDateLabel(d, range),
      protein: Math.round(row?.protein ?? 0),
      carbs: Math.round(row?.carbs ?? 0),
      fat: Math.round(row?.fat ?? 0)
    }
  })

  const waterData = displayDates.map((d) => ({
    date: formatDateLabel(d, range),
    amount: waterMap.get(d) ?? 0
  }))

  // Build weight data across all display dates, carrying forward the last known value.
  // First-time user with no entries → flat line at their currentWeight.
  // Use the latest weight before the range as carry-forward initial value.
  // Falls back to the earliest entry in range, then user.currentWeight.
  const weightMap = new Map(weightRows.map((r) => [r.date, r.weight]))
  const initialWeight = weightBefore?.weight ?? weightRows.at(0)?.weight ?? user.currentWeight
  const weightData = buildWeightTimeline(displayDates, weightMap, initialWeight, range)

  const currentWeight = latestWeight?.weight ?? user.currentWeight

  return (
    <div className='space-y-6'>
      <PageTitle title={t('progress.page-title')} />

      <TimeRangeTabs>
        <div className='space-y-6'>
          <CalorieChart data={calorieData} goal={user.calorieBudget} />
          <NutritionChart data={nutritionData} />
          <WaterChart data={waterData} goal={user.waterGoal} />
          <WeightChart data={weightData} goal={user.goalWeight} />
        </div>
      </TimeRangeTabs>

      <BmiCard weight={currentWeight} height={user.height} />
    </div>
  )
}
