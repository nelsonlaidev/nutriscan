import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: ['postcss', 'pino-pretty'],
  ignore: ['src/components/ui/*.tsx'],
  entry: ['src/db/reset.ts', 'src/db/seed.ts']
}

export default config
