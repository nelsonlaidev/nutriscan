import type { NextConfig } from 'next'

import './src/env'

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
    serverActions: {
      allowedOrigins: ['*.asse.devtunnels.ms', 'localhost:3000']
    }
  }
}

export default nextConfig
