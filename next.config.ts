import type { NextConfig } from 'next'

import createNextIntlPlugin from 'next-intl/plugin'

import { env } from './src/env'

const R2_URL = new URL(env.R2_PUBLIC_URL)

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: R2_URL.hostname
      }
    ]
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
