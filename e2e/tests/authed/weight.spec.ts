import { expect, test } from '@playwright/test'

test('weight page loads with current weight and progress bar', async ({ page }) => {
  await page.goto('/weight')
  await expect(page.getByRole('heading', { name: 'Weight Tracker' })).toBeVisible()
  // Current weight card should display a weight value
  await expect(page.getByTestId('current-weight')).toBeVisible()
  // eslint-disable-next-line sonarjs/slow-regex
  await expect(page.getByTestId('current-weight')).toHaveText(/\d+\.\d kg/)
})

test('weight page shows starting and goal values', async ({ page }) => {
  await page.goto('/weight')
  await expect(page.getByText(/Starting: \d+\.\d kg/)).toBeVisible()
  await expect(page.getByText(/Goal: \d+\.\d kg/)).toBeVisible()
})

test('weight page shows history section', async ({ page }) => {
  await page.goto('/weight')
  await expect(page.getByText('History')).toBeVisible()
})

test('add weight entry and clean up', async ({ page }) => {
  await page.goto('/weight')

  // Use a distinctive value unlikely to exist
  const testWeight = '123.4'

  // Open add weight dialog
  await page.getByRole('button', { name: 'Update Weight' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByText('Enter your current weight in kilograms.')).toBeVisible()
  await expect(page.getByText('Enter a value between 20 and 300 kg')).toBeVisible()

  // Fill in weight and save
  await page.getByLabel('Weight (kg)').fill(testWeight)
  await page.getByRole('button', { name: 'Save' }).click()

  // Dialog closes, new entry appears
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.getByText(`${testWeight} kg`).first()).toBeVisible()

  // Current weight should reflect the new value
  await expect(page.getByTestId('current-weight')).toHaveText(`${testWeight} kg`)

  // Clean up: delete the entry we just added
  const entryRow = page
    .getByTestId('weight-entry')
    .filter({ hasText: `${testWeight} kg` })
    .first()
  await entryRow.getByRole('button', { name: 'Entry options' }).click()
  await page.getByRole('menuitem', { name: 'Delete' }).click()
  await expect(page.getByTestId('weight-entry').filter({ hasText: `${testWeight} kg` })).toHaveCount(0)
})

test('edit weight entry and restore original value', async ({ page }) => {
  await page.goto('/weight')

  // Read the original weight of the first entry before editing
  const firstEntry = page.locator('[data-testid="current-weight"]')
  const originalText = await firstEntry.textContent()
  const originalWeight = originalText?.replace(' kg', '') ?? ''

  // Open the options menu on the first entry
  await page.getByRole('button', { name: 'Entry options' }).first().click()
  await page.getByRole('menuitem', { name: 'Edit' }).click()

  // Edit dialog should open
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByText('Edit Weight')).toBeVisible()

  // Change weight to a distinctive value
  const testWeight = '234.5'
  const input = page.getByLabel('Weight (kg)')
  await input.clear()
  await input.fill(testWeight)
  await page.getByRole('button', { name: 'Save' }).click()

  // Dialog closes, updated value visible
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.getByText(`${testWeight} kg`).first()).toBeVisible()

  // Restore original value
  await page.getByRole('button', { name: 'Entry options' }).first().click()
  await page.getByRole('menuitem', { name: 'Edit' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  const restoreInput = page.getByLabel('Weight (kg)')
  await restoreInput.clear()
  await restoreInput.fill(originalWeight)
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('dialog')).not.toBeVisible()
})

test('delete weight entry via dropdown menu', async ({ page }) => {
  await page.goto('/weight')

  // Add an entry first so we know what to delete
  const testWeight = '199.9'
  await page.getByRole('button', { name: 'Update Weight' }).click()
  await page.getByLabel('Weight (kg)').fill(testWeight)
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.getByText(`${testWeight} kg`).first()).toBeVisible()

  // Delete it via the dropdown
  const entryRow = page
    .getByTestId('weight-entry')
    .filter({ hasText: `${testWeight} kg` })
    .first()
  await entryRow.getByRole('button', { name: 'Entry options' }).click()
  await page.getByRole('menuitem', { name: 'Delete' }).click()

  // Entry should be gone from history
  await expect(page.getByTestId('weight-entry').filter({ hasText: `${testWeight} kg` })).toHaveCount(0)
})

test('weight history shows change badges', async ({ page }) => {
  await page.goto('/weight')

  // Seed data has multiple entries with varying weights, so change badges should exist
  // Change badges show "+X.X kg" or "-X.X kg"
  await expect(page.getByText(/[+-]\d+\.\d kg/).first()).toBeVisible()
})
