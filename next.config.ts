import type { NextConfig } from 'next'

import createNextIntlPlugin from 'next-intl/plugin'

import { env } from './src/env'

const R2_URL = new URL(env.R2_PUBLIC_URL)

const nextConfig: NextConfig = {
  reactCompiler: true,

  typescript: {
    ignoreBuildErrors: env.CI
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: R2_URL.hostname
      }
    ]
  },

  allowedDevOrigins: ['nutriscan.nelsonlai.dev', 'localhost:3000'],

  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
    serverActions: {
      allowedOrigins: ['nutriscan.nelsonlai.dev', 'localhost:3000'],
      bodySizeLimit: '10mb'
    }
  }
}

if (env.NODE_ENV === 'test') {
  nextConfig.devIndicators = false
}

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(nextConfig)
