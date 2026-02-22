import fs from 'node:fs'
import path from 'node:path'

import { test as setup } from '@playwright/test'

const authFile = path.join(import.meta.dirname, '.auth/user.json')

setup('authenticate as test user', async ({ page }) => {
  fs.mkdirSync(path.dirname(authFile), { recursive: true })

  await page.goto('/auth/sign-in')
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Password').fill('12341234')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await page.waitForURL('/dashboard')

  await page.context().storageState({ path: authFile })
})
