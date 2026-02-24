import { format } from 'date-fns'
import { createSearchParamsCache, parseAsString } from 'nuqs/server'

import { toZonedDate } from '@/lib/utils'

export const dashboardParsers = {
  date: parseAsString.withDefault(format(toZonedDate(new Date()), 'yyyy-MM-dd'))
}

export const dashboardCache = createSearchParamsCache(dashboardParsers)
