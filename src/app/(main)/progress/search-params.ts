import { createSearchParamsCache, parseAsStringLiteral } from 'nuqs/server'

import { TIME_RANGES } from '@/lib/constants'

export const progressParsers = {
  range: parseAsStringLiteral(TIME_RANGES).withDefault('7d'),
}

export const progressCache = createSearchParamsCache(progressParsers)
