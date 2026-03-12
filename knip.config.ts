import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: ['postcss', 'pino-pretty'],
  ignoreBinaries: ['cloudflared'],
  ignore: ['src/components/ui/*.tsx', 'e2e/**/*.ts'],
  entry: ['src/db/reset.ts', 'src/db/seed.ts']
}

export default config
