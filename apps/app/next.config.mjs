/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure output is compatible with Vercel
  distDir: '.next',
  // Docker production optimizations
  // Enable standalone output for Docker deployment
  // This creates a minimal server.js file with only necessary dependencies
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
}

// Turbopack configuration for Nx monorepo
// Set root to workspace root where node_modules is located
// This fixes the issue where Turbopack can't find Next.js package
if (process.env.NODE_ENV === 'production') {
  nextConfig.experimental = {
    ...nextConfig.experimental,
    // Set turbopack root to workspace root
    // In Docker: /app (absolute path to workspace root)
    // In local dev: ../../ (relative path from apps/app to workspace root)
    turbopack: {
      root: process.env.DOCKER_BUILD === 'true' ? '/app' : '../../',
    },
  }
}

export default nextConfig
  