import { expect, test } from '@playwright/test'
import { eq } from 'drizzle-orm'

import { db } from '@/db'
import { achievementUnlocks, customFoods, foodEntries, savedFoods, savedMealTemplates } from '@/db/schemas'
import { TEST_USER_CLEAN } from '@/lib/constants'

test.use({ storageState: 'e2e/.auth/clean-user.json' })

async function resetSavedFoodsState() {
  await db.delete(savedMealTemplates).where(eq(savedMealTemplates.userId, TEST_USER_CLEAN.id))
  await db.delete(customFoods).where(eq(customFoods.userId, TEST_USER_CLEAN.id))
  await db.delete(savedFoods).where(eq(savedFoods.userId, TEST_USER_CLEAN.id))
  await db.delete(foodEntries).where(eq(foodEntries.userId, TEST_USER_CLEAN.id))
  await db.delete(achievementUnlocks).where(eq(achievementUnlocks.userId, TEST_USER_CLEAN.id))
}

async function createSavedFood(values: {
  foodName: string
  servingSize: string
  calories: number
  protein: number
  carbs: number
  fat: number
  source: 'manual' | 'ai-scan' | 'barcode'
}) {
  await db.insert(savedFoods).values({
    userId: TEST_USER_CLEAN.id,
    ...values,
  })
}

test.beforeEach(async () => {
  await resetSavedFoodsState()
})

test('saved foods page supports custom foods, custom meals, and saved food browsing', async ({ page }) => {
  await createSavedFood({
    foodName: 'Greek Yogurt Bowl',
    servingSize: '1 bowl',
    calories: 240,
    protein: 18,
    carbs: 12,
    fat: 7,
    source: 'manual',
  })

  await page.goto('/saved-foods')

  await page.getByRole('tab', { name: 'Saved foods' }).click()
  const savedFoodsPanel = page.getByRole('tabpanel', { name: 'Saved foods' })
  await expect(savedFoodsPanel.getByRole('heading', { name: 'Saved Foods', exact: true, level: 3 })).toBeVisible()
  await savedFoodsPanel.getByRole('button', { name: 'Add saved food' }).click()

  const customFoodDialog = page.getByRole('dialog')
  await customFoodDialog.getByLabel('Food Name').fill('Protein Pancakes')
  await customFoodDialog.getByLabel('Serving Size').fill('2 pancakes')
  await customFoodDialog.getByLabel('Calories').fill('340')
  await customFoodDialog.getByLabel('Protein (g)').fill('24')
  await customFoodDialog.getByLabel('Carbs (g)').fill('28')
  await customFoodDialog.getByLabel('Fat (g)').fill('14')
  await customFoodDialog.getByRole('button', { name: 'Add' }).click()

  await expect(page.getByText('Food saved for later')).toBeVisible()
  await expect(page.getByText('Protein Pancakes')).toBeVisible()
  await page
    .locator('article')
    .filter({ hasText: 'Protein Pancakes' })
    .getByRole('button', { name: 'Delete saved food' })
    .click()
  await page.getByTestId('confirm-delete-saved-food').click()
  await expect(page.getByText('Saved food deleted')).toBeVisible()
  await expect(page.getByText('Protein Pancakes')).toHaveCount(0)

  await savedFoodsPanel.getByRole('button', { name: 'Add saved food' }).click()

  const secondCustomFoodDialog = page.getByRole('dialog')
  await secondCustomFoodDialog.getByLabel('Food Name').fill('Protein Pancakes')
  await secondCustomFoodDialog.getByLabel('Serving Size').fill('2 pancakes')
  await secondCustomFoodDialog.getByLabel('Calories').fill('340')
  await secondCustomFoodDialog.getByLabel('Protein (g)').fill('24')
  await secondCustomFoodDialog.getByLabel('Carbs (g)').fill('28')
  await secondCustomFoodDialog.getByLabel('Fat (g)').fill('14')
  await secondCustomFoodDialog.getByRole('button', { name: 'Add' }).click()

  await page.getByRole('tab', { name: 'My meals' }).click()
  await page.getByRole('button', { name: 'Create meal' }).click()

  const mealDialog = page.getByRole('dialog')
  await mealDialog.getByLabel('Meal name').fill('Weekend stack')
  await mealDialog.getByRole('button', { name: /Greek Yogurt Bowl/ }).click()
  await mealDialog.getByRole('button', { name: /Protein Pancakes/ }).click()
  await mealDialog.getByRole('button', { name: 'Create meal' }).click()

  await expect(page.getByText('Meal created')).toBeVisible()
  await expect(page.getByText('Weekend stack')).toBeVisible()

  await db.insert(savedFoods).values({
    userId: TEST_USER_CLEAN.id,
    foodName: 'Barcode Yogurt',
    servingSize: '1 cup',
    calories: 180,
    protein: 15,
    carbs: 10,
    fat: 8,
    source: 'barcode',
  })

  await page.goto('/saved-foods')
  await page.getByRole('tab', { name: 'Saved foods' }).click()
  await expect(page.getByRole('heading', { name: 'Barcode Yogurt', exact: true })).toBeVisible()
  await expect(page.getByText('1 cup')).toBeVisible()

  await page.getByRole('tab', { name: 'All' }).click()
  const allPanel = page.getByRole('tabpanel', { name: 'All' })
  await page.getByTestId('saved-foods-search').fill('yogurt')
  await expect(allPanel.getByRole('heading', { name: 'Greek Yogurt Bowl', exact: true })).toBeVisible()
  await expect(allPanel.getByRole('heading', { name: 'Barcode Yogurt', exact: true })).toBeVisible()
})
