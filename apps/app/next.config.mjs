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
  // Configure output file tracing for monorepo
  // This ensures Next.js can trace files correctly from the repository root
  outputFileTracingRoot: process.env.NODE_ENV === 'production' ? require('path').join(__dirname, '../../') : undefined,
}

export default nextConfig
  