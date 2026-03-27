import { expect, test } from '@playwright/test'

test('progress page loads with "Last 7 Days" view by default', async ({ page }) => {
  await page.goto('/progress')
  await expect(page.getByRole('heading', { name: 'Progress' })).toBeVisible()
  await expect(page.getByRole('tab', { name: 'Last 7 Days' })).toHaveAttribute('aria-selected', 'true')
})

test('time range tabs update URL and re-render charts', async ({ page }) => {
  await page.goto('/progress')

  // Switch to Last 30 Days
  await page.getByRole('tab', { name: 'Last 30 Days' }).click()
  await expect(page).toHaveURL(/range=30d/)
  await expect(page.getByRole('tab', { name: 'Last 30 Days' })).toHaveAttribute('aria-selected', 'true')

  // Switch to Last 12 Months
  await page.getByRole('tab', { name: 'Last 12 Months' }).click()
  await expect(page).toHaveURL(/range=12m/)
  await expect(page.getByRole('tab', { name: 'Last 12 Months' })).toHaveAttribute('aria-selected', 'true')

  // Switch back to Last 7 Days
  await page.getByRole('tab', { name: 'Last 7 Days' }).click()
  await expect(page.getByRole('tab', { name: 'Last 7 Days' })).toHaveAttribute('aria-selected', 'true')
})

test('time range persists on page reload', async ({ page }) => {
  await page.goto('/progress')

  await page.getByRole('tab', { name: 'Last 30 Days' }).click()
  await expect(page).toHaveURL(/range=30d/)

  await page.reload()
  await expect(page.getByRole('tab', { name: 'Last 30 Days' })).toHaveAttribute('aria-selected', 'true')
})

test('all four charts are rendered', async ({ page }) => {
  await page.goto('/progress')

  await expect(page.getByText('Calories', { exact: true })).toBeVisible()
  await expect(page.getByText('Nutrition', { exact: true })).toBeVisible()
  await expect(page.getByText('Water Intake')).toBeVisible()
  await expect(page.getByText('Weight Progress')).toBeVisible()
})

test('calorie chart shows goal reference', async ({ page }) => {
  await page.goto('/progress')
  await expect(page.getByText(/Calorie goal: \d+/)).toBeVisible()
})

test('water chart shows goal reference', async ({ page }) => {
  await page.goto('/progress')
  await expect(page.getByText(/Water goal: \d+ mL/)).toBeVisible()
})

test('weight chart shows goal reference', async ({ page }) => {
  await page.goto('/progress')
  await expect(page.getByText(/Weight goal: \d+ kg/)).toBeVisible()
})

test('nutrition chart shows macro legends', async ({ page }) => {
  await page.goto('/progress')

  const nutritionCard = page.locator('section, div').filter({ hasText: 'Nutrition' })
  await expect(nutritionCard.getByText('Protein')).toBeVisible()
  await expect(nutritionCard.getByText('Carbs')).toBeVisible()
  await expect(nutritionCard.getByText('Fat')).toBeVisible()
})

test('BMI card shows computed value and category', async ({ page }) => {
  await page.goto('/progress')

  await expect(page.getByText('BMI')).toBeVisible()
  // Seed: weight ~80kg, height 175cm → BMI ~26.1 → "Overweight"
  // oxlint-disable-next-line sonarjs/slow-regex
  await expect(page.getByText(/\d+\.\d/)).toBeVisible()
  await expect(
    page
      .getByText('Normal')
      .or(page.getByText('Overweight'))
      .or(page.getByText('Underweight'))
      .or(page.getByText('Obese')),
  ).toBeVisible()
})

test('chart type toggle switches between bar and area', async ({ page }) => {
  await page.goto('/progress')

  // Calorie chart defaults to bar — the recharts BarChart renders <rect> elements
  const calorieCard = page.locator('[class*="card"]').filter({ hasText: 'Calorie goal' })
  await expect(calorieCard.locator('.recharts-bar')).toBeVisible()

  // Click area chart toggle
  await calorieCard.getByRole('button', { name: 'Area chart' }).click()

  // Should now show area chart
  await expect(calorieCard.locator('.recharts-area')).toBeVisible()
  await expect(calorieCard.locator('.recharts-bar')).not.toBeVisible()

  // Click bar chart toggle back
  await calorieCard.getByRole('button', { name: 'Bar chart' }).click()
  await expect(calorieCard.locator('.recharts-bar')).toBeVisible()
})

test('direct URL with range param loads correct tab', async ({ page }) => {
  await page.goto('/progress?range=12m')
  await expect(page.getByRole('tab', { name: 'Last 12 Months' })).toHaveAttribute('aria-selected', 'true')
})
