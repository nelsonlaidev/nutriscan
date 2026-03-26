import { expect, test } from '@playwright/test'

test.use({ storageState: 'e2e/.auth/clean-user.json' })

test('profile editor is prefilled and email is read-only', async ({ page }) => {
  await page.goto('/settings/profile')

  await expect(page.getByRole('heading', { name: 'Edit Profile' })).toBeVisible()
  await expect(page.getByLabel('Display Name')).toHaveValue(/\S+/)
  await expect(page.getByLabel('Email')).toHaveValue('fresh@example.com')
  await expect(page.getByLabel('Email')).toBeDisabled()
})

test('user can update display name from profile editor', async ({ page }) => {
  await page.goto('/settings/profile')

  await page.getByLabel('Display Name').fill('Fresh Profile')
  await page.getByRole('button', { name: 'Save Changes' }).click()

  await expect(page).toHaveURL(/\/settings$/)
  await expect(page.getByText('Fresh Profile', { exact: true })).toBeVisible()

  await page.goto('/profile')
  await expect(page.getByText('Fresh Profile', { exact: true })).toBeVisible()
})
