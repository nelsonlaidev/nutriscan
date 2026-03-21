import { expect, test } from '@playwright/test'

// Proxy rule: unauthenticated users are redirected to '/' for all protected routes
const PROTECTED_ROUTES = [
  '/dashboard',
  '/add',
  '/progress',
  '/profile',
  '/settings',
  '/settings/personal-details',
  '/water',
  '/weight',
  '/meals',
  '/onboarding',
]

for (const route of PROTECTED_ROUTES) {
  test(`redirects unauthenticated user from ${route} to home`, async ({ page }) => {
    await page.goto(route)
    await expect(page).toHaveURL('/')
  })
}

// Public routes should be accessible without auth
test('home page is accessible to unauthenticated users', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL('/')
})

test('sign-in page is accessible to unauthenticated users', async ({ page }) => {
  await page.goto('/auth/sign-in')
  await expect(page).toHaveURL('/auth/sign-in')
})

test('sign-up page is accessible to unauthenticated users', async ({ page }) => {
  await page.goto('/auth/sign-up')
  await expect(page).toHaveURL('/auth/sign-up')
})

// Sign-in form
test('sign-in page renders form', async ({ page }) => {
  await page.goto('/auth/sign-in')
  await expect(page.getByLabel('Email')).toBeVisible()
  await expect(page.getByLabel('Password')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
})

test('shows error toast with invalid credentials', async ({ page }) => {
  await page.goto('/auth/sign-in')
  await page.getByLabel('Email').fill('nobody@example.com')
  await page.getByLabel('Password').fill('wrongpassword')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page.getByText('Invalid email or password')).toBeVisible()
  await expect(page).toHaveURL('/auth/sign-in')
})

test('successful sign-in redirects to dashboard', async ({ page }) => {
  await page.goto('/auth/sign-in')
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Password').fill('12341234')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expect(page).toHaveURL('/dashboard')
})

// Sign-up form
test('sign-up page renders form', async ({ page }) => {
  await page.goto('/auth/sign-up')
  await expect(page.getByLabel('Email')).toBeVisible()
  await expect(page.getByLabel('Password', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible()
})
