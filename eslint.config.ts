import { defineConfig } from '@nelsonlaidev/eslint-config'

export default defineConfig(
  {
    tailwindEntryPoint: './src/styles/globals.css',
    overrides: {
      tailwindcss: {
        'better-tailwindcss/no-unregistered-classes': ['error', { ignore: ['toaster'] }]
      }
    }
  },
  {
    files: ['src/components/ui/*.tsx'],
    rules: {
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off'
    }
  }
)
