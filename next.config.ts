import type { NextConfig } from 'next'

import './src/env'

import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
    serverActions: {
      allowedOrigins: ['*.asse.devtunnels.ms', 'localhost:3000']
    }
  }
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
