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

// Configure Turbopack workspace root so it can resolve node_modules in Nx monorepo
if (process.env.DOCKER_BUILD === 'true') {
  // In Docker, workspace root is /app
  nextConfig.turbopack = {
    root: '/app',
  }
}

export default nextConfig
  