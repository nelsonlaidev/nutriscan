import { defineConfig } from '@nelsonlaidev/eslint-config'

export default defineConfig({
  tailwindcss: {
    entryPoint: 'src/styles/globals.css',
    rootFontSize: 16,
    ignore: ['toaster'],
  },
  playwright: {
    files: [`e2e/**/*.test.{ts,tsx}`],
  },
})
