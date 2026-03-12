import type { DateRange } from '@/lib/utils'

import { and, desc, eq, gte, lte, sql } from 'drizzle-orm'

import { db } from '@/db'
import { foodEntries, waterEntries, weightEntries } from '@/db/schemas'

type CaloriesChartData = Array<{
  date: string
  calories: number
}>

export async function getCalorieChartData(userId: string, dateRange: DateRange): Promise<CaloriesChartData> {
  if (dateRange.dates.length === 0) return []

  const date = sql<string>`${foodEntries.createdAt}::date`.as('date')

  const rows = await db
    .select({
      date,
      calories: sql<number>`sum(${foodEntries.calories})::integer`.as('calories')
    })
    .from(foodEntries)
    .where(
      and(
        eq(foodEntries.userId, userId),
        gte(foodEntries.createdAt, dateRange.startOfDay),
        lte(foodEntries.createdAt, dateRange.endOfDay)
      )
    )
    .groupBy(date)
    .orderBy(desc(date))

  return rows
}

type NutritionChartData = Array<{
  date: string
  protein: number
  carbs: number
  fat: number
}>

export async function getNutritionChartData(userId: string, dateRange: DateRange): Promise<NutritionChartData> {
  if (dateRange.dates.length === 0) return []

  const date = sql<string>`${foodEntries.createdAt}::date`.as('date')

  const rows = await db
    .select({
      date,
      protein: sql<number>`sum(${foodEntries.protein})::integer`.as('protein'),
      carbs: sql<number>`sum(${foodEntries.carbs})::integer`.as('carbs'),
      fat: sql<number>`sum(${foodEntries.fat})::integer`.as('fat')
    })
    .from(foodEntries)
    .where(
      and(
        eq(foodEntries.userId, userId),
        gte(foodEntries.createdAt, dateRange.startOfDay),
        lte(foodEntries.createdAt, dateRange.endOfDay)
      )
    )
    .groupBy(date)
    .orderBy(desc(date))

  return rows
}

export type WaterChartData = Array<{
  date: string
  amount: number
}>

export async function getWaterChartData(userId: string, dateRange: DateRange): Promise<WaterChartData> {
  if (dateRange.dates.length === 0) return []

  const date = sql<string>`${waterEntries.createdAt}::date`.as('date')

  const rows = await db
    .select({
      date,
      amount: sql<number>`SUM(${waterEntries.amount})::integer`.as('amount')
    })
    .from(waterEntries)
    .where(
      and(
        eq(waterEntries.userId, userId),
        gte(waterEntries.createdAt, dateRange.startOfDay),
        lte(waterEntries.createdAt, dateRange.endOfDay)
      )
    )
    .groupBy(date)
    .orderBy(desc(date))

  return rows
}

export async function getWeightEntriesByDateRange(userId: string, dateRange: DateRange) {
  if (dateRange.dates.length === 0) return []

  const date = sql<string>`${weightEntries.createdAt}::date`.as('date')

  const rows = await db
    .selectDistinctOn([date], {
      date,
      weight: weightEntries.weight
    })
    .from(weightEntries)
    .where(
      and(
        eq(weightEntries.userId, userId),
        gte(weightEntries.createdAt, dateRange.startOfDay),
        lte(weightEntries.createdAt, dateRange.endOfDay)
      )
    )
    .orderBy(desc(date), desc(weightEntries.createdAt))

  return rows
}
