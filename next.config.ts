import type { NextConfig } from 'next'

import createNextIntlPlugin from 'next-intl/plugin'

import { env } from './src/env'

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [new URL(env.R2_PUBLIC_URL)]
  },
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
    serverActions: {
      allowedOrigins: ['*.asse.devtunnels.ms', 'localhost:3000'],
      bodySizeLimit: '10mb'
    }
  }
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
