import { expect, test } from '@playwright/test'
import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { achievementUnlocks, foodEntries, users, waterEntries, weightEntries } from '@/db/schemas'
import { TEST_USER_CLEAN } from '@/lib/constants'

test.use({ storageState: 'e2e/.auth/clean-user.json' })

async function resetAchievementState() {
  await db.delete(achievementUnlocks).where(eq(achievementUnlocks.userId, TEST_USER_CLEAN.id))
  await db.delete(foodEntries).where(eq(foodEntries.userId, TEST_USER_CLEAN.id))
  await db.delete(waterEntries).where(eq(waterEntries.userId, TEST_USER_CLEAN.id))
  await db.delete(weightEntries).where(eq(weightEntries.userId, TEST_USER_CLEAN.id))

  await db
    .update(users)
    .set({
      currentWeight: TEST_USER_CLEAN.currentWeight,
      waterGoal: TEST_USER_CLEAN.waterGoal,
    })
    .where(eq(users.id, TEST_USER_CLEAN.id))
}

test.beforeEach(async () => {
  await resetAchievementState()
})

test('achievement flow unlocks badges, updates progress, and keeps unlocked badges after deletes', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page.getByTestId('achievement-highlights')).toContainText('0/9')

  await page.goto('/add')
  await page.getByRole('link', { name: /Scan Food/i }).click()
  await page.getByRole('tab', { name: 'Manual' }).click()
  await page.getByLabel('Food Name').fill('Greek Yogurt')
  await page.getByLabel('Serving Size').fill('1 bowl')
  await page.getByLabel('Calories').fill('240')
  await page.getByLabel('Protein (g)').fill('18')
  await page.getByLabel('Carbs (g)').fill('12')
  await page.getByLabel('Fat (g)').fill('7')
  await page.getByRole('button', { name: 'Add' }).click()
  await page.getByRole('button', { name: 'Add to Meal' }).click()

  await expect(page.getByText('Achievement unlocked: First Bite')).toBeVisible()
  await expect(page).toHaveURL(/\/dashboard/)
  await expect(page.getByTestId('achievement-highlights')).toContainText('1/9')

  await page.goto('/profile#achievements')
  await expect(page.getByTestId('achievement-card-first_meal_logged')).toHaveAttribute('data-status', 'unlocked')
  await expect(page.getByTestId('achievement-card-meal_logging_streak_7')).toContainText('1/7')

  await page.goto('/water')
  await page.getByRole('button', { name: 'Drink Water (+250 mL)' }).click()
  await expect(page.getByText('Achievement unlocked: First Sip')).toBeVisible()

  await page.goto('/weight')
  await page.getByRole('button', { name: 'Update Weight' }).click()
  await page.getByLabel('Weight (kg)').fill('71.5')
  await page.getByRole('button', { name: 'Save' }).click()
  await expect(page.getByText('Achievement unlocked: On The Scale')).toBeVisible()

  await page.goto('/dashboard')
  await expect(page.getByTestId('achievement-highlights')).toContainText('3/9')
  const recentUnlocks = page.getByTestId('recent-achievement-item')
  await expect(recentUnlocks.first()).toContainText('On The Scale')

  await page.goto('/profile#achievements')
  await expect(page.getByTestId('achievement-card-first_water_logged')).toHaveAttribute('data-status', 'unlocked')
  await expect(page.getByTestId('achievement-card-first_weigh_in')).toHaveAttribute('data-status', 'unlocked')
  await expect(page.getByTestId('achievement-card-water_logging_days_7')).toContainText('1/7')
  await expect(page.getByTestId('achievement-card-weight_checkins_7')).toContainText('1/7')

  await page.goto('/weight')
  const entryRow = page.getByTestId('weight-entry').filter({ hasText: '71.5 kg' }).first()
  await entryRow.getByRole('button', { name: 'Entry options' }).click()
  await page.getByRole('menuitem', { name: 'Delete' }).click()
  await expect(page.getByTestId('weight-entry').filter({ hasText: '71.5 kg' })).toHaveCount(0)

  await page.goto('/profile#achievements')
  await expect(page.getByTestId('achievement-card-first_weigh_in')).toHaveAttribute('data-status', 'unlocked')
  await expect(page.getByTestId('achievement-card-weight_checkins_7')).toContainText('0/7')
})
