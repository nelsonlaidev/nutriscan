import { expect, test } from '@playwright/test'

test('profile page loads and shows title', async ({ page }) => {
  await page.goto('/profile')
  await expect(page.getByRole('heading', { name: 'Profile' })).toBeVisible()
})

test('profile displays user name and email', async ({ page }) => {
  await page.goto('/profile')
  await expect(page.getByText('Test', { exact: true })).toBeVisible()
  await expect(page.getByText('test@example.com')).toBeVisible()
})

test('profile displays health metrics', async ({ page }) => {
  await page.goto('/profile')
  await expect(page.getByText('70 kg')).toBeVisible()
  await expect(page.getByText('175 cm')).toBeVisible()
})

test('profile displays member since date', async ({ page }) => {
  await page.goto('/profile')
  await expect(page.getByText('Member since')).toBeVisible()
})

test('settings button navigates to /settings', async ({ page }) => {
  await page.goto('/profile')
  await page.locator('a[href="/settings"]').click()
  await expect(page).toHaveURL(/\/settings/)
})
