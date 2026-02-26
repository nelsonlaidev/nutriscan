import { defineConfig, devices } from '@playwright/test'

import { env } from './src/env'

const baseURL = 'http://localhost:3000'

export default defineConfig({
  fullyParallel: !env.CI,
  forbidOnly: env.CI,
  retries: env.CI ? 2 : 0,
  workers: env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'setup',
      testMatch: /global-setup\.ts/
    },
    {
      name: 'authenticated',
      testDir: './e2e/tests/authed',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 440, height: 900 },
        storageState: 'e2e/.auth/user.json'
      },
      dependencies: ['setup']
    },
    {
      name: 'unauthenticated',
      testDir: './e2e/tests/unauthed',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 440, height: 956 }
      }
    }
  ],
  webServer: {
    command: env.CI ? 'NODE_ENV=test pnpm start' : 'NODE_ENV=test pnpm dev',
    url: baseURL,
    reuseExistingServer: !env.CI
  }
})
