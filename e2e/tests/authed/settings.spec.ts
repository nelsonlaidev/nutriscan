import { expect, test } from '@playwright/test'

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

test('language switch changes UI to Chinese', async ({ page }) => {
  await page.goto('/settings')

  // Open language selector and switch to Chinese
  await page.getByRole('combobox', { name: 'Language' }).click()
  await page.getByRole('option', { name: '繁體中文' }).click()

  // The page should now show Chinese text
  await expect(page.getByRole('heading', { name: '設定' })).toBeVisible()
  await expect(page.getByText('深色模式')).toBeVisible()
  await expect(page.getByText('語言')).toBeVisible()

  // Switch back to English to avoid polluting other tests
  await page.getByRole('combobox', { name: '語言' }).click()
  await page.getByRole('option', { name: 'English' }).click()
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
})

test('language switch persists after navigation', async ({ page }) => {
  await page.goto('/settings')

  await page.getByRole('combobox', { name: 'Language' }).click()
  await page.getByRole('option', { name: '繁體中文' }).click()
  await expect(page.getByRole('heading', { name: '設定' })).toBeVisible()

  // Navigate away and back
  await page.goto('/dashboard')
  await page.goto('/settings')

  // Should still be Chinese
  await expect(page.getByRole('heading', { name: '設定' })).toBeVisible()

  // Clean up
  await page.getByRole('combobox', { name: '語言' }).click()
  await page.getByRole('option', { name: 'English' }).click()
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
  await expect(page.getByLabel('Goal Weight')).toHaveValue('70')
  await expect(page.getByLabel('Height')).toHaveValue('175')
  await expect(page.getByLabel('Birthday')).toHaveValue('1990-06-15')
  await expect(page.getByRole('radio', { name: 'Male', exact: true })).toBeChecked()
})

test('sign out redirects to sign-in page', async ({ page }) => {
  await page.goto('/settings')

  await page.getByRole('button', { name: 'Sign Out' }).click()
  await expect(page).toHaveURL(/\/auth\/sign-in/)
})
