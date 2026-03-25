import { defineConfig } from 'vitest/config'

function resolve(path: string) {
  return new URL(path, import.meta.url).pathname
}

export default defineConfig({
  test: {
    include: ['./**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
  },
})
