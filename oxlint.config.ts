import { defineConfig } from '@nelsonlaidev/oxlint-config'

export default defineConfig(undefined, {
  tailwindcss: {
    entryPoint: 'src/styles/globals.css',
    rootFontSize: 16,
    ignore: ['toaster'],
  },
  playwright: {
    files: [`e2e/**/*.test.{ts,tsx}`],
  },
})
