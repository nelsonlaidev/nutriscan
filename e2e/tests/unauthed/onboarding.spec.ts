import { expect, test } from '@playwright/test'

test('new user can complete onboarding flow', async ({ page }) => {
  const uniqueEmail = `test-${Date.now()}@example.com`

  // Sign up a new user
  await page.goto('/auth/sign-up')
  await page.getByLabel('Display Name').fill('New User')
  await page.getByLabel('Email').fill(uniqueEmail)
  await page.getByLabel('Password', { exact: true }).fill('password123')
  await page.getByLabel('Confirm Password').fill('password123')
  await page.getByRole('button', { name: 'Sign Up' }).click()

  // Wait for redirect to onboarding
  await page.waitForURL('/onboarding')
  await expect(page).toHaveURL('/onboarding')

  // Complete Step 1: Weight Goal
  await expect(page.getByRole('heading', { name: 'Set your weight goal' })).toBeVisible()
  await page.getByLabel('Current Weight').fill('80')
  await page.getByLabel('Goal Weight').fill('70')
  await page.getByRole('button', { name: 'Continue' }).click()

  // Complete Step 2: Details & Plan
  await expect(page.getByRole('heading', { name: 'Your calorie budget' })).toBeVisible()
  await page.getByLabel('Birthday').fill('1990-01-01')
  await page.getByLabel('Height').fill('180')

  // Select Gender: Male
  await page.getByTestId('gender-male').click({ force: true })

  // After height, birthday and gender are filled, the plan options appear. Select 'Steady'.
  await page.getByTestId('plan-steady').click({ force: true })

  await page.getByRole('button', { name: 'Continue' }).click()

  // Complete Step 3: Confirmation
  await expect(page.getByRole('heading', { name: 'Your plan summary' })).toBeVisible()

  // Ensure the confirm button is there and click it
  await page.getByRole('button', { name: 'Confirm' }).click()

  // Verify we get redirected to the dashboard
  await page.waitForURL('/dashboard')
  await expect(page).toHaveURL('/dashboard')
})
