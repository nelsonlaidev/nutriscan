import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: ['postcss'],
  entry: ['src/db/reset.ts']
}

export default config
