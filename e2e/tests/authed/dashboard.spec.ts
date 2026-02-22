import { expect, test } from '@playwright/test'

test('dashboard loads for authenticated user', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/dashboard/)
})

test('dashboard shows the user name', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page.getByRole('heading', { name: 'Test' })).toBeVisible()
})

test('dashboard shows calorie summary', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page.locator('text=kcal').first()).toBeVisible()
})
