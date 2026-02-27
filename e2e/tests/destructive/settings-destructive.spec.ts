import { expect, test } from '@playwright/test'

// These tests mutate shared DB state (locale, session) and must run
// serially AFTER all other authenticated tests have finished.
// The "destructive" project in playwright.config.ts depends on "authenticated".
test.describe.configure({ mode: 'serial' })

test('language switch changes UI to Chinese', async ({ page }) => {
  await page.goto('/settings')

  await page.getByRole('combobox', { name: 'Language' }).click()
  await page.getByRole('option', { name: '繁體中文' }).click()

  await expect(page.getByRole('heading', { name: '設定' })).toBeVisible()
  await expect(page.getByText('深色模式')).toBeVisible()
  await expect(page.getByText('語言')).toBeVisible()
})

test('language switch persists after navigation', async ({ page }) => {
  await page.goto('/settings')

  // Should still be Chinese from the previous test
  await expect(page.getByRole('heading', { name: '設定' })).toBeVisible()

  await page.goto('/dashboard')
  await page.goto('/settings')

  await expect(page.getByRole('heading', { name: '設定' })).toBeVisible()
})

test('restore locale to English', async ({ page }) => {
  await page.goto('/settings')

  await page.getByRole('combobox').first().click()
  await page.getByRole('option', { name: 'English' }).click()
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
})

// Sign out MUST be the last test — it destroys the session in the DB,
// making the shared auth token invalid for any subsequent test.
test('sign out redirects to sign-in page', async ({ page }) => {
  await page.goto('/settings')

  await page.getByRole('button', { name: 'Sign Out' }).click()
  await expect(page).toHaveURL(/\/auth\/sign-in/)
})
