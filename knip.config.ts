import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: ['postcss'],
  ignore: ['src/components/ui/*.tsx'],
  entry: ['src/db/reset.ts']
}

export default config
