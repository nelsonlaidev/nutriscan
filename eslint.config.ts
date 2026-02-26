import { defineConfig } from '@nelsonlaidev/eslint-config'

export default defineConfig(
  {
    tailwindcss: {
      entryPoint: './src/styles/globals.css',
      noUnknownClasses: {
        ignore: ['toaster', 'is-user', 'is-assistant']
      }
    },
    importX: {
      noNamespace: {
        ignore: ['./schemas', 'recharts']
      },
      noUnassignedImport: {
        allow: ['./src/env']
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
