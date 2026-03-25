import type { UIMessage } from 'ai'
import type { ClassValue } from 'clsx'
import type { TimeRange } from '@/types'

import { TZDate } from '@date-fns/tz'
import { clsx } from 'clsx'
import {
  addDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfDay,
  format,
  startOfDay,
  subDays,
  subYears,
} from 'date-fns'
import { twMerge } from 'tailwind-merge'

import { DEFAULT_TIMEZONE } from './time'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMl(ml: number) {
  return ml >= 1000 ? `${(ml / 1000).toFixed(1).replace(/\.0$/, '')} L` : `${ml} mL`
}

export function getDateBucket(date: Date | string, timezone = DEFAULT_TIMEZONE) {
  return format(toZonedDate(date, timezone), 'yyyy-MM-dd')
}

export type DateRange = {
  dates: Array<{ label: string; value: string }>
  startOfDay: string
  endOfDay: string
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
          value: format(month, 'yyyy-MM'),
        })),
        startOfDay: toZonedDate(startDate, timezone).toISOString(),
        endOfDay: addDays(toZonedDate(todayStart, timezone), 1).toISOString(),
      }
    }
    default: {
      throw new Error('Invalid time range')
    }
  }

  const days = eachDayOfInterval({
    start: startDate,
    end: todayStart,
  })

  const firstDay = days[0]
  const lastDay = days.at(-1)

  if (!firstDay || !lastDay) {
    throw new Error('Could not calculate date intervals')
  }

  return {
    dates: days.map((day) => ({
      label: format(day, formatStr),
      value: format(day, 'yyyy-MM-dd'),
    })),
    startOfDay: toZonedDate(firstDay, timezone).toISOString(),
    endOfDay: addDays(toZonedDate(lastDay, timezone), 1).toISOString(),
  }
}

export function toZonedDate(date: Date | string, timezone = DEFAULT_TIMEZONE) {
  return new TZDate(date instanceof Date ? date : new Date(date), timezone)
}

export type DayRange = {
  startOfDay: string
  endOfDay: string
}

export function getDayRange(date: string = new Date().toISOString(), timezone = DEFAULT_TIMEZONE): DayRange {
  const day = toZonedDate(date, timezone)

  return {
    startOfDay: startOfDay(day).toISOString(),
    endOfDay: endOfDay(day).toISOString(),
  }
}

export function getTextFromMessage(message: UIMessage): string {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => part.text)
    .join('')
}
