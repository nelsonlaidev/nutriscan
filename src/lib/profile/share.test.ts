import { describe, expect, test } from 'vitest'

import { createProfileShareFilename, getWeightGoalDelta } from './share'

describe('profile share helpers', () => {
  test('creates a stable, slugged filename for generated images', () => {
    expect(createProfileShareFilename('Jane Doe', new Date('2026-04-10T08:00:00.000Z'))).toBe(
      'nutriscan-jane-doe-stats-2026-04-10.png',
    )
  })

  test('reports when weight needs to move down toward the goal', () => {
    expect(getWeightGoalDelta(82.4, 76)).toStrictEqual({
      delta: 6.4,
      direction: 'down',
    })
  })

  test('reports when the goal has already been reached', () => {
    expect(getWeightGoalDelta(70, 70)).toStrictEqual({
      delta: 0,
      direction: 'steady',
    })
  })
})
