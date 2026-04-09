import { describe, expect, test } from 'vitest'

import { formatDateForTimezone } from './utils'

describe('time utilities', () => {
  test('formats dates in the app timezone instead of the runtime timezone', () => {
    expect(
      formatDateForTimezone('2026-04-09T00:00:00.000+08:00', 'en-US', {
        month: 'short',
        day: 'numeric',
      }),
    ).toBe('Apr 9')
  })
})
