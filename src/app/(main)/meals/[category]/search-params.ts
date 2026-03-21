import { format } from 'date-fns'
import { createSearchParamsCache, parseAsString } from 'nuqs/server'

import { toZonedDate } from '@/lib/utils'

const categoryParsers = {
  date: parseAsString.withDefault(format(toZonedDate(new Date()), 'yyyy-MM-dd')),
}

export const categoryCache = createSearchParamsCache(categoryParsers)
