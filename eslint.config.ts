import { defineConfig } from '@nelsonlaidev/eslint-config'

export default defineConfig(
  {
    tailwindEntryPoint: './src/styles/globals.css'
  },
  {
    files: ['src/components/ui/*.tsx'],
    rules: {
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off'
    }
  }
)
