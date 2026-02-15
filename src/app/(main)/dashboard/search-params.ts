import { format } from 'date-fns'
import { createSearchParamsCache, parseAsString } from 'nuqs/server'

export const dashboardParsers = {
  date: parseAsString.withDefault(format(new Date(), 'yyyy-MM-dd'))
}

export const dashboardCache = createSearchParamsCache(dashboardParsers)
