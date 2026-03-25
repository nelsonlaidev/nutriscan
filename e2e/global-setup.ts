import type { Browser, Page } from '@playwright/test'

import fs from 'node:fs'
import path from 'node:path'

import { test as setup } from '@playwright/test'

const authDir = path.join(import.meta.dirname, '.auth')
const baseURL = 'http://localhost:3000'
const password = '12341234'

setup.setTimeout(45_000)

async function ensureEnglishLocale(page: Page) {
  await page.goto('/settings')
  await page.getByRole('heading').first().waitFor()
  if (
    await page
      .getByRole('heading', { name: '設定' })
      .isVisible()
      .catch(() => false)
  ) {
    await page.getByRole('combobox').first().click()
    await page.getByRole('option', { name: 'English' }).click()
    await page.getByRole('heading', { name: 'Settings' }).waitFor()
  }
}

async function completeOnboarding(page: Page) {
  await page.waitForURL('/onboarding')
  await page.getByLabel('Current Weight').fill('72')
  await page.getByLabel('Goal Weight').fill('68')
  await page.getByRole('button', { name: 'Continue' }).click()

  await page.getByLabel('Birthday').fill('1994-03-20')
  await page.getByLabel('Height').fill('170')
  await page.getByLabel('Female', { exact: true }).click({ force: true })
  await page.getByLabel('Steady', { exact: false }).click({ force: true })
  await page.getByRole('button', { name: 'Continue' }).click()
  await page.getByRole('button', { name: 'Confirm' }).click()
  await page.waitForURL('/dashboard')
}

async function signInOrCreateUser(browser: Browser, email: string, name: string, authFile: string) {
  const context = await browser.newContext({ baseURL })
  const page = await context.newPage()

  await page.goto('/auth/sign-in')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign In' }).click()

  const signedIn = await page
    .waitForURL('/dashboard', { timeout: 5000 })
    .then(() => true)
    .catch(() => false)

  if (!signedIn) {
    await page.goto('/auth/sign-up')
    await page.getByLabel('Display Name').fill(name)
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Password', { exact: true }).fill(password)
    await page.getByLabel('Confirm Password').fill(password)
    await page.getByRole('button', { name: 'Sign Up' }).click()

    await completeOnboarding(page)
  }

  await ensureEnglishLocale(page)
  await context.storageState({ path: authFile })
  await context.close()
}

setup('authenticate as test users', async ({ browser }) => {
  fs.mkdirSync(authDir, { recursive: true })

  await signInOrCreateUser(browser, 'test@example.com', 'Test', path.join(authDir, 'user.json'))
  await signInOrCreateUser(browser, 'fresh@example.com', 'Fresh', path.join(authDir, 'clean-user.json'))
})
