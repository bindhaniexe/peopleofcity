import type { NextConfig } from 'next'
import { IS_PRODUCTION } from './src/lib/site'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  // Only these two are sent to the browser. The publishable key is safe to ship (row-level
  // security guards the data). SUPABASE_SECRET_KEY is deliberately NOT listed — it must
  // never reach client code.
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
  },
  // Search engines only index the configured production site. Every other deployment — dev, previews,
  // *.vercel.app, local — answers noindex on every response; production keeps the API and /admin out too.
  async headers() {
    const noindex = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]
    if (!IS_PRODUCTION) return [{ source: '/:path*', headers: noindex }]
    return [
      { source: '/api/:path*', headers: noindex },
      { source: '/admin', headers: noindex },
    ]
  },
}

export default nextConfig
