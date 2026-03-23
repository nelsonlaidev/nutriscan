import { and, desc, eq, gte, lte, sql } from 'drizzle-orm'

import { foodEntries, waterEntries, weightEntries } from '@/db/schemas'

import { protectedProcedure } from '../procedures'
import { DateRangeInputSchema } from '../schemas/progress.schema'

const calorieChart = protectedProcedure.input(DateRangeInputSchema).handler(async ({ input, context }) => {
  if (!input.hasDates) return []

  const date = sql<string>`${foodEntries.createdAt}::date`.as('date')

  const rows = await context.db
    .select({
      date,
      calories: sql<number>`sum(${foodEntries.calories})::integer`.as('calories'),
    })
    .from(foodEntries)
    .where(
      and(
        eq(foodEntries.userId, context.session.user.id),
        gte(foodEntries.createdAt, new Date(input.startOfDay)),
        lte(foodEntries.createdAt, new Date(input.endOfDay)),
      ),
    )
    .groupBy(date)
    .orderBy(desc(date))

  return rows
})

const nutritionChart = protectedProcedure.input(DateRangeInputSchema).handler(async ({ input, context }) => {
  if (!input.hasDates) return []

  const date = sql<string>`${foodEntries.createdAt}::date`.as('date')

  const rows = await context.db
    .select({
      date,
      protein: sql<number>`sum(${foodEntries.protein})::integer`.as('protein'),
      carbs: sql<number>`sum(${foodEntries.carbs})::integer`.as('carbs'),
      fat: sql<number>`sum(${foodEntries.fat})::integer`.as('fat'),
    })
    .from(foodEntries)
    .where(
      and(
        eq(foodEntries.userId, context.session.user.id),
        gte(foodEntries.createdAt, new Date(input.startOfDay)),
        lte(foodEntries.createdAt, new Date(input.endOfDay)),
      ),
    )
    .groupBy(date)
    .orderBy(desc(date))

  return rows
})

const waterChart = protectedProcedure.input(DateRangeInputSchema).handler(async ({ input, context }) => {
  if (!input.hasDates) return []

  const date = sql<string>`${waterEntries.createdAt}::date`.as('date')

  const rows = await context.db
    .select({
      date,
      amount: sql<number>`SUM(${waterEntries.amount})::integer`.as('amount'),
    })
    .from(waterEntries)
    .where(
      and(
        eq(waterEntries.userId, context.session.user.id),
        gte(waterEntries.createdAt, new Date(input.startOfDay)),
        lte(waterEntries.createdAt, new Date(input.endOfDay)),
      ),
    )
    .groupBy(date)
    .orderBy(desc(date))

  return rows
})

const weightByDateRange = protectedProcedure.input(DateRangeInputSchema).handler(async ({ input, context }) => {
  if (!input.hasDates) return []

  const date = sql<string>`${weightEntries.createdAt}::date`.as('date')

  const rows = await context.db
    .selectDistinctOn([date], {
      date,
      weight: weightEntries.weight,
    })
    .from(weightEntries)
    .where(
      and(
        eq(weightEntries.userId, context.session.user.id),
        gte(weightEntries.createdAt, new Date(input.startOfDay)),
        lte(weightEntries.createdAt, new Date(input.endOfDay)),
      ),
    )
    .orderBy(desc(date), desc(weightEntries.createdAt))

  return rows
})

export const progressRouter = {
  calorieChart,
  nutritionChart,
  waterChart,
  weightByDateRange,
}
