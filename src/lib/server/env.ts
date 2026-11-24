
import 'server-only'
import { ADMIN_GAME_ORIGINS, IS_PRODUCTION, PUBLIC_HOSTS, SITE_URL, STAGING_SITE_URL } from '@/lib/site'

export function isProduction() {
  return IS_PRODUCTION
}

const KNOWN = new Set([
  SITE_URL,
  STAGING_SITE_URL,
  ...PUBLIC_HOSTS.map((host) => `https://${host}`),
  'http://localhost:3000',
  process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`,
  process.env.VERCEL_BRANCH_URL && `https://${process.env.VERCEL_BRANCH_URL}`,
  process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`,
].filter(Boolean))

/** Only trusted origins can supply the public address used in email links. */
export function siteOrigin(req: Request) {
  const origin = req.headers.get('origin')
  if (origin) {
    const publicOrigin = ADMIN_GAME_ORIGINS.get(origin)
    if (publicOrigin) return publicOrigin
    if (KNOWN.has(origin)) return origin
  }
  if (!isProduction() && process.env.VERCEL_BRANCH_URL) return `https://${process.env.VERCEL_BRANCH_URL}`
  return SITE_URL
}
