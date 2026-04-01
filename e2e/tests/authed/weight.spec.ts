import { expect, test } from '@playwright/test'
import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { users } from '@/db/schemas/auth.schema'
import { weightEntries } from '@/db/schemas/weight-entry.schema'
import { TEST_USER_CLEAN } from '@/lib/constants'

test.use({ storageState: 'e2e/.auth/clean-user.json' })

test.describe.configure({ mode: 'serial' })

const INITIAL_WEIGHT = '72.0'

async function resetWeightState() {
  const today = new Date()
  today.setHours(9, 0, 0, 0)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const twoDaysAgo = new Date(today)
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

  await db.delete(weightEntries).where(eq(weightEntries.userId, TEST_USER_CLEAN.id))

  await db
    .update(users)
    .set({
      currentWeight: TEST_USER_CLEAN.currentWeight,
      startingWeight: TEST_USER_CLEAN.startingWeight,
      goalWeight: TEST_USER_CLEAN.goalWeight,
    })
    .where(eq(users.id, TEST_USER_CLEAN.id))

  await db.insert(weightEntries).values([
    {
      userId: TEST_USER_CLEAN.id,
      weight: 72,
      createdAt: today,
    },
    {
      userId: TEST_USER_CLEAN.id,
      weight: 72.4,
      createdAt: yesterday,
    },
    {
      userId: TEST_USER_CLEAN.id,
      weight: 72.8,
      createdAt: twoDaysAgo,
    },
  ])
}

test.beforeEach(async () => {
  await resetWeightState()
})

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
  const dialog = page.getByRole('dialog', { name: 'Update Weight' })

  // Open add weight dialog
  await page.getByRole('button', { name: 'Update Weight' }).click()
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('Enter your current weight in kilograms.')).toBeVisible()
  await expect(dialog.getByText('Enter a value between 20 and 300 kg')).toBeVisible()

  // Fill in weight and save
  await dialog.getByLabel('Weight (kg)').fill(testWeight)
  await dialog.getByRole('button', { name: 'Save' }).click()

  // Dialog closes, new entry appears
  await expect(dialog).not.toBeVisible()
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

  const originalWeight = INITIAL_WEIGHT
  const updatedWeight = '234.5'
  const dialog = page.getByRole('dialog', { name: 'Edit Weight' })
  let entryRow = page
    .getByTestId('weight-entry')
    .filter({ hasText: `${originalWeight} kg` })
    .first()

  // Open the options menu on the specific entry we want to edit
  await entryRow.getByRole('button', { name: 'Entry options' }).click()
  await page.getByRole('menuitem', { name: 'Edit' }).click()

  // Edit dialog should open
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText('Update the weight for this entry.')).toBeVisible()

  // Change weight to a distinctive value
  const input = dialog.getByLabel('Weight (kg)')
  await input.clear()
  await input.fill(updatedWeight)
  await dialog.getByRole('button', { name: 'Save' }).click()

  // Dialog closes, updated value visible
  await expect(dialog).not.toBeVisible()
  entryRow = page
    .getByTestId('weight-entry')
    .filter({ hasText: `${updatedWeight} kg` })
    .first()
  await expect(entryRow).toBeVisible()
  await expect(page.getByTestId('current-weight')).toHaveText(`${updatedWeight} kg`)

  // Restore original value
  await entryRow.getByRole('button', { name: 'Entry options' }).click()
  await page.getByRole('menuitem', { name: 'Edit' }).click()
  await expect(dialog).toBeVisible()
  const restoreInput = dialog.getByLabel('Weight (kg)')
  await restoreInput.clear()
  await restoreInput.fill(originalWeight)
  await dialog.getByRole('button', { name: 'Save' }).click()
  await expect(dialog).not.toBeVisible()
  await expect(page.getByTestId('current-weight')).toHaveText(`${originalWeight} kg`)
})

test('delete weight entry via dropdown menu', async ({ page }) => {
  await page.goto('/weight')

  // Add an entry first so we know what to delete
  const testWeight = '199.9'
  const dialog = page.getByRole('dialog', { name: 'Update Weight' })
  await page.getByRole('button', { name: 'Update Weight' }).click()
  await dialog.getByLabel('Weight (kg)').fill(testWeight)
  await dialog.getByRole('button', { name: 'Save' }).click()
  await expect(dialog).not.toBeVisible()
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
