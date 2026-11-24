
export const CITY_NAME = 'Bhubaneswar'
export const CITY_TITLE = CITY_NAME.toUpperCase()
export const SITE_NAME = `People of ${CITY_NAME}`
export const SITE_TITLE = `${SITE_NAME} — walk Saheed Nagar and Patia`
export const SITE_DESCRIPTION =
  'Walk through a stylised 3D Bhubaneswar. Explore Janpath in Saheed Nagar and KIIT Road in Patia, and meet local designers, makers and students.'

function origin(value: string | undefined) {
  if (!value) return undefined
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.origin : undefined
  } catch {
    return undefined
  }
}

const configuredSite = origin(process.env.NEXT_PUBLIC_SITE_URL)
export const SITE_URL = configuredSite ?? 'http://localhost:3000'
export const STAGING_SITE_URL = origin(process.env.NEXT_PUBLIC_STAGING_SITE_URL)

const productionAdmin = configuredSite && origin(process.env.NEXT_PUBLIC_ADMIN_URL)
const stagingAdmin = STAGING_SITE_URL && origin(process.env.NEXT_PUBLIC_STAGING_ADMIN_URL)
export const ADMIN_GAME_ORIGINS = new Map<string, string>([
  ...(productionAdmin ? [[productionAdmin, SITE_URL] as const] : []),
  ...(stagingAdmin && STAGING_SITE_URL ? [[stagingAdmin, STAGING_SITE_URL] as const] : []),
  ['http://admin.localhost:3000', 'http://localhost:3000'],
])
export const ADMIN_HOSTS = Array.from(ADMIN_GAME_ORIGINS.keys(), (url) => new URL(url).hostname)
export const PUBLIC_HOSTS = [configuredSite, STAGING_SITE_URL].flatMap((url) => {
  if (!url) return []
  const { hostname } = new URL(url)
  return hostname.startsWith('www.') ? [hostname, hostname.slice(4)] : [hostname, `www.${hostname}`]
})

export function gameOrigin() {
  const { hostname, origin, protocol, port } = window.location
  if (hostname === 'admin.localhost') return `${protocol}//localhost${port ? `:${port}` : ''}`
  return ADMIN_GAME_ORIGINS.get(origin) ?? origin
}

export const GA_ID = ''
export const IS_PRODUCTION = process.env.VERCEL_ENV === 'production' && !!configuredSite
export const ANALYTICS_ON = IS_PRODUCTION && !!GA_ID
