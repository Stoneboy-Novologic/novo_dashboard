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
  // Experimental features for better Docker support
  experimental: {
    // Enable output file tracing for standalone builds
    outputFileTracingRoot: process.env.NODE_ENV === 'production' ? undefined : undefined,
  },
}

export default nextConfig
  