/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
