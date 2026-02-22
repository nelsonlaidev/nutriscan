/**
 * Timezone-aware date utilities.
 */

/**
 * Formats a Date to yyyy-MM-dd in the given timezone.
 */
function toLocalDateString(date: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date)

  const year = parts.find((p) => p.type === 'year')?.value ?? '1970'
  const month = parts.find((p) => p.type === 'month')?.value ?? '01'
  const day = parts.find((p) => p.type === 'day')?.value ?? '01'

  return `${year}-${month}-${day}`
}

/**
 * Returns today's date as yyyy-MM-dd in the given timezone.
 */
export function getCurrentLocalDate(timezone: string): string {
  return toLocalDateString(new Date(), timezone)
}
