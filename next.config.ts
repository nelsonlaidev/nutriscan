import type { NextConfig } from 'next'

import './src/env'

import createNextIntlPlugin from 'next-intl/plugin'

const r2Hostname = process.env.R2_PUBLIC_URL ? new URL(process.env.R2_PUBLIC_URL).hostname : undefined

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: r2Hostname ? [{ protocol: 'https', hostname: r2Hostname }] : []
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
