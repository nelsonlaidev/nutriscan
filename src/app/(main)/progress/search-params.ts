import { createSearchParamsCache, parseAsStringLiteral } from 'nuqs/server'

export const timeRanges = ['weekly', 'monthly', 'yearly'] as const
export const progressParsers = {
  range: parseAsStringLiteral(timeRanges).withDefault('weekly'),
}

export const progressCache = createSearchParamsCache(progressParsers)
