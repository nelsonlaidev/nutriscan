import { expect, test } from '@playwright/test'

// Proxy rule: authenticated + onboarded users are redirected away from auth pages and '/'
test('redirects authenticated user from / to dashboard', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL('/dashboard')
})

test('redirects authenticated user from /auth/sign-in to dashboard', async ({ page }) => {
  await page.goto('/auth/sign-in')
  await expect(page).toHaveURL('/dashboard')
})

test('redirects authenticated user from /auth/sign-up to dashboard', async ({ page }) => {
  await page.goto('/auth/sign-up')
  await expect(page).toHaveURL('/dashboard')
})

// Proxy rule: authenticated + already onboarded user accessing /onboarding is sent to dashboard
test('redirects onboarded user from /onboarding to dashboard', async ({ page }) => {
  await page.goto('/onboarding')
  await expect(page).toHaveURL('/dashboard')
})

// Proxy rule: authenticated users can access all protected routes
const PROTECTED_ROUTES = ['/dashboard', '/add', '/progress', '/profile', '/settings', '/water', '/weight']

for (const route of PROTECTED_ROUTES) {
  test(`authenticated user can access ${route}`, async ({ page }) => {
    await page.goto(route)
    await expect(page).toHaveURL(route)
  })
}
