import type { MealCategory, TimeRange } from '@/types'
import type { UIMessage } from 'ai'

import { TZDate } from '@date-fns/tz'
import { type ClassValue, clsx } from 'clsx'
import {
  addDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfDay,
  format,
  startOfDay,
  subDays,
  subYears
} from 'date-fns'
import { twMerge } from 'tailwind-merge'

import { DEFAULT_TIMEZONE } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMl(ml: number) {
  return ml >= 1000 ? `${(ml / 1000).toFixed(1).replace(/\.0$/, '')} L` : `${ml} mL`
}

export type DateRange = {
  dates: Array<{ label: string; value: string }>
  startOfDay: Date
  endOfDay: Date
}

export function getDateRange(range: TimeRange, timezone = DEFAULT_TIMEZONE): DateRange {
  const todayStart = toZonedDate(new Date(), timezone)
  todayStart.setHours(0, 0, 0, 0)

  let startDate: Date
  let formatStr: string

  switch (range) {
    case 'weekly': {
      startDate = subDays(todayStart, 6)
      formatStr = 'EEE' // e.g., "Mon"
      break
    }
    case 'monthly': {
      startDate = subDays(todayStart, 29)
      formatStr = 'M/d' // e.g., "10/24"
      break
    }
    case 'yearly': {
      startDate = subYears(todayStart, 1)
      const months = eachMonthOfInterval({ start: startDate, end: todayStart })
      return {
        dates: months.map((month) => ({
          label: format(month, 'MMM'),
          value: format(month, 'yyyy-MM')
        })),
        startOfDay: toZonedDate(startDate, timezone),
        endOfDay: addDays(toZonedDate(todayStart, timezone), 1)
      }
    }
    default: {
      throw new Error('Invalid time range')
    }
  }

  const days = eachDayOfInterval({
    start: startDate,
    end: todayStart
  })

  const firstDay = days[0]
  const lastDay = days.at(-1)

  if (!firstDay || !lastDay) {
    throw new Error('Could not calculate date intervals')
  }

  return {
    dates: days.map((day) => ({
      label: format(day, formatStr),
      value: format(day, 'yyyy-MM-dd')
    })),
    startOfDay: toZonedDate(firstDay, timezone),
    endOfDay: addDays(toZonedDate(lastDay, timezone), 1)
  }
}

export function toZonedDate(date: Date | string, timezone = DEFAULT_TIMEZONE) {
  return new TZDate(date instanceof Date ? date : new Date(date), timezone)
}

export type DayRange = {
  startOfDay: Date
  endOfDay: Date
}

export function getDayRange(date: string, timezone = DEFAULT_TIMEZONE): DayRange {
  const day = toZonedDate(date, timezone)

  return {
    startOfDay: startOfDay(day),
    endOfDay: endOfDay(day)
  }
}

type FoodEntry = {
  calories: number
  protein: number
  carbs: number
  fat: number
  mealCategory: MealCategory
}

export function computeTotals(entries: FoodEntry[]) {
  let calories = 0
  let protein = 0
  let carbs = 0
  let fat = 0

  for (const entry of entries) {
    calories += entry.calories
    protein += entry.protein
    carbs += entry.carbs
    fat += entry.fat
  }

  return { calories, protein, carbs, fat }
}

export type MealBreakdown = {
  category: MealCategory
  items: number
  calories: number
}

export function computeMealBreakdowns(entries: FoodEntry[]): MealBreakdown[] {
  const categories: MealCategory[] = ['breakfast', 'lunch', 'dinner', 'snacks']

  return categories.map((category) => {
    const items = entries.filter((e) => e.mealCategory === category)

    let calories = 0

    for (const item of items) {
      calories += item.calories
    }

    return { category, items: items.length, calories: Math.round(calories) }
  })
}

export function getTextFromMessage(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => (part as { type: 'text'; text: string }).text)
    .join('')
}
