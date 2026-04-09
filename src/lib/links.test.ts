import { describe, expect, test } from 'vitest'

import { ADD_FOOD_OPTIONS, NAVBAR_LINKS } from './links'

describe('link configuration', () => {
  test('keeps the primary add action in the main navigation', () => {
    expect(NAVBAR_LINKS.map((link) => link.href)).toStrictEqual([
      '/dashboard',
      '/progress',
      '/add',
      '/chat',
      '/profile',
    ])
  })

  test('offers scan and saved foods entry points from add food', () => {
    expect(
      ADD_FOOD_OPTIONS.map((option) => ({
        href: option.href,
        title: option.title,
        description: option.description,
      })),
    ).toStrictEqual([
      {
        href: '/add/scan',
        title: 'add-food.scan-option-title',
        description: 'add-food.scan-option-description',
      },
      {
        href: '/saved-foods',
        title: 'saved-meals.page-title',
        description: 'add-food.saved-option-description',
      },
    ])
  })
})
