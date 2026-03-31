import type { Page } from '@playwright/test'

import { expect, test } from '@playwright/test'

test.use({ storageState: 'e2e/.auth/clean-user.json' })

async function answerQuestion(page: Page, choices: string | string[]) {
  await Promise.all(
    (Array.isArray(choices) ? choices : [choices]).map(async (choice) =>
      page.getByRole('button', { name: choice }).click(),
    ),
  )

  await page.getByRole('button', { name: 'Check' }).click()
  await page.getByRole('button', { name: /Continue|Finish lesson/ }).click()
}

test('learn mode unlocks lessons, refreshes overview cards, and keeps later lessons locked after a failed run', async ({
  page,
}) => {
  await page.goto('/learn/calories_portions_2')
  await expect(page).toHaveURL(/\/learn\?locked=calories_portions_2/)
  await expect(page.getByText('That lesson is still locked')).toBeVisible()

  await page.goto('/dashboard')
  await page.getByTestId('learn-progress-card').getByRole('link', { name: 'Continue lesson' }).click()
  await expect(page).toHaveURL(/\/learn\/calories_portions_1/)

  await answerQuestion(page, 'A unit of energy')
  await answerQuestion(page, 'Calorie needs vary from person to person')
  await answerQuestion(page, ['Water', 'Black coffee'])
  await answerQuestion(page, 'False')
  await answerQuestion(page, 'Activity, body size, and goals can all shift your needs')

  await expect(page.getByTestId('learn-result')).toContainText('Nice work')
  await expect(page.getByTestId('learn-result')).toContainText('+15')
  await expect(page.getByText('You unlocked 1 new lessons.')).toBeVisible()

  await page.getByRole('link', { name: 'Back to lesson path' }).click()
  await expect(page.getByTestId('lesson-node-calories_portions_1')).toHaveAttribute('data-status', 'mastered')
  await expect(page.getByTestId('lesson-node-calories_portions_2')).toHaveAttribute('data-status', 'available')

  await page.goto('/dashboard')
  await expect(page.getByTestId('learn-progress-card')).toContainText('15')
  await expect(page.getByTestId('learn-progress-card')).toContainText('1/12')

  await page.goto('/profile')
  await expect(page.getByTestId('learning-section')).toContainText('15')

  await page.goto('/learn/calories_portions_2')
  await answerQuestion(page, 'Water adds the most calories')
  await answerQuestion(page, 'Double the fried side dish')
  await answerQuestion(page, 'Add extra creamy sauce')

  await expect(page.getByTestId('learn-result')).toContainText('Good practice round')
  await page.getByRole('link', { name: 'Back to lesson path' }).click()

  await expect(page.getByTestId('lesson-node-calories_portions_2')).toHaveAttribute('data-status', 'available')
  await expect(page.getByTestId('lesson-node-calories_portions_3')).toHaveAttribute('data-status', 'locked')
})
