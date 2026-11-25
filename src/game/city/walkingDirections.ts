import { findPath } from '../nav'
import { CITY_SPINE, type CityPoint } from './layout'
import { cityAreaAt } from './runtime'

function nearestStreet([x, z]: CityPoint) {
  let best = { point: CITY_SPINE[0], index: 0, progress: 0, distance: Infinity }
  for (let i = 0; i < CITY_SPINE.length - 1; i++) {
    const [ax, az] = CITY_SPINE[i]
    const [bx, bz] = CITY_SPINE[i + 1]
    const dx = bx - ax
    const dz = bz - az
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz)))
    const point: CityPoint = [ax + dx * t, az + dz * t]
    const distance = Math.hypot(x - point[0], z - point[1])
    if (distance < best.distance) best = { point, index: i, progress: i + t, distance }
  }
  return best
}

/** Keep cross-neighbourhood directions on the main streets between local walking legs. */
export function walkingDirections(from: CityPoint, to: CityPoint): CityPoint[] | null {
  if (cityAreaAt(...from) === cityAreaAt(...to)) return findPath(...from, ...to)
  const start = nearestStreet(from)
  const end = nearestStreet(to)
  const firstLeg = findPath(...from, ...start.point)
  const lastLeg = findPath(...end.point, ...to)
  if (!firstLeg || !lastLeg) return findPath(...from, ...to)

  const between = CITY_SPINE.slice(Math.min(start.index, end.index) + 1, Math.max(start.index, end.index) + 1)
  if (start.progress > end.progress) between.reverse()
  return [...firstLeg, ...between, ...lastLeg].filter((point, i, all) => {
    return i === 0 || point[0] !== all[i - 1][0] || point[1] !== all[i - 1][1]
  })
}
