
export const CODE_PREFIX = 'BBS-'
export const CODE_LEN = 6

/** Format new codes and preserve the prefix of previously issued invites. */
export function normCode(raw: string) {
  const fromLink = raw.match(/[?&]invite=([A-Za-z0-9-]+)/)?.[1]
  const clean = (fromLink ?? raw).toUpperCase().replace(/[^A-Z0-9-]/g, '')
  const explicit = clean.match(/^(BBS|BLR)(?:-|(?=[A-Z0-9]{6,}$))/)
  const prefix = explicit ? `${explicit[1]}-` : CODE_PREFIX
  return prefix + clean.slice(explicit?.[0].length ?? 0).replace(/-/g, '').slice(0, CODE_LEN)
}
