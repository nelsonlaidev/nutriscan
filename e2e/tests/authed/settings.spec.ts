import { expect, test } from '@playwright/test'

import { TEST_USER } from '@/lib/constants'

import { capitalize } from '../../utils'

test('settings page loads and shows title', async ({ page }) => {
  await page.goto('/settings')
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
})

test('settings displays user name and email', async ({ page }) => {
  await page.goto('/settings')
  await expect(page.getByText('Test', { exact: true })).toBeVisible()
  await expect(page.getByText('test@example.com')).toBeVisible()
})

test('dark mode toggle switches theme', async ({ page }) => {
  await page.goto('/settings')

  const themeSwitch = page.getByRole('switch', { name: 'Dark Mode' })
  await expect(themeSwitch).toBeVisible()

  // Toggle dark mode on
  await themeSwitch.click()
  await expect(page.locator('html')).toHaveClass(/dark/)

  // Toggle dark mode off
  await themeSwitch.click()
  await expect(page.locator('html')).not.toHaveClass(/dark/)
})

test('dark mode persists after navigation', async ({ page }) => {
  await page.goto('/settings')

  const themeSwitch = page.getByRole('switch', { name: 'Dark Mode' })
  await themeSwitch.click()
  await expect(page.locator('html')).toHaveClass(/dark/)

  // Navigate away and back
  await page.goto('/dashboard')
  await page.goto('/settings')

  await expect(page.locator('html')).toHaveClass(/dark/)

  // Clean up: toggle back to light
  await page.getByRole('switch', { name: 'Dark Mode' }).click()
})

test('personal details link navigates to form', async ({ page }) => {
  await page.goto('/settings')

  await page.locator('a[href="/settings/personal-details"]').click()
  await expect(page).toHaveURL(/\/settings\/personal-details/)
  await expect(page.getByRole('heading', { name: 'Personal Details' })).toBeVisible()
})

test('personal details form is pre-filled with seed data', async ({ page }) => {
  await page.goto('/settings/personal-details')

  await expect(page.getByLabel('Current Weight')).toHaveValue(/\d+/)
  await expect(page.getByLabel('Goal Weight')).toHaveValue(String(TEST_USER.goalWeight))
  await expect(page.getByLabel('Height')).toHaveValue(String(TEST_USER.height))
  await expect(page.getByLabel('Birthday')).toHaveValue(TEST_USER.birthday)
  await expect(page.getByRole('radio', { name: capitalize(TEST_USER.gender), exact: true })).toBeChecked()
})
