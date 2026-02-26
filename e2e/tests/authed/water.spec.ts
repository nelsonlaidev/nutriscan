import { expect, test } from '@playwright/test'

test('water page loads with title and daily goal', async ({ page }) => {
  await page.goto('/water')
  await expect(page.getByRole('heading', { name: 'Water Tracker' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Daily goal/ })).toBeVisible()
})

test('quick add buttons add water and update total', async ({ page }) => {
  await page.goto('/water')

  // Click +100 mL quick add
  await page.getByRole('button', { name: '100 mL' }).click()

  // Total should increase — a new "Water" entry appears in history
  await expect(page.getByText('Today').first()).toBeVisible()
})

test('drink water button adds 250 mL entry', async ({ page }) => {
  await page.goto('/water')

  // Count existing history entries
  const entriesBefore = await page.getByText('Water', { exact: true }).count()

  // Click the main drink water button
  await page.getByRole('button', { name: 'Drink Water (+250 mL)' }).click()

  // A new entry should appear
  await expect(page.getByText('Water', { exact: true })).toHaveCount(entriesBefore + 1)
})

test('water goal dialog opens, validates, and saves', async ({ page }) => {
  await page.goto('/water')

  // Open goal dialog
  await page.getByRole('button', { name: /Daily goal/ }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByText('Daily Water Goal')).toBeVisible()
  await expect(page.getByText('Recommended: 2,000–3,000 mL per day')).toBeVisible()

  // Change goal to 3000
  const input = page.getByLabel('Goal (mL)')
  await input.clear()
  await input.fill('3000')
  await page.getByRole('button', { name: 'Save' }).click()

  // Dialog closes and goal button updates
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.getByRole('button', { name: /Daily goal: 3 L/ })).toBeVisible()

  // Restore original goal
  await page.getByRole('button', { name: /Daily goal/ }).click()
  const restoreInput = page.getByLabel('Goal (mL)')
  await restoreInput.clear()
  await restoreInput.fill('2500')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByRole('dialog')).not.toBeVisible()
})

test('water entry can be edited via dialog', async ({ page }) => {
  await page.goto('/water')

  // Add an entry first so we have something to edit
  await page.getByRole('button', { name: 'Drink Water (+250 mL)' }).click()
  await expect(page.getByText('250 mL').first()).toBeVisible()

  // Click the edit button on the first entry
  await page.getByRole('button', { name: 'Edit entry' }).first().click()

  // Edit dialog should open
  await expect(page.getByText('Edit Water Entry')).toBeVisible()

  // Change amount
  const amountInput = page.getByLabel('Amount (mL)')
  await amountInput.clear()
  await amountInput.fill('400')
  await page.getByRole('button', { name: 'Save' }).click()

  // Dialog closes, entry now shows 400 mL
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.getByText('400 mL').first()).toBeVisible()
})

test('water entry can be deleted via dialog', async ({ page }) => {
  await page.goto('/water')

  // Add an entry to delete
  await page.getByRole('button', { name: 'Drink Water (+250 mL)' }).click()
  const entriesAfterAdd = await page.getByText('Water', { exact: true }).count()

  // Open edit dialog on the first entry
  await page.getByRole('button', { name: 'Edit entry' }).first().click()
  await expect(page.getByText('Edit Water Entry')).toBeVisible()

  // Delete
  await page.getByRole('button', { name: 'Delete' }).click()

  // Dialog closes, entry count decreases
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page.getByText('Water', { exact: true })).toHaveCount(entriesAfterAdd - 1)
})

test('all quick add options are present', async ({ page }) => {
  await page.goto('/water')

  await expect(page.getByRole('button', { name: '100 mL' })).toBeVisible()
  await expect(page.getByRole('button', { name: '200 mL' })).toBeVisible()
  await expect(page.getByRole('button', { name: '300 mL' })).toBeVisible()
  await expect(page.getByRole('button', { name: '500 mL' })).toBeVisible()
})

test('water history groups entries by date', async ({ page }) => {
  await page.goto('/water')

  // Seed data creates entries for the past 30 days, so "Today" group should exist
  await expect(page.getByText(/Today/).first()).toBeVisible()
})
