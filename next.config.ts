import type { NextConfig } from 'next'

import './src/env'

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react']
  }
}

export default nextConfig
